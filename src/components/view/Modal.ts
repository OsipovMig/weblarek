import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._closeButton = container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;
    this._content = container.querySelector(".modal__content") as HTMLElement;

    this._closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    if (this._content) this._content.replaceChildren(value);
  }

  open() {
    // Защита по ТЗ: использование модификатора 'modal_active'
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    if (this._content) this._content.replaceChildren(); // Полная очистка
    this.events.emit("modal:close");
  }
}
