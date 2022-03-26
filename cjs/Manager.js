"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Manager extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.scene = null;
    }
    static getManagerPriority() {
        return this.managerPriority;
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
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    getManagerPriority() {
        return Object.getPrototypeOf(this).constructor.getManagerPriority();
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
    onAdd() {
        return this;
    }
    onRemove() {
        return this;
    }
}
exports.Manager = Manager;
Manager.managerPriority = 0;
