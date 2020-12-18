/// <reference types="node" />
import { IConstructor } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { EventEmitter } from "events";
export declare abstract class ToFromJSONEventEmitter extends EventEmitter {
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
