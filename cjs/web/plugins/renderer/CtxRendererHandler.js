"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxRendererHandler = void 0;
const RendererHandler_1 = require("../../../plugins/renderer/RendererHandler");
class CtxRendererHandler extends RendererHandler_1.RendererHandler {
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
exports.CtxRendererHandler = CtxRendererHandler;
CtxRendererHandler.rendererHandlerPriority = 0;
