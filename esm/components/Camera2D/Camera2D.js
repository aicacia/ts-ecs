import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { mat2d, vec2, vec4 } from "gl-matrix";
import { RenderableComponent } from "../RenderableComponent";
import { TransformComponent } from "../TransformComponent";
import { extractScale } from "../../math";
import { Camera2DManager } from "./Camera2DManager";
import { AABB2 } from "../../math/AABB2";
const MAT2D_0 = mat2d.create(), VEC2_0 = vec2.create(), POINTS = [vec2.create(), vec2.create(), vec2.create(), vec2.create()];
export class Camera2D extends RenderableComponent {
    constructor() {
        super(...arguments);
        this.width = 1.0;
        this.height = 1.0;
        this.aspect = 1.0;
        this.size = 1;
        this.minSize = Number.EPSILON;
        this.maxSize = Infinity;
        this.projection = mat2d.identity(mat2d.create());
        this.view = mat2d.identity(mat2d.create());
        this.needsUpdate = true;
        this.background = vec4.create();
    }
    getBackground() {
        return this.background;
    }
    setBackground(background) {
        vec4.copy(this.background, background);
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
            .flatMap(TransformComponent.getTransform)
            .ifSome((transform) => transform.setLocalScale2(vec2.set(VEC2_0, zoom, zoom)));
        return this;
    }
    getZoom() {
        return this.getEntity()
            .flatMap(TransformComponent.getTransform)
            .map((transform) => vec2.len(extractScale(VEC2_0, transform.getMatrix2d(MAT2D_0))) *
            this.size)
            .unwrapOr(this.size);
    }
    getView() {
        this.getEntity()
            .flatMap(TransformComponent.getTransform)
            .ifSome((transform) => mat2d.invert(this.view, transform.getMatrix2d(MAT2D_0)));
        return this.view;
    }
    getProjection() {
        return this.updateProjectionIfNeeded().projection;
    }
    getAABB2(out) {
        const matrix = MAT2D_0, points = POINTS;
        AABB2.identity(out);
        vec2.set(points[0], 0, 0);
        vec2.set(points[1], this.width, 0);
        vec2.set(points[2], this.width, this.height);
        vec2.set(points[3], 0, this.height);
        mat2d.mul(matrix, this.projection, this.view);
        mat2d.invert(matrix, matrix);
        for (const point of points) {
            point[0] = 2.0 * (point[0] / this.width) - 1.0;
            point[1] = -2.0 * (point[1] / this.height) + 1.0;
            vec2.transformMat2d(point, point, matrix);
            AABB2.expandPoint(out, out, point);
        }
        return out;
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
        mat2d.set(this.projection, 2 / width, 0.0, 0.0, 2 / height, -x, -y);
        this.needsUpdate = false;
        return this;
    }
    toRelative(out, screen) {
        this.toWorld(out, screen);
        vec2.transformMat2d(out, out, this.view);
        return out;
    }
    toWorld(out, screen) {
        const mat = MAT2D_0;
        out[0] = 2.0 * (screen[0] / this.width) - 1.0;
        out[1] = -2.0 * (screen[1] / this.height) + 1.0;
        mat2d.mul(mat, this.projection, this.view);
        mat2d.invert(mat, mat);
        vec2.transformMat2d(out, out, mat);
        return out;
    }
    toScreen(out, world) {
        const mat = mat2d.mul(MAT2D_0, this.projection, this.view);
        vec2.transformMat2d(out, world, mat);
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
Camera2D.Manager = Camera2DManager;
Camera2D.requiredComponents = [[Transform2D, Transform3D]];
