import { Option } from "@aicacia/core";
export class JSONClassRegistry {
    constructor() {
        this.constructorToTypeId = new Map();
        this.typeIdToConstructor = new Map();
    }
    getByConstructor(klass) {
        return Option.from(this.constructorToTypeId.get(klass))
            .map((typeId) => {
            const storedKlass = this.typeIdToConstructor.get(typeId);
            if (klass === storedKlass) {
                return typeId;
            }
            else {
                throw new Error(`${klass} and ${storedKlass} are using the same typeId ${typeId}`);
            }
        })
            .unwrapOrElse(() => {
            const typeId = klass.getTypeId();
            this.constructorToTypeId.set(klass, typeId);
            this.typeIdToConstructor.set(typeId, klass);
            return typeId;
        });
    }
    getById(typeId) {
        return Option.from(this.typeIdToConstructor.get(typeId));
    }
}
export const globalJSONClassRegistry = new JSONClassRegistry();
