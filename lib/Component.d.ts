import { Option, IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export interface Component {
    on(event: "add-to-scene" | "remove-from-scene", listener: () => void): this;
}
export declare abstract class Component extends ToFromJSONEventEmitter {
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
    getComponent<C extends Component = Component>(Component: IConstructor<C>): Option<C>;
    getRequiredComponent<C extends Component = Component>(Component: IConstructor<C>): C;
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P>;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    /**
     * @ignore
     */
    UNSAFE_setEntity(entity: Entity): this;
    /**
     * @ignore
     */
    UNSAFE_removeEntity(): this;
    getEntity(): Option<Entity>;
    getRequiredEntity(): Entity;
    getScene(): Option<import("./Scene").Scene>;
    getRequiredScene(): import("./Scene").Scene;
    /**
     * @ignore
     */
    UNSAFE_setManager(manager: Manager): this;
    /**
     * @ignore
     */
    UNSAFE_removeManager(): this;
    getManager<M extends Manager = Manager>(): Option<M>;
    getRequiredManager<M extends Manager = Manager>(): M;
    getSceneManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M>;
    getRequiredSceneManager<M extends Manager = Manager>(Manager: IConstructor<M>): M;
    onInit(): this;
    onDetach(): this;
    onAdd(): this;
    onRemove(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
}
import { IRequirement } from "./IRequirement";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";
