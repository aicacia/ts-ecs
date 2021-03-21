import { InputEvent } from "./InputEvent";

export class TouchInputEvent extends InputEvent<
  "touchstart" | "touchmove" | "touchend"
> {
  id = 0;
  x = 0;
  y = 0;
}
