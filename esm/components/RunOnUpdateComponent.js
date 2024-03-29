import { RenderableComponent } from "./RenderableComponent";
export class RunOnUpdateComponent extends RenderableComponent {
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
