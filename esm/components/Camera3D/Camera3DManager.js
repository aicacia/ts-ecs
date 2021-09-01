import { none } from "@aicacia/core";
import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
export class Camera3DManager extends DefaultDescriptorManager {
    constructor() {
        super(...arguments);
        this.active = none();
    }
    setActive(camera) {
        if (camera
            .getManager()
            .map((manager) => manager === this)
            .unwrapOr(false)) {
            this.active.replace(camera);
        }
        else {
            throw new Error("Camera3DManager.setActive(camera: Camera3D): cannot set active if camera is not in manager");
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
