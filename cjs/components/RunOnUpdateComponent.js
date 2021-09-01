"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunOnUpdateComponent = void 0;
const RenderableComponent_1 = require("./RenderableComponent");
class RunOnUpdateComponent extends RenderableComponent_1.RenderableComponent {
    constructor() {
        super(...arguments);
        this.queue = [];
        this.swap = [];
    }
    runOnUpdate(...fns) {
        this.queue.push(...fns);
        return this;
    }
    onUpdate() {
        if (this.queue.length > 0) {
            const queue = this.queue;
            this.queue = this.swap;
            this.swap = queue;
            for (const fn of queue) {
                fn.call(this);
            }
            this.swap.length = 0;
        }
        return this;
    }
}
exports.RunOnUpdateComponent = RunOnUpdateComponent;
