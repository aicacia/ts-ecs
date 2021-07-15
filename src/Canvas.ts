import { EventEmitter } from "events";

// tslint:disable-next-line: interface-name
export interface Entity {
  on(
    event: "resize",
    listener: (
      width: number,
      height: number,
      origWidth: number,
      origHeight: number
    ) => void
  ): this;
  off(
    event: "resize",
    listener: (
      width: number,
      height: number,
      origWidth: number,
      origHeight: number
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
    const origWidth = this.width,
      origHeight = this.height;

    if (width !== origWidth || height !== origHeight) {
      this.width = width;
      this.height = height;

      this.onResize();
      this.emit("resize", width, height, origWidth, origHeight);
    }
    return this;
  }

  abstract onResize(): this;
}
