import { RenderableComponent } from "./RenderableComponent";
import type { IRunOnUpdateFn } from "../IRunOnUpdateFn";
export declare abstract class RunOnUpdateComponent extends RenderableComponent {
    private queue;
    private swap;
    runOnUpdate(...fns: IRunOnUpdateFn<this>[]): this;
    onUpdate(): this;
}
