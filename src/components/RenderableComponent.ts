import { Component } from "../Component";

export class RenderableComponent extends Component {
  private renderable = true;

  getRenderable() {
    return this.renderable;
  }
  setRenderable(renderable = true) {
    this.renderable = renderable;
    return this;
  }
}
