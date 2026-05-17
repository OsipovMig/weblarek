import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._counter = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this._gallery = container.querySelector(".gallery") as HTMLElement;
    this._wrapper = container.querySelector(".page__wrapper") as HTMLElement;
    this._basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    if (this._counter) this._counter.textContent = String(value);
  }

  set catalog(items: HTMLElement[]) {
    if (this._gallery) this._gallery.replaceChildren(...items);
  }

  set locked(value: boolean) {
    if (this._wrapper) {
      this._wrapper.classList.toggle("page__wrapper_locked", value);
    }
  }
}
