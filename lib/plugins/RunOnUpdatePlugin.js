"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunOnUpdatePlugin = void 0;
const Plugin_1 = require("../Plugin");
class RunOnUpdatePlugin extends Plugin_1.Plugin {
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
exports.RunOnUpdatePlugin = RunOnUpdatePlugin;
