import { Option, IConstructor } from "@aicacia/core";
import { IJSONObject, isJSONArray } from "@aicacia/json";
import { Plugin } from "../../Plugin";

export abstract class Renderer extends Plugin {
  static pluginPriority = Infinity;

  private rendererHandlers: RendererHandler[] = [];
  private rendererHandlerMap: Map<
    IConstructor<RendererHandler>,
    RendererHandler
  > = new Map();

  getRendererHandlers(): readonly RendererHandler[] {
    return this.rendererHandlers;
  }
  getRendererHandler<R extends RendererHandler>(
    RendererHandler: IConstructor<R>
  ) {
    return Option.from(this.rendererHandlerMap.get(RendererHandler));
  }

  addRendererHandlers(rendererHandlers: RendererHandler[]) {
    for (const rendererHandler of rendererHandlers) {
      this._addRendererHandler(rendererHandler);
    }
    return this.sortRendererHandlers();
  }
  addRendererHandler(...rendererHandlers: RendererHandler[]) {
    return this.addRendererHandlers(rendererHandlers);
  }

  removeRendererHandlers(RendererHandlers: IConstructor<RendererHandler>[]) {
    for (const RendererHandler of RendererHandlers) {
      this._removeRendererHandler(RendererHandler);
    }
    return this.sortRendererHandlers();
  }
  removeRendererHandler(...rendererHandlers: IConstructor<RendererHandler>[]) {
    return this.removeRendererHandlers(rendererHandlers);
  }

  onUpdate() {
    for (const rendererHandler of this.rendererHandlers) {
      if (rendererHandler.getEnabled()) {
        rendererHandler.onBeforeRender();
        rendererHandler.onRender();
      }
    }
    return this;
  }
  onAfterUpdate() {
    for (const rendererHandler of this.rendererHandlers) {
      if (rendererHandler.getEnabled()) {
        rendererHandler.onAfterRender();
      }
    }
    return this;
  }

  private _addRendererHandler<R extends RendererHandler = RendererHandler>(
    rendererHandler: R
  ) {
    const RendererHandler = rendererHandler.getConstructor();

    if (!this.rendererHandlerMap.has(RendererHandler)) {
      this.rendererHandlers.push(rendererHandler);
      this.rendererHandlerMap.set(RendererHandler, rendererHandler);
      rendererHandler.UNSAFE_setRenderer(this);
      rendererHandler.onAdd();
      this.emit("add-renderer_handler", rendererHandler);
    }

    return this;
  }
  private _removeRendererHandler<R extends RendererHandler = RendererHandler>(
    RendererHandler: IConstructor<R>
  ) {
    this.getRendererHandler(RendererHandler).ifSome((rendererHandler) => {
      this.emit("remove-renderer_handler", rendererHandler);
      rendererHandler.onRemove();

      this.rendererHandlers.splice(
        this.rendererHandlers.indexOf(rendererHandler),
        1
      );
      this.rendererHandlerMap.delete(RendererHandler);
      rendererHandler.UNSAFE_removeRenderer();
    });

    return this;
  }

  private sortRendererHandlers() {
    this.rendererHandlers.sort(this.sortRendererHandlersFunction);
    return this;
  }
  private sortRendererHandlersFunction = (
    a: RendererHandler,
    b: RendererHandler
  ) => {
    return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
  };

  toJSON() {
    return {
      ...super.toJSON(),
      rendererHandlers: this.rendererHandlers.map((rendererHandler) =>
        rendererHandler.toJSON()
      ),
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    if (isJSONArray(json.rendererHandlers)) {
      this.addRendererHandlers(
        json.rendererHandlers.map((json) =>
          RendererHandler.newFromJSON(json as IJSONObject)
        )
      );
    }
    return this;
  }
}

import { RendererHandler } from "./RendererHandler";
