import { DefaultManager } from "./DefaultManager";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export class Component extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.entity = null;
        this.manager = null;
    }
    static getManagerConstructor() {
        if (!this.Manager) {
            throw new Error(this + " invalid Manager `" + this.Manager + "` " + this);
        }
        return this.Manager;
    }
    static getRequiredComponents() {
        return this.requiredComponents;
    }
    static getRequiredPlugins() {
        return this.requiredPlugins;
    }
    getManagerConstructor() {
        return Object.getPrototypeOf(this).constructor.getManagerConstructor();
    }
    getRequiredComponents() {
        return Object.getPrototypeOf(this).constructor.requiredComponents;
    }
    getRequiredPlugins() {
        return Object.getPrototypeOf(this).constructor.requiredPlugins;
    }
    getComponent(Component) {
        return this.entity ? this.entity.getComponent(Component) : null;
    }
    getRequiredComponent(Component) {
        const component = this.getComponent(Component);
        if (!component) {
            throw new Error(`${this.getConstructor()} Component requires ${Component} Component`);
        }
        return component;
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
            throw new Error(`${this.getConstructor()} Component requires ${Plugin} Plugin`);
        }
        return plugin;
    }
    /**
     * @ignore
     */
    UNSAFE_setEntity(entity) {
        this.entity = entity;
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeEntity() {
        this.entity = null;
        return this;
    }
    getEntity() {
        return this.entity;
    }
    getRequiredEntity() {
        const entity = this.getEntity();
        if (!entity) {
            throw new Error(`${this.getConstructor()} Component requires an Entity`);
        }
        return entity;
    }
    getScene() {
        const entity = this.entity;
        if (entity) {
            return entity.getScene();
        }
        else {
            return null;
        }
    }
    getRequiredScene() {
        const svene = this.getScene();
        if (!svene) {
            throw new Error(`${this.getConstructor()} Component requires a Scene`);
        }
        return svene;
    }
    /**
     * @ignore
     */
    UNSAFE_setManager(manager) {
        this.manager = manager;
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeManager() {
        this.manager = null;
        return this;
    }
    getManager() {
        return this.manager;
    }
    getRequiredManager() {
        const manager = this.getManager();
        if (!manager) {
            throw new Error(`${this.getConstructor()} Component is not part of a Manager ${Object.getPrototypeOf(this).getManagerConstructor()} Manager`);
        }
        return manager;
    }
    getSceneManager(Manager) {
        const scene = this.getScene();
        if (scene) {
            return scene.getManager(Manager);
        }
        else {
            return null;
        }
    }
    getRequiredSceneManager(Manager) {
        const manager = this.getSceneManager(Manager);
        if (!manager) {
            throw new Error(`${this.getConstructor()} Component requires ${Object.getPrototypeOf(this).getManagerConstructor()} Manager`);
        }
        return manager;
    }
    onInit() {
        return this;
    }
    onDetach() {
        return this;
    }
    onAdd() {
        return this;
    }
    onRemove() {
        return this;
    }
    onUpdate() {
        return this;
    }
    onAfterUpdate() {
        return this;
    }
}
Component.Manager = DefaultManager;
Component.requiredComponents = [];
Component.requiredPlugins = [];
