import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import { KeyboardInputEvent } from "./KeyboardInputEvent";

export class KeyboardInputHandler extends InputHandler {
  onEvent(time: Time, event: KeyboardInputEvent) {
    const input = this.getRequiredInput();

    switch (event.type) {
      case "keydown":
        input.getOrCreateButton(event.code).UNSAFE_down(time.getFrame());
        break;
      case "keyup":
        input.getOrCreateButton(event.code).UNSAFE_up(time.getFrame());
        break;
    }
    return this;
  }
}
