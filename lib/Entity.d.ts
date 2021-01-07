import { IJSONObject } from "@aicacia/json";
import { Option, IConstructor } from "@aicacia/core";
import { Component } from "./Component";
import type { Scene } from "./Scene";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface Entity {
    on(event: "add-component" | "remove-component", listener: (component: Component) => void): this;
    on(event: "add-child" | "remove-child", listener: (child: Entity) => void): this;
}
export declare class Entity extends ToFromJSONEventEmitter {
    private name;
    private depth;
    private scene;
    private root;
    private parent;
    private tags;
    private children;
    private components;
    getName(): Option<string>;
    setName(name: string): this;
    removeName(): this;
    hasTags(tags: string[]): boolean;
    hasTag(...tags: string[]): boolean;
    getTags(): Set<string>;
    addTags(tags: string[]): this;
    removeTag(...tags: string[]): this;
    removeTags(tags: string[]): this;
    clearTags(): this;
    addTag(...tags: string[]): this;
    getDepth(): number;
    getRoot(): Entity;
    isRoot(): boolean;
    hasParent(): boolean;
    getParent(): Option<Entity>;
    hasScene(): boolean;
    getScene(): Option<Scene>;
    getRequiredScene(): Scene;
    /**
     * @ignore
     */
    UNSAFE_setScene(scene: Scene, recur?: boolean): this;
    /**
     * @ignore
     */
    UNSAFE_removeScene(): this;
    forEachChild(fn: (entity: Entity) => void, recur?: boolean): this;
    find(fn: (entity: Entity) => boolean, recur?: boolean): Option<Entity>;
    findWithName(name: string): Option<Entity>;
    findWithTag(...tags: string[]): Option<Entity>;
    findWithTags(tags: string[]): Option<Entity>;
    findWithComponent<C extends Component>(Component: IConstructor<C>): Option<Entity>;
    findAll(fn: (entity: Entity) => boolean, recur?: boolean): Entity[];
    findAllWithName(name: string, recur?: boolean): Entity[];
    findAllWithTag(...tags: string[]): Entity[];
    findAllWithTags(tags: string[]): Entity[];
    findAllWithComponent<C extends Component>(Component: IConstructor<C>, recur?: boolean): Entity[];
    findParent(fn: (entity: Entity) => boolean): Option<Entity>;
    getComponents(): Map<IConstructor<Component, any[]>, Component>;
    hasComponent<C extends Component = Component>(Component: IConstructor<C>): boolean;
    getComponent<C extends Component = Component>(Component: IConstructor<C>): Option<C>;
    getRequiredComponent<C extends Component = Component>(Component: IConstructor<C>): C;
    getComponentInstanceOf<C extends Component = Component>(Component: IConstructor<C>): Option<C>;
    getComponentsInstanceOf<C extends Component = Component>(Component: IConstructor<C>): C[];
    addComponents(components: Component[]): this;
    addComponent(...components: Component[]): this;
    removeComponents(components: IConstructor<Component>[]): this;
    removeComponent(...components: IConstructor<Component>[]): this;
    removeFromScene(): void;
    detach(): void;
    getChildren(): readonly Entity[];
    addChildren(children: Entity[]): this;
    addChild(...children: Entity[]): this;
    removeChildren(children: Entity[]): this;
    removeChild(...children: Entity[]): this;
    validateRequirements(): void;
    private _addComponent;
    private _removeComponent;
    private _addChild;
    private _removeChild;
    /**
     * @ignore
     */
    UNSAFE_removeChild(child: Entity): this;
    private setDepth;
    toJSON(): IJSONObject;
    fromJSON(json: IJSONObject): this;
}
