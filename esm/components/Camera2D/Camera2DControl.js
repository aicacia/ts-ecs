import { vec2 } from "gl-matrix";
import { Input } from "../../plugins";
import { Camera2D } from "./Camera2D";
import { TransformComponent } from "../TransformComponent";
import { RenderableComponent } from "../RenderableComponent";
import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { Camera2DControlManager } from "./Camera2DControlManager";
import { EPSILON } from "../../math";
const VEC2_0 = vec2.create(), VEC2_1 = vec2.create(), VEC2_2 = vec2.create(), ZERO = vec2.fromValues(0, 0), MIN_SCALE = vec2.fromValues(EPSILON, EPSILON);
export class Camera2DControl extends RenderableComponent {
    constructor() {
        super(...arguments);
        this.enabled = true;
        this.panSpeed = 1.0;
        this.zoomSpeed = 1.0;
        this.dragging = false;
        this.lastMouse = vec2.create();
        this.offset = vec2.create();
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
        const input = this.getRequiredPlugin(Input), transform = TransformComponent.getRequiredTransform(this.getRequiredEntity()), scale = transform.getLocalScale2(VEC2_1), camera = this.getRequiredComponent(Camera2D), worldMouse = camera.toRelative(VEC2_0, vec2.set(VEC2_0, -input.getButtonValue("mouse-x"), -input.getButtonValue("mouse-y")));
        if (this.dragging) {
            vec2.sub(this.offset, worldMouse, this.lastMouse);
            vec2.scale(this.offset, this.offset, this.panSpeed);
            vec2.mul(this.offset, this.offset, scale);
            vec2.rotate(this.offset, this.offset, ZERO, transform.getRotationZ());
            this.enabled && transform.translate2(this.offset);
        }
        if (input.isDown("mouse-0")) {
            this.dragging = true;
        }
        else {
            this.dragging = false;
        }
        const mouseWheel = input.getButtonValue("mouse-wheel"), zoomSpeed = vec2.set(VEC2_2, this.zoomSpeed, this.zoomSpeed);
        if (mouseWheel !== 0 && this.enabled) {
            if (mouseWheel > 0) {
                vec2.add(scale, scale, zoomSpeed);
            }
            else if (mouseWheel < 0) {
                vec2.sub(scale, scale, zoomSpeed);
                vec2.max(scale, MIN_SCALE, scale);
            }
            transform.setLocalScale2(scale);
        }
        vec2.copy(this.lastMouse, worldMouse);
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
Camera2DControl.Manager = Camera2DControlManager;
Camera2DControl.requiredComponents = [[Transform2D, Transform3D]];
Camera2DControl.requiredPlugins = [Input];
