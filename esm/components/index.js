import { TransformComponent } from "./TransformComponent";
import { Transform2D } from "./Transform2D";
import { Transform3D } from "./Transform3D";
export { Camera2D, Camera2DManager, Camera2DControl, Camera2DControlManager, } from "./Camera2D";
export { Camera3D, Camera3DManager } from "./Camera3D";
export { Sprite, SpriteClip, SpriteManager, SpriteSheet } from "./Sprite";
export { Transform2D };
export { Transform3D };
export { RenderableComponent } from "./RenderableComponent";
export { RunOnUpdateComponent } from "./RunOnUpdateComponent";
export { TransformComponentManager } from "./TransformComponentManager";
TransformComponent.getTransform = function getTransform(entity) {
    const entityTransform = entity.getComponent(Transform2D) ||
        entity.getComponent(Transform3D);
    if (entityTransform) {
        return entityTransform;
    }
    else {
        return TransformComponent.getParentTransform(entity);
    }
};
export { TransformComponent };
