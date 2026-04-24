// Если VITE_API_ORIGIN не подгрузится, используем прямую ссылку
const origin =
  import.meta.env.VITE_API_ORIGIN || "https://larek-api.nomoreparties.co";

export const API_URL = `${origin}/api/weblarek`;
export const CDN_URL = `${origin}/content/weblarek`;

export const categoryMap: Record<string, string> = {
  "софт-скил": "card__category_soft",
  "хард-скил": "card__category_hard",
  кнопка: "card__category_button",
  дополнительное: "card__category_additional",
  другое: "card__category_other",
};
