import { RenderableComponent } from "./RenderableComponent";
import { IRunOnUpdateFn } from "../IRunOnUpdateFn";
export declare abstract class RunOnUpdateComponent extends RenderableComponent {
    private queue;
    private swap;
    runOnUpdate(...fns: IRunOnUpdateFn<this>[]): this;
    onUpdate(): this;
}
