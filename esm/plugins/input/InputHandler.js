import { none } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
export class InputHandler extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.input = none();
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
