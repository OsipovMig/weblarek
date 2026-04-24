import { API_URL, CDN_URL } from "./utils/constants";
import { apiProducts } from "./utils/data"; // Импортируем локальные данные для тестов
import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";

// Инициализация моделей
const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();

// Инициализация API
const baseApi = new Api(API_URL || "https://nomoreparties.co");
const larekApi = new LarekApi(baseApi);

console.log("РЕАЛЬНЫЙ АДРЕС API:", API_URL);

// --- 1. ТЕСТИРОВАНИЕ МОДЕЛЕЙ (на локальных данных) ---
console.group("Тестирование моделей данных (локально)");

// Тест каталога
catalog.setItems(apiProducts.items);
console.log("Товары загружены в каталог:", catalog.getItems());
console.log("Поиск товара по ID:", catalog.getItem(apiProducts.items[0].id));

// Тест корзины
basket.clear();
basket.add(apiProducts.items[0]);
console.log("Корзина (после добавления 1 товара):", basket.getCount());
console.log("Общая стоимость:", basket.getTotalPrice());

// Тест покупателя
buyer.setData("address", "Набережная, 10");
const validationErrors = buyer.validate();
console.log("Данные покупателя:", buyer.getData());
console.log(
  "Ошибки валидации (ожидаем payment, email, phone):",
  validationErrors,
);

console.groupEnd();

// --- 2. РАБОТА С СЕРВЕРОМ ---
larekApi
  .getProducts()
  .then((res) => {
    // Модифицируем данные: добавляем CDN_URL к картинкам (теперь это делается здесь)
    const itemsWithImages = res.items.map((item) => ({
      ...item,
      image: CDN_URL + item.image,
    }));

    catalog.setItems(itemsWithImages);

    console.group("Проверка данных с сервера");
    const products = catalog.getItems();
    console.log("Товары в CatalogModel (с сервера):", products);

    if (products.length > 0) {
      console.log("Пример товара с полным путём картинки:", products[0]);
    }
    console.groupEnd();
  })
  .catch((err) => {
    console.error("Ошибка при получении данных с сервера:", err);
  });
