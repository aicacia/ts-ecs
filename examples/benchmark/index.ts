import { XorShiftRng } from "@aicacia/rand";
import {
  Component,
  Entity,
  Plugin,
  Scene,
  Assets,
  Camera2D,
  Camera2DControl,
  FullScreenCanvas,
  Input,
  Sprite,
  Time,
  Loop,
  Transform2D,
} from "../../src";
import {
  WebCanvas,
  CtxRenderer,
  SpriteCtxRendererHandler,
  WebImageAsset,
  WebEventListener,
} from "../../src/web";
// @ts-ignore
import logoPng from "url:../assets/logo.png";

class FPSPlugin extends Plugin {
  static requiredPlugins = [Time];
  private element: HTMLElement;
  private fps: string;

  constructor(element: HTMLElement) {
    super();
    this.element = element;
  }
  onAfterUpdate() {
    const fps = this.getRequiredPlugin(Time).getFps().toFixed(2);

    if (fps !== this.fps) {
      this.fps = fps;
      this.element.innerText = `${this.fps}fps`;
    }
    return this;
  }
}

class Rotator extends Component {
  static requiredComponents = [Transform2D];
  static requiredPlugins = [Time];

  private rotation: number | undefined;

  onUpdate() {
    const delta = this.getRequiredPlugin(Time).getDelta(),
      transform2d = this.getRequiredComponent(Transform2D);

    if (!this.rotation) {
      this.rotation = transform2d.getLocalRotationZ();
    }

    this.rotation += delta;
    transform2d.setLocalRotation(this.rotation);
    return this;
  }
}

function onLoad() {
  const logoAsset = new WebImageAsset(logoPng),
    canvas = new WebCanvas(
      document.getElementById("canvas") as HTMLCanvasElement
    ),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D().setRenderable(false).setLocalScale2([10, 10]),
            new Camera2DControl(),
            new Camera2D().setBackground([0.98, 0.98, 0.98, 1.0])
          ),
        new Entity().addComponent(new Transform2D())
      )
      .addPlugin(
        new CtxRenderer(canvas.getElement()).addRendererHandler(
          new SpriteCtxRendererHandler()
        ),
        new Time(),
        new Input().addEventListener(new WebEventListener(canvas.getElement())),
        new FullScreenCanvas(canvas),
        new Assets().addAsset(logoAsset).loadAllInBackground(),
        new FPSPlugin(document.getElementById("fps")),
        new Loop()
      );

  const positionRNG = new XorShiftRng().uniformFloat(-50, 50),
    rotationRNG = new XorShiftRng().uniformFloat(-Math.PI, Math.PI);
  for (let i = 0, il = 1000; i < il; i++) {
    scene.addEntity(
      new Entity().addComponent(
        new Transform2D()
          .setLocalRotationZ(rotationRNG.nextFloat())
          .setLocalPosition2([
            positionRNG.nextFloat(),
            positionRNG.nextFloat(),
          ]),
        new Rotator(),
        new Sprite().setImageAsset(logoAsset)
      )
    );
  }

  scene.init();
}

window.addEventListener("load", onLoad);
