import { InputEvent } from "./InputEvent";

export class KeyboardInputEvent extends InputEvent<"keyup" | "keydown"> {
  code = "";
}
