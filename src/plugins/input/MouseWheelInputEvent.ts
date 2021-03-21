import { InputEvent } from "./InputEvent";

export class MouseWheelInputEvent extends InputEvent<"wheel"> {
  wheel = 0;
}
