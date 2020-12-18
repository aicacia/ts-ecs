import { IConstructor } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { EventEmitter } from "events";

export abstract class ToFromJSONEventEmitter extends EventEmitter {
  static typeId?: string;
  static toFromJSONEnabled = true;

  static toString() {
    return this.getTypeId();
  }
  static getTypeId() {
    return this.typeId || this.name;
  }
  static isToFromJSONEnabled() {
    return !!this.toFromJSONEnabled;
  }

  static getConstructorFromJSON<
    T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter
  >(json: IJSONObject): IConstructor<T> {
    return globalJSONClassRegistry
      .getById<T>(json.typeId as string)
      .expect(
        `Failed to get class ${json.typeId} from globalJSONClassRegistry make sure the Component was added`
      );
  }

  static newFromJSON<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(
    json: IJSONObject
  ): T {
    const ComponentClass = this.getConstructorFromJSON<T>(json);
    return new ComponentClass().fromJSON(json);
  }

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }

  toJSON(): IJSONObject {
    const typeId = globalJSONClassRegistry.getByConstructor(
      this.getConstructor()
    );

    return {
      typeId,
    };
  }
  fromJSON(_json: IJSONObject) {
    return this;
  }
}

import { globalJSONClassRegistry } from "./JSONClassRegistry";
