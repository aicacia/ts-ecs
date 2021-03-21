import { Option } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { ImageAsset } from "../../../plugins/assets/ImageAsset";
export declare class WebImageAsset extends ImageAsset {
    private image;
    private src;
    constructor(src: string);
    getImage(): Option<HTMLImageElement>;
    getWidth(): number;
    getHeight(): number;
    protected loadAsset(): Promise<void>;
    protected unloadAsset(): Promise<void>;
    toJSON(): {
        src: string;
        uuid: string;
        name: string;
    };
    fromJSON(json: IJSONObject): this;
}
