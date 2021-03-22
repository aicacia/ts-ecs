import type { Option } from "@aicacia/core";
import { mat2d, mat4, quat, vec2, vec3 } from "gl-matrix";
import type { Entity } from "../Entity";
import { RenderableComponent } from "./RenderableComponent";
import { TransformComponentManager } from "./TransformComponentManager";

const VEC2_0 = vec2.create(),
  VEC3_0 = vec3.create();

export abstract class TransformComponent extends RenderableComponent {
  static Manager = TransformComponentManager;

  static getParentTransform(entity: Entity): Option<TransformComponent> {
    return entity.getParent().andThen(TransformComponent.getTransform);
  }

  static getTransform(entity: Entity) {
    const entityTransform = entity
      .getComponent<TransformComponent>(Transform2D)
      .orElse(() => entity.getComponent<TransformComponent>(Transform3D));

    if (entityTransform.isNone()) {
      return TransformComponent.getParentTransform(entity);
    } else {
      return entityTransform;
    }
  }

  static getRequiredTransform(entity: Entity) {
    return TransformComponent.getTransform(entity).expect(
      `Entity required a TransformComponent`
    );
  }

  private needsUpdate = true;
  private localNeedsUpdate = true;

  onDetach() {
    return this.setNeedsUpdate();
  }

  getParentTransform() {
    return this.getEntity().flatMap(TransformComponent.getParentTransform);
  }

  setNeedsUpdate(needsUpdate = true) {
    this.setLocalNeedsUpdate(needsUpdate);

    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.getEntity().ifSome((entity) => {
        for (const child of entity.getChildren()) {
          for (const transform of child.getComponentsInstanceOf(
            TransformComponent as any
          )) {
            (transform as TransformComponent).setNeedsUpdate(needsUpdate);
          }
        }
      });
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  setLocalNeedsUpdate(localNeedsUpdate = true) {
    this.localNeedsUpdate = localNeedsUpdate;
    return this;
  }
  getLocalNeedsUpdate() {
    return this.localNeedsUpdate;
  }

  updateLocalMatrixIfNeeded() {
    if (this.localNeedsUpdate) {
      this.localNeedsUpdate = false;
      return this.updateLocalMatrix();
    } else {
      return this;
    }
  }

  updateMatrixIfNeeded() {
    if (this.needsUpdate) {
      this.needsUpdate = false;
      return this.updateMatrix();
    } else {
      return this;
    }
  }

  translate2(position: vec2): this {
    const current = this.getLocalPosition2(VEC2_0);
    vec2.add(current, current, position);
    return this.setLocalPosition2(current);
  }
  translate3(position: vec3): this {
    const current = this.getLocalPosition3(VEC3_0);
    vec3.add(current, current, position);
    return this.setLocalPosition3(current);
  }

  scale2(scale: vec2): this {
    const current = this.getLocalScale2(VEC2_0);
    vec2.mul(current, current, scale);
    return this.setLocalPosition2(current);
  }
  scale3(scale: vec3): this {
    const current = this.getLocalScale3(VEC3_0);
    vec3.mul(current, current, scale);
    return this.setLocalPosition3(current);
  }

  abstract updateLocalMatrix(): this;
  abstract updateMatrix(): this;

  abstract getMatrix2d(out: mat2d): mat2d;
  abstract getMatrix4(out: mat4): mat4;

  abstract getLocalMatrix2d(out: mat2d): mat2d;
  abstract getLocalMatrix4(out: mat4): mat4;

  abstract getLocalPosition2(out: vec2): vec2;
  abstract getLocalPosition3(out: vec3): vec3;

  abstract setLocalPosition2(localPosition: vec2): this;
  abstract setLocalPosition3(localPosition: vec3): this;

  abstract getLocalRotationZ(): number;
  abstract getLocalRotationQuat(out: quat): quat;

  abstract setLocalRotationZ(localRotation: number): this;
  abstract setLocalRotationQuat(localRotation: quat): this;

  abstract getLocalScale2(out: vec2): vec2;
  abstract getLocalScale3(out: vec3): vec3;

  abstract setLocalScale2(localScale: vec2): this;
  abstract setLocalScale3(localScale: vec3): this;

  abstract getPosition2(out: vec2): vec2;
  abstract getPosition3(out: vec3): vec3;

  abstract getRotationZ(): number;
  abstract getRotationQuat(out: quat): quat;

  abstract getScale2(out: vec2): vec2;
  abstract getScale3(out: vec3): vec3;
}

import { Transform2D } from "./Transform2D";
import { Transform3D } from "./Transform3D";
