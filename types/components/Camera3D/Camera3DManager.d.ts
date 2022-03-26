import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Camera3D } from "./Camera3D";
export declare class Camera3DManager extends DefaultDescriptorManager<Camera3D> {
    private active;
    setActive(camera: Camera3D): this;
    getActive(): Camera3D | null;
    getRequiredActive(): null;
    addComponent(camera: Camera3D): this;
    removeComponent(camera: Camera3D): this;
}
