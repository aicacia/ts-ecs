"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
var Manager = /** @class */ (function (_super) {
    tslib_1.__extends(Manager, _super);
    function Manager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scene = core_1.none();
        return _this;
    }
    Manager.getManagerPriority = function () {
        return this.managerPriority;
    };
    /**
     * @ignore
     */
    Manager.prototype.UNSAFE_setScene = function (scene) {
        this.scene.replace(scene);
        return this;
    };
    /**
     * @ignore
     */
    Manager.prototype.UNSAFE_removeScene = function () {
        this.scene.clear();
        return this;
    };
    Manager.prototype.getScene = function () {
        return this.scene;
    };
    Manager.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    Manager.prototype.getManagerPriority = function () {
        return Object.getPrototypeOf(this).constructor.getManagerPriority();
    };
    Manager.prototype.getPlugin = function (Plugin) {
        return this.getScene().flatMap(function (scene) { return scene.getPlugin(Plugin); });
    };
    Manager.prototype.getRequiredPlugin = function (Plugin) {
        return this.getPlugin(Plugin).expect(this.getConstructor() + " required " + Plugin + " Plugin");
    };
    Manager.prototype.getManager = function (Manager) {
        return this.getScene().flatMap(function (scene) { return scene.getManager(Manager); });
    };
    Manager.prototype.getRequiredManager = function (Manager) {
        return this.getManager(Manager).expect(this.getConstructor() + " required " + Manager + " Manager");
    };
    Manager.prototype.onAdd = function () {
        return this;
    };
    Manager.prototype.onRemove = function () {
        return this;
    };
    Manager.managerPriority = 0;
    return Manager;
}(ToFromJSONEventEmitter_1.ToFromJSONEventEmitter));
exports.Manager = Manager;
