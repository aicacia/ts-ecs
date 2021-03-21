import * as tape from "tape";
import { Plugin } from "../Plugin";
import { Scene } from "../Scene";
import { Loop } from "./Loop";

class Counter extends Plugin {
  private count = 0;

  onUpdate() {
    if (++this.count === 60) {
      this.getRequiredPlugin(Loop).stop();
    }
    return this;
  }
}

tape("Loop", async (assert: tape.Test) => {
  const loop = new Loop(),
    scene = new Scene().addPlugin(new Counter(), loop);

  assert.true(loop.isStopped());

  scene.init();

  assert.false(loop.isStopped());

  await loop.promise();

  assert.true(loop.isStopped());
  assert.end();
});
