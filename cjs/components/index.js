"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformComponent = exports.TransformComponentManager = exports.RunOnUpdateComponent = exports.RenderableComponent = exports.Transform3D = exports.Transform2D = exports.SpriteSheet = exports.SpriteManager = exports.SpriteClip = exports.Sprite = exports.Camera3DManager = exports.Camera3D = exports.Camera2DControlManager = exports.Camera2DControl = exports.Camera2DManager = exports.Camera2D = void 0;
const TransformComponent_1 = require("./TransformComponent");
Object.defineProperty(exports, "TransformComponent", { enumerable: true, get: function () { return TransformComponent_1.TransformComponent; } });
const Transform2D_1 = require("./Transform2D");
Object.defineProperty(exports, "Transform2D", { enumerable: true, get: function () { return Transform2D_1.Transform2D; } });
const Transform3D_1 = require("./Transform3D");
Object.defineProperty(exports, "Transform3D", { enumerable: true, get: function () { return Transform3D_1.Transform3D; } });
var Camera2D_1 = require("./Camera2D");
Object.defineProperty(exports, "Camera2D", { enumerable: true, get: function () { return Camera2D_1.Camera2D; } });
Object.defineProperty(exports, "Camera2DManager", { enumerable: true, get: function () { return Camera2D_1.Camera2DManager; } });
Object.defineProperty(exports, "Camera2DControl", { enumerable: true, get: function () { return Camera2D_1.Camera2DControl; } });
Object.defineProperty(exports, "Camera2DControlManager", { enumerable: true, get: function () { return Camera2D_1.Camera2DControlManager; } });
var Camera3D_1 = require("./Camera3D");
Object.defineProperty(exports, "Camera3D", { enumerable: true, get: function () { return Camera3D_1.Camera3D; } });
Object.defineProperty(exports, "Camera3DManager", { enumerable: true, get: function () { return Camera3D_1.Camera3DManager; } });
var Sprite_1 = require("./Sprite");
Object.defineProperty(exports, "Sprite", { enumerable: true, get: function () { return Sprite_1.Sprite; } });
Object.defineProperty(exports, "SpriteClip", { enumerable: true, get: function () { return Sprite_1.SpriteClip; } });
Object.defineProperty(exports, "SpriteManager", { enumerable: true, get: function () { return Sprite_1.SpriteManager; } });
Object.defineProperty(exports, "SpriteSheet", { enumerable: true, get: function () { return Sprite_1.SpriteSheet; } });
var RenderableComponent_1 = require("./RenderableComponent");
Object.defineProperty(exports, "RenderableComponent", { enumerable: true, get: function () { return RenderableComponent_1.RenderableComponent; } });
var RunOnUpdateComponent_1 = require("./RunOnUpdateComponent");
Object.defineProperty(exports, "RunOnUpdateComponent", { enumerable: true, get: function () { return RunOnUpdateComponent_1.RunOnUpdateComponent; } });
var TransformComponentManager_1 = require("./TransformComponentManager");
Object.defineProperty(exports, "TransformComponentManager", { enumerable: true, get: function () { return TransformComponentManager_1.TransformComponentManager; } });
TransformComponent_1.TransformComponent.getTransform = function getTransform(entity) {
    const entityTransform = entity.getComponent(Transform2D_1.Transform2D) ||
        entity.getComponent(Transform3D_1.Transform3D);
    if (entityTransform) {
        return entityTransform;
    }
    else {
        return TransformComponent_1.TransformComponent.getParentTransform(entity);
    }
};
