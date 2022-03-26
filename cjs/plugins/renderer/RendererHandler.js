"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererHandler = void 0;
const ToFromJSONEventEmitter_1 = require("../../ToFromJSONEventEmitter");
class RendererHandler extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.renderer = null;
        this.enabled = true;
    }
    static getRendererHandlerPriority() {
        return this.rendererHandlerPriority;
    }
    getEnabled() {
        return this.enabled;
    }
    setEnabled(enabled = true) {
        this.enabled = enabled;
        return this;
    }
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    getRendererHandlerPriority() {
        return Object.getPrototypeOf(this).constructor.getRendererHandlerPriority();
    }
    UNSAFE_setRenderer(renderer) {
        this.renderer = renderer;
        return this;
    }
    UNSAFE_removeRenderer() {
        this.renderer = null;
        return this;
    }
    getRenderer() {
        return this.renderer;
    }
    getRequiredRenderer() {
        if (!this.renderer) {
            throw new Error(`${this.getConstructor()} expected to be added to a Renderer first`);
        }
        return this.renderer;
    }
    getScene() {
        if (this.renderer) {
            return this.renderer.getScene();
        }
        else {
            return null;
        }
    }
    getRequiredScene() {
        const scene = this.getScene();
        if (!scene) {
            throw new Error(`${this.getConstructor()} required scene`);
        }
        return scene;
    }
    getManager(Manager) {
        const scene = this.getScene();
        if (scene) {
            return scene.getManager(Manager);
        }
        else {
            return null;
        }
    }
    getRequiredManager(Manager) {
        const manager = this.getManager(Manager);
        if (!manager) {
            throw new Error(`${this.getConstructor()} required ${Manager} Manager`);
        }
        return manager;
    }
    getPlugin(Plugin) {
        const scene = this.getScene();
        if (scene) {
            return scene.getPlugin(Plugin);
        }
        else {
            return null;
        }
    }
    getRequiredPlugin(Plugin) {
        const plugin = this.getPlugin(Plugin);
        if (!plugin) {
            throw new Error(`${this.getConstructor()} required ${Plugin} Plugin`);
        }
        return plugin;
    }
    onAdd() {
        return this;
    }
    onRemove() {
        return this;
    }
    onBeforeRender() {
        return this;
    }
    onRender() {
        return this;
    }
    onAfterRender() {
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { enabled: this.enabled });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.enabled = json.enabled;
        return this;
    }
}
exports.RendererHandler = RendererHandler;
