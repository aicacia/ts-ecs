"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeInputHandler = void 0;
const InputHandler_1 = require("./InputHandler");
class ResizeInputHandler extends InputHandler_1.InputHandler {
    onEvent(_time, event) {
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
exports.ResizeInputHandler = ResizeInputHandler;
