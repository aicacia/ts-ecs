"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const core_1 = require("@aicacia/core");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Manager extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.scene = core_1.none();
    }
    static getManagerPriority() {
        return this.managerPriority;
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
    getConstructor() {
        return Object.getPrototypeOf(this).constructor;
    }
    getManagerPriority() {
        return Object.getPrototypeOf(this).constructor.getManagerPriority();
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
    onAdd() {
        return this;
    }
    onRemove() {
        return this;
    }
}
exports.Manager = Manager;
Manager.managerPriority = 0;
