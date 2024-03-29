import type { IJSON, IJSONObject } from "@aicacia/json";
import { Asset } from "./Asset";

export class JSONAsset extends Asset {
  private json: IJSON = null;
  private src: RequestInfo;
  private options?: RequestInit;

  constructor(src: RequestInfo, options?: RequestInit) {
    super();
    this.src = src;
    this.options = options;
  }

  getJSON() {
    return this.json;
  }

  protected loadAsset() {
    return fetch(this.src, this.options)
      .then((response) => response.json())
      .then((json) => {
        this.json = json;
      });
  }

  protected unloadAsset() {
    this.json = null;
    return Promise.resolve();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      src: this.src,
      options: this.options,
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    this.src = json.src as RequestInfo;
    this.options = json.options as RequestInit;
    return this;
  }
}
