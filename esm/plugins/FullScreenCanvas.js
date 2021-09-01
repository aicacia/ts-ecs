import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { Input } from "./input";
export class FullScreenCanvas extends RunOnUpdatePlugin {
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
        this.getRequiredPlugin(Input).on("resize", this.onResizeEventListener);
        return this;
    }
    onRemove() {
        this.getRequiredPlugin(Input).off("resize", this.onResizeEventListener);
        return this;
    }
    onResize() {
        const input = this.getRequiredPlugin(Input);
        this.canvas.set(input.getButtonValue("screen-width"), input.getButtonValue("screen-height"));
    }
}
FullScreenCanvas.toFromJSONEnabled = false;
FullScreenCanvas.requiredPlugins = [Input];
