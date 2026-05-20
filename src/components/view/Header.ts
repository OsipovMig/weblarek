import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected _counter: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._counter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );
    this._basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    // Навешиваем слушатель клика открытия корзины внутри зоны ответственности класса
    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    if (this._counter) {
      this._counter.textContent = String(value);
    }
  }
}
