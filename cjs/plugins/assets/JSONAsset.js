"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONAsset = void 0;
const Asset_1 = require("./Asset");
class JSONAsset extends Asset_1.Asset {
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
exports.JSONAsset = JSONAsset;
