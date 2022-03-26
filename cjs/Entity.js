"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const json_1 = require("@aicacia/json");
const IRequirement_1 = require("./IRequirement");
const Component_1 = require("./Component");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Entity extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.name = null;
        this.depth = 0;
        this.scene = null;
        this.root = this;
        this.parent = null;
        this.tags = new Set();
        this.children = [];
        this.components = new Map();
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    removeName() {
        this.name = null;
        return this;
    }
    hasTags(tags) {
        return tags.every((tag) => this.tags.has(tag));
    }
    hasTag(...tags) {
        return this.hasTags(tags);
    }
    getTags() {
        return this.tags;
    }
    addTags(tags) {
        for (const tag of tags) {
            this.tags.add(tag);
        }
        return this;
    }
    removeTag(...tags) {
        return this.removeTags(tags);
    }
    removeTags(tags) {
        for (const tag of tags) {
            this.tags.delete(tag);
        }
        return this;
    }
    clearTags() {
        this.tags.clear();
        return this;
    }
    addTag(...tags) {
        return this.addTags(tags);
    }
    getDepth() {
        return this.depth;
    }
    getRoot() {
        return this.root;
    }
    isRoot() {
        return this.root === this;
    }
    hasParent() {
        return this.parent !== null;
    }
    getParent() {
        return this.parent;
    }
    hasScene() {
        return this.scene !== null;
    }
    getScene() {
        return this.scene;
    }
    getRequiredScene() {
        const scene = this.getScene();
        if (!scene) {
            throw new Error("Entity expected to have a Scene");
        }
        return scene;
    }
    /**
     * @ignore
     */
    UNSAFE_setScene(scene, recur = false) {
        this.scene = scene;
        if (recur) {
            for (const child of this.children) {
                child.UNSAFE_setScene(scene, recur);
            }
        }
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeScene() {
        this.scene = null;
        return this;
    }
    forEachChild(fn, recur = true) {
        for (const child of this.getChildren()) {
            if (fn(child) === false) {
                break;
            }
            if (recur) {
                child.forEachChild(fn, recur);
            }
        }
        return this;
    }
    find(fn, recur = true) {
        for (const child of this.getChildren()) {
            if (fn(child)) {
                return child;
            }
            else if (recur) {
                const found = child.find(fn, recur);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }
    findWithName(name) {
        return this.find((child) => child.name === name);
    }
    findWithTag(...tags) {
        return this.find((entity) => entity.hasTags(tags));
    }
    findWithTags(tags) {
        return this.findWithTag(...tags);
    }
    findWithComponent(Component) {
        return this.find((entity) => entity.getComponent(Component) !== null);
    }
    findAll(fn, recur = true) {
        const children = this.getChildren(), matching = [];
        for (const child of children) {
            if (fn(child)) {
                matching.push(child);
            }
            else if (recur) {
                matching.push(...child.findAll(fn, recur));
            }
        }
        return matching;
    }
    findAllWithName(name, recur = true) {
        return this.findAll((child) => name === child.name, recur);
    }
    findAllWithTag(...tags) {
        return this.findAll((entity) => entity.hasTags(tags));
    }
    findAllWithTags(tags) {
        return this.findAllWithTag(...tags);
    }
    findAllWithComponent(Component, recur = true) {
        return this.findAll((entity) => entity.getComponent(Component) !== null, recur);
    }
    findParent(fn) {
        const parent = this.getParent();
        if (parent) {
            if (fn(parent)) {
                return parent;
            }
            else {
                return parent.findParent(fn);
            }
        }
        else {
            return undefined;
        }
    }
    getComponents() {
        return this.components;
    }
    hasComponent(Component) {
        return this.getComponent(Component) !== null;
    }
    getComponent(Component) {
        return this.components.get(Component) || null;
    }
    getRequiredComponent(Component) {
        const component = this.getComponent(Component);
        if (!component) {
            throw new Error(`Entity expected to have a ${Component} Component`);
        }
        return component;
    }
    getComponentInstanceOf(Component) {
        for (const component of this.components.values()) {
            if (component instanceof Component) {
                return component;
            }
        }
        return null;
    }
    getComponentsInstanceOf(Component) {
        return Array.from(this.components.values()).filter((component) => component instanceof Component);
    }
    addComponents(components) {
        for (const component of components) {
            this._addComponent(component);
        }
        return this;
    }
    addComponent(...components) {
        return this.addComponents(components);
    }
    removeComponents(Components) {
        for (const Component of Components) {
            this._removeComponent(Component);
        }
        return this;
    }
    removeComponent(...components) {
        return this.removeComponents(components);
    }
    removeFromScene() {
        const scene = this.scene;
        if (scene) {
            scene.removeEntity(this);
        }
    }
    detach() {
        const parent = this.parent;
        if (parent) {
            parent._removeChild(this);
            const scene = this.scene;
            if (scene) {
                scene.addEntity(this);
            }
            for (const component of this.components.values()) {
                component.onDetach();
            }
        }
    }
    getChildren() {
        return this.children;
    }
    addChildren(children) {
        for (const child of children) {
            this._addChild(child);
        }
        return this;
    }
    addChild(...children) {
        return this.addChildren(children);
    }
    removeChildren(children) {
        for (const child of children) {
            this._removeChild(child);
        }
        return this;
    }
    removeChild(...children) {
        return this.removeChildren(children);
    }
    validateRequirements() {
        const missingComponents = new Map(), missingPlugins = new Map();
        for (const [Component, component] of this.components) {
            const missingRequiredComponents = (0, IRequirement_1.filterRequirements)(component.getRequiredComponents(), (C) => !this.hasComponent(C)), missingRequiredPlugins = (0, IRequirement_1.filterRequirements)(component.getRequiredPlugins(), (P) => !this.getRequiredScene().hasPlugin(P));
            if (missingRequiredComponents.length > 0) {
                missingComponents.set(Component, missingRequiredComponents);
            }
            if (missingRequiredComponents.length > 0) {
                missingPlugins.set(Component, missingRequiredPlugins);
            }
        }
        if (missingComponents.size > 0 || missingPlugins.size > 0) {
            const componentMessage = [...missingComponents.entries()]
                .map(([component, missingRequirements]) => missingRequirements
                .map((missingRequirement) => `Entity's ${(0, IRequirement_1.requirementToString)(component)} requires ${(0, IRequirement_1.requirementToString)(missingRequirement)} Component`)
                .join("\n"))
                .join("\n"), pluginMessage = [...missingPlugins.entries()]
                .map(([component, missingRequirements]) => missingRequirements
                .map((missingRequirement) => `Entity's ${(0, IRequirement_1.requirementToString)(component)} requires ${(0, IRequirement_1.requirementToString)(missingRequirement)} Plugin`)
                .join("\n"))
                .join("\n");
            throw new Error(componentMessage
                ? `${componentMessage}\n${pluginMessage}`
                : pluginMessage);
        }
    }
    _addComponent(component) {
        var _a;
        const Component = component.getConstructor();
        if (!this.components.has(Component)) {
            component.UNSAFE_setEntity(this);
            this.components.set(Component, component);
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.UNSAFE_addComponent(component);
            this.emit("add-component", component);
        }
        return this;
    }
    _removeComponent(Component) {
        var _a;
        const component = this.getComponent(Component);
        if (component) {
            this.emit("remove-component", component);
            component.UNSAFE_removeEntity();
            this.components.delete(Component);
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.UNSAFE_removeComponent(component);
        }
        return this;
    }
    _addChild(child) {
        var _a, _b, _c;
        if (this.children.indexOf(child) === -1) {
            if (child.isRoot()) {
                (_a = child.scene) === null || _a === void 0 ? void 0 : _a.removeEntity(child);
            }
            (_b = child.parent) === null || _b === void 0 ? void 0 : _b._removeChild(child);
            this.children.push(child);
            child.parent = this;
            child.root = this.root;
            child.setDepth(this.depth + 1);
            (_c = this.scene) === null || _c === void 0 ? void 0 : _c.UNSAFE_addEntityNow(child, true);
            this.emit("add-child", child);
        }
        return this;
    }
    _removeChild(child) {
        var _a;
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.UNSAFE_removeEntityNow(child);
        this.UNSAFE_removeChild(child);
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.emit("remove-child", child);
            this.children.splice(index, 1);
            child.scene = null;
            child.parent = null;
            child.root = child;
            child.setDepth(0);
        }
        return this;
    }
    setDepth(depth) {
        this.depth = depth;
        for (const child of this.children) {
            child.setDepth(depth + 1);
        }
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { name: this.name, tags: [...this.tags.values()], children: this.children.map((child) => child.toJSON()), components: [...this.components.values()].map((component) => component.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (json.name) {
            this.name = json.name;
        }
        if ((0, json_1.isJSONArray)(json.tags)) {
            this.addTags(json.tags);
        }
        if ((0, json_1.isJSONArray)(json.children)) {
            this.addChildren(json.children.map((childJSON) => new Entity().fromJSON(childJSON)));
        }
        if ((0, json_1.isJSONArray)(json.components)) {
            this.addComponents(json.components.map((componentJSON) => Component_1.Component.newFromJSON(componentJSON)));
        }
        return this;
    }
}
exports.Entity = Entity;
