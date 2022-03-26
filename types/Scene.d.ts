import { IJSONObject } from "@aicacia/json";
import type { IConstructor } from "@aicacia/core";
import type { Component } from "./Component";
import { Entity } from "./Entity";
import type { Manager } from "./Manager";
import { Plugin } from "./Plugin";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface ISceneEventTypes {
    maintain(): void;
    update(): void;
    init(): void;
    clear(): void;
    "add-component": (component: Component) => void;
    "remove-component": (component: Component) => void;
    "add-plugin": (plugin: Plugin) => void;
    "remove-plugin": (plugin: Plugin) => void;
    "add-entity": (entity: Entity) => void;
    "remove-entity": (entity: Entity) => void;
}
export declare class Scene extends ToFromJSONEventEmitter<ISceneEventTypes> {
    private name;
    private entities;
    private entitiesToAdd;
    private entitiesToRemove;
    private managers;
    private managerMap;
    private plugins;
    private pluginsMap;
    private isUpdating;
    private isInitted;
    init(): this;
    maintain(emit?: boolean): this;
    update(): this;
    clear(): this;
    getName(): string | null;
    setName(name: string): this;
    removeName(): this;
    forEachEntity(fn: (entity: Entity) => false | void, recur?: boolean): this;
    find(fn: (entity: Entity) => boolean, recur?: boolean): Entity | undefined;
    findWithTag(...tags: string[]): Entity | undefined;
    findWithTags(tags: string[]): Entity | undefined;
    findWithName(name: string): Entity | undefined;
    findAll(fn: (entity: Entity) => boolean, recur?: boolean): Entity[];
    findAllWithTag(...tags: string[]): Entity[];
    findAllWithTags(tags: string[]): Entity[];
    findAllWithName(name: string): Entity[];
    getEntities(): readonly Entity[];
    getManagers(): readonly Manager[];
    getManager<M extends Manager>(Manager: IConstructor<M>): M | null;
    getRequiredManager<M extends Manager>(Manager: IConstructor<M>): M;
    getPlugins(): readonly Plugin[];
    hasPlugin<P extends Plugin>(Plugin: IConstructor<P>): boolean;
    getPlugin<P extends Plugin>(Plugin: IConstructor<P>): P | null;
    getRequiredPlugin<P extends Plugin>(Plugin: IConstructor<P>): P;
    addPlugins(plugins: Plugin[]): this;
    addPlugin(...plugins: Plugin[]): this;
    removePlugins(Plugins: IConstructor<Plugin>[]): this;
    removePlugin(...plugins: IConstructor<Plugin>[]): this;
    addEntities(entities: Entity[]): this;
    addEntity(...entities: Entity[]): this;
    removeEntities(entities: Entity[]): this;
    removeEntity(...entities: Entity[]): this;
    addEntityNow(entity: Entity, force?: boolean): this;
    removeEntityNow(entity: Entity, force?: boolean): this;
    /**
     * @ignore
     */
    UNSAFE_addComponent(component: Component): this;
    /**
     * @ignore
     */
    UNSAFE_removeComponent(component: Component): this;
    /**
     * @ignore
     */
    UNSAFE_addEntityNow(entity: Entity, isChild: boolean): this;
    /**
     * @ignore
     */
    UNSAFE_removeEntityNow(entity: Entity): this;
    private _addPlugin;
    private _removePlugin;
    private sortPlugins;
    private sortPluginsFunction;
    private sortManagers;
    private managerSortFunction;
    toJSON(): IJSONObject;
    fromJSON(json: IJSONObject): this;
}
