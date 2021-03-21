"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawJSONAsset = void 0;
const Asset_1 = require("./Asset");
class RawJSONAsset extends Asset_1.Asset {
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
exports.RawJSONAsset = RawJSONAsset;
