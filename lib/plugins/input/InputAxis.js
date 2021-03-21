"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputAxis = void 0;
class InputAxis {
    constructor(name, negButton, posButton) {
        this.gravity = 3;
        this.sensitivity = 3;
        this.dead = 0.001;
        this.value = 0.0;
        this.name = name;
        this.negButton = negButton;
        this.posButton = posButton;
    }
    getName() {
        return this.name;
    }
    getNegButton() {
        return this.negButton;
    }
    setNegButton(negButton) {
        this.negButton = negButton;
        return this;
    }
    getPosButton() {
        return this.posButton;
    }
    setPosButton(posButton) {
        this.posButton = posButton;
        return this;
    }
    getGravity() {
        return this.gravity;
    }
    setGravity(gravity) {
        this.gravity = gravity;
        return this;
    }
    getSensitivity() {
        return this.sensitivity;
    }
    setSensitivity(sensitivity) {
        this.sensitivity = sensitivity;
        return this;
    }
    getDead() {
        return this.dead;
    }
    setDead(dead) {
        this.dead = dead;
        return this;
    }
    getValue() {
        return this.value;
    }
    /**
     * @ignore
     */
    UNSAFE_setValue(value) {
        this.value = value;
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_update(time, value, isNeg, isPos) {
        const delta = time.getDelta();
        if (isNeg) {
            value -= this.getSensitivity() * delta;
        }
        if (isPos) {
            value += this.getSensitivity() * delta;
        }
        if (!isPos && !isNeg && value !== 0.0) {
            value -= (value >= 0 ? 1 : -1) * this.getGravity() * delta;
        }
        value = value >= 1.0 ? 1.0 : value <= -1.0 ? -1.0 : value;
        if (Math.abs(value) <= this.getDead()) {
            value = 0.0;
        }
        this.value = value;
    }
    toJSON() {
        return {
            name: this.name,
            negButton: this.negButton,
            posButton: this.posButton,
            gravity: this.gravity,
            sensitivity: this.sensitivity,
            dead: this.dead,
            value: this.value,
        };
    }
    fromJSON(json) {
        this.name = json.name;
        this.negButton = json.negButton;
        this.posButton = json.posButton;
        this.gravity = json.gravity;
        this.sensitivity = json.sensitivity;
        this.dead = json.dead;
        this.value = json.value;
        return this;
    }
}
exports.InputAxis = InputAxis;
