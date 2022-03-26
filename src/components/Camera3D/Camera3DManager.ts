import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Camera3D } from "./Camera3D";

export class Camera3DManager extends DefaultDescriptorManager<Camera3D> {
  private active: Camera3D | null = null;

  setActive(camera: Camera3D) {
    if (camera.getManager() === this) {
      this.active = camera;
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
    if (this.active) {
      throw new Error(`Expected an Active Camera`);
    }
    return this.active;
  }

  addComponent(camera: Camera3D) {
    super.addComponent(camera);

    if (this.active === null) {
      this.active = camera;
    }

    return this;
  }

  removeComponent(camera: Camera3D) {
    super.removeComponent(camera);

    if (this.active) {
      if (this.active === camera) {
        this.active = null;
      }
    }

    return this;
  }
}
