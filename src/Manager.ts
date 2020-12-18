import { none, Option, IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

export abstract class Manager<
  C extends Component = Component
> extends ToFromJSONEventEmitter {
  static managerPriority = 0;

  static getManagerPriority() {
    return this.managerPriority;
  }

  protected scene: Option<Scene> = none();

  /**
   * @ignore
   */
  UNSAFE_setScene(scene: Scene) {
    this.scene.replace(scene);
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeScene() {
    this.scene.clear();
    return this;
  }
  getScene(): Option<Scene> {
    return this.scene;
  }

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }
  getManagerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getManagerPriority();
  }

  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P> {
    return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getConstructor()} required ${Plugin} Plugin`
    );
  }

  getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M> {
    return this.getScene().flatMap((scene) => scene.getManager(Manager));
  }
  getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>): M {
    return this.getManager(Manager).expect(
      `${this.getConstructor()} required ${Manager} Manager`
    );
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

import { Component } from "./Component";
import { Plugin } from "./Plugin";
import { Scene } from "./Scene";
