import { Component } from "../Component";
export class RenderableComponent extends Component {
    constructor() {
        super(...arguments);
        this.renderable = true;
    }
    getRenderable() {
        return this.renderable;
    }
    setRenderable(renderable = true) {
        this.renderable = renderable;
        return this;
    }
}
