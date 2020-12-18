"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultManager = void 0;
var tslib_1 = require("tslib");
var Manager_1 = require("./Manager");
var DefaultManager = /** @class */ (function (_super) {
    tslib_1.__extends(DefaultManager, _super);
    function DefaultManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.components = [];
        _this.sortFunction = function (a, b) {
            return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
        };
        return _this;
    }
    DefaultManager.prototype.getComponents = function () {
        return this.components;
    };
    DefaultManager.prototype.addComponent = function (component) {
        this.components.push(component);
        return this;
    };
    DefaultManager.prototype.removeComponent = function (component) {
        var index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
        return this;
    };
    DefaultManager.prototype.isEmpty = function () {
        return this.components.length === 0;
    };
    DefaultManager.prototype.sort = function () {
        this.components.sort(this.sortFunction);
        return this;
    };
    DefaultManager.prototype.onInit = function () {
        this.components.forEach(function (component) { return component.onInit(); });
        return this;
    };
    DefaultManager.prototype.onUpdate = function () {
        this.components.forEach(function (component) { return component.onUpdate(); });
        return this;
    };
    DefaultManager.prototype.onAfterUpdate = function () {
        this.components.forEach(function (component) { return component.onAfterUpdate(); });
        return this;
    };
    return DefaultManager;
}(Manager_1.Manager));
exports.DefaultManager = DefaultManager;
