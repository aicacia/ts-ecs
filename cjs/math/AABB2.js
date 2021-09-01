"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AABB2 = void 0;
const gl_matrix_1 = require("gl-matrix");
class AABB2 {
    constructor() {
        this.min = gl_matrix_1.vec2.fromValues(Infinity, Infinity);
        this.max = gl_matrix_1.vec2.fromValues(-Infinity, -Infinity);
    }
    static create() {
        return new AABB2();
    }
    static fromValues(min, max) {
        return AABB2.set(AABB2.create(), min, max);
    }
    static set(out, min, max) {
        AABB2.setMin(out, min);
        AABB2.setMax(out, max);
        return out;
    }
    static setMin(out, min) {
        gl_matrix_1.vec2.copy(out.min, min);
        return out;
    }
    static setMax(out, max) {
        gl_matrix_1.vec2.copy(out.max, max);
        return out;
    }
    static identity(out) {
        gl_matrix_1.vec2.set(out.min, Infinity, Infinity);
        gl_matrix_1.vec2.set(out.max, -Infinity, -Infinity);
        return out;
    }
    static expandPoint(out, aabb, v) {
        gl_matrix_1.vec2.min(out.min, aabb.min, v);
        gl_matrix_1.vec2.max(out.max, aabb.max, v);
        return out;
    }
    static union(out, a, b) {
        gl_matrix_1.vec2.min(out.min, a.min, b.min);
        gl_matrix_1.vec2.max(out.max, a.max, b.max);
        return out;
    }
    static intersects(a, b) {
        return !this.notIntersects(a, b);
    }
    static notIntersects(a, b) {
        return (a.max[0] < b.min[0] ||
            a.min[0] > b.max[0] ||
            a.max[1] < b.min[1] ||
            a.min[1] > b.max[1]);
    }
}
exports.AABB2 = AABB2;
