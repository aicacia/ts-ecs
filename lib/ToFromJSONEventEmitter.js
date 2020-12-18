"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToFromJSONEventEmitter = void 0;
var tslib_1 = require("tslib");
var events_1 = require("events");
var ToFromJSONEventEmitter = /** @class */ (function (_super) {
    tslib_1.__extends(ToFromJSONEventEmitter, _super);
    function ToFromJSONEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToFromJSONEventEmitter.toString = function () {
        return this.getTypeId();
    };
    ToFromJSONEventEmitter.getTypeId = function () {
        return this.typeId || this.name;
    };
    ToFromJSONEventEmitter.isToFromJSONEnabled = function () {
        return !!this.toFromJSONEnabled;
    };
    ToFromJSONEventEmitter.getConstructorFromJSON = function (json) {
        return JSONClassRegistry_1.globalJSONClassRegistry
            .getById(json.typeId)
            .expect("Failed to get class " + json.typeId + " from globalJSONClassRegistry make sure the Component was added");
    };
    ToFromJSONEventEmitter.newFromJSON = function (json) {
        var ComponentClass = this.getConstructorFromJSON(json);
        return new ComponentClass().fromJSON(json);
    };
    ToFromJSONEventEmitter.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    ToFromJSONEventEmitter.prototype.toJSON = function () {
        var typeId = JSONClassRegistry_1.globalJSONClassRegistry.getByConstructor(this.getConstructor());
        return {
            typeId: typeId,
        };
    };
    ToFromJSONEventEmitter.prototype.fromJSON = function (_json) {
        return this;
    };
    ToFromJSONEventEmitter.toFromJSONEnabled = true;
    return ToFromJSONEventEmitter;
}(events_1.EventEmitter));
exports.ToFromJSONEventEmitter = ToFromJSONEventEmitter;
var JSONClassRegistry_1 = require("./JSONClassRegistry");
