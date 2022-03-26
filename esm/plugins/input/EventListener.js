import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
export class EventListener extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.input = null;
    }
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    /**
     * @ignore
     */
    UNSAFE_setInput(input) {
        this.input = input;
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeInput() {
        this.input = null;
        return this;
    }
    getInput() {
        return this.input;
    }
    getRequiredInput() {
        const input = this.getInput();
        if (!input) {
            throw new Error(`${this.getConstructor()} requires a Input Plugin`);
        }
        return input;
    }
    getScene() {
        const input = this.getInput();
        if (input) {
            return input.getScene();
        }
        else {
            return null;
        }
    }
    getRequiredScene() {
        const scene = this.getScene();
        if (!scene) {
            throw new Error(`${this.getConstructor()} requires a Scene`);
        }
        return scene;
    }
    queueEvent(event) {
        const input = this.getInput();
        if (input) {
            input.queueEvent(event);
        }
        return this;
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
