"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderableComponent = void 0;
const Component_1 = require("../Component");
class RenderableComponent extends Component_1.Component {
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
exports.RenderableComponent = RenderableComponent;
