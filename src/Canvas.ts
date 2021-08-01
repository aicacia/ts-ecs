import { EventEmitter } from "events";

// tslint:disable-next-line: interface-name
export interface Entity {
  on(
    event: "resize",
    listener: (
      width: number,
      height: number,
      prevWidth: number,
      prevHeight: number
    ) => void
  ): this;
  off(
    event: "resize",
    listener: (
      width: number,
      height: number,
      prevWidth: number,
      prevHeight: number
    ) => void
  ): this;
}

export abstract class Canvas extends EventEmitter {
  private width = 1;
  private height = 1;

  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

  setWidth(width: number) {
    return this.set(width, this.height);
  }
  setHeight(height: number) {
    return this.set(this.width, height);
  }

  set(width: number, height: number) {
    const prevWidth = this.width,
      prevHeight = this.height;

    if (width !== prevWidth || height !== prevHeight) {
      this.width = width;
      this.height = height;

      this.onResize();
      this.emit("resize", width, height, prevWidth, prevHeight);
    }
    return this;
  }

  abstract onResize(): this;
}
