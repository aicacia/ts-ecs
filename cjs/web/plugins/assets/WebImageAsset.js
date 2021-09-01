"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebImageAsset = void 0;
const core_1 = require("@aicacia/core");
const ImageAsset_1 = require("../../../plugins/assets/ImageAsset");
class WebImageAsset extends ImageAsset_1.ImageAsset {
    constructor(src) {
        super();
        this.image = core_1.none();
        this.src = src;
    }
    getImage() {
        return this.image;
    }
    getWidth() {
        return this.image.map((image) => image.width).unwrapOr(0);
    }
    getHeight() {
        return this.image.map((image) => image.height).unwrapOr(0);
    }
    loadAsset() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => {
                this.image.replace(image);
                resolve();
            });
            image.addEventListener("error", (error) => reject(error));
            image.src = this.src;
        });
    }
    unloadAsset() {
        this.image.clear();
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
