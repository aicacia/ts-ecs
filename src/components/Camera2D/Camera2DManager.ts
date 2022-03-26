import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Camera2D } from "./Camera2D";

export class Camera2DManager extends DefaultDescriptorManager<Camera2D> {
  private active: Camera2D | null = null;

  setActive(camera: Camera2D) {
    if (camera.getManager() === this) {
      this.active = camera;
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
    if (!this.active) {
      throw new Error(`Expected an Active Camera`);
    }
    return this.active;
  }

  addComponent(camera: Camera2D) {
    super.addComponent(camera);

    if (this.active === null) {
      this.active = camera;
    }

    return this;
  }

  removeComponent(camera: Camera2D) {
    super.removeComponent(camera);

    if (this.active) {
      if (this.active === camera) {
        this.active = null;
      }
    }

    return this;
  }
}
