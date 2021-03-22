import { none, Option } from "@aicacia/core";
import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Camera3D } from "./Camera3D";

export class Camera3DManager extends DefaultDescriptorManager<Camera3D> {
  private active: Option<Camera3D> = none();

  setActive(camera: Camera3D) {
    if (
      camera
        .getManager()
        .map((manager) => manager === this)
        .unwrapOr(false)
    ) {
      this.active.replace(camera);
    } else {
      throw new Error(
        "Camera3DManager.setActive(camera: Camera3D): cannot set active if camera is not in manager"
      );
    }
    return this;
  }
  getActive() {
    return this.active;
  }
  getRequiredActive() {
    return this.getActive().expect(`Expected an Active Camera`);
  }

  addComponent(camera: Camera3D) {
    super.addComponent(camera);

    if (this.active.isNone()) {
      this.active.replace(camera);
    }

    return this;
  }

  removeComponent(camera: Camera3D) {
    super.removeComponent(camera);

    this.active.ifSome((active) => {
      if (active === camera) {
        this.active.clear();
      }
    });

    return this;
  }
}
