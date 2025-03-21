<template>
  <div class="product-table">
    <div class="filters">
      <div class="filter-group">
        <label>Фильтр по дате добавления:</label>
        <div class="filter-row">
          <input type="date" v-model="dateFilter" @change="updateFilters" class="filter-input" />
          <button v-if="dateFilter" @click="clearDateFilter" class="clear-button">
            Очистить
          </button>
        </div>
      </div>
      <div class="filter-group">
        <label>Фильтр по категории:</label>
        <div class="filter-row">
          <select v-model="categoryFilter" @change="updateFilters" class="filter-input">
            <option value="">Все категории</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button v-if="categoryFilter" @click="clearCategoryFilter" class="clear-button">
            Очистить
          </button>
        </div>
      </div>
      <button v-if="hasActiveFilters" @click="clearAllFilters" class="reset-button">
        Сбросить все фильтры
      </button>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Категория</th>
          <th>Цена (₽)</th>
          <th>Объем (мл)</th>
          <th>Крепость</th>
          <th>Статус</th>
          <th>Дата добавления</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>
            <div class="product-name">
              {{ product.name }}
              <span class="product-description">{{ product.description }}</span>
            </div>
          </td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.volume_ml }}</td>
          <td>{{ product.strength }}</td>
          <td>
            <span :class="['status-badge', getStatusClass(product.status)]">
              {{ product.status }}
            </span>
          </td>
          <td>{{ formatDate(product.date_created) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

// Определяем входные параметры компонента
// products - массив продуктов типа Product[] передается от родительского компонента
const props = defineProps<{ products: Product[] }>();

// Определяем события, которые компонент может отправлять родителю
// update:filters - событие для обновления фильтров в родительском компоненте
// используется для двусторонней привязки v-model с фильтрами
const emit = defineEmits(['update:filters']);

const dateFilter = ref('');
const categoryFilter = ref('');

// Вычисляем уникальные категории продуктов
const uniqueCategories = computed(() => {
  return [...new Set(props.products.map(product => product.category))];
});

// Вычисляем, есть ли активные фильтры
const hasActiveFilters = computed(() => {
  return dateFilter.value || categoryFilter.value;
});

// Форматируем дату в читаемый формат
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};


const getStatusClass = (status: string): string => {
  switch (status) {
    case 'В наличии':
      return 'status-available';
    case 'Временно недоступен':
      return 'status-unavailable';
    case 'Нет в продаже':
      return 'status-discontinued';
    case 'Сезонное меню':
      return 'status-seasonal';
    default:
      return '';
  }
};

const clearDateFilter = () => {
  dateFilter.value = '';
  updateFilters();
};

const clearCategoryFilter = () => {
  categoryFilter.value = '';
  updateFilters();
};

const clearAllFilters = () => {
  dateFilter.value = '';
  categoryFilter.value = '';
  updateFilters();
};

// Обновляем фильтры и отправляем событие для обновления родительского компонента
const updateFilters = () => {
  emit('update:filters', {
    date: dateFilter.value,
    categories: categoryFilter.value ? [categoryFilter.value] : []
  });
};
</script>

<style scoped lang="scss">
.product-table {
  margin-top: 1rem;
  padding: 1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 250px;

  label {
    font-weight: 500;
    color: #1f2937;
  }
}

.filter-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-input {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px solid #bfdbfe;
  }
}

.clear-button {
  padding: 0.5rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  height: fit-content;

  &:hover {
    background-color: #dc2626;
  }
}

.product-name {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .product-description {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-available {
  background-color: #dcfce7;
  color: #166534;
}

.status-unavailable {
  background-color: #fef9c3;
  color: #854d0e;
}

.status-discontinued {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-seasonal {
  background-color: #dbeafe;
  color: #1e40af;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  th, td {
    border: 1px solid #e5e7eb;
    padding: 0.75rem 1rem;
    text-align: left;
  }

  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #1f2937;
  }

  tr:hover {
    background-color: #f8fafc;
  }
}
</style> 