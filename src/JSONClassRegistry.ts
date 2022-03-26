import type { IConstructor } from "@aicacia/core";
import type { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

export class JSONClassRegistry {
  private constructorToTypeId: Map<
    IConstructor<ToFromJSONEventEmitter>,
    string
  > = new Map();
  private typeIdToConstructor: Map<
    string,
    IConstructor<ToFromJSONEventEmitter>
  > = new Map();

  getByConstructor<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(
    klass: IConstructor<T>
  ) {
    const typeId = this.constructorToTypeId.get(klass);
    if (typeId) {
      const storedKlass = this.typeIdToConstructor.get(typeId);

      if (klass === storedKlass) {
        return typeId;
      } else {
        throw new Error(
          `${klass} and ${storedKlass} are using the same typeId ${typeId}`
        );
      }
    } else {
      const typeId = (
        klass as any as typeof ToFromJSONEventEmitter
      ).getTypeId();
      this.constructorToTypeId.set(klass, typeId);
      this.typeIdToConstructor.set(typeId, klass);
      return typeId;
    }
  }
  getById<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(
    typeId: string
  ): IConstructor<T> | null {
    return (this.typeIdToConstructor.get(typeId) as IConstructor<T>) || null;
  }
}

export const globalJSONClassRegistry = new JSONClassRegistry();
