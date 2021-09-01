import { Input } from "../../plugins";
import { RenderableComponent } from "../RenderableComponent";
import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { Camera2DControlManager } from "./Camera2DControlManager";
import type { IJSONObject } from "@aicacia/json";
export declare class Camera2DControl extends RenderableComponent {
    static Manager: typeof Camera2DControlManager;
    static requiredComponents: (typeof Transform2D | typeof Transform3D)[][];
    static requiredPlugins: (typeof Input)[];
    private enabled;
    private panSpeed;
    private zoomSpeed;
    private dragging;
    private lastMouse;
    private offset;
    getEnabled(): boolean;
    setEnabled(enabled?: boolean): this;
    getPanSpeed(): number;
    setPanSpeed(panSpeed: number): this;
    getZoomSpeed(): number;
    setZoomSpeed(zoomSpeed: number): this;
    onUpdate(): this;
    toJSON(): {
        enabled: boolean;
        zoomSpeed: number;
        panSpeed: number;
    };
    fromJSON(json: IJSONObject): this;
}
