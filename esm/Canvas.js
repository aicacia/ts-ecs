import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";
export class Canvas extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.width = 1;
        this.height = 1;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    setWidth(width) {
        return this.set(width, this.height);
    }
    setHeight(height) {
        return this.set(this.width, height);
    }
    set(width, height) {
        const prevWidth = this.width, prevHeight = this.height;
        if (width !== prevWidth || height !== prevHeight) {
            this.width = width;
            this.height = height;
            this.onResize();
            this.emit("resize", width, height, prevWidth, prevHeight);
        }
        return this;
    }
}
