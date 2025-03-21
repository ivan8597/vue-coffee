import { defineStore } from 'pinia';
import type { User, UserCredentials } from '~/types/user';

// Проверка, выполняется ли код на клиенте
const isClient = () => typeof window !== 'undefined';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    currentUser: null as User | null,
  }),
  actions: {
    async login(credentials: UserCredentials) {
      try {
        console.log('Попытка входа с данными:', credentials);
        const users = await $fetch<User[]>('/api/users');
        console.log('Получены пользователи, количество:', users?.length);
        
        const user = users.find(
          u => {
            console.log('Сравнение с пользователем:', u.credentials?.username);
            return u.credentials.username === credentials.username &&
                  u.credentials.passphrase === credentials.passphrase;
          }
        );
        
        if (!user) {
          console.log('Пользователь не найден');
          throw new Error('Неверные данные авторизации');
        }
        
        if (!user.active) {
          console.log('Пользователь неактивен');
          throw new Error('Пользователь неактивен');
        }

        console.log('Успешный вход:', user.name);
        this.isAuthenticated = true;
        this.currentUser = user;
        
        // Сохраняем данные только на клиенте
        if (isClient()) {
          // Сохраняем в localStorage
          try {
            localStorage.setItem('auth', JSON.stringify(user));
            console.log('Данные сохранены в localStorage');
          } catch (err) {
            console.error('Ошибка при сохранении в localStorage:', err);
          }
          
          // Сохраняем в cookie
          try {
            // Удаляем пароль из cookies
            const userForCookie = { ...user };
            if (userForCookie.credentials) {
              userForCookie.credentials = { ...userForCookie.credentials };
              userForCookie.credentials.passphrase = '';
            }
            
            document.cookie = `auth=${JSON.stringify(userForCookie)}; path=/; max-age=86400`; // 24 часа
            console.log('Данные сохранены в cookie');
          } catch (err) {
            console.error('Ошибка при сохранении в cookie:', err);
          }
        }
        
        return true;
      } catch (err) {
        console.error('Ошибка в функции login:', err);
        throw err;
      }
    },
    
    logout() {
      try {
        console.log('Выход из системы');
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Очищаем данные только на клиенте
        if (isClient()) {
          // Очищаем localStorage
          try {
            localStorage.removeItem('auth');
            console.log('Данные удалены из localStorage');
          } catch (err) {
            console.error('Ошибка при удалении из localStorage:', err);
          }
          
          // Очищаем cookie
          try {
            document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            console.log('Данные удалены из cookie');
          } catch (err) {
            console.error('Ошибка при удалении cookie:', err);
          }
        }
      } catch (err) {
        console.error('Ошибка в функции logout:', err);
      }
    },
    
    checkAuth() {
      try {
        console.log('Проверка авторизации');
        
        // Проверяем данные только на клиенте
        if (isClient()) {
          // Проверяем localStorage
          let storedUser = null;
          try {
            const storedUserStr = localStorage.getItem('auth');
            if (storedUserStr) {
              storedUser = JSON.parse(storedUserStr);
              console.log('Пользователь найден в localStorage:', storedUser?.name);
            }
          } catch (err) {
            console.error('Ошибка при чтении из localStorage:', err);
          }
          
          // Проверяем cookie
          let cookieUser = null;
          try {
            const cookieStr = document.cookie
              .split('; ')
              .find(row => row.startsWith('auth='));
              
            if (cookieStr) {
              const cookieValue = cookieStr.split('=')[1];
              if (cookieValue) {
                cookieUser = JSON.parse(cookieValue);
                console.log('Пользователь найден в cookie:', cookieUser?.name);
              }
            }
          } catch (err) {
            console.error('Ошибка при чтении из cookie:', err);
          }
          
          const user = storedUser || cookieUser;
          
          if (user) {
            console.log('Пользователь авторизован:', user.name);
            this.isAuthenticated = true;
            this.currentUser = user;
            
            // Синхронизируем хранилища
            if (storedUser && !cookieUser) {
              try {
                document.cookie = `auth=${JSON.stringify(storedUser)}; path=/; max-age=86400`;
                console.log('Данные синхронизированы из localStorage в cookie');
              } catch (err) {
                console.error('Ошибка при синхронизации с cookie:', err);
              }
            } else if (!storedUser && cookieUser) {
              try {
                localStorage.setItem('auth', JSON.stringify(cookieUser));
                console.log('Данные синхронизированы из cookie в localStorage');
              } catch (err) {
                console.error('Ошибка при синхронизации с localStorage:', err);
              }
            }
            
            return true;
          }
        }
        
        // Если мы на сервере или пользователь не найден
        console.log('Пользователь не авторизован');
        this.isAuthenticated = false;
        this.currentUser = null;
        return false;
      } catch (err) {
        console.error('Ошибка в функции checkAuth:', err);
        return false;
      }
    },
  },
});