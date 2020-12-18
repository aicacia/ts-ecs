import type { Component } from "./Component";
import { Manager } from "./Manager";

export class DefaultManager<
  C extends Component = Component
> extends Manager<C> {
  private components: C[] = [];

  getComponents() {
    return this.components;
  }

  addComponent(component: C) {
    this.components.push(component);
    return this;
  }
  removeComponent(component: C) {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);
    }

    return this;
  }
  isEmpty() {
    return this.components.length === 0;
  }

  sortFunction = (a: C, b: C) => {
    return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
  };

  sort() {
    this.components.sort(this.sortFunction);
    return this;
  }

  onInit() {
    this.components.forEach((component) => component.onInit());
    return this;
  }
  onUpdate() {
    this.components.forEach((component) => component.onUpdate());
    return this;
  }
  onAfterUpdate() {
    this.components.forEach((component) => component.onAfterUpdate());
    return this;
  }
}
