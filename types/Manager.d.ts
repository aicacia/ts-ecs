import type { IConstructor } from "@aicacia/core";
import type { Component } from "./Component";
import type { Plugin } from "./Plugin";
import type { Scene } from "./Scene";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export declare abstract class Manager<C extends Component = Component> extends ToFromJSONEventEmitter {
    static managerPriority: number;
    static getManagerPriority(): number;
    protected scene: Scene | null;
    /**
     * @ignore
     */
    UNSAFE_setScene(scene: Scene): this;
    /**
     * @ignore
     */
    UNSAFE_removeScene(): this;
    getScene(): Scene | null;
    getConstructor(): IConstructor<this>;
    getManagerPriority(): number;
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P | null;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    getManager<M extends Manager = Manager>(Manager: IConstructor<M>): M | null;
    getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>): M;
    onAdd(): this;
    onRemove(): this;
    abstract addComponent(component: C): this;
    abstract removeComponent(component: C): this;
    abstract isEmpty(): boolean;
    abstract sort(): this;
    abstract onInit(): this;
    abstract onUpdate(): this;
    abstract onAfterUpdate(): this;
}
