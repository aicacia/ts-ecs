import { Option } from "@aicacia/core";
import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Camera3D } from "./Camera3D";
export declare class Camera3DManager extends DefaultDescriptorManager<Camera3D> {
    private active;
    setActive(camera: Camera3D): this;
    getActive(): Option<Camera3D>;
    getRequiredActive(): Camera3D;
    addComponent(camera: Camera3D): this;
    removeComponent(camera: Camera3D): this;
}
