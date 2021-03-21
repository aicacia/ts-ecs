import * as tape from "tape";
import { Plugin } from "../Plugin";
import { Scene } from "../Scene";
import { EventLoop } from "./EventLoop";
import { Input } from "./input";
import { Time } from "./Time";

class Counter extends Plugin {
  count = 0;

  onUpdate() {
    this.count += 1;
    return this;
  }
}

tape("EventLoop", (assert: tape.Test) => {
  const scene = new Scene().addPlugin(
    new Time(),
    new Input(),
    new Counter(),
    new EventLoop()
  );

  assert.true(scene.getRequiredPlugin(EventLoop).isStopped());

  scene.init();

  scene.getRequiredPlugin(Input).emit("event", { type: "resize" });
  scene.getRequiredPlugin(Input).emit("event", { type: "resize" });
  scene.getRequiredPlugin(Input).emit("event", { type: "resize" });

  setTimeout(() => {
    assert.equal(scene.getRequiredPlugin(Counter).count, 1);
    assert.end();
  }, 10);
});
