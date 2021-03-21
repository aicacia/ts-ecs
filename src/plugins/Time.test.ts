import * as tape from "tape";
import { Scene } from "../Scene";
import { Time } from "..";

tape("Time", (assert: tape.Test) => {
  const scene = new Scene().addPlugin(new Time());

  scene.update();

  const time = scene.getRequiredPlugin(Time);

  assert.equal(time.getScale(), 1);
  assert.equal(time.getFrame(), 1);
  assert.true(time.getDelta() > 0.0);

  scene.update();

  assert.equal(time.getScale(), 1);
  assert.equal(time.getFrame(), 2);
  assert.true(time.getDelta() > 0.0);

  assert.end();
});
