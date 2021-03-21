import { InputEvent } from "./InputEvent";

export class MouseInputEvent extends InputEvent<
  "mousemove" | "mousedown" | "mouseup" | "mouseleave"
> {
  button = 0;
  x = 0;
  y = 0;
}
