import type { IJSONObject } from "@aicacia/json";

export class SpriteClip {
  private duration = 1.0;
  private x = 0;
  private y = 0;
  private width = 1;
  private height = 1;

  getDuration() {
    return this.duration;
  }
  setDuration(duration: number) {
    this.duration = duration;
    return this;
  }

  getX() {
    return this.x;
  }
  setX(x: number) {
    this.x = x;
    return this;
  }

  getY() {
    return this.y;
  }
  setY(y: number) {
    this.y = y;
    return this;
  }

  getWidth() {
    return this.width;
  }
  setWidth(width: number) {
    this.width = width;
    return this;
  }

  getHeight() {
    return this.height;
  }
  setHeight(height: number) {
    this.height = height;
    return this;
  }

  toJSON() {
    return {
      duration: this.duration,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  fromJSON(json: IJSONObject) {
    this.duration = json.duration as number;
    this.x = json.x as number;
    this.y = json.y as number;
    this.width = json.width as number;
    this.height = json.height as number;
    return this;
  }
}
