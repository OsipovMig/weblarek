import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: { onClose: () => void }) {
    super(container);
    this._close = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );
    this._description = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );

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
