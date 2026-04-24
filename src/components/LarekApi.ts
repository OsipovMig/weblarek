// src/components/LarekApi.ts
import { IApi, IProductResponse, IOrder, IOrderResult } from "../types";

export class LarekApi {
  private _api: IApi;
  readonly cdn: string;

  constructor(api: IApi, cdn: string) {
    // <--- ПОРЯДОК: сначала API, потом CDN
    this._api = api;
    this.cdn = cdn;
  }

  getProducts(): Promise<IProductResponse> {
    // Убедись, что здесь '/product', а не 'product' или '/product/'
    return this._api.get<IProductResponse>("/product").then((data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      })),
    }));
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}
