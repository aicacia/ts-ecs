import raf = require("raf");
import { Input } from "./input";
import { Plugin } from "../Plugin";

export class EventLoop extends Plugin {
  static requiredPlugins = [Input];
  private id: number | null = null;
  private running = false;

  onInit() {
    this.getRequiredPlugin(Input).on("event", this.start);
    this.start();
    return this;
  }
  onRemove() {
    this.getRequiredPlugin(Input).off("event", this.start);
    return this;
  }

  start = () => {
    if (!this.running) {
      this.running = true;
      this.request();
    }
  };
  stop() {
    this.running = false;

    if (this.id !== null) {
      raf.cancel(this.id);
      this.id = null;
    }
    return this;
  }
  isStopped() {
    return this.running === false;
  }

  private run = (_ms: number) => {
    this.id = null;
    this.getRequiredScene().update();
    this.running = false;
    return this;
  };

  private request() {
    this.id = raf(this.run);
    return this;
  }
}
