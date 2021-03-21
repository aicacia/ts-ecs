import { Canvas } from "../Canvas";

export class WebCanvas extends Canvas {
  private canvas: HTMLCanvasElement;

  constructor(canvas?: HTMLCanvasElement) {
    super();

    this.canvas = canvas ? canvas : document.createElement("canvas");
    this.set(this.canvas.width, this.canvas.height);
  }

  getElement() {
    return this.canvas;
  }

  onResize() {
    this.canvas.width = this.getWidth();
    this.canvas.height = this.getHeight();
    this.canvas.style.width = `${this.getWidth()}px`;
    this.canvas.style.height = `${this.getHeight()}px`;
    return this;
  }

  getImageURI() {
    return this.canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
  }

  getStream(fps = 60): MediaStream {
    return (this.canvas as any).captureStream(fps);
  }
}
