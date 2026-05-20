import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface ICardView extends IProduct {
  index?: number;
  buttonText?: string;
}

export class Card extends Component<ICardView> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    // Напрямую передаем контейнер, так как cloneTemplate уже вернул чистый элемент
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
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
