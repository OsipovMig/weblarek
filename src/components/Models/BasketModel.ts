import { IProduct, IBasketModel } from "../../types";
import { IEvents } from "../base/Events"; // Добавили обязательный импорт брокера событий

export class BasketModel implements IBasketModel {
  protected _items: IProduct[] = [];
  protected events: IEvents; // Добавили поле для хранения брокера событий

  // Конструктор теперь принимает events (решает ошибку в main.ts)
  constructor(events: IEvents) {
    this.events = events;
  }

  // Реализация геттеров для соответствия интерфейсу IBasketModel
  get items(): IProduct[] {
    return this._items;
  }

  get total(): number {
    return this.getTotalPrice();
  }

  getItems(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    if (!this.isInBasket(item.id)) {
      this._items.push(item);
      this.notify(); // Генерируем событие при изменении данных
    }
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.notify(); // Генерируем событие при изменении данных
  }

  clear(): void {
    this._items = [];
    this.notify(); // Генерируем событие при изменении данных
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

  // Централизованный метод уведомления Презентера об изменении корзины
  protected notify(): void {
    this.events.emit("basket:changed", {
      items: this._items,
      total: this.getTotalPrice(),
      count: this.getCount(),
    } as object); // Добавили приведение типов, чтобы не было ошибок IEvents
  }
}
