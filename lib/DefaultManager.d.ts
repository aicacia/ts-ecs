import type { Component } from "./Component";
import { Manager } from "./Manager";
export declare class DefaultManager<C extends Component = Component> extends Manager<C> {
    private components;
    getComponents(): C[];
    addComponent(component: C): this;
    removeComponent(component: C): this;
    isEmpty(): boolean;
    sortFunction: (a: C, b: C) => number;
    sort(): this;
    onInit(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
}
