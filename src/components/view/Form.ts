import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IFormState {
  valid: boolean;
  errors: string;
}

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);
    this._submit = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      container,
    );
    this._errors = ensureElement<HTMLElement>(".form__errors", container);

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.events.emit<Partial<T>>(
        `${this.container.name}.${target.name}:change`,
        {
          value: target.value,
        } as any,
      );
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`, {});
    });
  }

  set valid(value: boolean) {
    if (this._submit) {
      this._submit.disabled = !value;
    }
  }

  set errors(value: string) {
    if (this._errors) this._errors.textContent = value;
  }

  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });

    // ИСПРАВЛЕНО: Используем Object.entries для безопасного перебора без динамических ключей
    Object.entries(inputs).forEach(([key, value]) => {
      // Ищем элемент ввода (input, select, textarea) по его атрибуту name внутри формы
      const inputElement = this.container.elements.namedItem(key) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;

      if (inputElement && value !== undefined) {
        // Устанавливаем текстовое значение в само поле ввода
        inputElement.value = String(value);
      }
    });

    return this.container;
  }
}
