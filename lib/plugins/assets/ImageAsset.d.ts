import { Asset } from "./Asset";
export declare abstract class ImageAsset extends Asset {
    abstract getWidth(): number;
    abstract getHeight(): number;
}
