"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToFromJSONEventEmitter = void 0;
const events_1 = require("events");
class ToFromJSONEventEmitter extends events_1.EventEmitter {
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
        return JSONClassRegistry_1.globalJSONClassRegistry
            .getById(json.typeId)
            .expect(`Failed to get class ${json.typeId} from globalJSONClassRegistry make sure the Component was added`);
    }
    static newFromJSON(json) {
        const ComponentClass = this.getConstructorFromJSON(json);
        return new ComponentClass().fromJSON(json);
    }
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    toJSON() {
        const typeId = JSONClassRegistry_1.globalJSONClassRegistry.getByConstructor(this.getConstructor());
        return {
            typeId,
        };
    }
    fromJSON(_json) {
        return this;
    }
}
exports.ToFromJSONEventEmitter = ToFromJSONEventEmitter;
ToFromJSONEventEmitter.toFromJSONEnabled = true;
const JSONClassRegistry_1 = require("./JSONClassRegistry");
