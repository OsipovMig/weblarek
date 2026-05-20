import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

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
    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this._content = ensureElement<HTMLElement>(".modal__content", container);

    this._closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    if (this._content) this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    if (this._content) this._content.replaceChildren();
  }
}
