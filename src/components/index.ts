import { TransformComponent } from "./TransformComponent";
import { Transform2D } from "./Transform2D";
import { Transform3D } from "./Transform3D";
import type { Entity } from "../Entity";

export {
  Camera2D,
  Camera2DManager,
  Camera2DControl,
  Camera2DControlManager,
} from "./Camera2D";
export { Camera3D, Camera3DManager } from "./Camera3D";
export { Sprite, SpriteClip, SpriteManager, SpriteSheet } from "./Sprite";
export { Transform2D };
export { Transform3D };
export { RenderableComponent } from "./RenderableComponent";
export { RunOnUpdateComponent } from "./RunOnUpdateComponent";
export { TransformComponentManager } from "./TransformComponentManager";

TransformComponent.getTransform = function getTransform(entity: Entity) {
  const entityTransform = entity
    .getComponent<TransformComponent>(Transform2D)
    .orElse(() => entity.getComponent<TransformComponent>(Transform3D));

  if (entityTransform.isNone()) {
    return TransformComponent.getParentTransform(entity);
  } else {
    return entityTransform;
  }
};

export { TransformComponent };
