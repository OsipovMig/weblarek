import { IBuyer, FormErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  protected _data: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this._data.payment = value as TPayment;
    } else {
      this._data[field] = value;
    }
    this.events.emit("buyer:changed", {});
  }

  getData(): IBuyer {
    return this._data;
  }

  clearData(): void {
    this._data = { payment: null, address: "", email: "", phone: "" };
    this.events.emit("buyer:changed", {});
  }

  // Оставляем только ВАШ оригинальный метод валидации данных из прошлого спринта
  validateAll(): FormErrors {
    const errors: FormErrors = {};

    if (!this._data.address.trim()) errors.address = "Необходимо указать адрес";
    if (!this._data.email.trim()) errors.email = "Необходимо указать email";
    if (!this._data.phone.trim()) errors.phone = "Необходимо указать телефон";
    if (!this._data.payment)
      errors.payment = "Необходимо выбрать способ оплаты";

    return errors;
  }
}
