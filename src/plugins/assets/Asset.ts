import { IJSONObject } from "@aicacia/json";
import { v4 } from "uuid";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";

// tslint:disable-next-line: interface-name
export interface Asset {
  on(event: "load" | "unload", listener: () => void): this;
  on(
    event: "load-error" | "unload-error",
    listener: (error: Error) => void
  ): this;
}

export abstract class Asset extends ToFromJSONEventEmitter {
  private uuid = v4();
  private name = "";
  private loaded = false;
  private loading = false;

  getUUID() {
    return this.uuid;
  }
  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  isLoaded() {
    return this.loaded;
  }
  isLoading() {
    return this.loading;
  }

  load() {
    if (this.loaded) {
      return Promise.resolve();
    } else {
      this.loading = true;
      return this.loadAsset()
        .then(() => {
          this.loading = false;
          this.loaded = true;
          this.emit("load");
        })
        .catch((error) => {
          this.loading = true;
          this.emit("load-error", error);
          throw error;
        });
    }
  }

  unload() {
    if (!this.loaded) {
      return Promise.resolve();
    } else {
      return this.unloadAsset()
        .then(() => {
          this.loaded = false;
          this.emit("unload");
        })
        .catch((error) => {
          this.emit("unload-error", error);
          throw error;
        });
    }
  }

  protected abstract loadAsset(): Promise<void>;
  protected abstract unloadAsset(): Promise<void>;

  toJSON() {
    return {
      ...super.toJSON(),
      uuid: this.uuid,
      name: this.name,
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    this.uuid = json.uuid as string;
    this.name = json.name as string;
    return this;
  }
}
