import type { IJSONObject } from "@aicacia/json";
import { Plugin } from "../Plugin";

export class Time extends Plugin {
  static pluginPriority = -Infinity;

  private scale = 1.0;

  private fixedDelta: number = 1.0 / 60.0;

  private frame = 0;
  private last: number = -(1.0 / 60.0);
  private current = 0.0;
  private delta: number = 1.0 / 60.0;
  private fps = 60.0;
  private fpsFrame = 0;
  private fpsLast = 0;

  private startTime: number = Date.now() * 0.001;
  private minDelta = 0.000001;
  private maxDelta = Infinity;

  getStartTime() {
    return this.startTime;
  }

  getDelta() {
    return this.delta * this.scale;
  }
  getRealDelta() {
    return this.delta * this.scale;
  }

  getCurrent() {
    return this.current;
  }

  getMinDelta() {
    return this.minDelta;
  }
  setMinDelta(minDelta: number) {
    this.minDelta = minDelta;
    return this;
  }

  getMaxDelta() {
    return this.maxDelta;
  }
  setMaxDelta(maxDelta: number) {
    this.maxDelta = maxDelta;
    return this;
  }

  getFrame() {
    return this.frame;
  }
  getFps() {
    return this.fps;
  }

  getScale() {
    return this.scale;
  }
  setScale(scale: number) {
    this.scale = scale;
    return this;
  }

  getFixedDelta() {
    return this.fixedDelta * this.scale;
  }
  setFixedDelta(fixedDelta: number) {
    this.fixedDelta = fixedDelta;
    return this;
  }

  now() {
    return Date.now() * 0.001 - this.startTime;
  }

  onUpdate() {
    ++this.frame;

    this.last = this.current;
    this.current = this.now();

    this.fpsFrame++;
    if (this.fpsLast + 1 < this.current) {
      this.fps = this.fpsFrame / (this.current - this.fpsLast);

      this.fpsLast = this.current;
      this.fpsFrame = 0;
    }

    this.delta = (this.current - this.last) * this.scale;
    this.delta =
      this.delta < this.minDelta
        ? this.minDelta
        : this.delta > this.maxDelta
        ? this.maxDelta
        : this.delta;

    return this;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      frame: this.frame,
      scale: this.scale,
      fixedDelta: this.fixedDelta,
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    this.frame = json.frame as number;
    this.scale = json.scale as number;
    this.fixedDelta = json.fixedDelta as number;
    return this;
  }
}
