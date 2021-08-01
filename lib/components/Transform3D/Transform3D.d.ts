import type { IJSONArray, IJSONObject } from "@aicacia/json";
import { mat2d, mat4, quat, vec2, vec3 } from "gl-matrix";
import { TransformComponent } from "../TransformComponent";
export declare class Transform3D extends TransformComponent {
    private localPosition;
    private localScale;
    private localRotation;
    private localMatrix;
    private position;
    private scale;
    private rotation;
    private matrix;
    getLocalPosition3(out: vec3): vec3;
    getLocalPosition2(out: vec2): vec2;
    setLocalPosition2(localPosition: vec2): this;
    setLocalPosition3(localPosition: vec3): this;
    getPosition3(out: vec3): vec3;
    getPosition2(out: vec2): vec2;
    getLocalRotationQuat(out: quat): import("gl-matrix").vec4;
    getLocalRotationZ(): number;
    setLocalRotationZ(localRotation: number): this;
    setLocalRotationQuat(localRotation: quat): this;
    getRotationQuat(out: quat): import("gl-matrix").vec4;
    getRotationZ(): number;
    getLocalScale3(out: vec3): vec3;
    getLocalScale2(out: vec2): vec2;
    setLocalScale2(localScale: vec2): this;
    setLocalScale3(localScale: vec3): this;
    getScale3(out: vec3): vec3;
    getScale2(out: vec2): vec2;
    setLocalPosition(localPosition: vec3): this;
    getPosition(): vec3;
    getLocalPosition(): vec3;
    setLocalScale(localScale: vec3): this;
    getScale(): vec3;
    getLocalScale(): vec3;
    setLocalRotation(localRotation: quat): this;
    getRotation(): quat;
    getLocalRotation(): quat;
    getMatrix(): mat4;
    getLocalMatrix(): mat4;
    updateLocalMatrix(): this;
    updateMatrix(): this;
    getMatrix4(out: mat4): mat4;
    getMatrix2d(out: mat2d): mat2d;
    getLocalMatrix4(out: mat4): mat4;
    getLocalMatrix2d(out: mat2d): mat2d;
    toLocalPosition(out: vec3, position: vec3): vec3;
    lookAt(position: vec3, up?: vec3): this;
    toJSON(): {
        localPosition: IJSONArray;
        localScale: IJSONArray;
        localRotation: IJSONArray;
    };
    fromJSON(json: IJSONObject): this;
}
