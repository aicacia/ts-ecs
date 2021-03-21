import { none, Option, IConstructor } from "@aicacia/core";
import { Plugin } from "../../Plugin";
import { Manager } from "../../Manager";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
import type { Renderer } from "./Renderer";
import type { IJSONObject } from "@aicacia/json";

export abstract class RendererHandler<
  R extends Renderer = Renderer
> extends ToFromJSONEventEmitter {
  static rendererHandlerPriority: number;

  static getRendererHandlerPriority() {
    return this.rendererHandlerPriority;
  }

  private renderer: Option<R> = none();
  private enabled = true;

  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled = true) {
    this.enabled = enabled;
    return this;
  }

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }
  getRendererHandlerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getRendererHandlerPriority();
  }

  UNSAFE_setRenderer(renderer: R) {
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
    return this.renderer.expect(
      `${this.getConstructor()} expected to be added to a Renderer first`
    );
  }

  getScene() {
    return this.getRenderer().flatMap((renderer) => renderer.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(`${this.getConstructor()} required scene`);
  }

  getManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getScene().flatMap((scene) => scene.getManager(Manager));
  }
  getRequiredManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(
      `${this.getConstructor()} required ${Manager} Manager`
    );
  }

  getPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P) {
    return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P) {
    return this.getPlugin(Plugin).expect(
      `${this.getConstructor()} required ${Plugin} Plugin`
    );
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
    return {
      ...super.toJSON(),
      enabled: this.enabled,
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    this.enabled = json.enabled as boolean;
    return this;
  }
}
