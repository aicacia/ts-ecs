import type { IConstructor } from "@aicacia/core";
import type { Plugin } from "../../Plugin";
import type { Manager } from "../../Manager";
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

  private renderer: R | null = null;
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
      throw new Error(
        `${this.getConstructor()} expected to be added to a Renderer first`
      );
    }
    return this.renderer;
  }

  getScene() {
    if (this.renderer) {
      return this.renderer.getScene();
    } else {
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

  getManager<M extends Manager>(Manager: IConstructor<M>) {
    const scene = this.getScene();
    if (scene) {
      return scene.getManager(Manager);
    } else {
      return null;
    }
  }
  getRequiredManager<M extends Manager>(Manager: IConstructor<M>) {
    const manager = this.getManager(Manager);
    if (!manager) {
      throw new Error(`${this.getConstructor()} required ${Manager} Manager`);
    }
    return manager;
  }

  getPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P) {
    const scene = this.getScene();
    if (scene) {
      return scene.getPlugin(Plugin);
    } else {
      return null;
    }
  }
  getRequiredPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P) {
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
