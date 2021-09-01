import type { CtxRenderer } from "./CtxRenderer";
import { RendererHandler } from "../../../plugins/renderer/RendererHandler";
export declare abstract class CtxRendererHandler extends RendererHandler<CtxRenderer> {
    static rendererHandlerPriority: number;
    getCtx(): CanvasRenderingContext2D;
    getCamera(): import("../../..").Camera2D;
    getScale(): number;
}
