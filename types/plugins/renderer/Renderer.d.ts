import type { IConstructor } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { Plugin } from "../../Plugin";
export declare abstract class Renderer extends Plugin {
    static pluginPriority: number;
    private rendererHandlers;
    private rendererHandlerMap;
    getRendererHandlers(): readonly RendererHandler[];
    getRendererHandler<R extends RendererHandler>(RendererHandler: IConstructor<R>): R | null;
    addRendererHandlers(rendererHandlers: RendererHandler[]): this;
    addRendererHandler(...rendererHandlers: RendererHandler[]): this;
    removeRendererHandlers(RendererHandlers: IConstructor<RendererHandler>[]): this;
    removeRendererHandler(...rendererHandlers: IConstructor<RendererHandler>[]): this;
    onUpdate(): this;
    onAfterUpdate(): this;
    private _addRendererHandler;
    private _removeRendererHandler;
    private sortRendererHandlers;
    private sortRendererHandlersFunction;
    toJSON(): {
        rendererHandlers: {
            enabled: boolean;
        }[];
    };
    fromJSON(json: IJSONObject): this;
}
import { RendererHandler } from "./RendererHandler";
