import { TransformComponentManager } from "../../../../components/TransformComponentManager";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d } from "gl-matrix";

const MAT2D_0 = mat2d.create();

export class TransformCtxRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(TransformComponentManager).ifSome(
      (transformComponentManager) => {
        const renderer = this.getRequiredRenderer(),
          scale = renderer.getScale();

        for (const transform of transformComponentManager.getComponents()) {
          if (transform.getRenderable()) {
            renderer.render((ctx) => {
              ctx.beginPath();
              ctx.strokeStyle = "#0c0";
              ctx.moveTo(0, 0);
              ctx.lineTo(0, 0.5);
              ctx.stroke();

              ctx.beginPath();
              ctx.strokeStyle = "#00c";
              ctx.moveTo(0, 0);
              ctx.lineTo(0.5, 0);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(0, 0, scale * 2, 0, 2 * Math.PI);
              ctx.fill();
            }, transform.getMatrix2d(MAT2D_0));
          }
        }
      }
    );

    return this;
  }
}
