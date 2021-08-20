import type { IConstructor } from "@aicacia/core";
import type { IJSONObject } from "@aicacia/json";
import type { ValidEventTypes } from "eventemitter3";
import { EventEmitter } from "eventemitter3";
export declare abstract class ToFromJSONEventEmitter<EventTypes extends ValidEventTypes = any> extends EventEmitter<EventTypes> {
    static typeId?: string;
    static toFromJSONEnabled: boolean;
    static toString(): string;
    static getTypeId(): string;
    static isToFromJSONEnabled(): boolean;
    static getConstructorFromJSON<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(json: IJSONObject): IConstructor<T>;
    static newFromJSON<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(json: IJSONObject): T;
    getConstructor(): IConstructor<this>;
    toJSON(): IJSONObject;
    fromJSON(_json: IJSONObject): this;
}
