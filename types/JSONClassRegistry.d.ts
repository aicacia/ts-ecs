import { IConstructor, Option } from "@aicacia/core";
import type { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export declare class JSONClassRegistry {
    private constructorToTypeId;
    private typeIdToConstructor;
    getByConstructor<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(klass: IConstructor<T>): string;
    getById<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(typeId: string): Option<IConstructor<T>>;
}
export declare const globalJSONClassRegistry: JSONClassRegistry;
