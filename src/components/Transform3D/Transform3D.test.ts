import { mat4, vec3 } from "gl-matrix";
import * as tape from "tape";
import { Scene } from "../../Scene";
import { Entity } from "../../Entity";
import { Transform3D } from "./Transform3D";

tape("Transform3D", (assert: tape.Test) => {
  const child = new Entity().addTag("child").addComponent(new Transform3D()),
    parent = new Entity()
      .addTag("parent")
      .addComponent(
        new Transform3D()
          .setLocalScale(vec3.fromValues(2, 2, 2))
          .setLocalPosition(vec3.fromValues(1, 1, 1))
      )
      .addChild(child);

  const scene = new Scene().addEntity(parent);

  scene.update();

  const parentTransform = parent.getRequiredComponent(Transform3D);
  const childTransform = child.getRequiredComponent(Transform3D);

  assert.true(parentTransform.getNeedsUpdate());
  assert.true(childTransform.getNeedsUpdate());

  assert.true(
    mat4.equals(
      parentTransform.getMatrix(),
      mat4.fromValues(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1)
    ),
    `[${parentTransform.getMatrix()}] = [${mat4.fromValues(
      2,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      0,
      2,
      0,
      1,
      1,
      1,
      1
    )}]`
  );
  assert.true(
    mat4.equals(
      childTransform.getMatrix(),
      mat4.fromValues(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 1, 1, 1, 1)
    ),
    `[${childTransform.getMatrix()}] = [${mat4.fromValues(
      2,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      0,
      2,
      0,
      1,
      1,
      1,
      1
    )}]`
  );

  assert.end();
});
