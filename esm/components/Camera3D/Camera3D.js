import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { EPSILON } from "../../math";
import { RenderableComponent } from "../RenderableComponent";
import { TransformComponent } from "../TransformComponent";
import { Camera3DManager } from "./Camera3DManager";
const MAT4_0 = mat4.create(), VEC2_0 = vec2.create();
export class Camera3D extends RenderableComponent {
    constructor() {
        super(...arguments);
        this.width = 1.0;
        this.height = 1.0;
        this.aspect = 1.0;
        this.orthographic = false;
        this.size = 1;
        this.minSize = Number.EPSILON;
        this.maxSize = Infinity;
        this.fov = 16;
        this.near = EPSILON;
        this.far = 1024;
        this.projection = mat4.identity(mat4.create());
        this.view = mat4.identity(mat4.create());
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
    getFov() {
        return this.fov;
    }
    setFov(fov) {
        this.fov = fov;
        return this.setNeedsUpdate();
    }
    getNear() {
        return this.near;
    }
    setNear(near) {
        this.near = near;
        return this.setNeedsUpdate();
    }
    getFar() {
        return this.far;
    }
    setFar(far) {
        this.far = far;
        return this.setNeedsUpdate();
    }
    getView() {
        const entity = this.getEntity();
        if (entity) {
            const transform = TransformComponent.getTransform(entity);
            if (transform) {
                mat4.invert(this.view, transform.getMatrix4(MAT4_0));
            }
        }
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
        return this.getRequiredManager().getActive() === this;
    }
    setActive() {
        this.getRequiredManager().setActive(this);
        return this;
    }
    updateProjection() {
        if (this.orthographic) {
            const right = this.size * this.aspect, left = -right, top = this.size, bottom = -top;
            mat4.ortho(this.projection, left, right, bottom, top, this.near, this.far);
        }
        else {
            mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
        }
        this.needsUpdate = false;
        return this;
    }
    toRelative(out, screen) {
        this.toWorld(out, screen);
        vec3.transformMat4(out, out, this.getView());
        return out;
    }
    toWorld(out, screen) {
        const mat = MAT4_0;
        out[0] = 2.0 * (screen[0] / this.width) - 1.0;
        out[1] = -2.0 * (screen[1] / this.height) + 1.0;
        out[2] = this.near;
        mat4.mul(mat, this.projection, this.getView());
        mat4.invert(mat, mat);
        vec3.transformMat4(out, out, mat);
        return out;
    }
    toScreen(out, world) {
        const mat = mat4.mul(MAT4_0, this.getProjection(), this.getView());
        VEC2_0[0] = world[0];
        VEC2_0[1] = world[1];
        vec2.transformMat4(out, VEC2_0, mat);
        out[0] = (out[0] + 1.0) * 0.5 * this.width;
        out[1] = (1.0 - out[1]) * 0.5 * this.height;
        return out;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { width: this.width, height: this.height, size: this.size, fov: this.fov, near: this.near, far: this.far, background: this.background });
    }
    fromJSON(json) {
        return super
            .fromJSON(json)
            .set(json.width, json.height)
            .setSize(json.size)
            .setFov(json.fov)
            .setNear(json.near)
            .setFar(json.far)
            .setBackground(json.background);
    }
}
Camera3D.Manager = Camera3DManager;
Camera3D.requiredComponents = [[Transform2D, Transform3D]];
