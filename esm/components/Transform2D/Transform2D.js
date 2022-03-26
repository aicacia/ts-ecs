import { mat2d, quat, vec2, vec3 } from "gl-matrix";
import { composeMat2d, decomposeMat2d, getAngleBetweenPoints, HALF_PI, mat4FromMat2d, } from "../../math";
import { TransformComponent } from "../TransformComponent";
const VEC2_0 = vec2.create(), VEC3_UP = vec3.fromValues(0, 0, 1), MAT2_0 = mat2d.create();
export class Transform2D extends TransformComponent {
    constructor() {
        super(...arguments);
        this.localPosition = vec2.create();
        this.localScale = vec2.fromValues(1, 1);
        this.localRotation = 0.0;
        this.localMatrix = mat2d.create();
        this.position = vec2.create();
        this.scale = vec2.fromValues(1, 1);
        this.rotation = 0.0;
        this.matrix = mat2d.create();
    }
    getLocalPosition2(out) {
        return vec2.copy(out, this.getLocalPosition());
    }
    getLocalPosition3(out) {
        const localPosition = this.getLocalPosition();
        out[0] = localPosition[0];
        out[1] = localPosition[1];
        return out;
    }
    setLocalPosition2(localPosition) {
        return this.setLocalPosition(localPosition);
    }
    setLocalPosition3(localPosition) {
        return this.setLocalPosition(vec2.set(VEC2_0, localPosition[0], localPosition[1]));
    }
    getPosition2(out) {
        return vec2.copy(out, this.getPosition());
    }
    getPosition3(out) {
        const position = this.getPosition();
        out[0] = position[0];
        out[1] = position[1];
        return out;
    }
    getLocalRotationZ() {
        return this.getLocalRotation();
    }
    getLocalRotationQuat(out) {
        return quat.fromEuler(out, 0, 0, this.getLocalRotation());
    }
    setLocalRotationZ(localRotation) {
        return this.setLocalRotation(localRotation);
    }
    setLocalRotationQuat(localRotation) {
        return this.setLocalRotation(quat.getAxisAngle(VEC3_UP, localRotation));
    }
    getRotationZ() {
        return this.getRotation();
    }
    getRotationQuat(out) {
        return quat.fromEuler(out, 0, 0, this.getRotation());
    }
    getLocalScale2(out) {
        return vec2.copy(out, this.getLocalScale());
    }
    getLocalScale3(out) {
        const localScale = this.getLocalScale();
        out[0] = localScale[0];
        out[1] = localScale[1];
        return out;
    }
    setLocalScale2(localScale) {
        return this.setLocalScale(localScale);
    }
    setLocalScale3(localScale) {
        return this.setLocalScale(vec2.set(VEC2_0, localScale[0], localScale[1]));
    }
    getScale2(out) {
        return vec2.copy(out, this.getScale());
    }
    getScale3(out) {
        const scale = this.getScale();
        out[0] = scale[0];
        out[1] = scale[1];
        return out;
    }
    setLocalPosition(localPosition) {
        vec2.copy(this.localPosition, localPosition);
        return this.setNeedsUpdate();
    }
    getPosition() {
        return this.updateMatrixIfNeeded().position;
    }
    getLocalPosition() {
        return this.localPosition;
    }
    setLocalScale(localScale) {
        vec2.copy(this.localScale, localScale);
        return this.setNeedsUpdate();
    }
    getScale() {
        return this.updateMatrixIfNeeded().scale;
    }
    getLocalScale() {
        return this.localScale;
    }
    setLocalRotation(localRotation) {
        this.localRotation = localRotation;
        return this.setNeedsUpdate();
    }
    getRotation() {
        return this.updateMatrixIfNeeded().rotation;
    }
    getLocalRotation() {
        return this.localRotation;
    }
    getMatrix() {
        return this.updateMatrixIfNeeded().matrix;
    }
    getLocalMatrix() {
        return this.updateLocalMatrixIfNeeded().localMatrix;
    }
    updateLocalMatrix() {
        composeMat2d(this.localMatrix, this.localPosition, this.localScale, this.localRotation);
        return this;
    }
    updateMatrix() {
        this.updateLocalMatrixIfNeeded();
        const parentTransform = this.getParentTransform();
        if (parentTransform) {
            mat2d.mul(this.matrix, parentTransform.getMatrix2d(MAT2_0), this.localMatrix);
            this.rotation = decomposeMat2d(this.matrix, this.position, this.scale);
        }
        else {
            mat2d.copy(this.matrix, this.localMatrix);
            vec2.copy(this.position, this.localPosition);
            vec2.copy(this.scale, this.localScale);
            this.rotation = this.localRotation;
        }
        return this;
    }
    getMatrix4(out) {
        return mat4FromMat2d(out, this.getMatrix());
    }
    getMatrix2d(out) {
        return mat2d.copy(out, this.getMatrix());
    }
    getLocalMatrix4(out) {
        return mat4FromMat2d(out, this.getLocalMatrix());
    }
    getLocalMatrix2d(out) {
        return mat2d.copy(out, this.getLocalMatrix());
    }
    toLocalPosition(out, position) {
        return vec2.sub(out, position, this.getPosition());
    }
    lookAt(position) {
        return this.setLocalRotation(getAngleBetweenPoints(this.localPosition, this.toLocalPosition(VEC2_0, position)) - HALF_PI);
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { localPosition: this.localPosition, localScale: this.localScale, localRotation: this.localRotation });
    }
    fromJSON(json) {
        return super
            .fromJSON(json)
            .setLocalPosition(json.localPosition)
            .setLocalScale(json.localScale)
            .setLocalRotation(json.localRotation);
    }
}
