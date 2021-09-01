import { requestAnimationFrame, cancelAnimationFrame, } from "./requestAnimationFrame";
import { Plugin } from "../Plugin";
export class Loop extends Plugin {
    constructor() {
        super(...arguments);
        this.id = null;
        this.running = false;
        this.resolves = [];
        this.run = (_ms) => {
            this.getRequiredScene().update();
            if (this.running) {
                this.request();
            }
            else if (this.resolves.length) {
                const resolves = this.resolves;
                this.resolves = [];
                for (const resolve of resolves) {
                    resolve();
                }
            }
            return this;
        };
    }
    promise() {
        if (this.running) {
            return new Promise((resolve) => this.resolves.push(resolve));
        }
        else {
            return Promise.resolve();
        }
    }
    start() {
        if (!this.running) {
            this.running = true;
            this.request();
        }
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
    onInit() {
        this.start();
        return this;
    }
}
