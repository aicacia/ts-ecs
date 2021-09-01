import { vec2 } from "gl-matrix";
export declare class AABB2 {
    static create(): AABB2;
    static fromValues(min: vec2, max: vec2): AABB2;
    static set(out: AABB2, min: vec2, max: vec2): AABB2;
    static setMin(out: AABB2, min: vec2): AABB2;
    static setMax(out: AABB2, max: vec2): AABB2;
    static identity(out: AABB2): AABB2;
    static expandPoint(out: AABB2, aabb: AABB2, v: vec2): AABB2;
    static union(out: AABB2, a: AABB2, b: AABB2): AABB2;
    static intersects(a: AABB2, b: AABB2): boolean;
    static notIntersects(a: AABB2, b: AABB2): boolean;
    min: vec2;
    max: vec2;
}
