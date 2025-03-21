// Импортируем данные о пользователях
import users from '~/users.json';

export default defineEventHandler(() => {
  return users;
});