"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var tslib_1 = require("tslib");
var json_1 = require("@aicacia/json");
var core_1 = require("@aicacia/core");
var ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
var Scene = /** @class */ (function (_super) {
    tslib_1.__extends(Scene, _super);
    function Scene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = core_1.none();
        _this.entities = [];
        _this.entitiesToAdd = [];
        _this.entitiesToRemove = [];
        _this.managers = [];
        _this.managerMap = new Map();
        _this.plugins = [];
        _this.pluginsMap = new Map();
        _this.isUpdating = false;
        _this.isInitted = false;
        _this.sortPluginsFunction = function (a, b) {
            return a.getPluginPriority() - b.getPluginPriority();
        };
        return _this;
    }
    Scene.prototype.init = function () {
        if (!this.isInitted) {
            this.isInitted = true;
            this.emit("init");
            this.maintain();
            this.plugins.forEach(function (plugin) { return plugin.onInit(); });
            this.isInitted = true;
        }
        return this;
    };
    Scene.prototype.maintain = function (emit) {
        var _this = this;
        if (emit === void 0) { emit = true; }
        emit && this.emit("maintain");
        this.entitiesToAdd.forEach(function (entity) { return _this.addEntityNow(entity, true); });
        this.entitiesToAdd.length = 0;
        this.entitiesToRemove.forEach(function (entity) {
            return _this.removeEntityNow(entity, true);
        });
        this.entitiesToRemove.length = 0;
        return this;
    };
    Scene.prototype.update = function () {
        this.init();
        this.isUpdating = true;
        this.emit("update");
        this.maintain();
        this.plugins.forEach(function (plugin) { return plugin.onUpdate(); });
        this.managers.forEach(function (manager) { return manager.onUpdate(); });
        this.managers.forEach(function (manager) { return manager.onAfterUpdate(); });
        this.plugins.forEach(function (plugin) { return plugin.onAfterUpdate(); });
        this.isUpdating = false;
        return this;
    };
    Scene.prototype.clear = function () {
        this.emit("clear");
        this.removeEntities(this.entities);
        this.removePlugin.apply(this, tslib_1.__spread(this.pluginsMap.keys()));
        return this;
    };
    Scene.prototype.getName = function () {
        return this.name;
    };
    Scene.prototype.setName = function (name) {
        this.name.replace(name);
        return this;
    };
    Scene.prototype.removeName = function () {
        this.name.take();
        return this;
    };
    Scene.prototype.find = function (fn, recur) {
        var e_1, _a;
        if (recur === void 0) { recur = true; }
        try {
            for (var _b = tslib_1.__values(this.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entity = _c.value;
                if (fn(entity)) {
                    return core_1.some(entity);
                }
                else if (recur) {
                    var found = entity.find(fn, recur);
                    if (found.isSome()) {
                        return found;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return core_1.none();
    };
    Scene.prototype.findWithTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.find(function (entity) { return entity.hasTags(tags); }, true);
    };
    Scene.prototype.findWithTags = function (tags) {
        return this.findWithTag.apply(this, tslib_1.__spread(tags));
    };
    Scene.prototype.findWithName = function (name) {
        return this.find(function (entity) {
            return entity
                .getName()
                .map(function (entityName) { return entityName === name; })
                .unwrapOr(false);
        }, true);
    };
    Scene.prototype.findAll = function (fn, recur) {
        var e_2, _a;
        if (recur === void 0) { recur = true; }
        var matching = [];
        try {
            for (var _b = tslib_1.__values(this.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entity = _c.value;
                if (fn(entity)) {
                    matching.push(entity);
                }
                else if (recur) {
                    matching.push.apply(matching, tslib_1.__spread(entity.findAll(fn, recur)));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return matching;
    };
    Scene.prototype.findAllWithTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.findAll(function (entity) { return entity.hasTags(tags); }, true);
    };
    Scene.prototype.findAllWithTags = function (tags) {
        return this.findAllWithTag.apply(this, tslib_1.__spread(tags));
    };
    Scene.prototype.findAllWithName = function (name) {
        return this.findAll(function (entity) {
            return entity
                .getName()
                .map(function (entityName) { return entityName === name; })
                .unwrapOr(false);
        }, true);
    };
    Scene.prototype.getEntities = function () {
        return this.entities;
    };
    Scene.prototype.getManagers = function () {
        return this.managers;
    };
    Scene.prototype.getManager = function (Manager) {
        return core_1.Option.from(this.managerMap.get(Manager));
    };
    Scene.prototype.getRequiredManager = function (Manager) {
        return this.getManager(Manager).expect("Scene required " + Manager + " Manager");
    };
    Scene.prototype.getPlugins = function () {
        return this.plugins;
    };
    Scene.prototype.hasPlugin = function (Plugin) {
        return this.getPlugin(Plugin).isSome();
    };
    Scene.prototype.getPlugin = function (Plugin) {
        return core_1.Option.from(this.pluginsMap.get(Plugin));
    };
    Scene.prototype.getRequiredPlugin = function (Plugin) {
        return this.getPlugin(Plugin).expect("Scene required " + Plugin + " Plugin");
    };
    Scene.prototype.addPlugins = function (plugins) {
        var _this = this;
        plugins.forEach(function (plugin) { return _this._addPlugin(plugin); });
        return this.sortPlugins();
    };
    Scene.prototype.addPlugin = function () {
        var plugins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plugins[_i] = arguments[_i];
        }
        return this.addPlugins(plugins);
    };
    Scene.prototype.removePlugins = function (plugins) {
        var _this = this;
        plugins.forEach(function (plugin) { return _this._removePlugin(plugin); });
        return this;
    };
    Scene.prototype.removePlugin = function () {
        var plugins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plugins[_i] = arguments[_i];
        }
        return this.removePlugins(plugins);
    };
    Scene.prototype.addEntities = function (entities) {
        var _a;
        (_a = this.entitiesToAdd).push.apply(_a, tslib_1.__spread(entities));
        return this;
    };
    Scene.prototype.addEntity = function () {
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        return this.addEntities(entities);
    };
    Scene.prototype.removeEntities = function (entities) {
        var _a;
        (_a = this.entitiesToRemove).push.apply(_a, tslib_1.__spread(entities));
        return this;
    };
    Scene.prototype.removeEntity = function () {
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        return this.removeEntities(entities);
    };
    Scene.prototype.addEntityNow = function (entity, force) {
        if (force === void 0) { force = false; }
        if (this.isUpdating && !force) {
            throw new Error("Scene.addEntityNow called while updating, use force to suppress this Error");
        }
        return this.UNSAFE_addEntityNow(entity, false);
    };
    Scene.prototype.removeEntityNow = function (entity, force) {
        if (force === void 0) { force = false; }
        if (this.isUpdating && !force) {
            throw new Error("Scene.removeEntityNow called while updating, use force to suppress this Error");
        }
        return this.UNSAFE_removeEntityNow(entity);
    };
    /**
     * @ignore
     */
    Scene.prototype.UNSAFE_addComponent = function (component) {
        var Manager = component.getManagerConstructor();
        var managerOption = this.getManager(Manager);
        var manager;
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
    };
    /**
     * @ignore
     */
    Scene.prototype.UNSAFE_removeComponent = function (component) {
        var _this = this;
        var Manager = component.getManagerConstructor();
        var managerOption = this.getManager(Manager);
        this.emit("remove-component", component);
        component.emit("remove-from-scene");
        managerOption.ifSome(function (manager) {
            component.onRemove();
            manager.removeComponent(component);
            component.UNSAFE_removeManager();
            if (manager.isEmpty()) {
                manager.onRemove();
                _this.managers.splice(_this.managers.indexOf(manager), 1);
                _this.managerMap.delete(Manager);
            }
        });
        return this;
    };
    /**
     * @ignore
     */
    Scene.prototype.UNSAFE_addEntityNow = function (entity, isChild) {
        var e_3, _a;
        var _this = this;
        var entitySceneOption = entity.getScene();
        if (entitySceneOption.isSome()) {
            var entityScene = entitySceneOption.unwrap();
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
            throw new Error("Scene trying to add an Entity that has a parent to the Scene");
        }
        entity.UNSAFE_setScene(this);
        try {
            for (var _b = tslib_1.__values(entity.getComponents().values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var component = _c.value;
                this.UNSAFE_addComponent(component);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        entity.forEachChild(function (child) { return _this.UNSAFE_addEntityNow(child, true); }, false);
        if (process.env.NODE_ENV !== "production") {
            entity.validateRequirements();
        }
        this.emit("add-entity", entity);
        return this;
    };
    /**
     * @ignore
     */
    Scene.prototype.UNSAFE_removeEntityNow = function (entity) {
        var e_4, _a;
        var _this = this;
        var entitySceneOption = entity.getScene();
        if (entitySceneOption.isSome()) {
            var entityScene = entitySceneOption.unwrap();
            if (entityScene !== this) {
                throw new Error("Scene trying to remove an Entity that is not a member of the Scene");
            }
        }
        try {
            for (var _b = tslib_1.__values(entity.getComponents().values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var component = _c.value;
                this.UNSAFE_removeComponent(component);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (entity.isRoot()) {
            var index = this.entities.indexOf(entity);
            if (index !== -1) {
                this.entities.splice(index, 1);
                entity.UNSAFE_removeScene();
            }
        }
        else {
            entity.getParent().ifSome(function (parent) { return parent.UNSAFE_removeChild(entity); });
        }
        entity
            .getChildren()
            .slice()
            .forEach(function (child) { return _this.removeEntityNow(child, true); });
        this.emit("remove-entity", entity);
        return this;
    };
    Scene.prototype._addPlugin = function (plugin) {
        var Plugin = plugin.getConstructor();
        if (!this.hasPlugin(Plugin)) {
            var Plugin_2 = plugin.getConstructor();
            this.plugins.push(plugin);
            this.pluginsMap.set(Plugin_2, plugin);
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
    };
    Scene.prototype._removePlugin = function (Plugin) {
        var _this = this;
        this.getPlugin(Plugin).ifSome(function (plugin) {
            _this.emit("remove-plugin", plugin);
            plugin.onRemove();
            plugin.UNSAFE_removeScene();
            _this.plugins.splice(_this.plugins.indexOf(plugin), 1);
            _this.pluginsMap.delete(Plugin);
        });
        return this;
    };
    Scene.prototype.sortPlugins = function () {
        this.plugins.sort(this.sortPluginsFunction);
        return this;
    };
    Scene.prototype.sortManagers = function () {
        this.managers.sort(this.managerSortFunction);
        return this;
    };
    Scene.prototype.managerSortFunction = function (a, b) {
        return a.getManagerPriority() - b.getManagerPriority();
    };
    Scene.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { name: this.name.unwrapOr(null), plugins: this.plugins
                .filter(function (plugin) {
                return plugin.getConstructor().isToFromJSONEnabled();
            })
                .map(function (plugin) { return plugin.toJSON(); }), entities: this.entities.map(function (entity) { return entity.toJSON(); }) });
    };
    Scene.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        if (json.name) {
            this.name.replace(json.name);
        }
        if (json_1.isJSONArray(json.plugins)) {
            this.addPlugins(json.plugins.map(function (plugin) {
                return Plugin_1.Plugin.newFromJSON(plugin);
            }));
        }
        if (json_1.isJSONArray(json.entities)) {
            this.addEntities(json.entities.map(function (entity) {
                return new Entity_1.Entity().fromJSON(entity);
            }));
        }
        return this.maintain(false);
    };
    return Scene;
}(ToFromJSONEventEmitter_1.ToFromJSONEventEmitter));
exports.Scene = Scene;
var Entity_1 = require("./Entity");
var Plugin_1 = require("./Plugin");
