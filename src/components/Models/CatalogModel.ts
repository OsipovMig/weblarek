import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    // Передаем пустой объект, удовлетворяющий <T extends object>, без приведения типов
    this.events.emit("items:changed", {});
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreview(item: IProduct | null = null): void {
    this._preview = item;
    // Чтобы не передавать null в события (так как null не extends object),
    // принудительно шлем пустой объект, если товара нет, или сам товар, если он выбран
    this.events.emit("preview:changed", item || {});
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
