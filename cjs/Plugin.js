"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const IRequirement_1 = require("./IRequirement");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Plugin extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.scene = null;
    }
    static getPluginPriority() {
        return this.pluginPriority;
    }
    static getRequiredPlugins() {
        return this.requiredPlugins;
    }
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    getPluginPriority() {
        return Object.getPrototypeOf(this).constructor.getPluginPriority();
    }
    getRequiredPlugins() {
        return Object.getPrototypeOf(this).constructor.requiredPlugins;
    }
    getPlugin(Plugin) {
        const scene = this.getScene();
        if (scene) {
            return scene.getPlugin(Plugin);
        }
        else {
            return null;
        }
    }
    getRequiredPlugin(Plugin) {
        const plugin = this.getPlugin(Plugin);
        if (!plugin) {
            throw new Error(`${this.getConstructor()} required ${Plugin} Plugin`);
        }
        return plugin;
    }
    getManager(Manager) {
        const scene = this.getScene();
        if (scene) {
            return scene.getManager(Manager);
        }
        else {
            return null;
        }
    }
    getRequiredManager(Manager) {
        const manager = this.getManager(Manager);
        if (!manager) {
            throw new Error(`${this.getConstructor()} required ${Manager} Manager`);
        }
        return manager;
    }
    validateRequirements() {
        const missingPlugins = [];
        for (const plugin of this.getRequiredScene().getPlugins()) {
            const missingRequiredPlugins = (0, IRequirement_1.filterRequirements)(plugin.getRequiredPlugins(), (P) => !this.getRequiredScene().hasPlugin(P));
            if (missingRequiredPlugins.length > 0) {
                missingPlugins.push(...missingRequiredPlugins);
            }
        }
        if (missingPlugins.length > 0) {
            const pluginMessage = missingPlugins
                .map((missingRequirement) => `${(0, IRequirement_1.requirementToString)(this.getConstructor())} Plugin requires ${(0, IRequirement_1.requirementToString)(missingRequirement)} Plugin`)
                .join("\n");
            throw new Error(pluginMessage);
        }
    }
    /**
     * @ignore
     */
    UNSAFE_setScene(scene) {
        this.scene = scene;
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeScene() {
        this.scene = null;
        return this;
    }
    getScene() {
        return this.scene;
    }
    getRequiredScene() {
        const scene = this.getScene();
        if (!scene) {
            throw new Error(`${this.getConstructor()} required a Scene`);
        }
        return scene;
    }
    onInit() {
        return this;
    }
    onAdd() {
        return this;
    }
    onRemove() {
        return this;
    }
    onAfterUpdate() {
        return this;
    }
    onUpdate() {
        return this;
    }
}
exports.Plugin = Plugin;
Plugin.pluginPriority = 0;
Plugin.requiredPlugins = [];
