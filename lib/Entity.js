"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
var tslib_1 = require("tslib");
var json_1 = require("@aicacia/json");
var core_1 = require("@aicacia/core");
var ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
var Entity = /** @class */ (function (_super) {
    tslib_1.__extends(Entity, _super);
    function Entity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = core_1.none();
        _this.depth = 0;
        _this.scene = core_1.none();
        _this.root = _this;
        _this.parent = core_1.none();
        _this.tags = new Set();
        _this.children = [];
        _this.components = new Map();
        return _this;
    }
    Entity.prototype.getName = function () {
        return this.name;
    };
    Entity.prototype.setName = function (name) {
        this.name.replace(name);
        return this;
    };
    Entity.prototype.removeName = function () {
        this.name.take();
        return this;
    };
    Entity.prototype.hasTags = function (tags) {
        var _this = this;
        return tags.every(function (tag) { return _this.tags.has(tag); });
    };
    Entity.prototype.hasTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.hasTags(tags);
    };
    Entity.prototype.getTags = function () {
        return this.tags;
    };
    Entity.prototype.addTags = function (tags) {
        var _this = this;
        tags.forEach(function (tag) { return _this.tags.add(tag); });
        return this;
    };
    Entity.prototype.removeTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.removeTags(tags);
    };
    Entity.prototype.removeTags = function (tags) {
        var _this = this;
        tags.forEach(function (tag) { return _this.tags.delete(tag); });
        return this;
    };
    Entity.prototype.addTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.addTags(tags);
    };
    Entity.prototype.getDepth = function () {
        return this.depth;
    };
    Entity.prototype.getRoot = function () {
        return this.root;
    };
    Entity.prototype.isRoot = function () {
        return this.root === this;
    };
    Entity.prototype.hasParent = function () {
        return this.parent.isSome();
    };
    Entity.prototype.getParent = function () {
        return this.parent;
    };
    Entity.prototype.hasScene = function () {
        return this.scene.isSome();
    };
    Entity.prototype.getScene = function () {
        return this.scene;
    };
    Entity.prototype.getRequiredScene = function () {
        return this.getScene().expect("Entity expected to have a Scene");
    };
    /**
     * @ignore
     */
    Entity.prototype.UNSAFE_setScene = function (scene, recur) {
        if (recur === void 0) { recur = false; }
        this.scene.replace(scene);
        if (recur) {
            this.forEachChild(function (child) { return child.UNSAFE_setScene(scene, recur); }, false);
        }
        return this;
    };
    /**
     * @ignore
     */
    Entity.prototype.UNSAFE_removeScene = function () {
        this.scene.clear();
        return this;
    };
    Entity.prototype.forEachChild = function (fn, recur) {
        if (recur === void 0) { recur = true; }
        this.getChildren().forEach(function (child) {
            fn(child);
            if (recur) {
                child.forEachChild(fn, recur);
            }
        });
        return this;
    };
    Entity.prototype.find = function (fn, recur) {
        var e_1, _a;
        if (recur === void 0) { recur = true; }
        var children = this.getChildren();
        try {
            for (var children_1 = tslib_1.__values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                if (fn(child)) {
                    return core_1.some(child);
                }
                else if (recur) {
                    var found = child.find(fn, recur);
                    if (found.isSome()) {
                        return found;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return core_1.none();
    };
    Entity.prototype.findWithName = function (name) {
        return this.find(function (child) {
            return child.name.map(function (childName) { return childName === name; }).unwrapOr(false);
        });
    };
    Entity.prototype.findWithTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.find(function (entity) { return entity.hasTags(tags); });
    };
    Entity.prototype.findWithTags = function (tags) {
        return this.findWithTag.apply(this, tslib_1.__spread(tags));
    };
    Entity.prototype.findWithComponent = function (Component) {
        return this.find(function (entity) { return entity.getComponent(Component).isSome(); });
    };
    Entity.prototype.findAll = function (fn, recur) {
        var e_2, _a;
        if (recur === void 0) { recur = true; }
        var children = this.getChildren(), matching = [];
        try {
            for (var children_2 = tslib_1.__values(children), children_2_1 = children_2.next(); !children_2_1.done; children_2_1 = children_2.next()) {
                var child = children_2_1.value;
                if (fn(child)) {
                    matching.push(child);
                }
                else if (recur) {
                    matching.push.apply(matching, tslib_1.__spread(child.findAll(fn, recur)));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (children_2_1 && !children_2_1.done && (_a = children_2.return)) _a.call(children_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return matching;
    };
    Entity.prototype.findAllWithName = function (name, recur) {
        if (recur === void 0) { recur = true; }
        return this.findAll(function (child) {
            return child.name.map(function (childName) { return childName === name; }).unwrapOr(false);
        }, recur);
    };
    Entity.prototype.findAllWithTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.findAll(function (entity) { return entity.hasTags(tags); });
    };
    Entity.prototype.findAllWithTags = function (tags) {
        return this.findAllWithTag.apply(this, tslib_1.__spread(tags));
    };
    Entity.prototype.findAllWithComponent = function (Component, recur) {
        if (recur === void 0) { recur = true; }
        return this.findAll(function (entity) { return entity.getComponent(Component).isSome(); }, recur);
    };
    Entity.prototype.findParent = function (fn) {
        return this.getParent().flatMap(function (parent) {
            if (fn(parent)) {
                return core_1.some(parent);
            }
            else {
                return parent.findParent(fn);
            }
        });
    };
    Entity.prototype.getComponents = function () {
        return this.components;
    };
    Entity.prototype.hasComponent = function (Component) {
        return this.getComponent(Component).isSome();
    };
    Entity.prototype.getComponent = function (Component) {
        return core_1.Option.from(this.components.get(Component));
    };
    Entity.prototype.getRequiredComponent = function (Component) {
        return this.getComponent(Component).expect("Entity expected to have a " + Component + " Component");
    };
    Entity.prototype.getComponentInstanceOf = function (Component) {
        return core_1.iter(this.components.values()).find(function (component) { return component instanceof Component; });
    };
    Entity.prototype.getComponentsInstanceOf = function (Component) {
        return core_1.iter(this.components.values())
            .filter(function (component) { return component instanceof Component; })
            .toArray();
    };
    Entity.prototype.addComponents = function (components) {
        var _this = this;
        components.forEach(function (component) { return _this._addComponent(component); });
        return this;
    };
    Entity.prototype.addComponent = function () {
        var components = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            components[_i] = arguments[_i];
        }
        return this.addComponents(components);
    };
    Entity.prototype.removeComponents = function (components) {
        var _this = this;
        components.forEach(function (component) { return _this._removeComponent(component); });
        return this;
    };
    Entity.prototype.removeComponent = function () {
        var components = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            components[_i] = arguments[_i];
        }
        return this.removeComponents(components);
    };
    Entity.prototype.removeFromScene = function () {
        var _this = this;
        this.scene.ifSome(function (scene) {
            scene.removeEntity(_this);
        });
    };
    Entity.prototype.detach = function () {
        var _this = this;
        this.parent.ifSome(function (parent) {
            var e_3, _a;
            parent._removeChild(_this);
            _this.scene.ifSome(function (scene) { return scene.addEntity(_this); });
            try {
                for (var _b = tslib_1.__values(_this.components.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var component = _c.value;
                    component.onDetach();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    };
    Entity.prototype.getChildren = function () {
        return this.children;
    };
    Entity.prototype.addChildren = function (children) {
        var _this = this;
        children.forEach(function (child) { return _this._addChild(child); });
        return this;
    };
    Entity.prototype.addChild = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        return this.addChildren(children);
    };
    Entity.prototype.removeChildren = function (children) {
        var _this = this;
        children.forEach(function (child) { return _this._removeChild(child); });
        return this;
    };
    Entity.prototype.removeChild = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        return this.removeChildren(children);
    };
    Entity.prototype.validateRequirements = function () {
        var e_4, _a;
        var _this = this;
        var missingComponents = new Map(), missingPlugins = new Map();
        try {
            for (var _b = tslib_1.__values(this.components), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), Component_2 = _d[0], component = _d[1];
                var missingRequiredComponents = IRequirement_1.filterRequirements(component.getRequiredComponents(), function (C) { return !_this.hasComponent(C); }), missingRequiredPlugins = IRequirement_1.filterRequirements(component.getRequiredPlugins(), function (P) { return !_this.getRequiredScene().hasPlugin(P); });
                if (missingRequiredComponents.length > 0) {
                    missingComponents.set(Component_2, missingRequiredComponents);
                }
                if (missingRequiredComponents.length > 0) {
                    missingPlugins.set(Component_2, missingRequiredPlugins);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (missingComponents.size > 0 || missingPlugins.size > 0) {
            var componentMessage = tslib_1.__spread(missingComponents.entries()).map(function (_a) {
                var _b = tslib_1.__read(_a, 2), component = _b[0], missingRequirements = _b[1];
                return missingRequirements
                    .map(function (missingRequirement) {
                    return "Entity's " + IRequirement_1.requirementToString(component) + " requires " + IRequirement_1.requirementToString(missingRequirement) + " Component";
                })
                    .join("\n");
            })
                .join("\n"), pluginMessage = tslib_1.__spread(missingPlugins.entries()).map(function (_a) {
                var _b = tslib_1.__read(_a, 2), component = _b[0], missingRequirements = _b[1];
                return missingRequirements
                    .map(function (missingRequirement) {
                    return "Entity's " + IRequirement_1.requirementToString(component) + " requires " + IRequirement_1.requirementToString(missingRequirement) + " Plugin";
                })
                    .join("\n");
            })
                .join("\n");
            throw new Error(componentMessage
                ? componentMessage + "\n" + pluginMessage
                : pluginMessage);
        }
    };
    Entity.prototype._addComponent = function (component) {
        var Component = component.getConstructor();
        if (!this.components.has(Component)) {
            component.UNSAFE_setEntity(this);
            this.components.set(Component, component);
            this.scene.ifSome(function (scene) { return scene.UNSAFE_addComponent(component); });
            this.emit("add-component", component);
        }
        return this;
    };
    Entity.prototype._removeComponent = function (Component) {
        var _this = this;
        var componentOption = this.getComponent(Component);
        componentOption.ifSome(function (component) {
            _this.emit("remove-component", component);
            component.UNSAFE_removeEntity();
            _this.components.delete(Component);
            _this.scene.ifSome(function (scene) { return scene.UNSAFE_removeComponent(component); });
        });
        return this;
    };
    Entity.prototype._addChild = function (child) {
        if (this.children.indexOf(child) === -1) {
            if (child.isRoot()) {
                child.scene.ifSome(function (scene) { return scene.removeEntity(child); });
            }
            child.parent.ifSome(function (parent) { return parent._removeChild(child); });
            this.children.push(child);
            child.parent.replace(this);
            child.root = this.root;
            child.setDepth(this.depth + 1);
            this.scene.ifSome(function (scene) { return scene.UNSAFE_addEntityNow(child, true); });
            this.emit("add-child", child);
        }
        return this;
    };
    Entity.prototype._removeChild = function (child) {
        this.scene.ifSome(function (scene) { return scene.UNSAFE_removeEntityNow(child); });
        this.UNSAFE_removeChild(child);
        return this;
    };
    /**
     * @ignore
     */
    Entity.prototype.UNSAFE_removeChild = function (child) {
        var index = this.children.indexOf(child);
        if (index !== -1) {
            this.emit("remove-child", child);
            this.children.splice(index, 1);
            child.scene.clear();
            child.parent.clear();
            child.root = child;
            child.setDepth(0);
        }
        return this;
    };
    Entity.prototype.setDepth = function (depth) {
        this.depth = depth;
        this.children.forEach(function (child) { return child.setDepth(depth + 1); });
        return this;
    };
    Entity.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { name: this.name.unwrapOr(null), tags: tslib_1.__spread(this.tags.values()), children: this.children.map(function (child) { return child.toJSON(); }), components: tslib_1.__spread(this.components.values()).map(function (component) {
                return component.toJSON();
            }) });
    };
    Entity.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        if (json.name) {
            this.name.replace(json.name);
        }
        if (json_1.isJSONArray(json.tags)) {
            this.addTags(json.tags);
        }
        if (json_1.isJSONArray(json.children)) {
            this.addChildren(json.children.map(function (childJSON) {
                return new Entity().fromJSON(childJSON);
            }));
        }
        if (json_1.isJSONArray(json.components)) {
            this.addComponents(json.components.map(function (componentJSON) {
                return Component_1.Component.newFromJSON(componentJSON);
            }));
        }
        return this;
    };
    return Entity;
}(ToFromJSONEventEmitter_1.ToFromJSONEventEmitter));
exports.Entity = Entity;
var IRequirement_1 = require("./IRequirement");
var Component_1 = require("./Component");
