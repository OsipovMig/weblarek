import { IProduct } from "../../types";

export class CatalogModel {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;

  constructor() {}

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct {
    const item = this._items.find((item) => item.id === id);
    if (!item) {
      throw new Error(`Product with id ${id} not found`);
    }
    return item;
  }

  setPreview(item: IProduct): void {
    this._preview = item;
  }

  getPreview(): IProduct | null {
    return this._preview;
  }
}
