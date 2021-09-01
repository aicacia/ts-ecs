"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreenCanvas = void 0;
const RunOnUpdatePlugin_1 = require("./RunOnUpdatePlugin");
const input_1 = require("./input");
class FullScreenCanvas extends RunOnUpdatePlugin_1.RunOnUpdatePlugin {
    constructor(canvas) {
        super();
        this.onResizeEventListener = () => {
            this.runOnUpdate(this.onResize);
        };
        this.canvas = canvas;
    }
    getCanvas() {
        return this.canvas;
    }
    onAdd() {
        this.getRequiredPlugin(input_1.Input).on("resize", this.onResizeEventListener);
        return this;
    }
    onRemove() {
        this.getRequiredPlugin(input_1.Input).off("resize", this.onResizeEventListener);
        return this;
    }
    onResize() {
        const input = this.getRequiredPlugin(input_1.Input);
        this.canvas.set(input.getButtonValue("screen-width"), input.getButtonValue("screen-height"));
    }
}
exports.FullScreenCanvas = FullScreenCanvas;
FullScreenCanvas.toFromJSONEnabled = false;
FullScreenCanvas.requiredPlugins = [input_1.Input];
