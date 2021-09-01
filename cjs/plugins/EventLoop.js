"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLoop = void 0;
const requestAnimationFrame_1 = require("./requestAnimationFrame");
const input_1 = require("./input");
const Plugin_1 = require("../Plugin");
class EventLoop extends Plugin_1.Plugin {
    constructor() {
        super(...arguments);
        this.id = null;
        this.running = false;
        this.start = () => {
            if (!this.running) {
                this.running = true;
                this.request();
            }
        };
        this.run = (_ms) => {
            this.id = null;
            this.getRequiredScene().update();
            this.running = false;
            return this;
        };
    }
    onInit() {
        this.getRequiredPlugin(input_1.Input).on("event", this.start);
        this.start();
        return this;
    }
    onRemove() {
        this.getRequiredPlugin(input_1.Input).off("event", this.start);
        return this;
    }
    stop() {
        this.running = false;
        if (this.id !== null) {
            requestAnimationFrame_1.cancelAnimationFrame(this.id);
            this.id = null;
        }
        return this;
    }
    isStopped() {
        return this.running === false;
    }
    request() {
        this.id = requestAnimationFrame_1.requestAnimationFrame(this.run);
        return this;
    }
}
exports.EventLoop = EventLoop;
EventLoop.requiredPlugins = [input_1.Input];
