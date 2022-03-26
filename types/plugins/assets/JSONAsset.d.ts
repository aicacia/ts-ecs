import type { IJSON, IJSONObject } from "@aicacia/json";
import { Asset } from "./Asset";
export declare class JSONAsset extends Asset {
    private json;
    private src;
    private options?;
    constructor(src: RequestInfo, options?: RequestInit);
    getJSON(): IJSON;
    protected loadAsset(): Promise<void>;
    protected unloadAsset(): Promise<void>;
    toJSON(): {
        src: RequestInfo;
        options: RequestInit | undefined;
        uuid: string;
        name: string;
    };
    fromJSON(json: IJSONObject): this;
}
