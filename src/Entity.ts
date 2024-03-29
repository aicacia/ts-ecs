import { IJSONObject, isJSONArray } from "@aicacia/json";
import type { IConstructor } from "@aicacia/core";
import {
  filterRequirements,
  IRequirement,
  requirementToString,
} from "./IRequirement";
import { Component } from "./Component";
import type { Plugin } from "./Plugin";
import type { Scene } from "./Scene";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

export interface IEntityEventTypes {
  "add-component": (component: Component) => void;
  "remove-component": (component: Component) => void;
  "add-child": (child: Entity) => void;
  "remove-child": (child: Entity) => void;
}

export class Entity extends ToFromJSONEventEmitter<IEntityEventTypes> {
  private name: string | null = null;
  private depth = 0;
  private scene: Scene | null = null;
  private root: Entity = this;
  private parent: Entity | null = null;
  private tags: Set<string> = new Set();
  private children: Entity[] = [];
  private components: Map<IConstructor<Component>, Component> = new Map();

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  removeName() {
    this.name = null;
    return this;
  }

  hasTags(tags: string[]) {
    return tags.every((tag) => this.tags.has(tag));
  }
  hasTag(...tags: string[]) {
    return this.hasTags(tags);
  }
  getTags() {
    return this.tags;
  }
  addTags(tags: string[]) {
    for (const tag of tags) {
      this.tags.add(tag);
    }
    return this;
  }
  removeTag(...tags: string[]) {
    return this.removeTags(tags);
  }
  removeTags(tags: string[]) {
    for (const tag of tags) {
      this.tags.delete(tag);
    }
    return this;
  }
  clearTags() {
    this.tags.clear();
    return this;
  }
  addTag(...tags: string[]) {
    return this.addTags(tags);
  }

  getDepth() {
    return this.depth;
  }
  getRoot() {
    return this.root;
  }
  isRoot() {
    return this.root === this;
  }

  hasParent(): boolean {
    return this.parent !== null;
  }
  getParent() {
    return this.parent;
  }

