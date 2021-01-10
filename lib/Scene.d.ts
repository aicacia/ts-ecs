import { IJSONObject } from "@aicacia/json";
import { Option, IConstructor } from "@aicacia/core";
import type { Component } from "./Component";
import { Entity } from "./Entity";
import type { Manager } from "./Manager";
import { Plugin } from "./Plugin";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface Scene {
    on(event: "maintain" | "update", listener: () => void): this;
    on(event: "add-component" | "remove-component", listener: (component: Component) => void): this;
    on(event: "add-plugin" | "remove-plugin", listener: (entity: Plugin) => void): this;
    on(event: "add-entity" | "remove-entity", listener: (entity: Entity) => void): this;
    off(event: "maintain" | "update", listener: () => void): this;
    off(event: "add-component" | "remove-component", listener: (component: Component) => void): this;
    off(event: "add-plugin" | "remove-plugin", listener: (entity: Plugin) => void): this;
    off(event: "add-entity" | "remove-entity", listener: (entity: Entity) => void): this;
}
export declare class Scene extends ToFromJSONEventEmitter {
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
    getName(): Option<string>;
    setName(name: string): this;
    removeName(): this;
    forEachEntity(fn: (entity: Entity) => false | void, recur?: boolean): this;
    find(fn: (entity: Entity) => boolean, recur?: boolean): Option<Entity>;
    findWithTag(...tags: string[]): Option<Entity>;
    findWithTags(tags: string[]): Option<Entity>;
    findWithName(name: string): Option<Entity>;
    findAll(fn: (entity: Entity) => boolean, recur?: boolean): Entity[];
    findAllWithTag(...tags: string[]): Entity[];
    findAllWithTags(tags: string[]): Entity[];
    findAllWithName(name: string): Entity[];
    getEntities(): readonly Entity[];
    getManagers(): readonly Manager[];
    getManager<M extends Manager>(Manager: IConstructor<M>): Option<M>;
    getRequiredManager<M extends Manager>(Manager: IConstructor<M>): M;
    getPlugins(): readonly Plugin[];
    hasPlugin<P extends Plugin>(Plugin: IConstructor<P>): boolean;
    getPlugin<P extends Plugin>(Plugin: IConstructor<P>): Option<P>;
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
