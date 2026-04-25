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
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

console.log("РЕАЛЬНЫЙ АДРЕС API:", API_URL);

// --- 1. ТЕСТИРОВАНИЕ МОДЕЛЕЙ (на локальных данных) ---
console.group("Тестирование моделей данных (локально)");

// Тест каталога
catalog.setItems(apiProducts.items);
console.log("Товары загружены в каталог:", catalog.getItems());
console.log("Поиск товара по ID:", catalog.getItem(apiProducts.items[0].id));

// Тест корзины
// --- Тестирование BasketModel ---
console.group("Тестирование модели корзины (локально)");

const testProduct = apiProducts.items[0];

// 1. Тест добавления и getItems()
basket.add(testProduct);
console.log("Товары в корзине (getItems):", basket.getItems());

// 2. Тест проверки наличия (isInBasket)
console.log("Товар в корзине (isInBasket):", basket.isInBasket(testProduct.id));

// 3. Тест количества и стоимости
console.log("Количество товаров:", basket.getCount());
console.log("Общая стоимость:", basket.getTotalPrice());

// 4. Тест удаления (remove)
basket.remove(testProduct.id);
console.log("Корзина после удаления товара (getCount):", basket.getCount());
console.log(
  "Товар остался в корзине? (isInBasket):",
  basket.isInBasket(testProduct.id),
);

// 5. Тест очистки (clear)
basket.add(testProduct); // Снова добавим для проверки очистки
basket.clear();
console.log("Корзина после метода clear (getCount):", basket.getCount());

console.groupEnd();

// ДОБАВИТЬ ТЕСТ PREVIEW:
const testItem = apiProducts.items[0];
catalog.setPreview(testItem);
console.log("Установлен товар для превью:", catalog.getPreview());
if (catalog.getPreview()?.id === testItem.id) {
  console.log("Тест setPreview/getPreview пройден успешно");
}

// Тест покупателя
console.group("Тестирование модели покупателя (локально)");

// 1. Заполняем данные
buyer.setData("address", "ул. Ленина, 10");
buyer.setData("email", "test@test.ru");
buyer.setData("phone", "+79990000000");
buyer.setData("payment", "card");
console.log("Данные заполнены:", buyer.getData());
console.log("Ошибки валидации (ожидаем пусто):", buyer.validate());

// 2. Тест метода clearData()
buyer.clearData();
console.log("Данные после очистки (clearData):", buyer.getData());

// Проверяем, что после очистки валидация снова находит ошибки
const errorsAfterClear = buyer.validate();
console.log("Ошибки после очистки (должны появиться снова):", errorsAfterClear);

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
