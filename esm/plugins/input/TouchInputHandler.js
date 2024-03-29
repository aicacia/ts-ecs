import { InputHandler } from "./InputHandler";
export class TouchInputHandler extends InputHandler {
    onEvent(time, event) {
        const input = this.getRequiredInput();
        switch (event.type) {
            case "touchstart":
                input.getOrCreateButton(`touch-${event.id}-x`).UNSAFE_setValue(event.x);
                input.getOrCreateButton(`touch-${event.id}-y`).UNSAFE_setValue(event.y);
                input
                    .getOrCreateButton(`touch-${event.id}`)
                    .UNSAFE_down(time.getFrame());
                break;
            case "touchmove":
                input.getOrCreateButton(`touch-${event.id}-x`).UNSAFE_setValue(event.x);
                input.getOrCreateButton(`touch-${event.id}-y`).UNSAFE_setValue(event.y);
                break;
            case "touchend":
                input.getOrCreateButton(`touch-${event.id}`).UNSAFE_up(time.getFrame());
                break;
        }
        return this;
    }
}
