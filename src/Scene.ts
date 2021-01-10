import { IJSONObject, isJSONArray } from "@aicacia/json";
import { none, Option, some, IConstructor } from "@aicacia/core";
import type { Component } from "./Component";
import { Entity } from "./Entity";
import type { Manager } from "./Manager";
import { Plugin } from "./Plugin";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

// tslint:disable-next-line: interface-name
export interface Scene {
  on(event: "maintain" | "update", listener: () => void): this;
  on(
    event: "add-component" | "remove-component",
    listener: (component: Component) => void
  ): this;
  on(
    event: "add-plugin" | "remove-plugin",
    listener: (entity: Plugin) => void
  ): this;
  on(
    event: "add-entity" | "remove-entity",
    listener: (entity: Entity) => void
  ): this;
  off(event: "maintain" | "update", listener: () => void): this;
  off(
    event: "add-component" | "remove-component",
    listener: (component: Component) => void
  ): this;
  off(
    event: "add-plugin" | "remove-plugin",
    listener: (entity: Plugin) => void
  ): this;
  off(
    event: "add-entity" | "remove-entity",
    listener: (entity: Entity) => void
  ): this;
}

export class Scene extends ToFromJSONEventEmitter {
  private name: Option<string> = none();

  private entities: Entity[] = [];
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: Entity[] = [];

  private managers: Manager[] = [];
  private managerMap: Map<IConstructor<Manager>, Manager> = new Map();

  private plugins: Plugin[] = [];
  private pluginsMap: Map<IConstructor<Plugin>, Plugin> = new Map();

  private isUpdating = false;
  private isInitted = false;

  init() {
    if (!this.isInitted) {
      this.isInitted = true;
      this.emit("init");
      this.maintain();
      for (const plugin of this.plugins) {
        plugin.onInit();
      }
      this.isInitted = true;
    }
    return this;
  }

  maintain(emit = true) {
    emit && this.emit("maintain");
    for (const entity of this.entitiesToRemove) {
      this.removeEntityNow(entity, true);
    }
    this.entitiesToRemove.length = 0;
    for (const entity of this.entitiesToAdd) {
      this.addEntityNow(entity, true);
    }
    this.entitiesToAdd.length = 0;
    return this;
  }

  update() {
    this.init();
    this.isUpdating = true;
    this.emit("update");
    this.maintain();
    for (const plugin of this.plugins) {
      plugin.onUpdate();
    }
    for (const manager of this.managers) {
      manager.onUpdate();
    }
    for (const manager of this.managers) {
      manager.onAfterUpdate();
    }
    for (const plugin of this.plugins) {
      plugin.onAfterUpdate();
    }
    this.isUpdating = false;
    return this;
  }

