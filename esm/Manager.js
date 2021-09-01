import { none } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export class Manager extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.scene = none();
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
Manager.managerPriority = 0;
