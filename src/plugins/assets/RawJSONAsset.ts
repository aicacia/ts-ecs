import { IJSON, IJSONObject } from "@aicacia/json";
import { Asset } from "./Asset";

export class RawJSONAsset extends Asset {
  private json: IJSON;

  constructor(json: IJSON) {
    super();
    this.json = json;
  }

  getJSON() {
    return this.json;
  }

  protected loadAsset() {
    return Promise.resolve();
  }

  protected unloadAsset() {
    return Promise.resolve();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      json: this.json,
    };
  }
  fromJSON(json: IJSONObject) {
    super.fromJSON(json);
    this.json = json.json as IJSON;
    return this;
  }
}
