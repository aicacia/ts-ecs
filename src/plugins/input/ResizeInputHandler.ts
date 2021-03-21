import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
import { ResizeInputEvent } from "./ResizeInputEvent";

export class ResizeInputHandler extends InputHandler {
  onEvent(_time: Time, event: ResizeInputEvent) {
    const input = this.getRequiredInput();

    switch (event.type) {
      case "resize":
        input.getOrCreateButton("screen-width").UNSAFE_setValue(event.width);
        input.getOrCreateButton("screen-height").UNSAFE_setValue(event.height);
        break;
    }
    return this;
  }
}
