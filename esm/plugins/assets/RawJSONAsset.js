import { Asset } from "./Asset";
export class RawJSONAsset extends Asset {
    constructor(json) {
        super();
        this.json = json;
    }
    getJSON() {
        return this.json;
    }
    loadAsset() {
        return Promise.resolve();
    }
    unloadAsset() {
        return Promise.resolve();
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { json: this.json });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.json = json.json;
        return this;
    }
}
