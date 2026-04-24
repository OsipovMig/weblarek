import { IBuyer, FormErrors, TPayment } from "../../types";

export class BuyerModel {
  protected _data: IBuyer = {
    payment: "card",
    address: "",
    email: "",
    phone: "",
  };
  protected _errors: FormErrors = {};

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
    this._data = { payment: "card", address: "", email: "", phone: "" };
    this._errors = {};
  }

  validate(): FormErrors {
    const errors: FormErrors = {};

    if (!this._data.address) errors.address = "Необходимо указать адрес";
    if (!this._data.email) errors.email = "Необходимо указать email";
    if (!this._data.phone) errors.phone = "Необходимо указать телефон";
    if (!this._data.payment) errors.payment = "Не выбран способ оплаты";

    this._errors = errors;
    return errors;
  }
}
