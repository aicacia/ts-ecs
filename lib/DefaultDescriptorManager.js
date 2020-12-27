"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDescriptorManager = void 0;
const DefaultManager_1 = require("./DefaultManager");
class DefaultDescriptorManager extends DefaultManager_1.DefaultManager {
    onInit() {
        return this;
    }
    onUpdate() {
        return this;
    }
    onAfterUpdate() {
        return this;
    }
}
exports.DefaultDescriptorManager = DefaultDescriptorManager;
