import { IBuyer, FormErrors, TPayment } from "../../types";

export class BuyerModel {
  protected _data: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  constructor() {}

  setData(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this._data.payment = value as TPayment;
    } else {
      this._data[field] = value;
    }
  }

  getData(): IBuyer {
    return this._data;
  }

  clearData(): void {
    // Сбрасываем всё, включая оплату
    this._data = { payment: null, address: "", email: "", phone: "" };
  }

  validate(): FormErrors {
    const errors: FormErrors = {};

    if (!this._data.address.trim()) errors.address = "Необходимо указать адрес";
    if (!this._data.email.trim()) errors.email = "Необходимо указать email";
    if (!this._data.phone.trim()) errors.phone = "Необходимо указать телефон";
    if (!this._data.payment)
      errors.payment = "Необходимо выбрать способ оплаты";

    return errors;
  }
}
