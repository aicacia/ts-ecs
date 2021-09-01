import { v4 } from "uuid";
import { ToFromJSONEventEmitter } from "../../ToFromJSONEventEmitter";
export class Asset extends ToFromJSONEventEmitter {
    constructor() {
        super(...arguments);
        this.uuid = v4();
        this.name = "";
        this.loaded = false;
        this.loading = false;
    }
    getUUID() {
        return this.uuid;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    isLoaded() {
        return this.loaded;
    }
    isLoading() {
        return this.loading;
    }
    load() {
        if (this.loaded) {
            return Promise.resolve();
        }
        else {
            this.loading = true;
            return this.loadAsset()
                .then(() => {
                this.loading = false;
                this.loaded = true;
                this.emit("load");
            })
                .catch((error) => {
                this.loading = true;
                this.emit("load-error", error);
                throw error;
            });
        }
    }
    unload() {
        if (!this.loaded) {
            return Promise.resolve();
        }
        else {
            return this.unloadAsset()
                .then(() => {
                this.loaded = false;
                this.emit("unload");
            })
                .catch((error) => {
                this.emit("unload-error", error);
                throw error;
            });
        }
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { uuid: this.uuid, name: this.name });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.uuid = json.uuid;
        this.name = json.name;
        return this;
    }
}
