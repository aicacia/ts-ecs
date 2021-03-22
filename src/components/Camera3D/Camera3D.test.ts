import { mat4, vec3 } from "gl-matrix";
import * as tape from "tape";
import { Scene } from "../../Scene";
import { Entity } from "../../Entity";
import { Camera3D, Transform3D } from "../..";

tape("Camera3D", (assert: tape.Test) => {
  const camera = new Camera3D().set(256, 256);
  const scene = new Scene().addEntity(
    new Entity().addComponent(
      new Transform3D().setLocalPosition(vec3.fromValues(1, 1, 1)),
      camera
    )
  );

  scene.update();

  assert.true(
    mat4.equals(
      camera.getView(),
      mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -1, -1, -1, 1)
    ),
    `[${camera.getView()}] = [${mat4.fromValues(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      -1,
      -1,
      -1,
      1
    )}]`
  );
  assert.true(
    mat4.equals(
      camera.getProjection(),
      mat4.fromValues(
        -0.14706505835056305,
        0,
        0,
        0,
        0,
        -0.14706505835056305,
        0,
        0,
        0,
        0,
        -1,
        -1,
        0,
        0,
        -0.0000019999999949504854,
        0
      )
    ),
    `[${camera.getProjection()}] = [${mat4.fromValues(
      -0.14706505835056305,
      0,
      0,
      0,
      0,
      -0.14706505835056305,
      0,
      0,
      0,
      0,
      -1,
      -1,
      0,
      0,
      -0.0000019999999949504854,
      0
    )}]`
  );

  assert.end();
});
