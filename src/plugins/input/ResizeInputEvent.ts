import { InputEvent } from "./InputEvent";

export class ResizeInputEvent extends InputEvent<"resize"> {
  width = 0;
  height = 0;
}
