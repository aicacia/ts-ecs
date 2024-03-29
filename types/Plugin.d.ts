import type { IConstructor } from "@aicacia/core";
import { IRequirement } from "./IRequirement";
import type { Manager } from "./Manager";
import type { Scene } from "./Scene";
import type { ValidEventTypes } from "eventemitter3";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export declare abstract class Plugin<EventTypes extends ValidEventTypes = any> extends ToFromJSONEventEmitter<EventTypes> {
    static pluginPriority: number;
    static requiredPlugins: IRequirement<Plugin>[];
    static getPluginPriority(): number;
    static getRequiredPlugins(): IRequirement<Plugin>[];
    private scene;
    getConstructor(): IConstructor<this>;
    getPluginPriority(): number;
    getRequiredPlugins(): IConstructor<Plugin>[];
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P | null;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    getManager<M extends Manager = Manager>(Manager: IConstructor<M>): M | null;
    getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>): M;
    validateRequirements(): void;
    /**
     * @ignore
     */
    UNSAFE_setScene(scene: Scene): this;
    /**
     * @ignore
     */
    UNSAFE_removeScene(): this;
    getScene(): Scene | null;
    getRequiredScene(): Scene;
    onInit(): this;
    onAdd(): this;
    onRemove(): this;
    onAfterUpdate(): this;
    onUpdate(): this;
}
