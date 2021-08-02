"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = void 0;
const core_1 = require("@aicacia/core");
const plugins_1 = require("../../plugins");
const RenderableComponent_1 = require("../RenderableComponent");
class Sprite extends RenderableComponent_1.RenderableComponent {
    constructor() {
        super(...arguments);
        this.layer = 0;
        this.imageAsset = core_1.none();
        this.clipX = 0;
        this.clipY = 0;
        this.clipWidth = 1;
        this.clipHeight = 1;
        this.width = 1;
        this.height = 1;
        this.onImageLoadHandler = () => {
            this.imageAsset.ifSome((imageAsset) => {
                this.clipWidth = imageAsset.getWidth();
                this.clipHeight = imageAsset.getHeight();
                imageAsset.off("load", this.onImageLoadHandler);
            });
        };
    }
    getClipX() {
        return this.clipX;
    }
    setClipX(clipX) {
        this.clipX = clipX;
        return this;
    }
    getClipY() {
        return this.clipY;
    }
    setClipY(clipY) {
        this.clipY = clipY;
        return this;
    }
    getClipWidth() {
        return this.clipWidth;
    }
    setClipWidth(clipWidth) {
        this.clipWidth = clipWidth;
        return this;
    }
    getClipHeight() {
        return this.clipHeight;
    }
    setClipHeight(clipHeight) {
        this.clipHeight = clipHeight;
        return this;
    }
    getSize(out) {
        out[0] = this.width;
        out[1] = this.height;
        return out;
    }
    getWidth() {
        return this.width;
    }
    setWidth(width) {
        this.width = width;
        return this;
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        this.height = height;
        return this;
    }
    getLayer() {
        return this.layer;
    }
    setLayer(layer) {
        const managerOption = this.getManager();
        managerOption.ifSome((manager) => manager.removeComponent(this));
        this.layer = layer | 0;
        managerOption.ifSome((manager) => manager.addComponent(this));
        return this;
    }
    getImageAsset() {
        return this.imageAsset;
    }
    setImageAsset(imageAsset) {
        this.imageAsset.replace(imageAsset);
        if (imageAsset.isLoaded()) {
            this.onImageLoadHandler();
        }
        else {
            imageAsset.on("load", this.onImageLoadHandler);
        }
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { imageAssetUUID: this.imageAsset
                .map((imageAsset) => imageAsset.getUUID())
                .unwrapOr(null), layer: this.layer, clipX: this.clipX, clipY: this.clipY, clipWidth: this.clipWidth, clipHeight: this.clipHeight, width: this.width, height: this.height });
    }
    fromJSON(json) {
        const onAddToScene = () => {
            this.setImageAsset(this.getRequiredPlugin(plugins_1.Assets)
                .getAsset(json.imageAssetUUID)
                .expect(`Sprite.fromJSON Failed to get Asset ${json.imageAssetUUID}`));
            this.off("add-to-scene", onAddToScene);
        };
        this.on("add-to-scene", onAddToScene);
        return super
            .fromJSON(json)
            .setLayer(json.layer)
            .setClipX(json.clipX)
            .setClipY(json.clipY)
            .setClipWidth(json.clipWidth)
            .setClipHeight(json.clipHeight)
            .setWidth(json.width)
            .setHeight(json.height);
    }
}
exports.Sprite = Sprite;
Sprite.requiredPlugins = [plugins_1.Assets];
const SpriteManager_1 = require("./SpriteManager");
Sprite.Manager = SpriteManager_1.SpriteManager;
