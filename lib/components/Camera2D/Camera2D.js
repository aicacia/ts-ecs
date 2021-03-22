"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2D = void 0;
const Transform2D_1 = require("../Transform2D");
const Transform3D_1 = require("../Transform3D");
const gl_matrix_1 = require("gl-matrix");
const RenderableComponent_1 = require("../RenderableComponent");
const TransformComponent_1 = require("../TransformComponent");
const math_1 = require("../../math");
const Camera2DManager_1 = require("./Camera2DManager");
const MAT2D_0 = gl_matrix_1.mat2d.create(), VEC2_0 = gl_matrix_1.vec2.create();
class Camera2D extends RenderableComponent_1.RenderableComponent {
    constructor() {
        super(...arguments);
        this.width = 1.0;
        this.height = 1.0;
        this.aspect = 1.0;
        this.size = 1;
        this.minSize = Number.EPSILON;
        this.maxSize = Infinity;
        this.projection = gl_matrix_1.mat2d.identity(gl_matrix_1.mat2d.create());
        this.view = gl_matrix_1.mat2d.identity(gl_matrix_1.mat2d.create());
        this.needsUpdate = true;
        this.background = gl_matrix_1.vec4.create();
    }
    getBackground() {
        return this.background;
    }
    setBackground(background) {
        gl_matrix_1.vec4.copy(this.background, background);
        return this;
    }
    set(width, height) {
        if (width !== this.width || height !== this.height) {
            this.width = width;
            this.height = height;
            this.aspect = width / height;
            return this.setNeedsUpdate();
        }
        else {
            return this;
        }
    }
    getWidth() {
        return this.width;
    }
    setWidth(width) {
        return this.set(width, this.height);
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        return this.set(this.width, height);
    }
    getAspect() {
        return this.aspect;
    }
    getSize() {
        return this.size;
    }
    setSize(size) {
        this.size =
            size < this.minSize
                ? this.minSize
                : size > this.maxSize
                    ? this.maxSize
                    : size;
        return this.setNeedsUpdate();
    }
    getMinSize() {
        return this.minSize;
    }
    setMinSize(minSize) {
        this.minSize = minSize;
        return this.setNeedsUpdate();
    }
    getMaxSize() {
        return this.minSize;
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
        return this.setNeedsUpdate();
    }
    setZoom(zoom) {
        this.getEntity()
            .flatMap(TransformComponent_1.TransformComponent.getTransform)
            .ifSome((transform) => transform.setLocalScale2(gl_matrix_1.vec2.set(VEC2_0, zoom, zoom)));
        return this;
    }
    getZoom() {
        return this.getEntity()
            .flatMap(TransformComponent_1.TransformComponent.getTransform)
            .map((transform) => gl_matrix_1.vec2.len(math_1.extractScale(VEC2_0, transform.getMatrix2d(MAT2D_0))) *
            this.size)
            .unwrapOr(this.size);
    }
    getView() {
        this.getEntity()
            .flatMap(TransformComponent_1.TransformComponent.getTransform)
            .ifSome((transform) => gl_matrix_1.mat2d.invert(this.view, transform.getMatrix2d(MAT2D_0)));
        return this.view;
    }
    getProjection() {
        return this.updateProjectionIfNeeded().projection;
    }
    setNeedsUpdate(needsUpdate = true) {
        this.needsUpdate = needsUpdate;
        return this;
    }
    updateProjectionIfNeeded() {
        if (this.needsUpdate) {
            return this.updateProjection();
        }
        else {
            return this;
        }
    }
    isActive() {
        return this.getRequiredManager()
            .getActive()
            .map((active) => active === this)
            .unwrapOr(false);
    }
    setActive() {
        this.getRequiredManager().setActive(this);
        return this;
    }
    updateProjection() {
        const size = this.getSize(), right = size * this.aspect, left = -right, top = size, bottom = -top, width = right - left, height = top - bottom, x = (right + left) / width, y = (top + bottom) / height;
        gl_matrix_1.mat2d.set(this.projection, 2 / width, 0.0, 0.0, 2 / height, -x, -y);
        this.needsUpdate = false;
        return this;
    }
    toRelative(out, screen) {
        this.toWorld(out, screen);
        gl_matrix_1.vec2.transformMat2d(out, out, this.view);
        return out;
    }
    toWorld(out, screen) {
        const mat = MAT2D_0;
        out[0] = 2.0 * (screen[0] / this.width) - 1.0;
        out[1] = -2.0 * (screen[1] / this.height) + 1.0;
        gl_matrix_1.mat2d.mul(mat, this.projection, this.view);
        gl_matrix_1.mat2d.invert(mat, mat);
        gl_matrix_1.vec2.transformMat2d(out, out, mat);
        return out;
    }
    toScreen(out, world) {
        const mat = gl_matrix_1.mat2d.mul(MAT2D_0, this.projection, this.view);
        gl_matrix_1.vec2.transformMat2d(out, world, mat);
        out[0] = (out[0] + 1.0) * 0.5 * this.width;
        out[1] = (1.0 - out[1]) * 0.5 * this.height;
        return out;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { width: this.width, height: this.height, background: this.background });
    }
    fromJSON(json) {
        return super
            .fromJSON(json)
            .set(json.width, json.height)
            .setBackground(json.background);
    }
}
exports.Camera2D = Camera2D;
Camera2D.Manager = Camera2DManager_1.Camera2DManager;
Camera2D.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
