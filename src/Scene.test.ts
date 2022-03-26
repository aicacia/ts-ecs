import * as tape from "tape";
import { Component, Entity, Plugin, Scene } from ".";
import type { IJSONObject } from "@aicacia/json";
import { DefaultManager } from "./DefaultManager";

export class TestManager extends DefaultManager<Test> {}

export class Test extends Component {
  static Manager = TestManager;

  position = 0;
  globalPosition = 0;

  onUpdate() {
    this.position += 1;

    const parent = this.getRequiredEntity().getParent();
    this.globalPosition = this.position;
    if (parent) {
      const parentComponent = parent.getComponent(Test);
      if (parentComponent) {
        this.globalPosition = parentComponent.position + this.position;
      }
    }

    return this;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      position: this.position,
      globalPosition: this.globalPosition,
    };
  }

  fromJSON(json: IJSONObject) {
    this.position = json.position as number;
    this.globalPosition = json.globalPosition as number;
    return this;
  }
}

export class Test1Plugin extends Plugin {
  static pluginPriority = 1;
}

export class Test2Plugin extends Plugin {
  static pluginPriority = Infinity;
}

tape("Scene", (assert: tape.Test) => {
  const scene = new Scene().addEntity(
    new Entity()
      .addTag("parent")
      .addComponent(new Test())
      .addChild(
        new Entity().addTag("child").addComponent(new Test()),
        new Entity().addTag("child2").addComponent(new Test())
      )
  );

  const test1Plugin = new Test1Plugin(),
    test2Plugin = new Test2Plugin();

  scene.addPlugin(test2Plugin, test1Plugin);
  assert.deepEquals(scene.getPlugins(), [test1Plugin, test2Plugin]);

  scene.update();

  const parent = scene.findWithTag("parent") as Entity;
  assert.true(parent.isRoot());
  assert.equal(parent.getDepth(), 0);
  assert.deepEqual(parent.getTags(), new Set(["parent"]));

  const child = scene.findWithTag("child") as Entity;
  assert.false(child.isRoot());
  assert.equal(child.getDepth(), 1);
  assert.deepEqual(child.getTags(), new Set(["child"]));

  child.detach();

  assert.true(child.isRoot());
  assert.equal(child.getDepth(), 0);

  assert.true(scene.findWithTag("child2") !== null);

  assert.end();
});

tape("Scene to/from JSON", (assert: tape.Test) => {
  const scene = new Scene()
    .addEntity(
      new Entity()
        .addTag("parent")
        .addComponent(new Test())
        .addChild(
          new Entity().addTag("child").addComponent(new Test()),
          new Entity().addTag("child").addComponent(new Test())
        )
    )
    .addPlugin(new Test1Plugin(), new Test2Plugin());

  scene.maintain();

  const json = scene.toJSON();

  scene.clear();
  scene.maintain();

  assert.deepEqual(json, {
    typeId: "Scene",
    name: null,
    entities: [
      {
        typeId: "Entity",
        name: null,
        tags: ["parent"],
        children: [
          {
            typeId: "Entity",
            name: null,
            tags: ["child"],
            children: [],
            components: [{ typeId: "Test", position: 0, globalPosition: 0 }],
          },
          {
            typeId: "Entity",
            name: null,
            tags: ["child"],
            children: [],
            components: [{ typeId: "Test", position: 0, globalPosition: 0 }],
          },
        ],
        components: [{ typeId: "Test", position: 0, globalPosition: 0 }],
      },
    ],
    plugins: [{ typeId: "Test1Plugin" }, { typeId: "Test2Plugin" }],
  });

  scene.fromJSON(json);

  assert.equals(scene.findAllWithTag("child").length, 2);
  assert.equals(
    scene.findWithTag("child")?.getRequiredComponent(Test).position,
    0
  );

  assert.end();
});

tape("Scene find(All)", (assert: tape.Test) => {
  const scene = new Scene().addEntity(
    new Entity()
      .addTag("parent")
      .addChild(new Entity().addTag("child").addComponent(new Test()))
  );

  scene.maintain();

  assert.equals(scene.findAllWithTag("parent").length, 1);
  assert.equals(scene.findAllWithTag("child").length, 1);

  scene
    .findWithTag("parent")
    ?.addChild(new Entity().addTag("child").addComponent(new Test()));

  scene.maintain();

  assert.equals(scene.findAllWithTag("child").length, 2);
  assert.equals(
    scene.getRequiredManager(TestManager).getComponents().length,
    2
  );

  assert.end();
});
