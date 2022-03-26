import type { IConstructor } from "@aicacia/core";
import type { IRequirement } from "./IRequirement";
import { DefaultManager } from "./DefaultManager";
import type { Entity } from "./Entity";
import type { Manager } from "./Manager";
import type { Plugin } from "./Plugin";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

export interface IComponentEventType {
  "add-to-scene": () => void;
  "remove-from-scene": () => void;
}

export abstract class Component extends ToFromJSONEventEmitter<IComponentEventType> {
  static Manager: IConstructor<Manager> = DefaultManager;
  static requiredComponents: IRequirement<Component>[] = [];
  static requiredPlugins: IRequirement<Plugin>[] = [];

  static getManagerConstructor<M extends Manager = Manager>(): IConstructor<M> {
    if (!this.Manager) {
      throw new Error(this + " invalid Manager `" + this.Manager + "` " + this);
    }
    return this.Manager as IConstructor<M>;
  }
  static getRequiredComponents(): IRequirement<Component>[] {
    return this.requiredComponents;
  }
  static getRequiredPlugins(): IRequirement<Plugin>[] {
    return this.requiredPlugins;
  }

  private entity: Entity | null = null;
  private manager: Manager | null = null;

  getManagerConstructor<M extends Manager = Manager>(): IConstructor<M> {
    return Object.getPrototypeOf(this).constructor.getManagerConstructor();
  }
  getRequiredComponents(): IRequirement<Component>[] {
    return Object.getPrototypeOf(this).constructor.requiredComponents;
  }
  getRequiredPlugins(): IRequirement<Plugin>[] {
    return Object.getPrototypeOf(this).constructor.requiredPlugins;
  }

  getComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): C | null {
    return this.entity ? this.entity.getComponent(Component) : null;
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): C {
    const component = this.getComponent(Component);
    if (!component) {
      throw new Error(
        `${this.getConstructor()} Component requires ${Component} Component`
      );
    }
    return component;
  }
  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    const scene = this.getScene();
    if (scene) {
      return scene.getPlugin(Plugin);
    } else {
      return null;
    }
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    const plugin = this.getPlugin(Plugin);
    if (!plugin) {
      throw new Error(
        `${this.getConstructor()} Component requires ${Plugin} Plugin`
      );
    }
    return plugin;
  }

  /**
   * @ignore
   */
  UNSAFE_setEntity(entity: Entity) {
    this.entity = entity;
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeEntity() {
    this.entity = null;
    return this;
  }
  getEntity() {
    return this.entity;
  }
  getRequiredEntity() {
    const entity = this.getEntity();
    if (!entity) {
      throw new Error(`${this.getConstructor()} Component requires an Entity`);
    }
    return entity;
  }

  getScene() {
    const entity = this.entity;
    if (entity) {
      return entity.getScene();
    } else {
      return null;
    }
  }
  getRequiredScene() {
    const svene = this.getScene();
    if (!svene) {
      throw new Error(`${this.getConstructor()} Component requires a Scene`);
    }
    return svene;
  }
  /**
   * @ignore
   */
  UNSAFE_setManager(manager: Manager) {
    this.manager = manager;
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeManager() {
    this.manager = null;
    return this;
  }
  getManager<M extends Manager = Manager>(): M | null {
    return this.manager as M;
  }
  getRequiredManager<M extends Manager = Manager>(): M {
    const manager = this.getManager();
    if (!manager) {
      throw new Error(
        `${this.getConstructor()} Component is not part of a Manager ${Object.getPrototypeOf(
          this
        ).getManagerConstructor()} Manager`
      );
    }
    return manager as M;
  }

  getSceneManager<M extends Manager = Manager>(Manager: IConstructor<M>) {
    const scene = this.getScene();
    if (scene) {
      return scene.getManager(Manager);
    } else {
      return null;
    }
  }
  getRequiredSceneManager<M extends Manager = Manager>(
    Manager: IConstructor<M>
  ) {
    const manager = this.getSceneManager(Manager);
    if (!manager) {
      throw new Error(
        `${this.getConstructor()} Component requires ${Object.getPrototypeOf(
          this
        ).getManagerConstructor()} Manager`
      );
    }
    return manager;
  }

  onInit() {
    return this;
  }
  onDetach() {
    return this;
  }
  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
}
