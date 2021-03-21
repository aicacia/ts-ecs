import { Canvas } from "../Canvas";
import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { Input } from "./input";
import type { IRequirement } from "../IRequirement";
import { Plugin } from "../Plugin";

export class FullScreenCanvas extends RunOnUpdatePlugin {
  static toFromJSONEnabled = false;
  static requiredPlugins: IRequirement<Plugin>[] = [Input];

  private canvas: Canvas;

  constructor(canvas: Canvas) {
    super();

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

  private onResizeEventListener = () => {
    this.runOnUpdate(this.onResize);
  };

  private onResize() {
    const input = this.getRequiredPlugin(Input);
    this.canvas.set(
      input.getButtonValue("screen-width"),
      input.getButtonValue("screen-height")
    );
  }
}
