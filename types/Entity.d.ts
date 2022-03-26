import { IJSONObject } from "@aicacia/json";
import type { IConstructor } from "@aicacia/core";
import { Component } from "./Component";
import type { Scene } from "./Scene";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface IEntityEventTypes {
    "add-component": (component: Component) => void;
    "remove-component": (component: Component) => void;
    "add-child": (child: Entity) => void;
    "remove-child": (child: Entity) => void;
}
export declare class Entity extends ToFromJSONEventEmitter<IEntityEventTypes> {
    private name;
    private depth;
    private scene;
    private root;
    private parent;
    private tags;
    private children;
    private components;
    getName(): string | null;
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
    getParent(): Entity | null;
    hasScene(): boolean;
    getScene(): Scene | null;
    getRequiredScene(): Scene;
    /**
     * @ignore
     */
    UNSAFE_setScene(scene: Scene, recur?: boolean): this;
    /**
     * @ignore
     */
    UNSAFE_removeScene(): this;
    forEachChild(fn: (entity: Entity) => false | void, recur?: boolean): this;
    find(fn: (entity: Entity) => boolean, recur?: boolean): Entity | undefined;
    findWithName(name: string): Entity | undefined;
    findWithTag(...tags: string[]): Entity | undefined;
    findWithTags(tags: string[]): Entity | undefined;
    findWithComponent<C extends Component>(Component: IConstructor<C>): Entity | undefined;
    findAll(fn: (entity: Entity) => boolean, recur?: boolean): Entity[];
    findAllWithName(name: string, recur?: boolean): Entity[];
    findAllWithTag(...tags: string[]): Entity[];
    findAllWithTags(tags: string[]): Entity[];
    findAllWithComponent<C extends Component>(Component: IConstructor<C>, recur?: boolean): Entity[];
    findParent(fn: (entity: Entity) => boolean): Entity | undefined;
    getComponents(): Map<IConstructor<Component, any[]>, Component>;
    hasComponent<C extends Component = Component>(Component: IConstructor<C>): boolean;
    getComponent<C extends Component = Component>(Component: IConstructor<C>): C | null;
    getRequiredComponent<C extends Component = Component>(Component: IConstructor<C>): C;
    getComponentInstanceOf<C extends Component = Component>(Component: IConstructor<C>): C | null;
    getComponentsInstanceOf<C extends Component = Component>(Component: IConstructor<C>): C[];
    addComponents(components: Component[]): this;
    addComponent(...components: Component[]): this;
    removeComponents(Components: IConstructor<Component>[]): this;
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