  clear() {
    this.emit("clear");
    this.removeEntities(this.entities);
    this.removePlugin(...this.pluginsMap.keys());
    return this;
  }

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name.replace(name);
    return this;
  }
  removeName() {
    this.name.take();
    return this;
  }

  forEachEntity(fn: (entity: Entity) => false | void, recur = true) {
    for (const entity of this.entities) {
      if (fn(entity) === false) {
        break;
      }

      if (recur) {
        entity.forEachChild(fn, recur);
      }
    }
    return this;
  }
  find(fn: (entity: Entity) => boolean, recur = true): Option<Entity> {
    for (const entity of this.entities) {
      if (fn(entity)) {
        return some(entity);
      } else if (recur) {
        const found = entity.find(fn, recur);

        if (found.isSome()) {
          return found;
        }
      }
    }

    return none();
  }
  findWithTag(...tags: string[]) {
    return this.find((entity) => entity.hasTags(tags), true);
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithName(name: string) {
    return this.find(
      (entity) =>
        entity
          .getName()
          .map((entityName) => entityName === name)
          .unwrapOr(false),
      true
    );
  }

  findAll(fn: (entity: Entity) => boolean, recur = true): Entity[] {
    const matching = [];

    for (const entity of this.entities) {
      if (fn(entity)) {
        matching.push(entity);
      } else if (recur) {
        matching.push(...entity.findAll(fn, recur));
      }
    }

    return matching;
  }
  findAllWithTag(...tags: string[]) {
    return this.findAll((entity) => entity.hasTags(tags), true);
  }
  findAllWithTags(tags: string[]) {
    return this.findAllWithTag(...tags);
  }
  findAllWithName(name: string) {
    return this.findAll(
      (entity) =>
        entity
          .getName()
          .map((entityName) => entityName === name)
          .unwrapOr(false),
      true
    );
  }

  getEntities(): readonly Entity[] {
    return this.entities;
  }

  getManagers(): readonly Manager[] {
    return this.managers;
  }

  getManager<M extends Manager>(Manager: IConstructor<M>): Option<M> {
    return Option.from(this.managerMap.get(Manager)) as Option<M>;
  }
  getRequiredManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(`Scene required ${Manager} Manager`);
  }

  getPlugins(): readonly Plugin[] {
    return this.plugins;
  }

  hasPlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).isSome();
  }
  getPlugin<P extends Plugin>(Plugin: IConstructor<P>): Option<P> {
    return Option.from(this.pluginsMap.get(Plugin)) as Option<P>;
  }
  getRequiredPlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(`Scene required ${Plugin} Plugin`);
  }

  addPlugins(plugins: Plugin[]) {
    for (const plugin of plugins) {
      this._addPlugin(plugin);
    }
    return this.sortPlugins();
  }
  addPlugin(...plugins: Plugin[]) {
    return this.addPlugins(plugins);
  }

  removePlugins(Plugins: IConstructor<Plugin>[]) {
    for (const Plugin of Plugins) {
      this._removePlugin(Plugin);
    }
    return this;
  }
  removePlugin(...plugins: IConstructor<Plugin>[]) {
    return this.removePlugins(plugins);
  }

  addEntities(entities: Entity[]) {
    this.entitiesToAdd.push(...entities);
    return this;
  }
  addEntity(...entities: Entity[]) {
    return this.addEntities(entities);
  }

  removeEntities(entities: Entity[]) {
    this.entitiesToRemove.push(...entities);
    return this;
  }
  removeEntity(...entities: Entity[]) {
    return this.removeEntities(entities);
  }

  addEntityNow(entity: Entity, force = false) {
    if (this.isUpdating && !force) {
      throw new Error(
        "Scene.addEntityNow called while updating, use force to suppress this Error"
      );
    }
    return this.UNSAFE_addEntityNow(entity, false);
  }

  removeEntityNow(entity: Entity, force = false) {
    if (this.isUpdating && !force) {
      throw new Error(
        "Scene.removeEntityNow called while updating, use force to suppress this Error"
      );
    }
    return this.UNSAFE_removeEntityNow(entity);
  }

  /**
   * @ignore
   */
  UNSAFE_addComponent(component: Component) {
    const Manager: IConstructor<Manager> = component.getManagerConstructor();

    const managerOption = this.getManager(Manager);
    let manager: Manager;

    if (managerOption.isNone()) {
      manager = new Manager();

      manager.UNSAFE_setScene(this);

      this.managers.push(manager);
      this.managerMap.set(Manager, manager);
      this.sortManagers();

      manager.onAdd();
    } else {
      manager = managerOption.unwrap();
    }

    manager.addComponent(component);
    component.UNSAFE_setManager(manager);

    manager.sort();
    component.onAdd();

    component.emit("add-to-scene");
    this.emit("add-component", component);

    return this;
  }

  /**
   * @ignore
   */
  UNSAFE_removeComponent(component: Component) {
    const Manager: IConstructor<Manager> = component.getManagerConstructor();

    const managerOption = this.getManager(Manager);

    this.emit("remove-component", component);
    component.emit("remove-from-scene");

    managerOption.ifSome((manager) => {
      component.onRemove();

      manager.removeComponent(component);
      component.UNSAFE_removeManager();

      if (manager.isEmpty()) {
        manager.onRemove();

        this.managers.splice(this.managers.indexOf(manager), 1);
        this.managerMap.delete(Manager);
      }
    });

    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_addEntityNow(entity: Entity, isChild: boolean) {
    const entitySceneOption = entity.getScene();

    if (entitySceneOption.isSome()) {
      const entityScene = entitySceneOption.unwrap();

      if (entityScene === this) {
        throw new Error(
          "Scene trying to add an Entity that is already a member of the Scene"
        );
      } else {
        entityScene.removeEntityNow(entity, true);
      }
    }

    if (entity.isRoot()) {
      this.entities.push(entity);
    } else if (!isChild) {
      throw new Error(
        "Scene trying to add an Entity that already has a parent"
      );
    }

    entity.UNSAFE_setScene(this);
    for (const component of entity.getComponents().values()) {
      this.UNSAFE_addComponent(component);
    }
    for (const child of entity.getChildren()) {
      this.UNSAFE_addEntityNow(child, true);
    }

    if (process.env.NODE_ENV !== "production") {
      entity.validateRequirements();
    }

    this.emit("add-entity", entity);

    return this;
  }

  /**
   * @ignore
   */
  UNSAFE_removeEntityNow(entity: Entity) {
    const entitySceneOption = entity.getScene();

    if (entitySceneOption.isSome()) {
      const entityScene = entitySceneOption.unwrap();

      if (entityScene !== this) {
        throw new Error(
          "Scene trying to remove an Entity that is not a member of the Scene"
        );
      }
    }

    for (const component of entity.getComponents().values()) {
      this.UNSAFE_removeComponent(component);
    }

    if (entity.isRoot()) {
      const index = this.entities.indexOf(entity);

      if (index !== -1) {
        this.entities.splice(index, 1);
        entity.UNSAFE_removeScene();
      }
    } else {
      entity.getParent().ifSome((parent) => parent.UNSAFE_removeChild(entity));
    }

    for (const child of entity.getChildren().slice()) {
      this.removeEntityNow(child, true);
    }
    this.emit("remove-entity", entity);

    return this;
  }

  private _addPlugin<P extends Plugin>(plugin: P) {
    const Plugin: IConstructor<Plugin> = plugin.getConstructor();

    if (!this.hasPlugin(Plugin)) {
      const Plugin: IConstructor<Plugin> = plugin.getConstructor();

      this.plugins.push(plugin);
      this.pluginsMap.set(Plugin, plugin);
      plugin.UNSAFE_setScene(this);
      if (this.isInitted) {
        plugin.onInit();
      }
      plugin.onAdd();
      if (process.env.NODE_ENV !== "production") {
        plugin.validateRequirements();
      }
      this.emit("add-plugin", plugin);
    }
    return this;
  }
  private _removePlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    this.getPlugin(Plugin).ifSome((plugin) => {
      this.emit("remove-plugin", plugin);
      plugin.onRemove();
      plugin.UNSAFE_removeScene();
      this.plugins.splice(this.plugins.indexOf(plugin), 1);
      this.pluginsMap.delete(Plugin);
    });

    return this;
  }

  private sortPlugins() {
    this.plugins.sort(this.sortPluginsFunction);
    return this;
  }
  private sortPluginsFunction = (a: Plugin, b: Plugin) => {
    return a.getPluginPriority() - b.getPluginPriority();
  };

  private sortManagers() {
    this.managers.sort(this.managerSortFunction);
    return this;
  }
  private managerSortFunction(a: Manager, b: Manager) {
    return a.getManagerPriority() - b.getManagerPriority();
  }

  toJSON(): IJSONObject {
    return {
      ...super.toJSON(),
      name: this.name.unwrapOr(null as any),
      plugins: this.plugins
        .filter((plugin) =>
          (plugin.getConstructor() as any).isToFromJSONEnabled()
        )
        .map((plugin) => plugin.toJSON()),
      entities: this.entities.map((entity) => entity.toJSON()),
    };
  }

  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    if (json.name) {
      this.name.replace(json.name as string);
    }
    if (isJSONArray(json.plugins)) {
      this.addPlugins(
        (json.plugins as Array<IJSONObject>).map((plugin) =>
          Plugin.newFromJSON(plugin)
        )
      );
    }
    if (isJSONArray(json.entities)) {
      this.addEntities(
        json.entities.map((entity) =>
          new Entity().fromJSON(entity as IJSONObject)
        )
      );
    }
    return this.maintain(false);
  }
}
