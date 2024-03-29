import type { IConstructor } from "@aicacia/core";
import type { Plugin } from "../../Plugin";
import type { Manager } from "../../Manager";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
import type { Renderer } from "./Renderer";
import type { IJSONObject } from "@aicacia/json";
export declare abstract class RendererHandler<R extends Renderer = Renderer> extends ToFromJSONEventEmitter {
    static rendererHandlerPriority: number;
    static getRendererHandlerPriority(): number;
    private renderer;
    private enabled;
    getEnabled(): boolean;
    setEnabled(enabled?: boolean): this;
    getConstructor(): IConstructor<this>;
    getRendererHandlerPriority(): number;
    UNSAFE_setRenderer(renderer: R): this;
    UNSAFE_removeRenderer(): this;
    getRenderer(): R | null;
    getRequiredRenderer(): R;
    getScene(): import("../..").Scene | null;
    getRequiredScene(): import("../..").Scene;
    getManager<M extends Manager>(Manager: IConstructor<M>): M | null;
    getRequiredManager<M extends Manager>(Manager: IConstructor<M>): M;
    getPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P): P | null;
    getRequiredPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P): P;
    onAdd(): this;
    onRemove(): this;
    onBeforeRender(): this;
    onRender(): this;
    onAfterRender(): this;
    toJSON(): {
        enabled: boolean;
    };
    fromJSON(json: IJSONObject): this;
}
