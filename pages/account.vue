<template>
  <div class="account-page">
    <div class="header">
      <h1>Меню кофейни</h1>
      <button @click="logout" class="logout-button">
        Выход
      </button>
    </div>
    <div v-if="error" class="error-banner">
      <div class="error-content">
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
        <button v-if="error === 'Требуется авторизация'" @click="redirectToLogin" class="error-action">
          Войти
        </button>
      </div>
    </div>
    <div v-else-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      Загрузка данных...
    </div>
    <ProductTable 
      v-else 
      :products="filteredProducts" 
      @update:filters="applyFilters" 
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth';
import type { Product } from '~/types/product';
import auth from '~/middleware/auth';

definePageMeta({
  middleware: [auth]
});

const authStore = useAuthStore();
const router = useRouter();
const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const error = ref<string | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    console.log('Начало загрузки данных на странице');
    console.log('Статус авторизации:', authStore.isAuthenticated);
    
    if (!authStore.isAuthenticated) {
      console.log('Пользователь не авторизован, отображаем ошибку');
      error.value = 'Требуется авторизация';
      return;
    }

    console.log('Загружаем продукты...');
    const response = await $fetch<Product[]>('/api/products', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).catch((err: any) => {
      console.error('Ошибка fetch:', err);
      if (err.statusCode === 401) {
        throw new Error('Требуется авторизация');
      }
      throw err;
    });

    console.log('Ответ API:', response ? 'Данные получены' : 'Пустой ответ');
    
    if (!response) {
      throw new Error('Не удалось загрузить данные');
    }

    products.value = response;
    filteredProducts.value = response;
    console.log('Данные успешно загружены, количество продуктов:', products.value.length);
  } catch (err: any) {
    console.error('Общая ошибка в mounted:', err);
    error.value = err.message || 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.';
    
    if (err.message === 'Требуется авторизация') {
      authStore.logout();
    }
  } finally {
    isLoading.value = false;
    console.log('Завершение инициализации страницы');
  }
});

const redirectToLogin = () => {
  router.push('/');
};

const logout = () => {
  try {
    authStore.logout();
    router.push('/');
  } catch (err) {
    console.error('Ошибка при выходе:', err);
    error.value = 'Произошла ошибка при выходе из системы';
  }
};

const applyFilters = (filters: { date?: string; categories?: string[] }) => {
  try {
    filteredProducts.value = products.value.filter((product: Product) => {
      const matchesDate = filters.date ? product.date_created === filters.date : true;
      const matchesCategory = filters.categories?.length 
        ? filters.categories.includes(product.category) 
        : true;
      return matchesDate && matchesCategory;
    });
  } catch (err) {
    console.error('Ошибка при фильтрации:', err);
    error.value = 'Произошла ошибка при фильтрации данных';
  }
};
</script>

<style scoped lang="scss">
.account-page {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 600;
    color: #1f2937;
  }
}

.error-banner {
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #dc2626;
  text-align: left;
}

.error-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.error-action {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #b91c1c;
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
  font-size: 1.125rem;
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
}
</style>