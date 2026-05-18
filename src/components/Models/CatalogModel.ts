import { IProduct, ICatalogModel } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel implements ICatalogModel {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;

  // ИСПРАВЛЕНО: Убрали внешнее объявление поля.
  // Модификатор protected прямо здесь гарантирует создание и железную запись свойства this.events
  constructor(protected events: IEvents) {}

  get items(): IProduct[] {
    return this._items;
  }

  get preview(): IProduct | null {
    return this._preview;
  }

  setItems(items: IProduct[]): void {
    this._items = items;

    // Добавили защитную проверку ?., чтобы рантайм не падал в любом случае
    this.events?.emit("items:changed", { items: this._items } as object);
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setPreview(item: IProduct | null = null): void {
    this._preview = item;
    this.events?.emit("preview:changed", { item: this._preview });
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
