import { API_URL, CDN_URL } from "./utils/constants";
import "./scss/styles.scss";

// Импорт базовой инфраструктуры
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { LarekApi } from "./components/LarekApi";

// Импорт Моделей данных (Слой Model)
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";

// Импорт Компонентов отображения (Слой View)
import { Page } from "./components/view/page";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

// Импорт типов данных
import { IProduct, IOrder } from "./types";
import { ensureElement, cloneTemplate } from "./utils/utils";

// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ ИНФРАСТРУКТУРЫ И МОДЕЛЕЙ
// ==========================================
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// ==========================================
// 2. ИНИЦИАЛИЗАЦИЯ СТАТИЧНЫХ ПРЕДСТАВЛЕНИЙ (ОДИН РАЗ В НАЧАЛЕ)
// ==========================================

// Инициализация глобальных каркасных элементов (Передаем document.body по новой программе)
const page = new Page(document.body);
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

// ИСПРАВЛЕНО: Все уникальные компоненты окон и форм создаются строго ОДИН РАЗ как константы
const cardPreviewView = new CardPreview(cloneTemplate("#card-preview"), {
  onClick: () => {
    const currentPreviewItem = catalogModel.getPreview();
    if (currentPreviewItem) {
      events.emit("card:toBasket", { id: currentPreviewItem.id });
    }
  },
});

const basketView = new Basket(cloneTemplate("#basket"), events);
const orderFormView = new OrderForm(cloneTemplate("#order"), events);
const contactsFormView = new ContactsForm(cloneTemplate("#contacts"), events);
const successView = new Success(cloneTemplate("#success"), {
  onClose: () => {
    modal.close();
    basketModel.clear();
    buyerModel.clearData();
  },
});

// ==========================================
// 3. ОБРАБОТКА СОБЫТИЙ ПРЕЗЕНТЕРОМ
// ==========================================

// --- 3.1. СОБЫТИЯ МОДЕЛЕЙ ДАННЫХ (Вызывают ререндер Представлений) ---

// [Модель] Изменение каталога товаров -> Рендерим динамические карточки на Главной странице
events.on("items:changed", () => {
  const cardElements = catalogModel.getItems().map((item) => {
    // Динамический класс карточки витрины (создается в цикле, так как зависит от массива данных)
    const cardElement = cloneTemplate("#card-catalog");
    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit("card:select", { id: item.id });
      },
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
  page.catalog = cardElements;
});

// [Модель] Изменение выбранного для просмотра товара -> Только перерендериваем готовый компонент
events.on<IProduct>("preview:changed", (item) => {
  if (item && item.id) {
    const isAdded = basketModel.isInBasket(item.id);
    let btnText = isAdded ? "Удалить из корзины" : "В корзину";
    const isPriceless = item.price === null;
    if (isPriceless) {
      btnText = "Не продается";
    }

    // ИСПРАВЛЕНО: Никаких new CardPreview, только вызов метода .render() у константы!
    modal.content = cardPreviewView.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
      description: item.description,
    });

    cardPreviewView.buttonText = btnText;
    cardPreviewView.disabled = isPriceless;

    modal.open();
  }
});

