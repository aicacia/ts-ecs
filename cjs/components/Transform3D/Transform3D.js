"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform3D = void 0;
const gl_matrix_1 = require("gl-matrix");
const math_1 = require("../../math");
const TransformComponent_1 = require("../TransformComponent");
const MAT4_0 = gl_matrix_1.mat4.create(), QUAT_0 = gl_matrix_1.quat.create(), VEC3_0 = gl_matrix_1.vec3.create(), VEC3_UP = gl_matrix_1.vec3.fromValues(0, 0, 1);
class Transform3D extends TransformComponent_1.TransformComponent {
    constructor() {
        super(...arguments);
        this.localPosition = gl_matrix_1.vec3.create();
        this.localScale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        this.localRotation = gl_matrix_1.quat.identity(gl_matrix_1.quat.create());
        this.localMatrix = gl_matrix_1.mat4.create();
        this.position = gl_matrix_1.vec3.create();
        this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        this.rotation = gl_matrix_1.quat.identity(gl_matrix_1.quat.create());
        this.matrix = gl_matrix_1.mat4.create();
    }
    getLocalPosition3(out) {
        return gl_matrix_1.vec3.copy(out, this.getLocalPosition());
    }
    getLocalPosition2(out) {
        const localPosition = this.getLocalPosition();
        out[0] = localPosition[0];
        out[1] = localPosition[1];
        return out;
    }
    setLocalPosition2(localPosition) {
        return this.setLocalPosition(gl_matrix_1.vec3.set(VEC3_0, localPosition[0], localPosition[1], this.localPosition[2]));
    }
    setLocalPosition3(localPosition) {
        return this.setLocalPosition(localPosition);
    }
    getPosition3(out) {
        return gl_matrix_1.vec3.copy(out, this.getPosition());
    }
    getPosition2(out) {
        const position = this.getPosition();
        out[0] = position[0];
        out[1] = position[1];
        return out;
    }
    getLocalRotationQuat(out) {
        return gl_matrix_1.quat.copy(out, this.localRotation);
    }
    getLocalRotationZ() {
        return gl_matrix_1.quat.getAxisAngle(VEC3_UP, this.localRotation);
    }
    setLocalRotationZ(localRotation) {
        const localRotationQuat = gl_matrix_1.quat.copy(QUAT_0, this.getLocalRotation());
        gl_matrix_1.quat.rotateZ(localRotationQuat, localRotationQuat, localRotation);
        return this.setLocalRotation(localRotationQuat);
    }
    setLocalRotationQuat(localRotation) {
        return this.setLocalRotation(localRotation);
    }
    getRotationQuat(out) {
        return gl_matrix_1.quat.copy(out, this.getRotation());
    }
    getRotationZ() {
        return gl_matrix_1.quat.getAxisAngle(VEC3_UP, this.getRotation());
    }
    getLocalScale3(out) {
        return gl_matrix_1.vec3.copy(out, this.getLocalScale());
    }
    getLocalScale2(out) {
        const localScale = this.getLocalScale();
        out[0] = localScale[0];
        out[1] = localScale[1];
        return out;
    }
    setLocalScale2(localScale) {
        return this.setLocalScale(gl_matrix_1.vec3.set(VEC3_0, localScale[0], localScale[1], this.localScale[2]));
    }
    setLocalScale3(localScale) {
        return this.setLocalScale(localScale);
    }
    getScale3(out) {
        return gl_matrix_1.vec3.copy(out, this.getScale());
    }
    getScale2(out) {
        const scale = this.getScale();
        out[0] = scale[0];
        out[1] = scale[1];
        return out;
    }
    setLocalPosition(localPosition) {
        gl_matrix_1.vec3.copy(this.localPosition, localPosition);
        return this.setNeedsUpdate();
    }
    getPosition() {
        return this.updateMatrixIfNeeded().position;
    }
    getLocalPosition() {
        return this.localPosition;
    }
    setLocalScale(localScale) {
        gl_matrix_1.vec3.copy(this.localScale, localScale);
        return this.setNeedsUpdate();
    }
    getScale() {
        return this.updateMatrixIfNeeded().scale;
    }
    getLocalScale() {
        return this.localScale;
    }
    setLocalRotation(localRotation) {
        gl_matrix_1.quat.copy(this.localRotation, localRotation);
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
        gl_matrix_1.mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScale);
        return this;
    }
    updateMatrix() {
        this.updateLocalMatrixIfNeeded();
        const parentTransform = this.getParentTransform();
        if (parentTransform) {
            gl_matrix_1.mat4.mul(this.matrix, parentTransform.getMatrix4(MAT4_0), this.localMatrix);
            gl_matrix_1.mat4.getRotation(this.rotation, this.matrix);
            gl_matrix_1.mat4.getScaling(this.scale, this.matrix);
            gl_matrix_1.mat4.getTranslation(this.position, this.matrix);
        }
        else {
            gl_matrix_1.mat4.copy(this.matrix, this.localMatrix);
            gl_matrix_1.vec3.copy(this.position, this.localPosition);
            gl_matrix_1.vec3.copy(this.scale, this.localScale);
            gl_matrix_1.quat.copy(this.rotation, this.localRotation);
        }
        return this;
    }
    getMatrix4(out) {
        return gl_matrix_1.mat4.copy(out, this.getMatrix());
    }
    getMatrix2d(out) {
        return (0, math_1.mat2dFromMat4)(out, this.getMatrix());
    }
    getLocalMatrix4(out) {
        return gl_matrix_1.mat4.copy(out, this.getLocalMatrix());
    }
    getLocalMatrix2d(out) {
        return (0, math_1.mat2dFromMat4)(out, this.getLocalMatrix());
    }
    toLocalPosition(out, position) {
        return gl_matrix_1.vec3.sub(out, position, this.getPosition());
    }
    lookAt(position, up = VEC3_UP) {
        gl_matrix_1.mat4.getRotation(this.localRotation, gl_matrix_1.mat4.targetTo(MAT4_0, this.localPosition, this.toLocalPosition(VEC3_0, position), up));
        return this.setNeedsUpdate();
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
exports.Transform3D = Transform3D;
