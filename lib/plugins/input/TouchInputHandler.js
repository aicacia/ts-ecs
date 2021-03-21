"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchInputHandler = void 0;
const InputHandler_1 = require("./InputHandler");
class TouchInputHandler extends InputHandler_1.InputHandler {
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
exports.TouchInputHandler = TouchInputHandler;
