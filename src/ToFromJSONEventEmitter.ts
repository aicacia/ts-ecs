import type { IConstructor } from "@aicacia/core";
import type { IJSONObject } from "@aicacia/json";
import type { ValidEventTypes } from "eventemitter3";
import { EventEmitter } from "eventemitter3";

export abstract class ToFromJSONEventEmitter<
  EventTypes extends ValidEventTypes = any
> extends EventEmitter<EventTypes> {
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
    const constructor = globalJSONClassRegistry.getById<T>(
      json.typeId as string
    );
    if (!constructor) {
      throw new Error(
        `Failed to get class ${json.typeId} from globalJSONClassRegistry make sure the Component was added`
      );
    }
    return constructor;
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
