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
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { CardCatalog, CardPreview, CardBasket } from "./components/view/card";
import { OrderForm, ContactsForm } from "./components/view/Form";
import { Success } from "./components/view/Success";

// Импорт типов данных
import { IProduct, FormErrors, IOrder } from "./types";

// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ ИНФРАСТРУКТУРЫ И МОДЕЛЕЙ
// ==========================================
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(CDN_URL, baseApi);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// ==========================================
// 2. ИНИЦИАЛИЗАЦИЯ ГЛОБАЛЬНЫХ ПРЕДСТАВЛЕНИЙ
// ==========================================
const page = new Page(document.body, events);
const modal = new Modal(
  document.getElementById("modal-container") as HTMLElement,
  events,
);

// Сбор HTML-шаблонов <template> из DOM-дерева
const cardCatalogTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

// Инициализация компонентов представления для модальных окон
// Используем .firstElementChild, чтобы достать чистый HTML-элемент формы/корзины из шаблона
const basketView = new Basket(
  (basketTemplate.content.cloneNode(true) as HTMLElement)
    .firstElementChild as HTMLElement,
  events,
);

const orderFormView = new OrderForm(
  (orderTemplate.content.cloneNode(true) as HTMLElement)
    .firstElementChild as HTMLFormElement,
  events,
);

const contactsFormView = new ContactsForm(
  (contactsTemplate.content.cloneNode(true) as HTMLElement)
    .firstElementChild as HTMLFormElement,
  events,
);

// ==========================================
// 3. ОБРАБОТКА СОБЫТИЙ ПРЕЗЕНТЕРОМ
// ==========================================

// --- 3.1. СОБЫТИЯ МОДЕЛЕЙ ДАННЫХ (Вызывают ререндер Представлений) ---

// [Модель] Изменение каталога товаров -> Рендерим карточки на Главной странице
events.on("items:changed", () => {
  const cardElements = catalogModel.getItems().map((item) => {
    const cardClone = cardCatalogTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const cardElement = cardClone.firstElementChild as HTMLElement; // Извлекаем саму HTML-кнопку .card

    const card = new CardCatalog(cardElement, {
      onClick: () => {
        events.emit("card:select", { id: item.id });
      },
    });
    return card.render(item);
  });

  page.catalog = cardElements;
});

// [Модель] Изменение выбранного для просмотра товара -> Открываем карточку превью
events.on<{ item: IProduct | null }>("preview:changed", (data) => {
  if (data.item) {
    const previewClone = cardPreviewTemplate.content.cloneNode(
      true,
    ) as HTMLElement;
    const previewElement = previewClone.firstElementChild as HTMLElement; // Извлекаем HTML-элемент карточки превью

    const cardPreview = new CardPreview(previewElement, {
      onClick: () => {
        events.emit("card:toBasket", { id: data.item!.id });
      },
    });

    const isAdded = basketModel.isInBasket(data.item.id);
    modal.content = cardPreview.render({
      ...data.item,
      buttonText: isAdded ? "Удалить из корзины" : "В корзину",
    });

    modal.open();
  }
});

// [Модель] Изменение содержимого корзины -> Обновляем счетчик на странице и разметку списка
events.on("basket:changed", () => {
  page.counter = basketModel.getCount();

  const basketItems = basketModel.getItems().map((item, index) => {
    const rowClone = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const rowElement = rowClone.firstElementChild as HTMLElement; // Извлекаем HTML-элемент строки корзины

    const row = new CardBasket(rowElement, {
      onDelete: () => {
        events.emit("card:delete", { id: item.id });
      },
    });
    return row.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.items = basketItems;
  basketView.total = basketModel.getTotalPrice();
});

// [Модель] Изменение данных покупателя (Валидация первой формы)
events.on<FormErrors>("orderForm:validate", (errors) => {
  orderFormView.valid = !errors.address && !errors.payment;
  orderFormView.errors = Object.values(errors).filter(Boolean).join(", ");
});

// [Модель] Изменение данных покупателя (Валидация второй формы)
events.on<FormErrors>("contactsForm:validate", (errors) => {
  contactsFormView.valid = !errors.email && !errors.phone;
  contactsFormView.errors = Object.values(errors).filter(Boolean).join(", ");
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
    const isAdded = basketModel.isInBasket(item.id);
    const cardBtn = modal.content.querySelector(".card__button");
    if (cardBtn)
      cardBtn.textContent = isAdded ? "Удалить из корзины" : "В корзину";
  }
});

// [Представление] Нажатие кнопки удаления товара из корзины
events.on<{ id: string }>("card:delete", (data) => {
  basketModel.remove(data.id);
});

// [Представление] Нажатие кнопки открытия корзины
events.on("basket:open", () => {
  const basketItems = basketModel.getItems().map((item, index) => {
    const rowClone = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const rowElement = rowClone.firstElementChild as HTMLElement;
    const row = new CardBasket(rowElement, {
      onDelete: () => events.emit("card:delete", { id: item.id }),
    });
    return row.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  basketView.items = basketItems;
  basketView.total = basketModel.getTotalPrice();

  modal.content = basketView.render();
  modal.open();
});

// [Представление] Нажатие кнопки оформления заказа
events.on("order:open", () => {
  modal.content = orderFormView.render({
    valid: false,
    errors: [],
  });
});

// [Представление] Нажатие кнопки перехода ко второй форме оформления заказа
events.on("order:submit", () => {
  modal.content = contactsFormView.render({
    valid: false,
    errors: [],
  });
});

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
      const successClone = successTemplate.content.cloneNode(
        true,
      ) as HTMLElement;
      const successElement = successClone.firstElementChild as HTMLElement; // Извлекаем элемент окна успеха

      const successView = new Success(successElement, {
        onClose: () => {
          modal.close();
          basketModel.clear();
          buyerModel.clearData();
        },
      });
      modal.content = successView.render({ total: result.total });
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

// Системные события открытия/закрытия модалок
events.on("modal:open", () => {
  page.locked = true;
});
events.on("modal:close", () => {
  page.locked = false;
});

// ==========================================
// 4. ЗАПУСК ПРИЛОЖЕНИЯ (ЗАПРОС К СЕРВЕРУ)
// ==========================================
larekApi
  .getProducts()
  .then((response) => {
    // Сохранение товаров в модели данных
    catalogModel.setItems(response.items);
  })
  .catch((err) => console.error("Ошибка загрузки данных с сервера:", err));
