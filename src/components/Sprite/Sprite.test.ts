import * as tape from "tape";
import { Scene } from "../../Scene";
import { Entity } from "../../Entity";
import { Transform3D } from "../..";
import { Assets, ImageAsset, Time } from "../../plugins";
import { Sprite } from "./Sprite";

class TestImageAsset extends ImageAsset {
  getWidth() {
    return 1;
  }
  getHeight() {
    return 1;
  }
  loadAsset() {
    return Promise.resolve();
  }
  unloadAsset() {
    return Promise.resolve();
  }
}

tape("Sprite", (assert: tape.Test) => {
  const sprite = new Sprite().setImageAsset(new TestImageAsset());
  const scene = new Scene()
    .addEntity(new Entity().addComponent(new Transform3D(), sprite))
    .addPlugin(new Time(), new Assets());

  scene.update();

  assert.end();
});
