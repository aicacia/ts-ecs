import { Option, IConstructor } from "@aicacia/core";
import { IRequirement } from "./IRequirement";
import type { Manager } from "./Manager";
import type { Scene } from "./Scene";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export declare abstract class Plugin extends ToFromJSONEventEmitter {
    static pluginPriority: number;
    static requiredPlugins: IRequirement<Plugin>[];
    static getPluginPriority(): number;
    static getRequiredPlugins(): IRequirement<Plugin>[];
    private scene;
    getConstructor(): IConstructor<this>;
    getPluginPriority(): number;
    getRequiredPlugins(): IConstructor<Plugin>[];
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P>;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M>;
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
    getScene(): Option<Scene>;
    getRequiredScene(): Scene;
    onInit(): this;
    onAdd(): this;
    onRemove(): this;
    onAfterUpdate(): this;
    onUpdate(): this;
}
