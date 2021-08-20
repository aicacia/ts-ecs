import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { mat2d, vec2, vec4 } from "gl-matrix";
import { RenderableComponent } from "../RenderableComponent";
import type { IJSONArray, IJSONObject } from "@aicacia/json";
import { Camera2DManager } from "./Camera2DManager";
import { AABB2 } from "../../math/AABB2";
export declare class Camera2D extends RenderableComponent {
    static Manager: typeof Camera2DManager;
    static requiredComponents: (typeof Transform2D | typeof Transform3D)[][];
    private width;
    private height;
    private aspect;
    private size;
    private minSize;
    private maxSize;
    private projection;
    private view;
    private needsUpdate;
    private background;
    getBackground(): vec4;
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
    setZoom(zoom: number): this;
    getZoom(): number;
    getView(): mat2d;
    getProjection(): mat2d;
    getAABB2(out: AABB2): AABB2;
    setNeedsUpdate(needsUpdate?: boolean): this;
    updateProjectionIfNeeded(): this;
    isActive(): boolean;
    setActive(): this;
    updateProjection(): this;
    toRelative(out: vec2, screen: vec2): vec2;
    toWorld(out: vec2, screen: vec2): vec2;
    toScreen(out: vec2, world: vec2): vec2;
    toJSON(): {
        width: number;
        height: number;
        background: IJSONArray;
    };
    fromJSON(json: IJSONObject): this;
}
