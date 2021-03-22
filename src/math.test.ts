import { vec2 } from "gl-matrix";
import * as tape from "tape";
import { getAngleFromPoint } from "./math";

tape("math getAngleFromPoint", (assert: tape.Test) => {
  assert.equals(getAngleFromPoint(vec2.fromValues(0, 0)), 0, "center");
  assert.equals(getAngleFromPoint(vec2.fromValues(1, 0)), 0, "right");
  assert.equals(
    getAngleFromPoint(vec2.fromValues(1, 1)),
    Math.PI * 0.25,
    "up right"
  );
  assert.equals(getAngleFromPoint(vec2.fromValues(0, 1)), Math.PI * 0.5, "up");
  assert.equals(
    getAngleFromPoint(vec2.fromValues(-1, 1)),
    Math.PI * 0.75,
    "up left"
  );
  assert.equals(getAngleFromPoint(vec2.fromValues(-1, 0)), Math.PI, "left");
  assert.equals(
    getAngleFromPoint(vec2.fromValues(-1, -1)),
    Math.PI * 1.25,
    "down left"
  );
  assert.equals(
    getAngleFromPoint(vec2.fromValues(0, -1)),
    Math.PI * 1.5,
    "down"
  );
  assert.equals(
    getAngleFromPoint(vec2.fromValues(1, -1)),
    Math.PI * 1.75,
    "down right"
  );
  assert.end();
});
