"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultManager = void 0;
const Manager_1 = require("./Manager");
class DefaultManager extends Manager_1.Manager {
    constructor() {
        super(...arguments);
        this.components = [];
        this.sortFunction = (a, b) => {
            return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
        };
    }
    getComponents() {
        return this.components;
    }
    addComponent(component) {
        this.components.push(component);
        return this;
    }
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
        return this;
    }
    isEmpty() {
        return this.components.length === 0;
    }
    sort() {
        this.components.sort(this.sortFunction);
        return this;
    }
    onInit() {
        for (const component of this.components) {
            component.onInit();
        }
        return this;
    }
    onUpdate() {
        for (const component of this.components) {
            component.onUpdate();
        }
        return this;
    }
    onAfterUpdate() {
        for (const component of this.components) {
            component.onAfterUpdate();
        }
        return this;
    }
}
exports.DefaultManager = DefaultManager;
