import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { TPayment, IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";

export class OrderForm extends Form<Partial<IBuyer>> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._cardButton = ensureElement<HTMLButtonElement>(
      "button[name=card]",
      container,
    );
    this._cashButton = ensureElement<HTMLButtonElement>(
      "button[name=cash]",
      container,
    );

    this._cardButton.addEventListener("click", () => {
      this.events.emit("order.payment:change", { payment: "card" });
    });
    this._cashButton.addEventListener("click", () => {
      this.events.emit("order.payment:change", { payment: "cash" });
    });
  }

  set payment(method: TPayment | null) {
    if (this._cardButton && this._cashButton) {
      this._cardButton.classList.toggle("button_alt-active", method === "card");
      this._cashButton.classList.toggle("button_alt-active", method === "cash");
    }
  }

  // ИСПРАВЛЕНО: Переопределяем метод render для синхронизации кнопок и инпута адреса
  render(state: Partial<IBuyer> & { valid: boolean; errors: string }) {
    this.payment = state.payment ?? null;
    return super.render(state);
  }
}
