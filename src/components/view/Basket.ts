import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._list = ensureElement<HTMLElement>(".basket__list", container);
    this._total = ensureElement<HTMLElement>(".basket__price", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this._button.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    if (this._list) {
      this._list.replaceChildren(...items);
    }
  }

  set total(value: number) {
    if (this._total) this._total.textContent = `${value} синапсов`;
  }

  set disabled(state: boolean) {
    if (this._button) {
      this._button.disabled = state;
    }
  }
}
