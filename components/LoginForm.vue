<template>
  <div class="login-form">
    <div class="form-card">
      <div class="form-header">
        <h3>Вход в систему</h3>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="form-content">
          <div class="form-group">
            <label>Имя пользователя</label>
            <input 
              v-model="formState.username" 
              type="text"
              placeholder="Введите имя пользователя"
              class="form-input"
              :class="{ 'error-input': error }"
            />
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input 
              v-model="formState.passphrase" 
              type="password"
              placeholder="Введите пароль"
              class="form-input"
              :class="{ 'error-input': error }"
            />
          </div>
          <Transition name="fade">
            <div v-if="error" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Введены неверные данные авторизации. Попробуйте ещё раз
            </div>
          </Transition>
          <button type="submit" class="submit-button" :disabled="isLoading">
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth';
import type { UserCredentials } from '~/types/user';

const formState = ref<UserCredentials>({
  username: '',
  passphrase: ''
});

const error = ref(false);
const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const onSubmit = async () => {
  try {
    error.value = false;
    isLoading.value = true;
    await authStore.login(formState.value);
    router.push('/account');
  } catch (err) {
    error.value = true;
    //Для того, чтобы при ошибке не было видно пароль
    setTimeout(() => {
      formState.value.passphrase = '';
    }, 100);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.form-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.form-header {
  padding: 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
}

.form-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }
}

.form-input {
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &.error-input {
    border-color: #ef4444;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  text-align: left;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
}

.error-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 