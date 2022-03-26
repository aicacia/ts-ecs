"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebImageAsset = void 0;
const ImageAsset_1 = require("../../../plugins/assets/ImageAsset");
class WebImageAsset extends ImageAsset_1.ImageAsset {
    constructor(src) {
        super();
        this.image = null;
        this.src = src;
    }
    getImage() {
        return this.image;
    }
    getWidth() {
        var _a, _b;
        return (_b = (_a = this.image) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0;
    }
    getHeight() {
        var _a, _b;
        return (_b = (_a = this.image) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0;
    }
    loadAsset() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => {
                this.image = image;
                resolve();
            });
            image.addEventListener("error", (error) => reject(error));
            image.src = this.src;
        });
    }
    unloadAsset() {
        this.image = null;
        return Promise.resolve();
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { src: this.src });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.src = json.src;
        return this;
    }
}
exports.WebImageAsset = WebImageAsset;
