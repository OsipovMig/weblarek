import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

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
    this._list = container.querySelector(".basket__list") as HTMLElement;
    this._total = container.querySelector(".basket__price") as HTMLElement;
    this._button = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    this._button.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    if (this._list) {
      if (items.length > 0) {
        this._list.replaceChildren(...items);
        this._button.removeAttribute("disabled");
      } else {
        this._list.replaceChildren(document.createTextNode("Корзина пуста"));
        this._button.setAttribute("disabled", "disabled");
      }
    }
  }

  set total(value: number) {
    if (this._total) this._total.textContent = `${value} синапсов`;
  }
}
