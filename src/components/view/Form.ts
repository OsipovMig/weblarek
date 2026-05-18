import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormState {
  valid: boolean;
  errors: string[];
}

// 1. Общий родительский класс для всех форм на сайте
export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  // ИСПРАВЛЕНО: Явно указали тип T в контейнере, чтобы убрать ошибку "неиспользуемый тип T"
  constructor(
    protected container: HTMLFormElement & { name: keyof T | string },
    protected events: IEvents,
  ) {
    super(container);
    this._submit = container.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;
    this._errors = container.querySelector(".form__errors") as HTMLElement;

    // Отслеживаем ввод текста в полях формы
    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      // ИСПРАВЛЕНО: Добавлено приведение типов as object для совместимости с вашим IEvents
      this.events.emit(`${this.container.name}.${target.name}:change`, {
        value: target.value,
      } as object);
    });

    // Отслеживаем отправку формы (клик на Submit)
    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`, {} as object);
    });
  }

  set valid(value: boolean) {
    if (this._submit) {
      if (value) this._submit.removeAttribute("disabled");
      else this._submit.setAttribute("disabled", "disabled");
    }
  }

  set errors(value: string) {
    if (this._errors) this._errors.textContent = value;
  }
}

// 2. Дочерний класс: Форма доставки и выбора оплаты (Экспортируем!)
export class OrderForm extends Form<any> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._cardButton = container.querySelector(
      "button[name=card]",
    ) as HTMLButtonElement;
    this._cashButton = container.querySelector(
      "button[name=cash]",
    ) as HTMLButtonElement;

    this._cardButton.addEventListener("click", () =>
      this.selectPayment("card"),
    );
    this._cashButton.addEventListener("click", () =>
      this.selectPayment("cash"),
    );
  }

  selectPayment(method: "card" | "cash") {
    if (this._cardButton && this._cashButton) {
      // Подсвечиваем выбранную кнопку модификатором button_alt-active по ТЗ
      this._cardButton.classList.toggle("button_alt-active", method === "card");
      this._cashButton.classList.toggle("button_alt-active", method === "cash");
      this.events.emit("order.payment:change", { payment: method } as object);
    }
  }
}

// 3. Дочерний класс: Форма контактов покупателя (Экспортируем!)
export class ContactsForm extends Form<any> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}
