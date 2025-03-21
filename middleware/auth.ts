import { useAuthStore } from '~/store/auth'

// Проверка, выполняется ли код на клиенте
const isClient = () => typeof window !== 'undefined';

export default defineNuxtRouteMiddleware((to) => {
  // Если пользователь переходит на главную страницу, пропускаем проверку
  if (to.path === '/') {
    console.log('Переход на главную, пропускаем проверку');
    return;
  }
  
  // Клиентская проверка выполняется только в браузере
  if (!isClient()) {
    console.log('Серверный рендеринг, пропускаем проверку авторизации');
    return;
  }
  
  try {
    console.log('Клиентская проверка авторизации для:', to.path);
    const authStore = useAuthStore();
    
    // Проверяем авторизацию при каждом переходе
    authStore.checkAuth();
    
    if (!authStore.isAuthenticated) {
      console.log('Пользователь не авторизован, перенаправление на главную');
      return navigateTo('/');
    }
    
    console.log('Пользователь авторизован, продолжаем');
  } catch (error) {
    console.error('Ошибка в middleware auth:', error);
    return navigateTo('/');
  }
});