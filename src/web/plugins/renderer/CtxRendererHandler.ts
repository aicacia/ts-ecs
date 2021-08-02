import type { CtxRenderer } from "./CtxRenderer";
import { RendererHandler } from "../../../plugins/renderer/RendererHandler";

export abstract class CtxRendererHandler extends RendererHandler<CtxRenderer> {
  static rendererHandlerPriority = 0;

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
