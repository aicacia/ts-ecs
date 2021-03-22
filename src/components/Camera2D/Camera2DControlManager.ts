import { DefaultManager } from "../../DefaultManager";
import type { Camera2DControl } from "./Camera2DControl";

export class Camera2DControlManager extends DefaultManager<Camera2DControl> {
  onInit() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
}
