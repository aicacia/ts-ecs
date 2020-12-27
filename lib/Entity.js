"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const json_1 = require("@aicacia/json");
const core_1 = require("@aicacia/core");
const ToFromJSONEventEmitter_1 = require("./ToFromJSONEventEmitter");
class Entity extends ToFromJSONEventEmitter_1.ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.name = core_1.none();
        this.depth = 0;
        this.scene = core_1.none();
        this.root = this;
        this.parent = core_1.none();
        this.tags = new Set();
        this.children = [];
        this.components = new Map();
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
        tags.forEach((tag) => this.tags.add(tag));
        return this;
    }
    removeTag(...tags) {
        return this.removeTags(tags);
    }
    removeTags(tags) {
        tags.forEach((tag) => this.tags.delete(tag));
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
        return this.parent.isSome();
    }
    getParent() {
        return this.parent;
    }
    hasScene() {
        return this.scene.isSome();
    }
    getScene() {
        return this.scene;
    }
    getRequiredScene() {
        return this.getScene().expect("Entity expected to have a Scene");
    }
    /**
     * @ignore
     */
    UNSAFE_setScene(scene, recur = false) {
        this.scene.replace(scene);
        if (recur) {
            this.forEachChild((child) => child.UNSAFE_setScene(scene, recur), false);
        }
        return this;
    }
    /**
     * @ignore
     */
    UNSAFE_removeScene() {
        this.scene.clear();
        return this;
    }
    forEachChild(fn, recur = true) {
        this.getChildren().forEach((child) => {
            fn(child);
            if (recur) {
                child.forEachChild(fn, recur);
            }
        });
        return this;
    }
    find(fn, recur = true) {
        const children = this.getChildren();
        for (const child of children) {
            if (fn(child)) {
                return core_1.some(child);
            }
            else if (recur) {
                const found = child.find(fn, recur);
                if (found.isSome()) {
                    return found;
                }
            }
        }
        return core_1.none();
    }
    findWithName(name) {
        return this.find((child) => child.name.map((childName) => childName === name).unwrapOr(false));
    }
    findWithTag(...tags) {
        return this.find((entity) => entity.hasTags(tags));
    }
    findWithTags(tags) {
        return this.findWithTag(...tags);
    }
    findWithComponent(Component) {
        return this.find((entity) => entity.getComponent(Component).isSome());
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
        return this.findAll((child) => child.name.map((childName) => childName === name).unwrapOr(false), recur);
    }
    findAllWithTag(...tags) {
        return this.findAll((entity) => entity.hasTags(tags));
    }
    findAllWithTags(tags) {
        return this.findAllWithTag(...tags);
    }
    findAllWithComponent(Component, recur = true) {
        return this.findAll((entity) => entity.getComponent(Component).isSome(), recur);
    }
    findParent(fn) {
        return this.getParent().flatMap((parent) => {
            if (fn(parent)) {
                return core_1.some(parent);
            }
            else {
                return parent.findParent(fn);
            }
        });
    }
    getComponents() {
        return this.components;
    }
    hasComponent(Component) {
        return this.getComponent(Component).isSome();
    }
    getComponent(Component) {
        return core_1.Option.from(this.components.get(Component));
    }
    getRequiredComponent(Component) {
        return this.getComponent(Component).expect(`Entity expected to have a ${Component} Component`);
    }
    getComponentInstanceOf(Component) {
        return core_1.iter(this.components.values()).find((component) => component instanceof Component);
    }
    getComponentsInstanceOf(Component) {
        return core_1.iter(this.components.values())
            .filter((component) => component instanceof Component)
            .toArray();
    }
    addComponents(components) {
        components.forEach((component) => this._addComponent(component));
        return this;
    }
    addComponent(...components) {
        return this.addComponents(components);
    }
    removeComponents(components) {
        components.forEach((component) => this._removeComponent(component));
        return this;
    }
    removeComponent(...components) {
        return this.removeComponents(components);
    }
    removeFromScene() {
        this.scene.ifSome((scene) => {
            scene.removeEntity(this);
        });
    }
    detach() {
        this.parent.ifSome((parent) => {
            parent._removeChild(this);
            this.scene.ifSome((scene) => scene.addEntity(this));
            for (const component of this.components.values()) {
                component.onDetach();
            }
        });
    }
    getChildren() {
        return this.children;
    }
    addChildren(children) {
        children.forEach((child) => this._addChild(child));
        return this;
    }
    addChild(...children) {
        return this.addChildren(children);
    }
    removeChildren(children) {
        children.forEach((child) => this._removeChild(child));
        return this;
    }
    removeChild(...children) {
        return this.removeChildren(children);
    }
    validateRequirements() {
        const missingComponents = new Map(), missingPlugins = new Map();
        for (const [Component, component] of this.components) {
            const missingRequiredComponents = IRequirement_1.filterRequirements(component.getRequiredComponents(), (C) => !this.hasComponent(C)), missingRequiredPlugins = IRequirement_1.filterRequirements(component.getRequiredPlugins(), (P) => !this.getRequiredScene().hasPlugin(P));
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
                .map((missingRequirement) => `Entity's ${IRequirement_1.requirementToString(component)} requires ${IRequirement_1.requirementToString(missingRequirement)} Component`)
                .join("\n"))
                .join("\n"), pluginMessage = [...missingPlugins.entries()]
                .map(([component, missingRequirements]) => missingRequirements
                .map((missingRequirement) => `Entity's ${IRequirement_1.requirementToString(component)} requires ${IRequirement_1.requirementToString(missingRequirement)} Plugin`)
                .join("\n"))
                .join("\n");
            throw new Error(componentMessage
                ? `${componentMessage}\n${pluginMessage}`
                : pluginMessage);
        }
    }
    _addComponent(component) {
        const Component = component.getConstructor();
        if (!this.components.has(Component)) {
            component.UNSAFE_setEntity(this);
            this.components.set(Component, component);
            this.scene.ifSome((scene) => scene.UNSAFE_addComponent(component));
            this.emit("add-component", component);
        }
        return this;
    }
    _removeComponent(Component) {
        const componentOption = this.getComponent(Component);
        componentOption.ifSome((component) => {
            this.emit("remove-component", component);
            component.UNSAFE_removeEntity();
            this.components.delete(Component);
            this.scene.ifSome((scene) => scene.UNSAFE_removeComponent(component));
        });
        return this;
    }
    _addChild(child) {
        if (this.children.indexOf(child) === -1) {
            if (child.isRoot()) {
                child.scene.ifSome((scene) => scene.removeEntity(child));
            }
            child.parent.ifSome((parent) => parent._removeChild(child));
            this.children.push(child);
            child.parent.replace(this);
            child.root = this.root;
            child.setDepth(this.depth + 1);
            this.scene.ifSome((scene) => scene.UNSAFE_addEntityNow(child, true));
            this.emit("add-child", child);
        }
        return this;
    }
    _removeChild(child) {
        this.scene.ifSome((scene) => scene.UNSAFE_removeEntityNow(child));
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
            child.scene.clear();
            child.parent.clear();
            child.root = child;
            child.setDepth(0);
        }
        return this;
    }
    setDepth(depth) {
        this.depth = depth;
        this.children.forEach((child) => child.setDepth(depth + 1));
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { name: this.name.unwrapOr(null), tags: [...this.tags.values()], children: this.children.map((child) => child.toJSON()), components: [...this.components.values()].map((component) => component.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (json.name) {
            this.name.replace(json.name);
        }
        if (json_1.isJSONArray(json.tags)) {
            this.addTags(json.tags);
        }
        if (json_1.isJSONArray(json.children)) {
            this.addChildren(json.children.map((childJSON) => new Entity().fromJSON(childJSON)));
        }
        if (json_1.isJSONArray(json.components)) {
            this.addComponents(json.components.map((componentJSON) => Component_1.Component.newFromJSON(componentJSON)));
        }
        return this;
    }
}
exports.Entity = Entity;
const IRequirement_1 = require("./IRequirement");
const Component_1 = require("./Component");
