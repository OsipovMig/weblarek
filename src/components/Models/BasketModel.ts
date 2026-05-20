import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  protected _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    if (!this.isInBasket(item.id)) {
      this._items.push(item);
      this.notify();
    }
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.notify();
  }

  clear(): void {
    this._items = [];
    this.notify();
  }

  getTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  isInBasket(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }

  protected notify(): void {
    // Передаем пустой объект для удовлетворения контракта <T extends object>
    this.events.emit("basket:changed", {});
  }
}
