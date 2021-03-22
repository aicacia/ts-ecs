import { mat2d, vec2 } from "gl-matrix";
import * as tape from "tape";
import { Scene } from "../../Scene";
import { Entity } from "../../Entity";
import { Camera2D, Transform2D } from "../..";

tape("Camera2D", (assert: tape.Test) => {
  const camera = new Camera2D().set(256, 256);
  const scene = new Scene().addEntity(
    new Entity().addComponent(
      new Transform2D().setLocalPosition(vec2.fromValues(1, 1)),
      camera
    )
  );

  scene.update();

  assert.true(
    mat2d.equals(camera.getView(), mat2d.fromValues(1, 0, 0, 1, -1, -1))
  );
  assert.true(
    mat2d.equals(camera.getProjection(), mat2d.fromValues(1, 0, 0, 1, 0, 0))
  );

  assert.end();
});
