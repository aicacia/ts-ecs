import type { Component } from "./Component";
import { DefaultManager } from "./DefaultManager";
export declare class DefaultDescriptorManager<C extends Component = Component> extends DefaultManager<C> {
    onInit(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
}
