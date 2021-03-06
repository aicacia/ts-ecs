"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const core_1 = require("@aicacia/core");
const DefaultManager_1 = require("./DefaultManager");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Component extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.entity = core_1.none();
        this.manager = core_1.none();
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
        return this.getEntity().flatMap((entity) => entity.getComponent(Component));
    }
    getRequiredComponent(Component) {
        return this.getComponent(Component).expect(() => `${this.getConstructor()} Component requires ${Component} Component`);
    }
    getPlugin(Plugin) {
        return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
    }
    getRequiredPlugin(Plugin) {
        return this.getPlugin(Plugin).expect(() => `${this.getConstructor()} Component requires ${Plugin} Plugin`);
    }
    /**
     * @ignore
     */
    UNSAFE_setEntity(entity) {
        this.entity.replace(entity);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeEntity() {
        this.entity.clear();
        return this;
    }
    getEntity() {
        return this.entity;
    }
    getRequiredEntity() {
        return this.getEntity().expect(() => `${this.getConstructor()} Component requires an Entity`);
    }
    getScene() {
        return this.entity.flatMap((entity) => entity.getScene());
    }
    getRequiredScene() {
        return this.getScene().expect(() => `${this.getConstructor()} Component requires a Scene`);
    }
    /**
     * @ignore
     */
    UNSAFE_setManager(manager) {
        this.manager.replace(manager);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeManager() {
        this.manager.clear();
        return this;
    }
    getManager() {
        return this.manager;
    }
    getRequiredManager() {
        return this.getManager().expect(() => `${this.getConstructor()} Component is not part of a Manager ${Object.getPrototypeOf(this).getManagerConstructor()} Manager`);
    }
    getSceneManager(Manager) {
        return this.getScene().flatMap((scene) => scene.getManager(Manager));
    }
    getRequiredSceneManager(Manager) {
        return this.getSceneManager(Manager).expect(() => `${this.getConstructor()} Component requires ${Object.getPrototypeOf(this).getManagerConstructor()} Manager`);
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
exports.Component = Component;
Component.Manager = DefaultManager_1.DefaultManager;
Component.requiredComponents = [];
Component.requiredPlugins = [];
