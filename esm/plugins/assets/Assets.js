import { Option, iter } from "@aicacia/core";
import { isJSONArray } from "@aicacia/json";
import { Plugin } from "../../Plugin";
import { Asset } from "./Asset";
export class Assets extends Plugin {
    constructor() {
        super(...arguments);
        this.assetMap = {};
        this.assets = [];
        this.loadedAssets = [];
        this.loadingPromises = new Map();
        this.unloadingPromises = new Map();
    }
    find(fn) {
        return iter(this.assets).find(fn);
    }
    findWithName(name) {
        return this.find((asset) => asset.getName() === name);
    }
    findAll(fn) {
        return iter(this.assets).filter(fn).toArray();
    }
    findAllWithName(name) {
        return this.findAll((asset) => asset.getName() === name);
    }
    isLoading() {
        return this.loadingPromises.size > 0;
    }
    getAsset(uuid) {
        return Option.from(this.assetMap[uuid]);
    }
    getAssets() {
        return this.assets;
    }
    getLoadedAssets() {
        return this.loadedAssets;
    }
    getLoadingAssets() {
        return Array.from(this.loadingPromises.keys());
    }
    getUnloadingAssets() {
        return Array.from(this.unloadingPromises.keys());
    }
    getUnloadedAssets() {
        return this.assets.filter((asset) => !asset.isLoaded());
    }
    addAsset(...assets) {
        return this.addAssets(assets);
    }
    addAssets(assets) {
        for (const asset of assets) {
            this._addAsset(asset);
        }
        return this;
    }
    removeAsset(...assets) {
        return this.removeAssets(assets);
    }
    removeAssets(assets) {
        for (const asset of assets) {
            this._removeAsset(asset);
        }
        return this;
    }
    loadAll() {
        return this.loadAssets(this.getUnloadedAssets());
    }
    loadAllInBackground() {
        return this.loadAssetsInBackground(this.getUnloadedAssets());
    }
    loadAssetInBackground(...assets) {
        return this.loadAssetsInBackground(assets);
    }
    loadAssetsInBackground(assets) {
        this.loadAssets(assets);
        return this;
    }
    unloadAssetInBackground(...assets) {
        return this.unloadAssetsInBackground(assets);
    }
    unloadAssetsInBackground(assets) {
        this.unloadAssets(assets);
        return this;
    }
    loadAsset(...assets) {
        return this.loadAssets(assets);
    }
    loadAssets(assets) {
        return Promise.all(assets.map((asset) => this._loadAsset(asset)));
    }
    unloadAsset(...assets) {
        return this.unloadAssets(assets);
    }
    unloadAssets(assets) {
        return Promise.all(assets.map((asset) => this._unloadAsset(asset)));
    }
    _loadAsset(asset) {
        if (asset.isLoaded()) {
            return Promise.resolve();
        }
        else {
            const promise = this.loadingPromises.get(asset);
            if (promise) {
                return promise;
            }
            else {
                const promise = asset
                    .load()
                    .then(() => {
                    this.loadingPromises.delete(asset);
                    this.loadedAssets.push(asset);
                })
                    .catch((error) => {
                    this.loadingPromises.delete(asset);
                    throw error;
                });
                this.loadingPromises.set(asset, promise);
                return promise;
            }
        }
    }
    _unloadAsset(asset) {
        if (!asset.isLoaded()) {
            return Promise.resolve();
        }
        else {
            const promise = this.unloadingPromises.get(asset);
            if (promise) {
                return promise;
            }
            else {
                const promise = asset
                    .load()
                    .then(() => {
                    this.unloadingPromises.delete(asset);
                    this.loadedAssets.splice(this.loadedAssets.indexOf(asset), 1);
                })
                    .catch((error) => {
                    this.unloadingPromises.delete(asset);
                    throw error;
                });
                this.unloadingPromises.set(asset, promise);
                return promise;
            }
        }
    }
    _addAsset(asset) {
        const uuid = asset.getUUID();
        if (!this.assetMap[uuid]) {
            this.assetMap[uuid] = asset;
            this.assets.push(asset);
        }
        return this;
    }
    _removeAsset(asset) {
        const uuid = asset.getUUID();
        if (this.assetMap[uuid]) {
            delete this.assetMap[uuid];
            this.assets.splice(this.assets.indexOf(asset), 1);
        }
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { assets: this.assets.map((asset) => asset.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (isJSONArray(json.assets)) {
            this.addAssets(json.assets.map((json) => Asset.newFromJSON(json)));
        }
        return this;
    }
}
