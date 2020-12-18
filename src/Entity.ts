import { IJSONObject, isJSONArray } from "@aicacia/json";
import { none, Option, some, IConstructor, iter } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

// tslint:disable-next-line: interface-name
export interface Entity {
  on(
    event: "add-component" | "remove-component",
    listener: (component: Component) => void
  ): this;
  on(
    event: "add-child" | "remove-child",
    listener: (child: Entity) => void
  ): this;
}

export class Entity extends ToFromJSONEventEmitter {
  private name: Option<string> = none();
  private depth = 0;
  private scene: Option<Scene> = none();
  private root: Entity = this;
  private parent: Option<Entity> = none();
  private tags: Set<string> = new Set();
  private children: Entity[] = [];
  private components: Map<IConstructor<Component>, Component> = new Map();

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
    tags.forEach((tag) => this.tags.add(tag));
    return this;
  }
  removeTag(...tags: string[]) {
    return this.removeTags(tags);
  }
  removeTags(tags: string[]) {
    tags.forEach((tag) => this.tags.delete(tag));
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
    return this.parent.isSome();
  }
  getParent(): Option<Entity> {
    return this.parent;
  }

  hasScene() {
    return this.scene.isSome();
  }
  getScene(): Option<Scene> {
    return this.scene;
  }
  getRequiredScene() {
    return this.getScene().expect("Entity expected to have a Scene");
  }
  /**
   * @ignore
   */
  UNSAFE_setScene(scene: Scene, recur = false) {
    this.scene.replace(scene);
    if (recur) {
      this.forEachChild((child) => child.UNSAFE_setScene(scene, recur), false);
    }
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeScene() {
    this.scene.clear();
    return this;
  }

  forEachChild(fn: (entity: Entity) => void, recur = true) {
    this.getChildren().forEach((child) => {
      fn(child);

      if (recur) {
        child.forEachChild(fn, recur);
      }
    });
    return this;
  }
  find(fn: (entity: Entity) => boolean, recur = true): Option<Entity> {
    const children = this.getChildren();

    for (const child of children) {
      if (fn(child)) {
        return some(child);
      } else if (recur) {
        const found = child.find(fn, recur);

        if (found.isSome()) {
          return found;
        }
      }
    }

    return none();
  }
  findWithName(name: string) {
    return this.find((child) =>
      child.name.map((childName) => childName === name).unwrapOr(false)
    );
  }
  findWithTag(...tags: string[]) {
    return this.find((entity) => entity.hasTags(tags));
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithComponent<C extends Component>(Component: IConstructor<C>) {
    return this.find((entity) => entity.getComponent(Component).isSome());
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
    return this.findAll(
      (child) =>
        child.name.map((childName) => childName === name).unwrapOr(false),
      recur
    );
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
      (entity) => entity.getComponent(Component).isSome(),
      recur
    );
  }

  findParent(fn: (entity: Entity) => boolean): Option<Entity> {
    return this.getParent().flatMap((parent) => {
      if (fn(parent)) {
        return some(parent);
      } else {
        return parent.findParent(fn);
      }
    });
  }

  getComponents() {
    return this.components;
  }
  hasComponent<C extends Component = Component>(Component: IConstructor<C>) {
    return this.getComponent(Component).isSome();
  }
  getComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): Option<C> {
    return Option.from(this.components.get(Component) as C);
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return this.getComponent(Component).expect(
      `Entity expected to have a ${Component} Component`
    );
  }
  getComponentInstanceOf<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return iter(this.components.values()).find(
      (component) => component instanceof Component
    ) as Option<C>;
  }
  getComponentsInstanceOf<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return iter(this.components.values())
      .filter((component) => component instanceof Component)
      .toArray() as C[];
  }

  addComponents(components: Component[]) {
    components.forEach((component) => this._addComponent(component));
    return this;
  }
  addComponent(...components: Component[]) {
    return this.addComponents(components);
  }

  removeComponents(components: IConstructor<Component>[]) {
    components.forEach((component) => this._removeComponent(component));
    return this;
  }
  removeComponent(...components: IConstructor<Component>[]) {
    return this.removeComponents(components);
  }

  removeFromScene() {
    this.scene.ifSome((scene) => {
      scene.removeEntity(this);
    });
  }
  detach() {
    this.parent.ifSome((parent) => {
      parent._removeChild(this);
      this.scene.ifSome((scene) => scene.addEntity(this));
      for (const component of this.components.values()) {
        component.onDetach();
      }
    });
  }
  getChildren(): readonly Entity[] {
    return this.children;
  }
  addChildren(children: Entity[]) {
    children.forEach((child) => this._addChild(child));
    return this;
  }
  addChild(...children: Entity[]) {
    return this.addChildren(children);
  }

  removeChildren(children: Entity[]) {
    children.forEach((child) => this._removeChild(child));
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

      this.scene.ifSome((scene) => scene.UNSAFE_addComponent(component));
      this.emit("add-component", component);
    }
    return this;
  }

  private _removeComponent<C extends Component>(Component: IConstructor<C>) {
    const componentOption = this.getComponent(Component);

    componentOption.ifSome((component) => {
      this.emit("remove-component", component);
      component.UNSAFE_removeEntity();

      this.components.delete(Component);

      this.scene.ifSome((scene) => scene.UNSAFE_removeComponent(component));
    });
    return this;
  }

  private _addChild(child: Entity) {
    if (this.children.indexOf(child) === -1) {
      if (child.isRoot()) {
        child.scene.ifSome((scene) => scene.removeEntity(child));
      }
      child.parent.ifSome((parent) => parent._removeChild(child));

      this.children.push(child);

      child.parent.replace(this);
      child.root = this.root;
      child.setDepth(this.depth + 1);
      this.scene.ifSome((scene) => scene.UNSAFE_addEntityNow(child, true));

      this.emit("add-child", child);
    }
    return this;
  }
  private _removeChild(child: Entity) {
    this.scene.ifSome((scene) => scene.UNSAFE_removeEntityNow(child));
    this.UNSAFE_removeChild(child);
    return this;
  }
  UNSAFE_removeChild(child: Entity) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.emit("remove-child", child);
      this.children.splice(index, 1);

      child.scene.clear();
      child.parent.clear();
      child.root = child;
      child.setDepth(0);
    }
    return this;
  }

  private setDepth(depth: number) {
    this.depth = depth;
    this.children.forEach((child) => child.setDepth(depth + 1));
    return this;
  }

  toJSON(): IJSONObject {
    return {
      ...super.toJSON(),
      name: this.name.unwrapOr(null as any),
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
      this.name.replace(json.name as string);
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
        json.components.map((componentJSON) =>
          Component.newFromJSON(componentJSON as IJSONObject)
        )
      );
    }
    return this;
  }
}

import {
  filterRequirements,
  IRequirement,
  requirementToString,
} from "./IRequirement";
import { Component } from "./Component";
import { Plugin } from "./Plugin";
import { Scene } from "./Scene";
