import { mat2d, vec2, vec3, vec4, mat4 } from "gl-matrix";

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const HALF_PI = Math.PI * 0.5;
export const TAU = Math.PI * 2;
export const EPSILON = 0.000001;

export function composeMat2d(
  out: mat2d,
  position: vec2,
  scale: vec2,
  rotation: number
): mat2d {
  const sx = scale[0],
    sy = scale[1],
    c = Math.cos(rotation),
    s = Math.sin(rotation);

  out[0] = c * sx;
  out[1] = s * sx;
  out[2] = -s * sy;
  out[3] = c * sy;
  out[4] = position[0];
  out[5] = position[1];

  return out;
}

const extractScale_VEC2_0 = vec2.create();

export function extractScale(out: vec2, matrix: mat2d): vec2 {
  return vec2.set(
    out,
    vec2.len(vec2.set(extractScale_VEC2_0, matrix[0], matrix[1])),
    vec2.len(vec2.set(extractScale_VEC2_0, matrix[2], matrix[3]))
  );
}

export function decomposeMat2d(
  matrix: mat2d,
  position: vec2,
  scale: vec2
): number {
  vec2.set(position, matrix[4], matrix[5]);
  extractScale(scale, matrix);
  return getRotationFromMat2d(matrix);
}

export function getRotationFromMat2d(matrix: mat2d): number {
  return Math.atan2(matrix[2], matrix[0]);
}

export function getPointFromAngle(out: vec2, angle: number) {
  out[0] = Math.cos(angle);
  out[1] = Math.sin(angle);
  return out;
}

export function getAngleFromPoint(out: vec2) {
  const x = out[0],
    y = out[1],
    angle = Math.atan2(y, x);

  if (y < 0) {
    return TAU + angle;
  } else {
    return angle;
  }
}

const getTangentAngle_VEC2_0 = vec2.create();

export function getTangentAngle(vec: vec2) {
  const tmp = vec2.copy(getTangentAngle_VEC2_0, vec),
    tmpX = tmp[0];
  tmp[0] = tmp[1];
  tmp[1] = tmpX;
  return getAngleFromPoint(tmp);
}

export function getAngleBetweenPoints(a: vec2, b: vec2): number {
  const sign = b[1] < a[1] ? -1 : 1;
  return Math.acos(vec2.dot(a, b) / (vec2.len(a) * vec2.len(b))) * sign;
}

export function sign(value: number) {
  return value < 0 ? -1 : 1;
}

export function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

export function angleVec2(out: vec2) {
  return Math.atan2(out[1], out[0]);
}

export function vec2FromAngle(out: vec2, angle: number) {
  out[0] = Math.cos(angle);
  out[1] = Math.sin(angle);
  return out;
}

export function projectPointOnAxis(out: vec2, point: vec2, axis: vec2) {
  const squaredLength = vec2.squaredLength(axis),
    dotProduct = vec2.dot(point, axis);

  return vec2.scale(out, axis, dotProduct / squaredLength);
}

export function radToDeg(rad: number) {
  return rad * RAD_TO_DEG;
}

export function degToRad(def: number) {
  return def * DEG_TO_RAD;
}

export function equals(a: number, b: number) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

export function toHex(color: vec3 | vec4) {
  return `#${((color[0] * 255) | 0).toString(16)}${(
    (color[1] * 255) |
    0
  ).toString(16)}${((color[2] * 255) | 0).toString(16)}`;
}

export function toRgb(color: vec3 | vec4) {
  return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`;
}

export function toRgba(color: vec4) {
  return `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${
    color[3]
  })`;
}

export function mat4FromMat2d(out: mat4, matrix: mat2d) {
  return mat4.set(
    out,
    matrix[0],
    matrix[1],
    0.0,
    matrix[4],
    matrix[2],
    matrix[3],
    0.0,
    matrix[5],
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  );
}

export function mat2dFromMat4(out: mat2d, matrix: mat4) {
  return mat2d.set(
    out,
    matrix[0],
    matrix[1],
    matrix[4],
    matrix[5],
    matrix[13],
    matrix[14]
  );
}
