import { Asset } from "./Asset";

export abstract class ImageAsset extends Asset {
  abstract getWidth(): number;
  abstract getHeight(): number;
}
