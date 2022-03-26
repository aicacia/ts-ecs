import type { IConstructor } from "@aicacia/core";
import type { Component } from "./Component";
import type { Plugin } from "./Plugin";
import type { Scene } from "./Scene";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

export abstract class Manager<
  C extends Component = Component
> extends ToFromJSONEventEmitter {
  static managerPriority = 0;

  static getManagerPriority() {
    return this.managerPriority;
  }

  protected scene: Scene | null = null;

  /**
   * @ignore
   */
  UNSAFE_setScene(scene: Scene) {
    this.scene = scene;
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeScene() {
    this.scene = null;
    return this;
  }
  getScene() {
    return this.scene;
  }

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }
  getManagerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getManagerPriority();
  }

  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P | null {
    const scene = this.getScene();
    if (scene) {
      return scene.getPlugin(Plugin);
    } else {
      return null;
    }
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    const plugin = this.getPlugin<P>(Plugin);
    if (!plugin) {
      throw new Error(`${this.getConstructor()} required ${Plugin} Plugin`);
    }
    return plugin;
  }

  getManager<M extends Manager = Manager>(Manager: IConstructor<M>): M | null {
    const scene = this.getScene();
    if (scene) {
      return scene.getManager(Manager);
    } else {
      return null;
    }
  }
  getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>): M {
    const manager = this.getManager(Manager);
    if (!manager) {
      throw new Error(`${this.getConstructor()} required ${Manager} Manager`);
    }
    return manager;
  }

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }

  abstract addComponent(component: C): this;
  abstract removeComponent(component: C): this;
  abstract isEmpty(): boolean;
  abstract sort(): this;
  abstract onInit(): this;
  abstract onUpdate(): this;
  abstract onAfterUpdate(): this;
}
