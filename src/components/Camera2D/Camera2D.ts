import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { mat2d, vec2, vec4 } from "gl-matrix";
import { RenderableComponent } from "../RenderableComponent";
import { TransformComponent } from "../TransformComponent";
import { extractScale } from "../../math";
import type { IJSONArray, IJSONObject } from "@aicacia/json";
import { Camera2DManager } from "./Camera2DManager";

const MAT2D_0 = mat2d.create(),
  VEC2_0 = vec2.create();

export class Camera2D extends RenderableComponent {
  static Manager = Camera2DManager;
  static requiredComponents = [[Transform2D, Transform3D]];

  private width = 1.0;
  private height = 1.0;
  private aspect = 1.0;

  private size = 1;
  private minSize = Number.EPSILON;
  private maxSize = Infinity;

  private projection = mat2d.identity(mat2d.create());
  private view = mat2d.identity(mat2d.create());

  private needsUpdate = true;
  private background: vec4 = vec4.create();

  getBackground() {
    return this.background;
  }
  setBackground(background: vec4) {
    vec4.copy(this.background, background);
    return this;
  }

  set(width: number, height: number) {
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.aspect = width / height;
      return this.setNeedsUpdate();
    } else {
      return this;
    }
  }
  getWidth() {
    return this.width;
  }
  setWidth(width: number) {
    return this.set(width, this.height);
  }
  getHeight() {
    return this.height;
  }
  setHeight(height: number) {
    return this.set(this.width, height);
  }
  getAspect() {
    return this.aspect;
  }

  getSize() {
    return this.size;
  }
  setSize(size: number) {
    this.size =
      size < this.minSize
        ? this.minSize
        : size > this.maxSize
        ? this.maxSize
        : size;
    return this.setNeedsUpdate();
  }
  getMinSize() {
    return this.minSize;
  }
  setMinSize(minSize: number) {
    this.minSize = minSize;
    return this.setNeedsUpdate();
  }
  getMaxSize() {
    return this.minSize;
  }
  setMaxSize(maxSize: number) {
    this.maxSize = maxSize;
    return this.setNeedsUpdate();
  }

  setZoom(zoom: number) {
    this.getEntity()
      .flatMap(TransformComponent.getTransform)
      .ifSome((transform) =>
        transform.setLocalScale2(vec2.set(VEC2_0, zoom, zoom))
      );
    return this;
  }
  getZoom() {
    return this.getEntity()
      .flatMap(TransformComponent.getTransform)
      .map(
        (transform) =>
          vec2.len(extractScale(VEC2_0, transform.getMatrix2d(MAT2D_0))) *
          this.size
      )
      .unwrapOr(this.size);
  }

  getView() {
    this.getEntity()
      .flatMap(TransformComponent.getTransform)
      .ifSome((transform) =>
        mat2d.invert(this.view, transform.getMatrix2d(MAT2D_0))
      );
    return this.view;
  }

  getProjection() {
    return this.updateProjectionIfNeeded().projection;
  }

  setNeedsUpdate(needsUpdate = true) {
    this.needsUpdate = needsUpdate;
    return this;
  }

  updateProjectionIfNeeded() {
    if (this.needsUpdate) {
      return this.updateProjection();
    } else {
      return this;
    }
  }

  isActive(): boolean {
    return this.getRequiredManager<Camera2DManager>()
      .getActive()
      .map((active) => active === this)
      .unwrapOr(false);
  }
  setActive() {
    this.getRequiredManager<Camera2DManager>().setActive(this);
    return this;
  }
  updateProjection() {
    const size = this.getSize(),
      right = size * this.aspect,
      left = -right,
      top = size,
      bottom = -top,
      width = right - left,
      height = top - bottom,
      x = (right + left) / width,
      y = (top + bottom) / height;

    mat2d.set(this.projection, 2 / width, 0.0, 0.0, 2 / height, -x, -y);
    this.needsUpdate = false;

    return this;
  }

  toRelative(out: vec2, screen: vec2) {
    this.toWorld(out, screen);
    vec2.transformMat2d(out, out, this.view);
    return out;
  }

  toWorld(out: vec2, screen: vec2) {
    const mat = MAT2D_0;

    out[0] = 2.0 * (screen[0] / this.width) - 1.0;
    out[1] = -2.0 * (screen[1] / this.height) + 1.0;

    mat2d.mul(mat, this.projection, this.view);
    mat2d.invert(mat, mat);
    vec2.transformMat2d(out, out, mat);

    return out;
  }

  toScreen(out: vec2, world: vec2) {
    const mat = mat2d.mul(MAT2D_0, this.projection, this.view);

    vec2.transformMat2d(out, world, mat);

    out[0] = (out[0] + 1.0) * 0.5 * this.width;
    out[1] = (1.0 - out[1]) * 0.5 * this.height;

    return out;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      width: this.width,
      height: this.height,
      background: this.background as IJSONArray,
    };
  }

  fromJSON(json: IJSONObject) {
    return super
      .fromJSON(json)
      .set(json.width as number, json.height as number)
      .setBackground(json.background as vec4);
  }
}
