import type { Component } from "./Component";
import { DefaultManager } from "./DefaultManager";

export class DefaultDescriptorManager<
  C extends Component = Component
> extends DefaultManager<C> {
  onInit() {
    return this;
  }
  onUpdate() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
}
