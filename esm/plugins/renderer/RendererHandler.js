import { none } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
export class RendererHandler extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.renderer = none();
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
        this.renderer.replace(renderer);
        return this;
    }
    UNSAFE_removeRenderer() {
        this.renderer.clear();
        return this;
    }
    getRenderer() {
        return this.renderer;
    }
    getRequiredRenderer() {
        return this.renderer.expect(`${this.getConstructor()} expected to be added to a Renderer first`);
    }
    getScene() {
        return this.getRenderer().flatMap((renderer) => renderer.getScene());
    }
    getRequiredScene() {
        return this.getScene().expect(`${this.getConstructor()} required scene`);
    }
    getManager(Manager) {
        return this.getScene().flatMap((scene) => scene.getManager(Manager));
    }
    getRequiredManager(Manager) {
        return this.getManager(Manager).expect(`${this.getConstructor()} required ${Manager} Manager`);
    }
    getPlugin(Plugin) {
        return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
    }
    getRequiredPlugin(Plugin) {
        return this.getPlugin(Plugin).expect(`${this.getConstructor()} required ${Plugin} Plugin`);
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
