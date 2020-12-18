import { none, Option, IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

// tslint:disable-next-line: interface-name
export interface Component {
  on(event: "add-to-scene" | "remove-from-scene", listener: () => void): this;
}

export abstract class Component extends ToFromJSONEventEmitter {
  static Manager: IConstructor<Manager>;
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

  private entity: Option<Entity> = none();
  private manager: Option<Manager> = none();

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
  ): Option<C> {
    return this.getEntity().flatMap((entity) => entity.getComponent(Component));
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): C {
    return this.getComponent(Component).expect(
      `${this.getConstructor()} Component requires ${Component} Component`
    );
  }
  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getConstructor()} Component requires ${Plugin} Plugin`
    );
  }

  /**
   * @ignore
   */
  UNSAFE_setEntity(entity: Entity) {
    this.entity.replace(entity);
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeEntity() {
    this.entity.clear();
    return this;
  }
  getEntity() {
    return this.entity;
  }
  getRequiredEntity() {
    return this.getEntity().expect(
      `${this.getConstructor()} Component requires an Entity`
    );
  }

  getScene() {
    return this.entity.flatMap((entity) => entity.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(
      `${this.getConstructor()} Component requires a Scene`
    );
  }
  /**
   * @ignore
   */
  UNSAFE_setManager(manager: Manager) {
    this.manager.replace(manager);
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeManager() {
    this.manager.clear();
    return this;
  }
  getManager<M extends Manager = Manager>() {
    return this.manager as Option<M>;
  }
  getRequiredManager<M extends Manager = Manager>() {
    return this.getManager<M>().expect(
      `${this.getConstructor()} Component is not part of a Manager ${Object.getPrototypeOf(
        this
      ).getManagerConstructor()} Manager`
    );
  }

  getSceneManager<M extends Manager = Manager>(Manager: IConstructor<M>) {
    return this.getScene().flatMap((scene) => scene.getManager(Manager));
  }
  getRequiredSceneManager<M extends Manager = Manager>(
    Manager: IConstructor<M>
  ) {
    return this.getSceneManager(Manager).expect(
      `${this.getConstructor()} Component requires ${Object.getPrototypeOf(
        this
      ).getManagerConstructor()} Manager`
    );
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

import { IRequirement } from "./IRequirement";
import { DefaultManager } from "./DefaultManager";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";

Component.Manager = DefaultManager;
