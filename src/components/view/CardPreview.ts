import { CardCatalog } from "./CardCatalog";
import { ensureElement } from "../../utils/utils";

export class CardPreview extends CardCatalog {
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onClick: () => void }) {
    super(container, actions);
    this._text = ensureElement<HTMLElement>(".card__text", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    if (this._button && actions?.onClick) {
      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        actions.onClick();
      });
    }
  }

  set description(value: string) {
    if (this._text) this._text.textContent = value;
  }

  // Отдельный чистый сеттер для текста кнопки по ТЗ
  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  // Отдельный чистый сеттер для управления блокировкой кнопки по ТЗ
  set disabled(state: boolean) {
    if (this._button) {
      this._button.disabled = state;
    }
  }
}
