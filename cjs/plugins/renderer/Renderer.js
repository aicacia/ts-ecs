"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const json_1 = require("@aicacia/json");
const Plugin_1 = require("../../Plugin");
class Renderer extends Plugin_1.Plugin {
    constructor() {
        super(...arguments);
        this.rendererHandlers = [];
        this.rendererHandlerMap = new Map();
        this.sortRendererHandlersFunction = (a, b) => {
            return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
        };
    }
    getRendererHandlers() {
        return this.rendererHandlers;
    }
    getRendererHandler(RendererHandler) {
        return this.rendererHandlerMap.get(RendererHandler) || null;
    }
    addRendererHandlers(rendererHandlers) {
        for (const rendererHandler of rendererHandlers) {
            this._addRendererHandler(rendererHandler);
        }
        return this.sortRendererHandlers();
    }
    addRendererHandler(...rendererHandlers) {
        return this.addRendererHandlers(rendererHandlers);
    }
    removeRendererHandlers(RendererHandlers) {
        for (const RendererHandler of RendererHandlers) {
            this._removeRendererHandler(RendererHandler);
        }
        return this.sortRendererHandlers();
    }
    removeRendererHandler(...rendererHandlers) {
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
    _addRendererHandler(rendererHandler) {
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
    _removeRendererHandler(RendererHandler) {
        const rendererHandler = this.rendererHandlerMap.get(RendererHandler);
        if (rendererHandler) {
            this.emit("remove-renderer_handler", rendererHandler);
            rendererHandler.onRemove();
            this.rendererHandlers.splice(this.rendererHandlers.indexOf(rendererHandler), 1);
            this.rendererHandlerMap.delete(RendererHandler);
            rendererHandler.UNSAFE_removeRenderer();
        }
        return this;
    }
    sortRendererHandlers() {
        this.rendererHandlers.sort(this.sortRendererHandlersFunction);
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { rendererHandlers: this.rendererHandlers.map((rendererHandler) => rendererHandler.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if ((0, json_1.isJSONArray)(json.rendererHandlers)) {
            this.addRendererHandlers(json.rendererHandlers.map((json) => RendererHandler_1.RendererHandler.newFromJSON(json)));
        }
        return this;
    }
}
exports.Renderer = Renderer;
Renderer.pluginPriority = Infinity;
const RendererHandler_1 = require("./RendererHandler");
