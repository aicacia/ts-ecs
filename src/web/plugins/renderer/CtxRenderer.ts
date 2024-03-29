import { mat2d } from "gl-matrix";
import { Camera2D, Camera2DManager } from "../../../components/Camera2D";
import { toRgba } from "../../../math";
import { Renderer } from "../../../plugins/renderer/Renderer";
import type { IJSONObject } from "@aicacia/json";

const MAT2D_0 = mat2d.create();

export class CtxRenderer extends Renderer {
  static toFromJSONEnabled = false;

  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lineWidth = 1.0;
  private camera: Camera2D | null = null;
  private cameraView: mat2d = mat2d.create();
  private cameraProjection: mat2d = mat2d.create();
  private cameraViewProjection: mat2d = mat2d.create();
  private scale = 1.0;
  private enabled = true;

  constructor(element: HTMLCanvasElement) {
    super();

    this.element = element;
    this.ctx = element.getContext("2d") as CanvasRenderingContext2D;
  }

  getCameraView() {
    return this.cameraView;
  }
  getCameraProjection() {
    return this.cameraProjection;
  }
  getCameraViewProjection() {
    return this.cameraViewProjection;
  }
  getElement() {
    return this.element;
  }
  getCtx() {
    return this.ctx;
  }

  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled = true) {
    this.enabled = enabled;
    return this;
  }

  getLineWidth() {
    return this.lineWidth;
  }
  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
    return this;
  }

  getActiveCamera() {
    return this.getRequiredScene()
      .getRequiredManager(Camera2DManager)
      .getRequiredActive();
  }
  getCamera() {
    return this.camera || this.getActiveCamera();
  }
  setCamera(camera: Camera2D) {
    this.camera = camera;
    return this;
  }
  removeCamera() {
    this.camera = null;
    return this;
  }

  private getCanvasSize() {
    const width = this.element.width,
      height = this.element.height;

    return (width > height ? height : width) * 0.5;
  }
  getScale() {
    return this.scale;
  }

  render(fn: (ctx: CanvasRenderingContext2D) => void, model?: mat2d) {
    const mvp = MAT2D_0;

    if (model) {
      mat2d.mul(mvp, this.cameraViewProjection, model);
    } else {
      mat2d.copy(mvp, this.cameraViewProjection);
    }
    this.ctx.save();
    this.ctx.transform(mvp[0], mvp[1], mvp[2], mvp[3], mvp[4], mvp[5]);
    fn(this.ctx);
    this.ctx.restore();
    return this;
  }

  onUpdate() {
    if (!this.enabled) {
      return this;
    }
    const camera = this.getCamera(),
      width = this.element.width,
      height = this.element.height,
      halfWidth = width * 0.5,
      halfHeight = height * 0.5;

    camera.set(width, height);
    mat2d.copy(this.cameraView, camera.getView());
    mat2d.copy(this.cameraProjection, camera.getProjection());
    mat2d.mul(
      this.cameraViewProjection,
      this.cameraProjection,
      this.cameraView
    );
    this.scale = (1.0 / this.getCanvasSize()) * camera.getZoom();

    this.ctx.save();

    this.ctx.save();
    this.ctx.fillStyle = toRgba(camera.getBackground());
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();

    this.ctx.lineWidth = this.getLineWidth() * this.getScale();
    this.ctx.transform(halfWidth, 0, 0, -halfHeight, halfWidth, halfHeight);

    super.onUpdate();
    this.ctx.restore();

    return this;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      lineWidth: this.lineWidth,
      enabled: this.enabled,
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    this.lineWidth = json.lineWidth as number;
    this.enabled = json.enabled as boolean;
    return this;
  }
}
