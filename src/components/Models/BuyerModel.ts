import { IBuyer, FormErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events"; // Добавили обязательный импорт брокера событий

export class BuyerModel {
  protected _data: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };
  protected events: IEvents; // Добавили поле для хранения брокера событий

  // Конструктор теперь принимает events (решает ошибку в main.ts)
  constructor(events: IEvents) {
    this.events = events;
  }

  setData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this._data.payment = value as TPayment;
    } else {
      this._data[field] = value;
    }

    // Эмитим событие: данные покупателя в модели изменились
    this.events.emit("buyer:changed", this._data as object);

    // Автоматически запускаем раздельное уведомление о валидации форм
    this.validateForm();
  }

  getData(): IBuyer {
    return this._data;
  }

  clearData(): void {
    // Сбрасываем всё, включая оплату
    this._data = { payment: null, address: "", email: "", phone: "" };

    // Эмитим событие: данные успешно сброшены
    this.events.emit("buyer:clear", {} as object);
  }

  // Метод переименован в validateAll, чтобы соответствовать вызовам в вашем main.ts
  validateAll(): FormErrors {
    const errors: FormErrors = {};

    if (!this._data.address.trim()) errors.address = "Необходимо указать адрес";
    if (!this._data.email.trim()) errors.email = "Необходимо указать email";
    if (!this._data.phone.trim()) errors.phone = "Необходимо указать телефон";
    if (!this._data.payment)
      errors.payment = "Необходимо выбрать способ оплаты";

    return errors;
  }

  // Раздельная валидация для двух разных окон форм на сайте (эмитит события во View)
  protected validateForm(): void {
    // 1. Проверка первой формы (Способ оплаты + Адрес)
    const orderErrors: FormErrors = {};
    if (!this._data.payment)
      orderErrors.payment = "Необходимо выбрать способ оплаты";
    if (!this._data.address.trim())
      orderErrors.address = "Необходимо указать адрес доставки";
    this.events.emit("orderForm:validate", orderErrors as object);

    // 2. Проверка второй формы (Email + Телефон)
    const contactsErrors: FormErrors = {};
    if (!this._data.email.trim())
      contactsErrors.email = "Необходимо указать email";
    if (!this._data.phone.trim())
      contactsErrors.phone = "Необходимо указать телефон";
    this.events.emit("contactsForm:validate", contactsErrors as object);
  }
}
