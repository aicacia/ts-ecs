export class JSONClassRegistry {
    constructor() {
        this.constructorToTypeId = new Map();
        this.typeIdToConstructor = new Map();
    }
    getByConstructor(klass) {
        const typeId = this.constructorToTypeId.get(klass);
        if (typeId) {
            const storedKlass = this.typeIdToConstructor.get(typeId);
            if (klass === storedKlass) {
                return typeId;
            }
            else {
                throw new Error(`${klass} and ${storedKlass} are using the same typeId ${typeId}`);
            }
        }
        else {
            const typeId = klass.getTypeId();
            this.constructorToTypeId.set(klass, typeId);
            this.typeIdToConstructor.set(typeId, klass);
            return typeId;
        }
    }
    getById(typeId) {
        return this.typeIdToConstructor.get(typeId) || null;
    }
}
export const globalJSONClassRegistry = new JSONClassRegistry();
