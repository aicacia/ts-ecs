import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { RenderableComponent } from "../RenderableComponent";
import { Camera3DManager } from "./Camera3DManager";
import type { IJSONArray, IJSONObject } from "@aicacia/json";
export declare class Camera3D extends RenderableComponent {
    static Manager: typeof Camera3DManager;
    static requiredComponents: (typeof Transform3D | typeof Transform2D)[][];
    private width;
    private height;
    private aspect;
    private orthographic;
    private size;
    private minSize;
    private maxSize;
    private fov;
    private near;
    private far;
    private projection;
    private view;
    private needsUpdate;
    private background;
    getBackground(): import("gl-matrix").mat2;
    setBackground(background: vec4): this;
    set(width: number, height: number): this;
    getWidth(): number;
    setWidth(width: number): this;
    getHeight(): number;
    setHeight(height: number): this;
    getAspect(): number;
    getSize(): number;
    setSize(size: number): this;
    getMinSize(): number;
    setMinSize(minSize: number): this;
    getMaxSize(): number;
    setMaxSize(maxSize: number): this;
    getFov(): number;
    setFov(fov: number): this;
    getNear(): number;
    setNear(near: number): this;
    getFar(): number;
    setFar(far: number): this;
    getView(): mat4;
    getProjection(): mat4;
    setNeedsUpdate(needsUpdate?: boolean): this;
    updateProjectionIfNeeded(): this;
    isActive(): boolean;
    setActive(): this;
    updateProjection(): this;
    toRelative(out: vec3, screen: vec2): vec3;
    toWorld(out: vec3, screen: vec2): vec3;
    toScreen(out: vec2, world: vec3): vec2;
    toJSON(): {
        width: number;
        height: number;
        size: number;
        fov: number;
        near: number;
        far: number;
        background: IJSONArray;
    };
    fromJSON(json: IJSONObject): this;
}
