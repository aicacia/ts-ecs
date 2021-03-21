import { IJSONObject } from "@aicacia/json";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
export interface Asset {
    on(event: "load" | "unload", listener: () => void): this;
    on(event: "load-error" | "unload-error", listener: (error: Error) => void): this;
}
export declare abstract class Asset extends ToFromJSONEventEmitter {
    private uuid;
    private name;
    private loaded;
    private loading;
    getUUID(): string;
    getName(): string;
    setName(name: string): this;
    isLoaded(): boolean;
    isLoading(): boolean;
    load(): Promise<void>;
    unload(): Promise<void>;
    protected abstract loadAsset(): Promise<void>;
    protected abstract unloadAsset(): Promise<void>;
    toJSON(): {
        uuid: string;
        name: string;
    };
    fromJSON(json: IJSONObject): this;
}
