"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardInputEvent = void 0;
const InputEvent_1 = require("./InputEvent");
class KeyboardInputEvent extends InputEvent_1.InputEvent {
    constructor() {
        super(...arguments);
        this.code = "";
    }
}
exports.KeyboardInputEvent = KeyboardInputEvent;
