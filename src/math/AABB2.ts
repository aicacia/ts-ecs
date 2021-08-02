import { vec2 } from "gl-matrix";

export class AABB2 {
  static create() {
    return new AABB2();
  }

  static fromValues(min: vec2, max: vec2) {
    return AABB2.set(AABB2.create(), min, max);
  }

  static set(out: AABB2, min: vec2, max: vec2) {
    AABB2.setMin(out, min);
    AABB2.setMax(out, max);
    return out;
  }
  static setMin(out: AABB2, min: vec2) {
    vec2.copy(out.min, min);
    return out;
  }
  static setMax(out: AABB2, max: vec2) {
    vec2.copy(out.max, max);
    return out;
  }

  static identity(out: AABB2) {
    vec2.set(out.min, Infinity, Infinity);
    vec2.set(out.max, -Infinity, -Infinity);
    return out;
  }

  static expandPoint(out: AABB2, aabb: AABB2, v: vec2) {
    vec2.min(out.min, aabb.min, v);
    vec2.max(out.max, aabb.max, v);
    return out;
  }

  static union(out: AABB2, a: AABB2, b: AABB2) {
    vec2.min(out.min, a.min, b.min);
    vec2.max(out.max, a.max, b.max);
    return out;
  }

  static intersects(a: AABB2, b: AABB2) {
    return !this.notIntersects(a, b);
  }

  static notIntersects(a: AABB2, b: AABB2) {
    return (
      a.max[0] < b.min[0] ||
      a.min[0] > b.max[0] ||
      a.max[1] < b.min[1] ||
      a.min[1] > b.max[1]
    );
  }

  min: vec2 = vec2.fromValues(Infinity, Infinity);
  max: vec2 = vec2.fromValues(-Infinity, -Infinity);
}
