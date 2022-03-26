"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteCtxRendererHandler = void 0;
const Sprite_1 = require("../../../../components/Sprite");
const TransformComponent_1 = require("../../../../components/TransformComponent");
const CtxRendererHandler_1 = require("../CtxRendererHandler");
const gl_matrix_1 = require("gl-matrix");
const math_1 = require("../../../../math");
const AABB2_2 = require("../../../../math/AABB2");
const MAT2_0 = gl_matrix_1.mat2d.create(), AABB2_0 = AABB2_2.AABB2.create(), AABB2_1 = AABB2_2.AABB2.create(), VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create();
class SpriteCtxRendererHandler extends CtxRendererHandler_1.CtxRendererHandler {
    onRender() {
        var _a;
        const spriteManager = this.getManager(Sprite_1.SpriteManager);
        if (spriteManager) {
            const renderer = this.getRequiredRenderer(), cameraAABB2 = this.getCamera().getAABB2(AABB2_0), aabb = AABB2_1, tmp0 = VEC2_0, tmp1 = VEC2_1;
            for (const sprite of spriteManager.getComponents()) {
                const image = (_a = sprite.getImageAsset()) === null || _a === void 0 ? void 0 : _a.getImage();
                if (sprite.getRenderable() && image) {
                    const transform = TransformComponent_1.TransformComponent.getRequiredTransform(sprite.getRequiredEntity());
                    (0, math_1.getAABB2FromRect)(aabb, transform.getPosition2(tmp0), transform.getRotationZ(), sprite.getSize(tmp1));
                    if (AABB2_2.AABB2.notIntersects(cameraAABB2, aabb)) {
                        continue;
                    }
                    renderer.render((ctx) => {
                        const width = sprite.getWidth(), height = sprite.getHeight(), halfWidth = width * 0.5, halfHeight = height * 0.5;
                        ctx.scale(1, -1);
                        ctx.drawImage(image, sprite.getClipX(), sprite.getClipY(), sprite.getClipWidth(), sprite.getClipHeight(), -halfWidth, -halfHeight, width, height);
                    }, transform.getMatrix2d(MAT2_0));
                }
            }
        }
        return this;
    }
}
exports.SpriteCtxRendererHandler = SpriteCtxRendererHandler;
