import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from "./requestAnimationFrame";
import { Plugin } from "../Plugin";

export type ILoopHandler = (ms: number) => void;

export class Loop extends Plugin {
  private id: number | null = null;
  private running = false;
  private resolves: Array<() => void> = [];

  promise(): Promise<void> {
    if (this.running) {
      return new Promise((resolve) => this.resolves.push(resolve));
    } else {
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

  private run = (_ms: number) => {
    this.getRequiredScene().update();

    if (this.running) {
      this.request();
    } else if (this.resolves.length) {
      const resolves = this.resolves;

      this.resolves = [];

      for (const resolve of resolves) {
        resolve();
      }
    }
    return this;
  };

  private request() {
    this.id = requestAnimationFrame(this.run);
    return this;
  }

  onInit() {
    this.start();
    return this;
  }
}
