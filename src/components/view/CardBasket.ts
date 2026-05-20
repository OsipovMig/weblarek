import { Card } from "./card";
import { ensureElement } from "../../utils/utils";

export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onDelete: () => void }) {
    super(container);
    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._buttonDelete = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    if (this._buttonDelete && actions?.onDelete) {
      this._buttonDelete.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    if (this._index) this._index.textContent = String(value);
  }
}
