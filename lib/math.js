"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mat2dFromMat4 = exports.mat4FromMat2d = exports.toRgba = exports.toRgb = exports.toHex = exports.equals = exports.degToRad = exports.radToDeg = exports.projectPointOnAxis = exports.vec2FromAngle = exports.angleVec2 = exports.clamp = exports.sign = exports.getAngleBetweenPoints = exports.getTangentAngle = exports.getAngleFromPoint = exports.getPointFromAngle = exports.getRotationFromMat2d = exports.decomposeMat2d = exports.extractScale = exports.composeMat2d = exports.EPSILON = exports.TAU = exports.HALF_PI = exports.RAD_TO_DEG = exports.DEG_TO_RAD = void 0;
const gl_matrix_1 = require("gl-matrix");
exports.DEG_TO_RAD = Math.PI / 180;
exports.RAD_TO_DEG = 180 / Math.PI;
exports.HALF_PI = Math.PI * 0.5;
exports.TAU = Math.PI * 2;
exports.EPSILON = 0.000001;
function composeMat2d(out, position, scale, rotation) {
    const sx = scale[0], sy = scale[1], c = Math.cos(rotation), s = Math.sin(rotation);
    out[0] = c * sx;
    out[1] = s * sx;
    out[2] = -s * sy;
    out[3] = c * sy;
    out[4] = position[0];
    out[5] = position[1];
    return out;
}
exports.composeMat2d = composeMat2d;
const extractScale_VEC2_0 = gl_matrix_1.vec2.create();
function extractScale(out, matrix) {
    return gl_matrix_1.vec2.set(out, gl_matrix_1.vec2.len(gl_matrix_1.vec2.set(extractScale_VEC2_0, matrix[0], matrix[1])), gl_matrix_1.vec2.len(gl_matrix_1.vec2.set(extractScale_VEC2_0, matrix[2], matrix[3])));
}
exports.extractScale = extractScale;
function decomposeMat2d(matrix, position, scale) {
    gl_matrix_1.vec2.set(position, matrix[4], matrix[5]);
    extractScale(scale, matrix);
    return getRotationFromMat2d(matrix);
}
exports.decomposeMat2d = decomposeMat2d;
function getRotationFromMat2d(matrix) {
    return Math.atan2(matrix[2], matrix[0]);
}
exports.getRotationFromMat2d = getRotationFromMat2d;
function getPointFromAngle(out, angle) {
    out[0] = Math.cos(angle);
    out[1] = Math.sin(angle);
    return out;
}
exports.getPointFromAngle = getPointFromAngle;
function getAngleFromPoint(out) {
    const x = out[0], y = out[1], angle = Math.atan2(y, x);
    if (y < 0) {
        return exports.TAU + angle;
    }
    else {
        return angle;
    }
}
exports.getAngleFromPoint = getAngleFromPoint;
const getTangentAngle_VEC2_0 = gl_matrix_1.vec2.create();
function getTangentAngle(vec) {
    const tmp = gl_matrix_1.vec2.copy(getTangentAngle_VEC2_0, vec), tmpX = tmp[0];
    tmp[0] = tmp[1];
    tmp[1] = tmpX;
    return getAngleFromPoint(tmp);
}
exports.getTangentAngle = getTangentAngle;
function getAngleBetweenPoints(a, b) {
    const sign = b[1] < a[1] ? -1 : 1;
    return Math.acos(gl_matrix_1.vec2.dot(a, b) / (gl_matrix_1.vec2.len(a) * gl_matrix_1.vec2.len(b))) * sign;
}
exports.getAngleBetweenPoints = getAngleBetweenPoints;
function sign(value) {
    return value < 0 ? -1 : 1;
}
exports.sign = sign;
function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
exports.clamp = clamp;
function angleVec2(out) {
    return Math.atan2(out[1], out[0]);
}
exports.angleVec2 = angleVec2;
function vec2FromAngle(out, angle) {
    out[0] = Math.cos(angle);
    out[1] = Math.sin(angle);
    return out;
}
exports.vec2FromAngle = vec2FromAngle;
function projectPointOnAxis(out, point, axis) {
    const squaredLength = gl_matrix_1.vec2.squaredLength(axis), dotProduct = gl_matrix_1.vec2.dot(point, axis);
    return gl_matrix_1.vec2.scale(out, axis, dotProduct / squaredLength);
}
exports.projectPointOnAxis = projectPointOnAxis;
function radToDeg(rad) {
    return rad * exports.RAD_TO_DEG;
}
exports.radToDeg = radToDeg;
function degToRad(def) {
    return def * exports.DEG_TO_RAD;
}
exports.degToRad = degToRad;
function equals(a, b) {
    return Math.abs(a - b) <= exports.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
exports.equals = equals;
function toHex(color) {
    return `#${((color[0] * 255) | 0).toString(16)}${((color[1] * 255) |
        0).toString(16)}${((color[2] * 255) | 0).toString(16)}`;
}
exports.toHex = toHex;
function toRgb(color) {
    return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`;
}
exports.toRgb = toRgb;
function toRgba(color) {
    return `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${color[3]})`;
}
exports.toRgba = toRgba;
function mat4FromMat2d(out, matrix) {
    return gl_matrix_1.mat4.set(out, matrix[0], matrix[1], 0.0, matrix[4], matrix[2], matrix[3], 0.0, matrix[5], 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}
exports.mat4FromMat2d = mat4FromMat2d;
function mat2dFromMat4(out, matrix) {
    return gl_matrix_1.mat2d.set(out, matrix[0], matrix[1], matrix[4], matrix[5], matrix[13], matrix[14]);
}
exports.mat2dFromMat4 = mat2dFromMat4;
