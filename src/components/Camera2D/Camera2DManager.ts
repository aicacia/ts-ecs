import { none, Option } from "@aicacia/core";
import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Camera2D } from "./Camera2D";

export class Camera2DManager extends DefaultDescriptorManager<Camera2D> {
  private active: Option<Camera2D> = none();

  setActive(camera: Camera2D) {
    if (
      camera
        .getManager()
        .map((manager) => manager === this)
        .unwrapOr(false)
    ) {
      this.active.replace(camera);
    } else {
      throw new Error(
        "Camera2DManager.setActive(camera: Camera2D): cannot set active if camera is not in manager"
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

  addComponent(camera: Camera2D) {
    super.addComponent(camera);

    if (this.active.isNone()) {
      this.active.replace(camera);
    }

    return this;
  }

  removeComponent(camera: Camera2D) {
    super.removeComponent(camera);

    this.active.ifSome((active) => {
      if (active === camera) {
        this.active.clear();
      }
    });

    return this;
  }
}
