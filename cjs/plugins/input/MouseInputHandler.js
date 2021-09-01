"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseInputHandler = void 0;
const InputHandler_1 = require("./InputHandler");
class MouseInputHandler extends InputHandler_1.InputHandler {
    onEvent(time, event) {
        const input = this.getRequiredInput();
        switch (event.type) {
            case "mousemove":
                input.getOrCreateButton("mouse-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("mouse-y").UNSAFE_setValue(event.y);
                break;
            case "mousedown":
                input.getOrCreateButton("mouse-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("mouse-y").UNSAFE_setValue(event.y);
                input
                    .getOrCreateButton(`mouse-${event.button}`)
                    .UNSAFE_down(time.getFrame());
                break;
            case "mouseup":
            case "mouseleave":
                input.getOrCreateButton("mouse-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("mouse-y").UNSAFE_setValue(event.y);
                input
                    .getOrCreateButton(`mouse-${event.button}`)
                    .UNSAFE_up(time.getFrame());
                break;
            case "wheel":
                input.getOrCreateButton("mouse-wheel").UNSAFE_setValue(event.wheel);
                break;
        }
        return this;
    }
    onAfterUpdate() {
        this.getRequiredInput().getOrCreateButton("mouse-wheel").UNSAFE_setValue(0);
        return this;
    }
}
exports.MouseInputHandler = MouseInputHandler;
