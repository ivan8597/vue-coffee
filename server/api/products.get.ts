// Импортируем данные о продуктах
import products from '~/products.json';

export default defineEventHandler(() => {
  try {
    // Возвращаем данные клиенту
    return products;
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    return [];
  }
}); 