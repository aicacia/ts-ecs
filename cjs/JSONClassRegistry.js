"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalJSONClassRegistry = exports.JSONClassRegistry = void 0;
const core_1 = require("@aicacia/core");
class JSONClassRegistry {
    constructor() {
        this.constructorToTypeId = new Map();
        this.typeIdToConstructor = new Map();
    }
    getByConstructor(klass) {
        return core_1.Option.from(this.constructorToTypeId.get(klass))
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
        return core_1.Option.from(this.typeIdToConstructor.get(typeId));
    }
}
exports.JSONClassRegistry = JSONClassRegistry;
exports.globalJSONClassRegistry = new JSONClassRegistry();
