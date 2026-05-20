import { Api } from "./base/Api";
import { IProductResponse, IOrder, IOrderResult } from "../types";

export class LarekApi {
  private _api: Api;

  // ИСПРАВЛЕНО: Конструктор теперь принимает только базовый класс Api, без CDN
  constructor(api: Api) {
    this._api = api;
  }

  // ИСПРАВЛЕНО: Метод просто возвращает полный сырой объект ответа сервера без изменений
  getProducts(): Promise<IProductResponse> {
    return this._api.get<IProductResponse>("/product");
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}