  hasScene() {
    return this.scene !== null;
  }
  getScene() {
    return this.scene;
  }
  getRequiredScene() {
    const scene = this.getScene();
    if (!scene) {
      throw new Error("Entity expected to have a Scene");
    }
    return scene;
  }
  /**
   * @ignore
   */
  UNSAFE_setScene(scene: Scene, recur = false) {
    this.scene = scene;
    if (recur) {
      for (const child of this.children) {
        child.UNSAFE_setScene(scene, recur);
      }
    }
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeScene() {
    this.scene = null;
    return this;
  }

  forEachChild(fn: (entity: Entity) => false | void, recur = true) {
    for (const child of this.getChildren()) {
      if (fn(child) === false) {
        break;
      }

      if (recur) {
        child.forEachChild(fn, recur);
      }
    }
    return this;
  }
  find(fn: (entity: Entity) => boolean, recur = true): Entity | undefined {
    for (const child of this.getChildren()) {
      if (fn(child)) {
        return child;
      } else if (recur) {
        const found = child.find(fn, recur);

        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }
  findWithName(name: string) {
    return this.find((child) => child.name === name);
  }
  findWithTag(...tags: string[]) {
    return this.find((entity) => entity.hasTags(tags));
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithComponent<C extends Component>(Component: IConstructor<C>) {
    return this.find((entity) => entity.getComponent(Component) !== null);
  }

  findAll(fn: (entity: Entity) => boolean, recur = true): Entity[] {
    const children = this.getChildren(),
      matching = [];

    for (const child of children) {
      if (fn(child)) {
        matching.push(child);
      } else if (recur) {
        matching.push(...child.findAll(fn, recur));
      }
    }

    return matching;
  }
  findAllWithName(name: string, recur = true) {
    return this.findAll((child) => name === child.name, recur);
  }
  findAllWithTag(...tags: string[]) {
    return this.findAll((entity) => entity.hasTags(tags));
  }
  findAllWithTags(tags: string[]) {
    return this.findAllWithTag(...tags);
  }
  findAllWithComponent<C extends Component>(
    Component: IConstructor<C>,
    recur = true
  ) {
    return this.findAll(
      (entity) => entity.getComponent(Component) !== null,
      recur
    );
  }

  findParent(fn: (entity: Entity) => boolean): Entity | undefined {
    const parent = this.getParent();

    if (parent) {
      if (fn(parent)) {
        return parent;
      } else {
        return parent.findParent(fn);
      }
    } else {
      return undefined;
    }
  }

  getComponents() {
    return this.components;
  }
  hasComponent<C extends Component = Component>(Component: IConstructor<C>) {
    return this.getComponent(Component) !== null;
  }
  getComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): C | null {
    return (this.components.get(Component) as C) || null;
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    const component = this.getComponent(Component);
    if (!component) {
      throw new Error(`Entity expected to have a ${Component} Component`);
    }
    return component;
  }
  getComponentInstanceOf<C extends Component = Component>(
    Component: IConstructor<C>
  ): C | null {
    for (const component of this.components.values()) {
      if (component instanceof Component) {
        return component;
      }
    }
    return null;
  }
  getComponentsInstanceOf<C extends Component = Component>(
    Component: IConstructor<C>
  ): C[] {
    return Array.from(this.components.values()).filter(
      (component) => component instanceof Component
    ) as C[];
  }

  addComponents(components: Component[]) {
    for (const component of components) {
      this._addComponent(component);
    }
    return this;
  }
  addComponent(...components: Component[]) {
    return this.addComponents(components);
  }

  removeComponents(Components: IConstructor<Component>[]) {
    for (const Component of Components) {
      this._removeComponent(Component);
    }
    return this;
  }
  removeComponent(...components: IConstructor<Component>[]) {
    return this.removeComponents(components);
  }

  removeFromScene() {
    const scene = this.scene;
    if (scene) {
      scene.removeEntity(this);
    }
  }
  detach() {
    const parent = this.parent;
    if (parent) {
      parent._removeChild(this);
      const scene = this.scene;

      if (scene) {
        scene.addEntity(this);
      }
      for (const component of this.components.values()) {
        component.onDetach();
      }
    }
  }
  getChildren(): readonly Entity[] {
    return this.children;
  }
  addChildren(children: Entity[]) {
    for (const child of children) {
      this._addChild(child);
    }
    return this;
  }
  addChild(...children: Entity[]) {
    return this.addChildren(children);
  }

  removeChildren(children: Entity[]) {
    for (const child of children) {
      this._removeChild(child);
    }
    return this;
  }
  removeChild(...children: Entity[]) {
    return this.removeChildren(children);
  }

  validateRequirements() {
    const missingComponents: Map<
        IConstructor<Component>,
        IRequirement<Component>[]
      > = new Map(),
      missingPlugins: Map<
        IConstructor<Component>,
        IRequirement<Plugin>[]
      > = new Map();

    for (const [Component, component] of this.components) {
      const missingRequiredComponents = filterRequirements(
          component.getRequiredComponents(),
          (C) => !this.hasComponent(C)
        ),
        missingRequiredPlugins = filterRequirements(
          component.getRequiredPlugins(),
          (P) => !this.getRequiredScene().hasPlugin(P)
        );

      if (missingRequiredComponents.length > 0) {
        missingComponents.set(Component, missingRequiredComponents);
      }
      if (missingRequiredComponents.length > 0) {
        missingPlugins.set(Component, missingRequiredPlugins);
      }
    }

    if (missingComponents.size > 0 || missingPlugins.size > 0) {
      const componentMessage = [...missingComponents.entries()]
          .map(([component, missingRequirements]) =>
            missingRequirements
              .map(
                (missingRequirement) =>
                  `Entity's ${requirementToString(
                    component
                  )} requires ${requirementToString(
                    missingRequirement
                  )} Component`
              )
              .join("\n")
          )
          .join("\n"),
        pluginMessage = [...missingPlugins.entries()]
          .map(([component, missingRequirements]) =>
            missingRequirements
              .map(
                (missingRequirement) =>
                  `Entity's ${requirementToString(
                    component
                  )} requires ${requirementToString(missingRequirement)} Plugin`
              )
              .join("\n")
          )
          .join("\n");

      throw new Error(
        componentMessage
          ? `${componentMessage}\n${pluginMessage}`
          : pluginMessage
      );
    }
  }

  private _addComponent<C extends Component>(component: C) {
    const Component = component.getConstructor();

    if (!this.components.has(Component)) {
      component.UNSAFE_setEntity(this);

      this.components.set(Component, component);
      this.scene?.UNSAFE_addComponent(component);
      this.emit("add-component", component);
    }
    return this;
  }

  private _removeComponent<C extends Component>(Component: IConstructor<C>) {
    const component = this.getComponent(Component);

    if (component) {
      this.emit("remove-component", component);
      component.UNSAFE_removeEntity();

      this.components.delete(Component);
      this.scene?.UNSAFE_removeComponent(component);
    }
    return this;
  }

  private _addChild(child: Entity) {
    if (this.children.indexOf(child) === -1) {
      if (child.isRoot()) {
        child.scene?.removeEntity(child);
      }
      child.parent?._removeChild(child);

      this.children.push(child);

      child.parent = this;
      child.root = this.root;
      child.setDepth(this.depth + 1);
      this.scene?.UNSAFE_addEntityNow(child, true);

      this.emit("add-child", child);
    }
    return this;
  }
  private _removeChild(child: Entity) {
    this.scene?.UNSAFE_removeEntityNow(child);
    this.UNSAFE_removeChild(child);
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeChild(child: Entity) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.emit("remove-child", child);
      this.children.splice(index, 1);

      child.scene = null;
      child.parent = null;
      child.root = child;
      child.setDepth(0);
    }
    return this;
  }

  private setDepth(depth: number) {
    this.depth = depth;
    for (const child of this.children) {
      child.setDepth(depth + 1);
    }
    return this;
  }

  toJSON(): IJSONObject {
    return {
      ...super.toJSON(),
      name: this.name,
      tags: [...this.tags.values()],
      children: this.children.map((child) => child.toJSON()),
      components: [...this.components.values()].map((component) =>
        component.toJSON()
      ),
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    if (json.name) {
      this.name = json.name as string;
    }
    if (isJSONArray(json.tags)) {
      this.addTags(json.tags as string[]);
    }
    if (isJSONArray(json.children)) {
      this.addChildren(
        json.children.map((childJSON) =>
          new Entity().fromJSON(childJSON as IJSONObject)
        )
      );
    }
    if (isJSONArray(json.components)) {
      this.addComponents(
        json.components.map(
          (componentJSON) =>
            Component.newFromJSON(componentJSON as IJSONObject) as Component
        )
      );
    }
    return this;
  }
}
