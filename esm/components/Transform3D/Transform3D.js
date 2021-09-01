import { mat4, quat, vec3 } from "gl-matrix";
import { mat2dFromMat4 } from "../../math";
import { TransformComponent } from "../TransformComponent";
const MAT4_0 = mat4.create(), QUAT_0 = quat.create(), VEC3_0 = vec3.create(), VEC3_UP = vec3.fromValues(0, 0, 1);
export class Transform3D extends TransformComponent {
    constructor() {
        super(...arguments);
        this.localPosition = vec3.create();
        this.localScale = vec3.fromValues(1, 1, 1);
        this.localRotation = quat.identity(quat.create());
        this.localMatrix = mat4.create();
        this.position = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
        this.rotation = quat.identity(quat.create());
        this.matrix = mat4.create();
    }
    getLocalPosition3(out) {
        return vec3.copy(out, this.getLocalPosition());
    }
    getLocalPosition2(out) {
        const localPosition = this.getLocalPosition();
        out[0] = localPosition[0];
        out[1] = localPosition[1];
        return out;
    }
    setLocalPosition2(localPosition) {
        return this.setLocalPosition(vec3.set(VEC3_0, localPosition[0], localPosition[1], this.localPosition[2]));
    }
    setLocalPosition3(localPosition) {
        return this.setLocalPosition(localPosition);
    }
    getPosition3(out) {
        return vec3.copy(out, this.getPosition());
    }
    getPosition2(out) {
        const position = this.getPosition();
        out[0] = position[0];
        out[1] = position[1];
        return out;
    }
    getLocalRotationQuat(out) {
        return quat.copy(out, this.localRotation);
    }
    getLocalRotationZ() {
        return quat.getAxisAngle(VEC3_UP, this.localRotation);
    }
    setLocalRotationZ(localRotation) {
        const localRotationQuat = quat.copy(QUAT_0, this.getLocalRotation());
        quat.rotateZ(localRotationQuat, localRotationQuat, localRotation);
        return this.setLocalRotation(localRotationQuat);
    }
    setLocalRotationQuat(localRotation) {
        return this.setLocalRotation(localRotation);
    }
    getRotationQuat(out) {
        return quat.copy(out, this.getRotation());
    }
    getRotationZ() {
        return quat.getAxisAngle(VEC3_UP, this.getRotation());
    }
    getLocalScale3(out) {
        return vec3.copy(out, this.getLocalScale());
    }
    getLocalScale2(out) {
        const localScale = this.getLocalScale();
        out[0] = localScale[0];
        out[1] = localScale[1];
        return out;
    }
    setLocalScale2(localScale) {
        return this.setLocalScale(vec3.set(VEC3_0, localScale[0], localScale[1], this.localScale[2]));
    }
    setLocalScale3(localScale) {
        return this.setLocalScale(localScale);
    }
    getScale3(out) {
        return vec3.copy(out, this.getScale());
    }
    getScale2(out) {
        const scale = this.getScale();
        out[0] = scale[0];
        out[1] = scale[1];
        return out;
    }
    setLocalPosition(localPosition) {
        vec3.copy(this.localPosition, localPosition);
        return this.setNeedsUpdate();
    }
    getPosition() {
        return this.updateMatrixIfNeeded().position;
    }
    getLocalPosition() {
        return this.localPosition;
    }
    setLocalScale(localScale) {
        vec3.copy(this.localScale, localScale);
        return this.setNeedsUpdate();
    }
    getScale() {
        return this.updateMatrixIfNeeded().scale;
    }
    getLocalScale() {
        return this.localScale;
    }
    setLocalRotation(localRotation) {
        quat.copy(this.localRotation, localRotation);
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
        mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScale);
        return this;
    }
    updateMatrix() {
        this.updateLocalMatrixIfNeeded()
            .getParentTransform()
            .mapOrElse((parentTransform) => {
            mat4.mul(this.matrix, parentTransform.getMatrix4(MAT4_0), this.localMatrix);
            mat4.getRotation(this.rotation, this.matrix);
            mat4.getScaling(this.scale, this.matrix);
            mat4.getTranslation(this.position, this.matrix);
        }, () => {
            mat4.copy(this.matrix, this.localMatrix);
            vec3.copy(this.position, this.localPosition);
            vec3.copy(this.scale, this.localScale);
            quat.copy(this.rotation, this.localRotation);
        });
        return this;
    }
    getMatrix4(out) {
        return mat4.copy(out, this.getMatrix());
    }
    getMatrix2d(out) {
        return mat2dFromMat4(out, this.getMatrix());
    }
    getLocalMatrix4(out) {
        return mat4.copy(out, this.getLocalMatrix());
    }
    getLocalMatrix2d(out) {
        return mat2dFromMat4(out, this.getLocalMatrix());
    }
    toLocalPosition(out, position) {
        return vec3.sub(out, position, this.getPosition());
    }
    lookAt(position, up = VEC3_UP) {
        mat4.getRotation(this.localRotation, mat4.targetTo(MAT4_0, this.localPosition, this.toLocalPosition(VEC3_0, position), up));
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
