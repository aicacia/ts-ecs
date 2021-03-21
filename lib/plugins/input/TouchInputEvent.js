"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchInputEvent = void 0;
const InputEvent_1 = require("./InputEvent");
class TouchInputEvent extends InputEvent_1.InputEvent {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.x = 0;
        this.y = 0;
    }
}
exports.TouchInputEvent = TouchInputEvent;
