"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const json_1 = require("@aicacia/json");
const core_1 = require("@aicacia/core");
const Entity_1 = require("./Entity");
const Plugin_1 = require("./Plugin");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Scene extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.name = core_1.none();
        this.entities = [];
        this.entitiesToAdd = [];
        this.entitiesToRemove = [];
        this.managers = [];
        this.managerMap = new Map();
        this.plugins = [];
        this.pluginsMap = new Map();
        this.isUpdating = false;
        this.isInitted = false;
        this.sortPluginsFunction = (a, b) => {
            return a.getPluginPriority() - b.getPluginPriority();
        };
    }
    init() {
        if (!this.isInitted) {
            this.isInitted = true;
            this.emit("init");
            this.maintain();
            for (const plugin of this.plugins) {
                plugin.onInit();
            }
            this.isInitted = true;
        }
        return this;
    }
    maintain(emit = true) {
        emit && this.emit("maintain");
        for (const entity of this.entitiesToRemove) {
            this.removeEntityNow(entity, true);
        }
        this.entitiesToRemove.length = 0;
        for (const entity of this.entitiesToAdd) {
            this.addEntityNow(entity, true);
        }
        this.entitiesToAdd.length = 0;
        return this;
    }
    update() {
        this.init();
        this.isUpdating = true;
        this.emit("update");
        this.maintain();
        for (const plugin of this.plugins) {
            plugin.onUpdate();
        }
        for (const manager of this.managers) {
            manager.onUpdate();
        }
        for (const manager of this.managers) {
            manager.onAfterUpdate();
        }
        for (const plugin of this.plugins) {
            plugin.onAfterUpdate();
        }
        this.isUpdating = false;
        return this;
    }
    clear() {
        this.emit("clear");
        this.removeEntities(this.entities);
        this.removePlugin(...this.pluginsMap.keys());
        return this;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name.replace(name);
        return this;
    }
    removeName() {
        this.name.take();
        return this;
    }
    forEachEntity(fn, recur = true) {
        for (const entity of this.entities) {
            if (fn(entity) === false) {
                break;
            }
            if (recur) {
                entity.forEachChild(fn, recur);
            }
        }
        return this;
    }
    find(fn, recur = true) {
        for (const entity of this.entities) {
            if (fn(entity)) {
                return core_1.some(entity);
            }
            else if (recur) {
                const found = entity.find(fn, recur);
                if (found.isSome()) {
                    return found;
                }
            }
        }
        return core_1.none();
    }
    findWithTag(...tags) {
        return this.find((entity) => entity.hasTags(tags), true);
    }
    findWithTags(tags) {
        return this.findWithTag(...tags);
    }
    findWithName(name) {
        return this.find((entity) => entity
            .getName()
            .map((entityName) => entityName === name)
            .unwrapOr(false), true);
    }
    findAll(fn, recur = true) {
        const matching = [];
        for (const entity of this.entities) {
            if (fn(entity)) {
                matching.push(entity);
            }
            else if (recur) {
                matching.push(...entity.findAll(fn, recur));
            }
        }
        return matching;
    }
    findAllWithTag(...tags) {
        return this.findAll((entity) => entity.hasTags(tags), true);
    }
    findAllWithTags(tags) {
        return this.findAllWithTag(...tags);
    }
    findAllWithName(name) {
        return this.findAll((entity) => entity
            .getName()
            .map((entityName) => entityName === name)
            .unwrapOr(false), true);
    }
    getEntities() {
        return this.entities;
    }
    getManagers() {
        return this.managers;
    }
    getManager(Manager) {
        return core_1.Option.from(this.managerMap.get(Manager));
    }
    getRequiredManager(Manager) {
        return this.getManager(Manager).expect(`Scene required ${Manager} Manager`);
    }
    getPlugins() {
        return this.plugins;
    }
    hasPlugin(Plugin) {
        return this.getPlugin(Plugin).isSome();
    }
    getPlugin(Plugin) {
        return core_1.Option.from(this.pluginsMap.get(Plugin));
    }
    getRequiredPlugin(Plugin) {
        return this.getPlugin(Plugin).expect(`Scene required ${Plugin} Plugin`);
    }
    addPlugins(plugins) {
        for (const plugin of plugins) {
            this._addPlugin(plugin);
        }
        return this.sortPlugins();
    }
    addPlugin(...plugins) {
        return this.addPlugins(plugins);
    }
    removePlugins(Plugins) {
        for (const Plugin of Plugins) {
            this._removePlugin(Plugin);
        }
        return this;
    }
    removePlugin(...plugins) {
        return this.removePlugins(plugins);
    }
    addEntities(entities) {
        this.entitiesToAdd.push(...entities);
        return this;
    }
    addEntity(...entities) {
        return this.addEntities(entities);
    }
    removeEntities(entities) {
        this.entitiesToRemove.push(...entities);
        return this;
    }
    removeEntity(...entities) {
        return this.removeEntities(entities);
    }
    addEntityNow(entity, force = false) {
        if (this.isUpdating && !force) {
            throw new Error("Scene.addEntityNow called while updating, use force to suppress this Error");
        }
        return this.UNSAFE_addEntityNow(entity, false);
    }
    removeEntityNow(entity, force = false) {
        if (this.isUpdating && !force) {
            throw new Error("Scene.removeEntityNow called while updating, use force to suppress this Error");
        }
        return this.UNSAFE_removeEntityNow(entity);
    }
    /**
     * @ignore
     */
    UNSAFE_addComponent(component) {
        const Manager = component.getManagerConstructor();
        const managerOption = this.getManager(Manager);
        let manager;
        if (managerOption.isNone()) {
            manager = new Manager();
            manager.UNSAFE_setScene(this);
            this.managers.push(manager);
            this.managerMap.set(Manager, manager);
            this.sortManagers();
            manager.onAdd();
        }
        else {
            manager = managerOption.unwrap();
        }
        manager.addComponent(component);
        component.UNSAFE_setManager(manager);
        manager.sort();
        component.onAdd();
        component.emit("add-to-scene");
        this.emit("add-component", component);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeComponent(component) {
        const Manager = component.getManagerConstructor();
        const managerOption = this.getManager(Manager);
        this.emit("remove-component", component);
        component.emit("remove-from-scene");
        managerOption.ifSome((manager) => {
            component.onRemove();
            manager.removeComponent(component);
            component.UNSAFE_removeManager();
            if (manager.isEmpty()) {
                manager.onRemove();
                this.managers.splice(this.managers.indexOf(manager), 1);
                this.managerMap.delete(Manager);
            }
        });
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_addEntityNow(entity, isChild) {
        const entitySceneOption = entity.getScene();
        if (entitySceneOption.isSome()) {
            const entityScene = entitySceneOption.unwrap();
            if (entityScene === this) {
                throw new Error("Scene trying to add an Entity that is already a member of the Scene");
            }
            else {
                entityScene.removeEntityNow(entity, true);
            }
        }
        if (entity.isRoot()) {
            this.entities.push(entity);
        }
        else if (!isChild) {
            throw new Error("Scene trying to add an Entity that already has a parent");
        }
        entity.UNSAFE_setScene(this);
        for (const component of entity.getComponents().values()) {
            this.UNSAFE_addComponent(component);
        }
        for (const child of entity.getChildren()) {
            this.UNSAFE_addEntityNow(child, true);
        }
        if (process.env.NODE_ENV !== "production") {
            entity.validateRequirements();
        }
        this.emit("add-entity", entity);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeEntityNow(entity) {
        const entitySceneOption = entity.getScene();
        if (entitySceneOption.isSome()) {
            const entityScene = entitySceneOption.unwrap();
            if (entityScene !== this) {
                throw new Error("Scene trying to remove an Entity that is not a member of the Scene");
            }
        }
        for (const component of entity.getComponents().values()) {
            this.UNSAFE_removeComponent(component);
        }
        if (entity.isRoot()) {
            const index = this.entities.indexOf(entity);
            if (index !== -1) {
                this.entities.splice(index, 1);
                entity.UNSAFE_removeScene();
            }
        }
        else {
            entity.getParent().ifSome((parent) => parent.UNSAFE_removeChild(entity));
        }
        for (const child of entity.getChildren().slice()) {
            this.removeEntityNow(child, true);
        }
        this.emit("remove-entity", entity);
        return this;
    }
    _addPlugin(plugin) {
        const Plugin = plugin.getConstructor();
        if (!this.hasPlugin(Plugin)) {
            const Plugin = plugin.getConstructor();
            this.plugins.push(plugin);
            this.pluginsMap.set(Plugin, plugin);
            plugin.UNSAFE_setScene(this);
            if (this.isInitted) {
                plugin.onInit();
            }
            plugin.onAdd();
            if (process.env.NODE_ENV !== "production") {
                plugin.validateRequirements();
            }
            this.emit("add-plugin", plugin);
        }
        return this;
    }
    _removePlugin(Plugin) {
        this.getPlugin(Plugin).ifSome((plugin) => {
            this.emit("remove-plugin", plugin);
            plugin.onRemove();
            plugin.UNSAFE_removeScene();
            this.plugins.splice(this.plugins.indexOf(plugin), 1);
            this.pluginsMap.delete(Plugin);
        });
        return this;
    }
    sortPlugins() {
        this.plugins.sort(this.sortPluginsFunction);
        return this;
    }
    sortManagers() {
        this.managers.sort(this.managerSortFunction);
        return this;
    }
    managerSortFunction(a, b) {
        return a.getManagerPriority() - b.getManagerPriority();
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { name: this.name.unwrapOr(null), plugins: this.plugins
                .filter((plugin) => plugin.getConstructor().isToFromJSONEnabled())
                .map((plugin) => plugin.toJSON()), entities: this.entities.map((entity) => entity.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (json.name) {
            this.name.replace(json.name);
        }
        if (json_1.isJSONArray(json.plugins)) {
            this.addPlugins(json.plugins.map((plugin) => Plugin_1.Plugin.newFromJSON(plugin)));
        }
        if (json_1.isJSONArray(json.entities)) {
            this.addEntities(json.entities.map((entity) => new Entity_1.Entity().fromJSON(entity)));
        }
        return this.maintain(false);
    }
}
exports.Scene = Scene;
