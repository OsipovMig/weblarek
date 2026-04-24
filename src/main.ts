import { API_URL, CDN_URL } from "./utils/constants"; // Импортируем константы
import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from "./components/base/Api"; // Базовый класс
import { LarekApi } from "./components/LarekApi"; // Твой новый класс

// Инициализация моделей
const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();

// Инициализация API
const baseApi = new Api(API_URL);

// 2. Создаем наш LarekApi
// ВАЖНО: передаем ОБЪЕКТ baseApi первым, а СТРОКУ CDN_URL вторым
// (согласно конструктору выше)
const larekApi = new LarekApi(baseApi, CDN_URL);

// 3. Вызываем метод
larekApi
  .getProducts()
  .then((res) => {
    catalog.setItems(res.items);
    console.log("Товары с сервера:", catalog.getItems());
  })
  .catch(console.error);
console.log(
  "%c ЗАПРОС ДАННЫХ С СЕРВЕРА ",
  "background: #222; color: #bada55; font-size: 1.2em;",
);

// Получаем реальные данные с сервера
larekApi
  .getProducts()
  .then((res) => {
    // 1. Сохраняем полученный массив товаров в модель каталога
    catalog.setItems(res.items);

    // 2. Проверяем результат в консоли
    console.group("Проверка данных с сервера");
    const products = catalog.getItems();
    console.log("Товары, успешно сохраненные в CatalogModel:", products);

    if (products.length > 0) {
      console.log(
        "Первый товар из каталога (с полным путем картинки):",
        products[0],
      );
    }
    console.groupEnd();
  })
  .catch((err) => {
    console.error("Ошибка при получении данных с сервера:", err);
  });

// Твои тесты моделей (можно оставить для проверки логики работы с корзиной и покупателем)
console.log(
  "%c ПРОВЕРКА ЛОГИКИ МОДЕЛЕЙ ",
  "background: #222; color: #3498db; font-size: 1.2em;",
);

// Проверка BasketModel (на пустых данных пока)
basket.clear();
console.log("Корзина очищена, количество:", basket.getCount());

// Проверка BuyerModel
buyer.setData("address", "Набережная, 10");
console.log("Валидация покупателя (ожидаем ошибки):", buyer.validate());
