import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IPage {
  catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected _gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container); // Здесь сохраняется document.body
    // Ищем сетку каталога внутри всего body страницы
    this._gallery = ensureElement<HTMLElement>(".gallery", container);
  }

  set catalog(items: HTMLElement[]) {
    if (this._gallery) {
      this._gallery.replaceChildren(...items);
    }
  }
}
