import { Api } from "./base/Api";
import { IProductResponse, IOrder, IOrderResult, IProduct } from "../types";

export class LarekApi {
  private _api: Api;
  readonly cdnUrl: string;

  // Конструктор принимает сначала строку CDN, затем объект Api
  constructor(cdnUrl: string, api: Api) {
    this._api = api;
    this.cdnUrl = cdnUrl;
  }

  getProducts(): Promise<IProductResponse> {
    // Убрали знак вопроса, чтобы метод гарантированно возвращал Promise, который ждет main.ts
    return this._api.get<IProductResponse>("/product").then((response) => {
      return {
        ...response,
        items: response.items.map((item: IProduct) => ({
          ...item,
          image: this.cdnUrl + item.image,
        })),
      };
    });
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}
