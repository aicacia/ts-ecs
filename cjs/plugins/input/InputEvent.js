"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputEvent = void 0;
class InputEvent {
    constructor(type) {
        this.type = type;
    }
    static init(event, type) {
        event.type = type;
        return event;
    }
}
exports.InputEvent = InputEvent;
