"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2DControl = void 0;
const gl_matrix_1 = require("gl-matrix");
const plugins_1 = require("../../plugins");
const Camera2D_1 = require("./Camera2D");
const TransformComponent_1 = require("../TransformComponent");
const RenderableComponent_1 = require("../RenderableComponent");
const Transform2D_1 = require("../Transform2D");
const Transform3D_1 = require("../Transform3D");
const Camera2DControlManager_1 = require("./Camera2DControlManager");
const math_1 = require("../../math");
const VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create(), VEC2_2 = gl_matrix_1.vec2.create(), ZERO = gl_matrix_1.vec2.fromValues(0, 0), MIN_SCALE = gl_matrix_1.vec2.fromValues(math_1.EPSILON, math_1.EPSILON);
class Camera2DControl extends RenderableComponent_1.RenderableComponent {
    constructor() {
        super(...arguments);
        this.enabled = true;
        this.panSpeed = 1.0;
        this.zoomSpeed = 1.0;
        this.dragging = false;
        this.lastMouse = gl_matrix_1.vec2.create();
        this.offset = gl_matrix_1.vec2.create();
    }
    getEnabled() {
        return this.enabled;
    }
    setEnabled(enabled = true) {
        this.enabled = enabled;
        return this;
    }
    getPanSpeed() {
        return this.panSpeed;
    }
    setPanSpeed(panSpeed) {
        this.panSpeed = panSpeed;
        return this;
    }
    getZoomSpeed() {
        return this.zoomSpeed;
    }
    setZoomSpeed(zoomSpeed) {
        this.zoomSpeed = zoomSpeed;
        return this;
    }
    onUpdate() {
        const input = this.getRequiredPlugin(plugins_1.Input), transform = TransformComponent_1.TransformComponent.getRequiredTransform(this.getRequiredEntity()), scale = transform.getLocalScale2(VEC2_1), camera = this.getRequiredComponent(Camera2D_1.Camera2D), worldMouse = camera.toRelative(VEC2_0, gl_matrix_1.vec2.set(VEC2_0, -input.getButtonValue("mouse-x"), -input.getButtonValue("mouse-y")));
        if (this.dragging) {
            gl_matrix_1.vec2.sub(this.offset, worldMouse, this.lastMouse);
            gl_matrix_1.vec2.scale(this.offset, this.offset, this.panSpeed);
            gl_matrix_1.vec2.mul(this.offset, this.offset, scale);
            gl_matrix_1.vec2.rotate(this.offset, this.offset, ZERO, transform.getRotationZ());
            this.enabled && transform.translate2(this.offset);
        }
        if (input.isDown("mouse-0")) {
            this.dragging = true;
        }
        else {
            this.dragging = false;
        }
        const mouseWheel = input.getButtonValue("mouse-wheel"), zoomSpeed = gl_matrix_1.vec2.set(VEC2_2, this.zoomSpeed, this.zoomSpeed);
        if (mouseWheel !== 0 && this.enabled) {
            if (mouseWheel > 0) {
                gl_matrix_1.vec2.add(scale, scale, zoomSpeed);
            }
            else if (mouseWheel < 0) {
                gl_matrix_1.vec2.sub(scale, scale, zoomSpeed);
                gl_matrix_1.vec2.max(scale, MIN_SCALE, scale);
            }
            transform.setLocalScale2(scale);
        }
        gl_matrix_1.vec2.copy(this.lastMouse, worldMouse);
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { enabled: this.enabled, zoomSpeed: this.zoomSpeed, panSpeed: this.panSpeed });
    }
    fromJSON(json) {
        this.setEnabled(json.enabled);
        this.setZoomSpeed(json.zoomSpeed);
        this.setPanSpeed(json.panSpeed);
        return this;
    }
}
exports.Camera2DControl = Camera2DControl;
Camera2DControl.Manager = Camera2DControlManager_1.Camera2DControlManager;
Camera2DControl.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
Camera2DControl.requiredPlugins = [plugins_1.Input];
