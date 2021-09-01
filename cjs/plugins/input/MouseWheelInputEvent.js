"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseWheelInputEvent = void 0;
const InputEvent_1 = require("./InputEvent");
class MouseWheelInputEvent extends InputEvent_1.InputEvent {
    constructor() {
        super(...arguments);
        this.wheel = 0;
    }
}
exports.MouseWheelInputEvent = MouseWheelInputEvent;
