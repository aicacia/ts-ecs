import { Asset } from "./Asset";
export class JSONAsset extends Asset {
    constructor(src, options) {
        super();
        this.json = null;
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
            this.json = json;
        });
    }
    unloadAsset() {
        this.json = null;
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
