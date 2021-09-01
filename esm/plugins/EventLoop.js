import { requestAnimationFrame, cancelAnimationFrame, } from "./requestAnimationFrame";
import { Input } from "./input";
import { Plugin } from "../Plugin";
export class EventLoop extends Plugin {
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
        this.getRequiredPlugin(Input).on("event", this.start);
        this.start();
        return this;
    }
    onRemove() {
        this.getRequiredPlugin(Input).off("event", this.start);
        return this;
    }
    stop() {
        this.running = false;
        if (this.id !== null) {
            cancelAnimationFrame(this.id);
            this.id = null;
        }
        return this;
    }
    isStopped() {
        return this.running === false;
    }
    request() {
        this.id = requestAnimationFrame(this.run);
        return this;
    }
}
EventLoop.requiredPlugins = [Input];
