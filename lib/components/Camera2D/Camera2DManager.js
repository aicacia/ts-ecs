"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2DManager = void 0;
const core_1 = require("@aicacia/core");
const DefaultDescriptorManager_1 = require("../../DefaultDescriptorManager");
class Camera2DManager extends DefaultDescriptorManager_1.DefaultDescriptorManager {
    constructor() {
        super(...arguments);
        this.active = core_1.none();
    }
    setActive(camera) {
        if (camera
            .getManager()
            .map((manager) => manager === this)
            .unwrapOr(false)) {
            this.active.replace(camera);
        }
        else {
            throw new Error("Camera2DManager.setActive(camera: Camera2D): cannot set active if camera is not in manager");
        }
        return this;
    }
    getActive() {
        return this.active;
    }
    getRequiredActive() {
        return this.getActive().expect(`Expected an Active Camera`);
    }
    addComponent(camera) {
        super.addComponent(camera);
        if (this.active.isNone()) {
            this.active.replace(camera);
        }
        return this;
    }
    removeComponent(camera) {
        super.removeComponent(camera);
        this.active.ifSome((active) => {
            if (active === camera) {
                this.active.clear();
            }
        });
        return this;
    }
}
exports.Camera2DManager = Camera2DManager;
