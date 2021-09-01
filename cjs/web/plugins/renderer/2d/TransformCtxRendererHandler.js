"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformCtxRendererHandler = void 0;
const TransformComponentManager_1 = require("../../../../components/TransformComponentManager");
const CtxRendererHandler_1 = require("../CtxRendererHandler");
const gl_matrix_1 = require("gl-matrix");
const MAT2D_0 = gl_matrix_1.mat2d.create();
class TransformCtxRendererHandler extends CtxRendererHandler_1.CtxRendererHandler {
    onRender() {
        this.getManager(TransformComponentManager_1.TransformComponentManager).ifSome((transformComponentManager) => {
            const renderer = this.getRequiredRenderer(), scale = renderer.getScale();
            for (const transform of transformComponentManager.getComponents()) {
                if (transform.getRenderable()) {
                    renderer.render((ctx) => {
                        ctx.beginPath();
                        ctx.strokeStyle = "#0c0";
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, 0.5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.strokeStyle = "#00c";
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0.5, 0);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(0, 0, scale * 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }, transform.getMatrix2d(MAT2D_0));
                }
            }
        });
        return this;
    }
}
exports.TransformCtxRendererHandler = TransformCtxRendererHandler;
