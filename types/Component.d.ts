import type { IConstructor } from "@aicacia/core";
import type { IRequirement } from "./IRequirement";
import type { Entity } from "./Entity";
import type { Manager } from "./Manager";
import type { Plugin } from "./Plugin";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface IComponentEventType {
    "add-to-scene": () => void;
    "remove-from-scene": () => void;
}
export declare abstract class Component extends ToFromJSONEventEmitter<IComponentEventType> {
    static Manager: IConstructor<Manager>;
    static requiredComponents: IRequirement<Component>[];
    static requiredPlugins: IRequirement<Plugin>[];
    static getManagerConstructor<M extends Manager = Manager>(): IConstructor<M>;
    static getRequiredComponents(): IRequirement<Component>[];
    static getRequiredPlugins(): IRequirement<Plugin>[];
    private entity;
    private manager;
    getManagerConstructor<M extends Manager = Manager>(): IConstructor<M>;
    getRequiredComponents(): IRequirement<Component>[];
    getRequiredPlugins(): IRequirement<Plugin>[];
    getComponent<C extends Component = Component>(Component: IConstructor<C>): C | null;
    getRequiredComponent<C extends Component = Component>(Component: IConstructor<C>): C;
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P | null;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    /**
     * @ignore
     */
    UNSAFE_setEntity(entity: Entity): this;
    /**
     * @ignore
     */
    UNSAFE_removeEntity(): this;
    getEntity(): Entity | null;
    getRequiredEntity(): Entity;
    getScene(): import("./Scene").Scene | null;
    getRequiredScene(): import("./Scene").Scene;
    /**
     * @ignore
     */
    UNSAFE_setManager(manager: Manager): this;
    /**
     * @ignore
     */
    UNSAFE_removeManager(): this;
    getManager<M extends Manager = Manager>(): M | null;
    getRequiredManager<M extends Manager = Manager>(): M;
    getSceneManager<M extends Manager = Manager>(Manager: IConstructor<M>): M | null;
    getRequiredSceneManager<M extends Manager = Manager>(Manager: IConstructor<M>): M;
    onInit(): this;
    onDetach(): this;
    onAdd(): this;
    onRemove(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
}
