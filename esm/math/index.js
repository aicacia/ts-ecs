import { mat2d, vec2, mat4 } from "gl-matrix";
import { AABB2 } from "./AABB2";
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const HALF_PI = Math.PI * 0.5;
export const TAU = Math.PI * 2;
export const EPSILON = 0.000001;
export function composeMat2d(out, position, scale, rotation) {
    const sx = scale[0], sy = scale[1], c = Math.cos(rotation), s = Math.sin(rotation);
    out[0] = c * sx;
    out[1] = s * sx;
    out[2] = -s * sy;
    out[3] = c * sy;
    out[4] = position[0];
    out[5] = position[1];
    return out;
}
const extractScale_VEC2_0 = vec2.create();
export function extractScale(out, matrix) {
    return vec2.set(out, vec2.len(vec2.set(extractScale_VEC2_0, matrix[0], matrix[1])), vec2.len(vec2.set(extractScale_VEC2_0, matrix[2], matrix[3])));
}
export function decomposeMat2d(matrix, position, scale) {
    vec2.set(position, matrix[4], matrix[5]);
    extractScale(scale, matrix);
    return getRotationFromMat2d(matrix);
}
export function getRotationFromMat2d(matrix) {
    return Math.atan2(matrix[2], matrix[0]);
}
export function getPointFromAngle(out, angle) {
    out[0] = Math.cos(angle);
    out[1] = Math.sin(angle);
    return out;
}
export function getAngleFromPoint(out) {
    const x = out[0], y = out[1], angle = Math.atan2(y, x);
    if (y < 0) {
        return TAU + angle;
    }
    else {
        return angle;
    }
}
const getTangentAngle_VEC2_0 = vec2.create();
export function getTangentAngle(vec) {
    const tmp = vec2.copy(getTangentAngle_VEC2_0, vec), tmpX = tmp[0];
    tmp[0] = tmp[1];
    tmp[1] = tmpX;
    return getAngleFromPoint(tmp);
}
export function getAngleBetweenPoints(a, b) {
    const sign = b[1] < a[1] ? -1 : 1;
    return Math.acos(vec2.dot(a, b) / (vec2.len(a) * vec2.len(b))) * sign;
}
export function sign(value) {
    return value < 0 ? -1 : 1;
}
export function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
export function angleVec2(out) {
    return Math.atan2(out[1], out[0]);
}
export function vec2FromAngle(out, angle) {
    out[0] = Math.cos(angle);
    out[1] = Math.sin(angle);
    return out;
}
export function projectPointOnAxis(out, point, axis) {
    const squaredLength = vec2.squaredLength(axis), dotProduct = vec2.dot(point, axis);
    return vec2.scale(out, axis, dotProduct / squaredLength);
}
export function radToDeg(rad) {
    return rad * RAD_TO_DEG;
}
export function degToRad(def) {
    return def * DEG_TO_RAD;
}
export function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
export function toHex(color) {
    return `#${((color[0] * 255) | 0).toString(16)}${((color[1] * 255) |
        0).toString(16)}${((color[2] * 255) | 0).toString(16)}`;
}
export function toRgb(color) {
    return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`;
}
export function toRgba(color) {
    return `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${color[3]})`;
}
export function mat4FromMat2d(out, matrix) {
    return mat4.set(out, matrix[0], matrix[1], 0.0, matrix[4], matrix[2], matrix[3], 0.0, matrix[5], 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}
export function mat2dFromMat4(out, matrix) {
    return mat2d.set(out, matrix[0], matrix[1], matrix[4], matrix[5], matrix[13], matrix[14]);
}
const getAABB2_points = [
    vec2.create(),
    vec2.create(),
    vec2.create(),
    vec2.create(),
];
export function getAABB2FromRect(out, position, angle, size) {
    const points = getAABB2_points, hw = size[0] * 0.5, hh = size[1] * 0.5;
    AABB2.identity(out);
    vec2.set(points[0], position[0] - hw, position[1] - hh);
    vec2.set(points[1], position[0] - hw, position[1] + hh);
    vec2.set(points[2], position[0] + hw, position[1] + hh);
    vec2.set(points[3], position[0] + hw, position[1] - hh);
    points.forEach((point) => {
        vec2.rotate(point, point, position, angle);
        AABB2.expandPoint(out, out, point);
    });
    return out;
}
