import { InputHandler } from "./InputHandler";
export class KeyboardInputHandler extends InputHandler {
    onEvent(time, event) {
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
