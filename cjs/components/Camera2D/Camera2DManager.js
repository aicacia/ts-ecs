"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2DManager = void 0;
const DefaultDescriptorManager_1 = require("../../DefaultDescriptorManager");
class Camera2DManager extends DefaultDescriptorManager_1.DefaultDescriptorManager {
    constructor() {
        super(...arguments);
        this.active = null;
    }
    setActive(camera) {
        if (camera.getManager() === this) {
            this.active = camera;
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
        if (!this.active) {
            throw new Error(`Expected an Active Camera`);
        }
        return this.active;
    }
    addComponent(camera) {
        super.addComponent(camera);
        if (this.active === null) {
            this.active = camera;
        }
        return this;
    }
    removeComponent(camera) {
        super.removeComponent(camera);
        if (this.active) {
            if (this.active === camera) {
                this.active = null;
            }
        }
        return this;
    }
}
exports.Camera2DManager = Camera2DManager;
