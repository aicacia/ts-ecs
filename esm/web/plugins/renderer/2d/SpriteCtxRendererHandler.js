import { SpriteManager } from "../../../../components/Sprite";
import { TransformComponent } from "../../../../components/TransformComponent";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d, vec2 } from "gl-matrix";
import { getAABB2FromRect } from "../../../../math";
import { AABB2 } from "../../../../math/AABB2";
const MAT2_0 = mat2d.create(), AABB2_0 = AABB2.create(), AABB2_1 = AABB2.create(), VEC2_0 = vec2.create(), VEC2_1 = vec2.create();
export class SpriteCtxRendererHandler extends CtxRendererHandler {
    onRender() {
        var _a;
        const spriteManager = this.getManager(SpriteManager);
        if (spriteManager) {
            const renderer = this.getRequiredRenderer(), cameraAABB2 = this.getCamera().getAABB2(AABB2_0), aabb = AABB2_1, tmp0 = VEC2_0, tmp1 = VEC2_1;
            for (const sprite of spriteManager.getComponents()) {
                const image = (_a = sprite.getImageAsset()) === null || _a === void 0 ? void 0 : _a.getImage();
                if (sprite.getRenderable() && image) {
                    const transform = TransformComponent.getRequiredTransform(sprite.getRequiredEntity());
                    getAABB2FromRect(aabb, transform.getPosition2(tmp0), transform.getRotationZ(), sprite.getSize(tmp1));
                    if (AABB2.notIntersects(cameraAABB2, aabb)) {
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
