"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const core_1 = require("@aicacia/core");
const IRequirement_1 = require("./IRequirement");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Plugin extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.scene = core_1.none();
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
        return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
    }
    getRequiredPlugin(Plugin) {
        return this.getPlugin(Plugin).expect(() => `${this.getConstructor()} required ${Plugin} Plugin`);
    }
    getManager(Manager) {
        return this.getScene().flatMap((scene) => scene.getManager(Manager));
    }
    getRequiredManager(Manager) {
        return this.getManager(Manager).expect(() => `${this.getConstructor()} required ${Manager} Manager`);
    }
    validateRequirements() {
        const missingPlugins = [];
        for (const plugin of this.getRequiredScene().getPlugins()) {
            const missingRequiredPlugins = IRequirement_1.filterRequirements(plugin.getRequiredPlugins(), (P) => !this.getRequiredScene().hasPlugin(P));
            if (missingRequiredPlugins.length > 0) {
                missingPlugins.push(...missingRequiredPlugins);
            }
        }
        if (missingPlugins.length > 0) {
            const pluginMessage = missingPlugins
                .map((missingRequirement) => `${IRequirement_1.requirementToString(this.getConstructor())} Plugin requires ${IRequirement_1.requirementToString(missingRequirement)} Plugin`)
                .join("\n");
            throw new Error(pluginMessage);
        }
    }
    /**
     * @ignore
     */
    UNSAFE_setScene(scene) {
        this.scene.replace(scene);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeScene() {
        this.scene.clear();
        return this;
    }
    getScene() {
        return this.scene;
    }
    getRequiredScene() {
        return this.getScene().expect(() => `${this.getConstructor()} required a Scene`);
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
