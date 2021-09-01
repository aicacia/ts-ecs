"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputButton = void 0;
class InputButton {
    constructor(name) {
        this.value = 0.0;
        this.frameDown = 0;
        this.frameUp = 0;
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getFrameDown() {
        return this.frameDown;
    }
    getFrameUp() {
        return this.frameUp;
    }
    getValue() {
        return this.value;
    }
    UNSAFE_setValue(value) {
        this.value = value;
        return this;
    }
    UNSAFE_up(frame) {
        if (this.value === 1.0) {
            this.frameUp = frame;
        }
        this.value = 0.0;
        return this;
    }
    UNSAFE_down(frame) {
        if (this.value === 0.0) {
            this.frameDown = frame;
        }
        this.value = 1.0;
        return this;
    }
    toJSON() {
        return {
            name: this.name,
            value: this.value,
            frameDown: this.frameDown,
            frameUp: this.frameUp,
        };
    }
    fromJSON(json) {
        this.name = json.name;
        this.value = json.value;
        this.frameDown = json.frameDown;
        this.frameUp = json.frameUp;
        return this;
    }
}
exports.InputButton = InputButton;
