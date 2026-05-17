import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import { IProduct } from "../../types";

// Расширяем интерфейс для нужд отображения (порядковый номер, текст кнопки)
export interface ICardView extends IProduct {
  index?: number;
  buttonText?: string;
}

// Родительский класс карточки
export class Card extends Component<ICardView> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this._price.textContent = "Бесценно";
      } else {
        this._price.textContent = `${value} синапсов`;
      }
    }
  }
}

// Карточка в галерее (Шаблон #card-catalog)
export class CardCatalog extends Card {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions?: { onClick: () => void }) {
    super(container);
    this._category = container.querySelector(".card__category") as HTMLElement;
    this._image = container.querySelector(".card__image") as HTMLImageElement;

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      this._category.className = "card__category"; // сброс старых классов

      // Защита по ТЗ: использование объекта categoryMap из src/utils/constants.ts
      const categoryClass =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this._category.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    // Используем базовый метод setImage вашего родительского класса Component
    this.setImage(
      this._image,
      value,
      this.container.querySelector(".card__title")?.textContent || "",
    );
  }
}

// Карточка превью в модальном окне (Шаблон #card-preview)
export class CardPreview extends CardCatalog {
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onClick: () => void }) {
    super(container, actions);
    this._text = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (this._button && actions?.onClick) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation(); // Исключаем дублирование клика по карточке
        actions.onClick();
      });
    }
  }

  set description(value: string) {
    if (this._text) this._text.textContent = value;
  }

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  // Блокируем бесценные товары при рендере цены на этапе превью
  set price(value: number | null) {
    super.price = value;
    if (value === null && this._button) {
      this._button.setAttribute("disabled", "disabled");
      this._button.textContent = "Не продается";
    }
  }
}

// Карточка товара в списке корзины (Шаблон #card-basket)
export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onDelete: () => void }) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._buttonDelete = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;

    if (this._buttonDelete && actions?.onDelete) {
      this._buttonDelete.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }
}
