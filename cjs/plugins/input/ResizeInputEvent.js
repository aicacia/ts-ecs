"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeInputEvent = void 0;
const InputEvent_1 = require("./InputEvent");
class ResizeInputEvent extends InputEvent_1.InputEvent {
    constructor() {
        super(...arguments);
        this.width = 0;
        this.height = 0;
    }
}
exports.ResizeInputEvent = ResizeInputEvent;
