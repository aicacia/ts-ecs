import { vec2, vec4 } from "gl-matrix";
import { Component, Entity, Scene } from "../../lib";
import {
  Assets,
  Camera2D,
  Camera2DControl,
  Camera2DManager,
  FullScreenCanvas,
  Input,
  Sprite,
  Time,
  Loop,
  Transform2D,
} from "../../lib";
import {
  WebCanvas,
  CtxRenderer,
  SpriteCtxRendererHandler,
  TransformCtxRendererHandler,
  WebImageAsset,
  WebEventListener,
} from "../../lib/web";
// @ts-ignore
import logoPng from "url:../assets/logo.png";

class Rotator extends Component {
  static requiredComponents = [Transform2D];
  static requiredPlugins = [Time];

  private rotation = 0.0;

  onUpdate() {
    const delta = this.getRequiredPlugin(Time).getDelta(),
      transform2d = this.getRequiredComponent(Transform2D);

    this.rotation += delta;
    transform2d.setLocalRotation(this.rotation);
    return this;
  }
}

class LookAtCamera extends Component {
  static requiredComponents = [Transform2D];

  onUpdate() {
    const cameraPosition = this.getRequiredScene()
      .getRequiredManager(Camera2DManager)
      .getRequiredActive()
      .getRequiredComponent(Transform2D)
      .getPosition();
    this.getRequiredComponent(Transform2D).lookAt(cameraPosition);
    return this;
  }
}

function onLoad() {
  const logoAsset = new WebImageAsset(logoPng),
    canvas = new WebCanvas().set(256, 256),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D().setRenderable(false),
            new Camera2DControl(),
            new Camera2D().setBackground(vec4.fromValues(0.98, 0.98, 0.98, 1.0))
          ),
        new Entity()
          .addComponent(new Transform2D())
          .addChild(
            new Entity().addComponent(
              new Transform2D()
                .setLocalPosition(vec2.fromValues(3, 0))
                .setRenderable(false),
              new LookAtCamera(),
              new Sprite().setImageAsset(logoAsset)
            )
          ),
        new Entity()
          .addComponent(new Transform2D(), new Rotator())
          .addChild(
            new Entity().addComponent(
              new Transform2D().setLocalPosition(vec2.fromValues(0, 3))
            )
          )
      )
      .addPlugin(
        new CtxRenderer(
          canvas,
          canvas.getElement().getContext("2d")
        ).addRendererHandler(
          new TransformCtxRendererHandler(),
          new SpriteCtxRendererHandler()
        ),
        // Required by many Components and plugins
        new Time(),
        // Handles all input
        new Input().addEventListener(new WebEventListener(canvas.getElement())),
        // forces a canvas to stay in sync with the window size
        new FullScreenCanvas(canvas),
        // assets
        new Assets().addAsset(logoAsset).loadAllInBackground(),
        new Loop()
      );

  (window as any).scene = scene;

  canvas.getElement().style.position = "absolute";
  canvas.getElement().style.left = "0px";
  canvas.getElement().style.top = "0px";
  document.body.appendChild(canvas.getElement());

  scene.init();

  setTimeout(() => {
    const json = scene.toJSON();
    console.log(json);
    const newScene: Scene = Scene.newFromJSON(json);
    newScene.maintain();
    console.log(newScene);
  }, 1000);
}

window.addEventListener("load", onLoad);
