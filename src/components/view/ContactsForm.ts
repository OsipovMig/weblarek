import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IBuyer } from "../../types";

// ИСПРАВЛЕНО: Явно добавили ключевое слово export и строгую типизацию Partial<IBuyer> вместо any
export class ContactsForm extends Form<Partial<IBuyer>> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}
