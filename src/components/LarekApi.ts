import { Api } from "./base/Api";
import { IProductResponse, IOrder, IOrderResult } from "../types";

export class LarekApi {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  getProducts(): Promise<IProductResponse> {
    return this._api.get<IProductResponse>("/product");
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}
