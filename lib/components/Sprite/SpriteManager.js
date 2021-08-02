"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteManager = void 0;
const DefaultDescriptorManager_1 = require("../../DefaultDescriptorManager");
class SpriteManager extends DefaultDescriptorManager_1.DefaultDescriptorManager {
    constructor() {
        super(...arguments);
        this.layers = {};
        this.sortFunction = (a, b) => {
            return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
        };
    }
    isEmpty() {
        return Object.values(this.layers).length === 0;
    }
    getComponents() {
        return [].concat(...Object.values(this.layers));
    }
    addComponent(sprite) {
        this.getOrCreateLayer(sprite.getLayer()).push(sprite);
        return this;
    }
    removeComponent(sprite) {
        const layerIndex = sprite.getLayer(), layer = this.layers[layerIndex];
        if (layer) {
            const index = layer.indexOf(sprite);
            if (index !== -1) {
                layer.splice(index, 1);
                if (layer.length === 0) {
                    delete this.layers[layerIndex];
                }
            }
        }
        return this;
    }
    sort() {
        for (const layer of Object.values(this.layers)) {
            layer.sort(this.sortFunction);
        }
        return this;
    }
    getOrCreateLayer(layerIndex) {
        const layer = this.layers[layerIndex];
        if (layer) {
            return layer;
        }
        else {
            const newLayer = [];
            this.layers[layerIndex] = newLayer;
            return newLayer;
        }
    }
}
exports.SpriteManager = SpriteManager;
