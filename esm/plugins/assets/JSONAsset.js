import { none } from "@aicacia/core";
import { Asset } from "./Asset";
export class JSONAsset extends Asset {
    constructor(src, options) {
        super();
        this.json = none();
        this.src = src;
        this.options = options;
    }
    getJSON() {
        return this.json;
    }
    loadAsset() {
        return fetch(this.src, this.options)
            .then((response) => response.json())
            .then((json) => {
            this.json.replace(json);
        });
    }
    unloadAsset() {
        this.json.clear();
        return Promise.resolve();
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { src: this.src, options: this.options });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.src = json.src;
        this.options = json.options;
        return this;
    }
}
