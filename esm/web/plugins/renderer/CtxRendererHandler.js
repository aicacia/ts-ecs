import { RendererHandler } from "../../../plugins/renderer/RendererHandler";
export class CtxRendererHandler extends RendererHandler {
    getCtx() {
        return this.getRequiredRenderer().getCtx();
    }
    getCamera() {
        return this.getRequiredRenderer().getCamera();
    }
    getScale() {
        return this.getRequiredRenderer().getScale();
    }
}
CtxRendererHandler.rendererHandlerPriority = 0;