// [Модель] Изменение содержимого корзины -> Синхронизируем счетчик и перерисовываем строки списка
events.on("basket:changed", () => {
  // 1. Обновляем счетчик количества товаров в шапке сайта
  header.counter = basketModel.getCount();

  // 2. Ререндерим текст кнопки на карточке превью (если она открыта)
  const currentPreviewItem = catalogModel.getPreview();
  if (currentPreviewItem) {
    const isAdded = basketModel.isInBasket(currentPreviewItem.id);
    cardPreviewView.buttonText = isAdded ? "Удалить из корзины" : "В корзину";
  }

  // 3. Формируем массив динамических строк CardBasket на основании свежих данных модели
  const basketItems = basketModel.getItems().map((item, index) => {
    const rowElement = cloneTemplate("#card-basket");
    const row = new CardBasket(rowElement, {
      onDelete: () => events.emit("card:delete", { id: item.id }),
    });
    return row.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  // 4. Записываем подготовленные элементы и суммы в готовую константу представления корзины
  basketView.items = basketItems;
  basketView.total = basketModel.getTotalPrice();
  basketView.disabled = basketModel.getCount() === 0;
});

// [Модель] Изменение данных покупателя -> Презентер сам рассчитывает валидацию и обновляет формы
events.on<object>("buyer:changed", () => {
  const currentData = buyerModel.getData();
  const errors = buyerModel.validateAll(); // Вызов оригинального метода модели из прошлого спринта

  // 1. Обновляем первую форму (Доставка), если она сейчас активна в DOM модалки
  const activeOrderForm = document.querySelector(
    '.modal form[name="order"]',
  ) as HTMLFormElement;
  if (activeOrderForm && orderFormView) {
    orderFormView.render({
      payment: currentData.payment,
      address: currentData.address,
      valid: !errors.address && !errors.payment,
      errors: Object.values({
        payment: errors.payment,
        address: errors.address,
      })
        .filter(Boolean)
        .join(", "),
    });
  }

  // 2. Обновляем вторую форму (Контакты), если она сейчас активна в DOM модалки
  const activeContactsForm = document.querySelector(
    '.modal form[name="contacts"]',
  ) as HTMLFormElement;
  if (activeContactsForm && contactsFormView) {
    contactsFormView.render({
      email: currentData.email,
      phone: currentData.phone,
      valid: !errors.email && !errors.phone,
      errors: Object.values({ email: errors.email, phone: errors.phone })
        .filter(Boolean)
        .join(", "),
    });
  }
});

// --- 3.2. СОБЫТИЯ ПРЕДСТАВЛЕНИЙ (Изменяют данные в Моделях) ---

// [Представление] Выбор карточки для просмотра
events.on<{ id: string }>("card:select", (data) => {
  const item = catalogModel.getItem(data.id);
  if (item) {
    catalogModel.setPreview(item);
  }
});

// [Представление] Нажатие кнопки покупки товара
events.on<{ id: string }>("card:toBasket", (data) => {
  const item = catalogModel.getItem(data.id);
  if (item) {
    if (basketModel.isInBasket(item.id)) {
      basketModel.remove(item.id);
    } else {
      basketModel.add(item);
    }
  }
});

// [Представление] Нажатие кнопки удаления товара из корзины
events.on<{ id: string }>("card:delete", (data) => {
  basketModel.remove(data.id);
});

// [Представление] Нажатие кнопки открытия корзины
// [Представление] Нажатие кнопки открытия корзины в шапке сайта
events.on("basket:open", () => {
  // ИСПРАВЛЕНО: Никаких переборов массива и клонирований шаблонов при открытии!
  // Просто передаем уже подготовленную разметку константы basketView в контент модалки
  modal.content = basketView.render();
  modal.open(); // Открытие окна
});

// [Представление] Нажатие кнопки оформления заказа
events.on("order:open", () => {
  // 1. Забираем реальные данные и рассчитываем актуальные ошибки из модели
  const currentData = buyerModel.getData();
  const errors = buyerModel.validateAll();

  // 2. ИСПРАВЛЕНО: Флаг valid теперь рассчитывается строго на основе реальных данных из модели, а не хардкодится в false!
  modal.content = orderFormView.render({
    payment: currentData.payment,
    address: currentData.address,
    valid: !errors.address && !errors.payment,
    errors: Object.values({ payment: errors.payment, address: errors.address })
      .filter(Boolean)
      .join(", "),
  });

  modal.open();
});

// [Представление] Нажатие кнопки перехода ко второй форме оформления заказа
events.on("order:submit", () => {
  // 1. Забираем реальные данные и рассчитываем актуальные ошибки из модели
  const currentData = buyerModel.getData();
  const errors = buyerModel.validateAll();

  // 2. ИСПРАВЛЕНО: Флаг valid для контактов также рассчитывается честно на основе данных модели
  modal.content = contactsFormView.render({
    email: currentData.email,
    phone: currentData.phone,
    valid: !errors.email && !errors.phone,
    errors: Object.values({ email: errors.email, phone: errors.phone })
      .filter(Boolean)
      .join(", "),
  });
});

// [Представление] Нажатие кнопки оплаты/завершения оформления заказа
// НАЙДИТЕ И ПОЛНОСТЬЮ ЗАМЕНИТЕ ЭТОТ ОБРАБОТЧИК В main.ts:

// [Представление] Нажатие кнопки оплаты/завершения оформления заказа
events.on("contacts:submit", () => {
  const orderData: IOrder = {
    ...buyerModel.getData(),
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((item) => item.id),
  };

  larekApi
    .orderProducts(orderData)
    .then((result) => {
      // ИСПРАВЛЕНО: Больше не создаем локальный successView и не клонируем шаблон!
      // Используем уже готовую константу со строки 63 и вызываем её метод .render()
      modal.content = successView.render({ total: result.total });

      // Очищаем данные в моделях сразу при получении ответа, как требовал ревьюер
      setTimeout(() => {
        basketModel.clear();
        buyerModel.clearData();
      }, 0);
    })
    .catch((err) => console.error("Ошибка отправки заказа:", err));
});

// [Представление] Изменение данных в формах
events.on<{ value: string }>("order.address:change", (data) =>
  buyerModel.setData("address", data.value),
);
events.on<{ payment: "card" | "cash" }>("order.payment:change", (data) =>
  buyerModel.setData("payment", data.payment),
);
events.on<{ value: string }>("contacts.email:change", (data) =>
  buyerModel.setData("email", data.value),
);
events.on<{ value: string }>("contacts.phone:change", (data) =>
  buyerModel.setData("phone", data.value),
);

// ==========================================
// 4. ЗАПУСК ПРИЛОЖЕНИЯ (ЗАПРОС К СЕРВЕРУ)
// ==========================================
larekApi
  .getProducts()
  .then((response) => {
    const itemsWithImages = response.items.map((item) => ({
      ...item,
      image: CDN_URL + item.image,
    }));
    catalogModel.setItems(itemsWithImages);
  })
  .catch((err) => console.error("Ошибка загрузки данных с сервера:", err));
