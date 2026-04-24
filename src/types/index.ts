export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Интерфейс для описания товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Тип для способа оплаты
export type TPayment = "card" | "cash";

// Интерфейс для данных покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс состояния приложения (для CatalogModel)
export interface ICatalogModel {
  items: IProduct[];
  preview: IProduct | null;
}

// Интерфейс для корзины (для BasketModel)
export interface IBasketModel {
  items: IProduct[];
  total: number;
}

// Тип для хранения ошибок валидации форм
export type FormErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс для итогового заказа, который уходит на сервер
export interface IOrder extends IBuyer {
  items: string[]; // Массив ID купленных товаров
  total: number; // Итоговая сумма
}

// Ответ от сервера при запросе списка товаров
export interface IProductResponse {
  total: number;
  items: IProduct[];
}

// Ответ от сервера при успешном заказе
export interface IOrderResult {
  id: string;
  total: number;
}
