"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxRenderer = void 0;
const gl_matrix_1 = require("gl-matrix");
const Camera2D_1 = require("../../../components/Camera2D");
const math_1 = require("../../../math");
const Renderer_1 = require("../../../plugins/renderer/Renderer");
const MAT2D_0 = gl_matrix_1.mat2d.create();
class CtxRenderer extends Renderer_1.Renderer {
    constructor(element) {
        super();
        this.lineWidth = 1.0;
        this.camera = null;
        this.cameraView = gl_matrix_1.mat2d.create();
        this.cameraProjection = gl_matrix_1.mat2d.create();
        this.cameraViewProjection = gl_matrix_1.mat2d.create();
        this.scale = 1.0;
        this.enabled = true;
        this.element = element;
        this.ctx = element.getContext("2d");
    }
    getCameraView() {
        return this.cameraView;
    }
    getCameraProjection() {
        return this.cameraProjection;
    }
    getCameraViewProjection() {
        return this.cameraViewProjection;
    }
    getElement() {
        return this.element;
    }
    getCtx() {
        return this.ctx;
    }
    getEnabled() {
        return this.enabled;
    }
    setEnabled(enabled = true) {
        this.enabled = enabled;
        return this;
    }
    getLineWidth() {
        return this.lineWidth;
    }
    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
        return this;
    }
    getActiveCamera() {
        return this.getRequiredScene()
            .getRequiredManager(Camera2D_1.Camera2DManager)
            .getRequiredActive();
    }
    getCamera() {
        return this.camera || this.getActiveCamera();
    }
    setCamera(camera) {
        this.camera = camera;
        return this;
    }
    removeCamera() {
        this.camera = null;
        return this;
    }
    getCanvasSize() {
        const width = this.element.width, height = this.element.height;
        return (width > height ? height : width) * 0.5;
    }
    getScale() {
        return this.scale;
    }
    render(fn, model) {
        const mvp = MAT2D_0;
        if (model) {
            gl_matrix_1.mat2d.mul(mvp, this.cameraViewProjection, model);
        }
        else {
            gl_matrix_1.mat2d.copy(mvp, this.cameraViewProjection);
        }
        this.ctx.save();
        this.ctx.transform(mvp[0], mvp[1], mvp[2], mvp[3], mvp[4], mvp[5]);
        fn(this.ctx);
        this.ctx.restore();
        return this;
    }
    onUpdate() {
        if (!this.enabled) {
            return this;
        }
        const camera = this.getCamera(), width = this.element.width, height = this.element.height, halfWidth = width * 0.5, halfHeight = height * 0.5;
        camera.set(width, height);
        gl_matrix_1.mat2d.copy(this.cameraView, camera.getView());
        gl_matrix_1.mat2d.copy(this.cameraProjection, camera.getProjection());
        gl_matrix_1.mat2d.mul(this.cameraViewProjection, this.cameraProjection, this.cameraView);
        this.scale = (1.0 / this.getCanvasSize()) * camera.getZoom();
        this.ctx.save();
        this.ctx.save();
        this.ctx.fillStyle = (0, math_1.toRgba)(camera.getBackground());
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.restore();
        this.ctx.lineWidth = this.getLineWidth() * this.getScale();
        this.ctx.transform(halfWidth, 0, 0, -halfHeight, halfWidth, halfHeight);
        super.onUpdate();
        this.ctx.restore();
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { lineWidth: this.lineWidth, enabled: this.enabled });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.lineWidth = json.lineWidth;
        this.enabled = json.enabled;
        return this;
    }
}
exports.CtxRenderer = CtxRenderer;
CtxRenderer.toFromJSONEnabled = false;
