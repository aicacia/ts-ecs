import { EventEmitter } from "eventemitter3";
export class ToFromJSONEventEmitter extends EventEmitter {
    static toString() {
        return this.getTypeId();
    }
    static getTypeId() {
        return this.typeId || this.name;
    }
    static isToFromJSONEnabled() {
        return !!this.toFromJSONEnabled;
    }
    static getConstructorFromJSON(json) {
        const constructor = globalJSONClassRegistry.getById(json.typeId);
        if (!constructor) {
            throw new Error(`Failed to get class ${json.typeId} from globalJSONClassRegistry make sure the Component was added`);
        }
        return constructor;
    }
    static newFromJSON(json) {
        const ComponentClass = this.getConstructorFromJSON(json);
        return new ComponentClass().fromJSON(json);
    }
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    toJSON() {
        const typeId = globalJSONClassRegistry.getByConstructor(this.getConstructor());
        return {
            typeId,
        };
    }
    fromJSON(_json) {
        return this;
    }
}
ToFromJSONEventEmitter.toFromJSONEnabled = true;
import { globalJSONClassRegistry } from "./JSONClassRegistry";
