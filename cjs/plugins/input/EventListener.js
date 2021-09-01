"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
const core_1 = require("@aicacia/core");
const ToFromJSONEventEmitter_1 = require("../../ToFromJSONEventEmitter");
class EventListener extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.input = core_1.none();
    }
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    /**
     * @ignore
     */
    UNSAFE_setInput(input) {
        this.input.replace(input);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeInput() {
        this.input.clear();
        return this;
    }
    getInput() {
        return this.input;
    }
    getRequiredInput() {
        return this.getInput().expect(`${this.getConstructor()} requires a Input Plugin`);
    }
    getScene() {
        return this.getInput().flatMap((input) => input.getScene());
    }
    getRequiredScene() {
        return this.getScene().expect(`${this.getConstructor()} requires a Scene`);
    }
    queueEvent(event) {
        return this.getInput().map((input) => input.queueEvent(event));
    }
    onAdd() {
        return this;
    }
    onRemove() {
        return this;
    }
    onUpdate(_time) {
        return this;
    }
    onAfterUpdate(_time) {
        return this;
    }
}
exports.EventListener = EventListener;
