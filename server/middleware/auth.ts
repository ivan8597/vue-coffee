// Проверка для  авторизации
export default defineEventHandler(async (event) => {
  // Пропускаем  маршруты
  if (event.path === "/" || event.path === "/api/users") {
    console.log("Маршрут:", event.path);
    return;
  }

  console.log("Серверная проверка для пути:", event.path);

  // Логируем для отладки
  if (event.path.startsWith("/api/")) {
    console.log("API запрос разрешен:", event.path);
  }
});
