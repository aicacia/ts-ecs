import { mat2d } from "gl-matrix";
import { Camera2D } from "../../../components/Camera2D";
import { Renderer } from "../../../plugins/renderer/Renderer";
import type { Canvas } from "../../../Canvas";
import type { IJSONObject } from "@aicacia/json";
export declare class CtxRenderer extends Renderer {
    static toFromJSONEnabled: boolean;
    private canvas;
    private ctx;
    private lineWidth;
    private camera;
    private cameraView;
    private cameraProjection;
    private cameraViewProjection;
    private scale;
    private enabled;
    constructor(canvas: Canvas, ctx: CanvasRenderingContext2D);
    getCameraView(): mat2d;
    getCameraProjection(): mat2d;
    getCameraViewProjection(): mat2d;
    getCanvas(): Canvas;
    getCtx(): CanvasRenderingContext2D;
    getEnabled(): boolean;
    setEnabled(enabled?: boolean): this;
    getLineWidth(): number;
    setLineWidth(lineWidth: number): this;
    getActiveCamera: () => Camera2D;
    getCamera(): Camera2D;
    setCamera(camera: Camera2D): this;
    removeCamera(): this;
    private getCanvasSize;
    getScale(): number;
    render(fn: (ctx: CanvasRenderingContext2D) => void, model?: mat2d): this;
    onUpdate(): this;
    toJSON(): {
        lineWidth: number;
        enabled: boolean;
        rendererHandlers: {
            enabled: boolean;
        }[];
    };
    fromJSON(json: IJSONObject): this;
}
