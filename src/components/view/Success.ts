import { Component } from "../base/Component";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: { onClose: () => void }) {
    super(container);
    this._close = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;
    this._description = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;

    if (this._close && actions?.onClose) {
      this._close.addEventListener("click", actions.onClose);
    }
  }

  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }
}
