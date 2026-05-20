import { Card } from "./card";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export class CardCatalog extends Card {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(container: HTMLElement, actions?: { onClick: () => void }) {
    super(container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._image = ensureElement<HTMLImageElement>(".card__image", container);

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      this._category.className = "card__category";
      const categoryClass =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this._category.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    this.setImage(
      this._image,
      value,
      this.container?.querySelector(".card__title")?.textContent || "",
    );
  }
}
