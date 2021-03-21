import { IJSON, IJSONObject } from "@aicacia/json";
import { Asset } from "./Asset";
export declare class RawJSONAsset extends Asset {
    private json;
    constructor(json: IJSON);
    getJSON(): IJSON;
    protected loadAsset(): Promise<void>;
    protected unloadAsset(): Promise<void>;
    toJSON(): {
        json: IJSON;
        uuid: string;
        name: string;
    };
    fromJSON(json: IJSONObject): this;
}
