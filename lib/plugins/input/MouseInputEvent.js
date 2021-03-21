"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseInputEvent = void 0;
const InputEvent_1 = require("./InputEvent");
class MouseInputEvent extends InputEvent_1.InputEvent {
    constructor() {
        super(...arguments);
        this.button = 0;
        this.x = 0;
        this.y = 0;
    }
}
exports.MouseInputEvent = MouseInputEvent;
