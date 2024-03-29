import { Plugin } from "../Plugin";
import type { IRunOnUpdateFn } from "../IRunOnUpdateFn";
export declare abstract class RunOnUpdatePlugin extends Plugin {
    private queue;
    private swap;
    runOnUpdate(...fns: IRunOnUpdateFn<this>[]): this;
    onUpdate(): this;
}
