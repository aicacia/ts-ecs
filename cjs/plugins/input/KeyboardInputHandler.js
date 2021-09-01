"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardInputHandler = void 0;
const InputHandler_1 = require("./InputHandler");
class KeyboardInputHandler extends InputHandler_1.InputHandler {
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
exports.KeyboardInputHandler = KeyboardInputHandler;
