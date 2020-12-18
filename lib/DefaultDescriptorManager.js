"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDescriptorManager = void 0;
var tslib_1 = require("tslib");
var DefaultManager_1 = require("./DefaultManager");
var DefaultDescriptorManager = /** @class */ (function (_super) {
    tslib_1.__extends(DefaultDescriptorManager, _super);
    function DefaultDescriptorManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultDescriptorManager.prototype.onInit = function () {
        return this;
    };
    DefaultDescriptorManager.prototype.onUpdate = function () {
        return this;
    };
    DefaultDescriptorManager.prototype.onAfterUpdate = function () {
        return this;
    };
    return DefaultDescriptorManager;
}(DefaultManager_1.DefaultManager));
exports.DefaultDescriptorManager = DefaultDescriptorManager;
