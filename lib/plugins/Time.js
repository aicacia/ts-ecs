"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
const Plugin_1 = require("../Plugin");
class Time extends Plugin_1.Plugin {
    constructor() {
        super(...arguments);
        this.scale = 1.0;
        this.fixedDelta = 1.0 / 60.0;
        this.frame = 0;
        this.last = -(1.0 / 60.0);
        this.current = 0.0;
        this.delta = 1.0 / 60.0;
        this.fps = 60.0;
        this.fpsFrame = 0;
        this.fpsLast = 0;
        this.startTime = Date.now() * 0.001;
        this.minDelta = 0.000001;
        this.maxDelta = Infinity;
    }
    getStartTime() {
        return this.startTime;
    }
    getDelta() {
        return this.delta * this.scale;
    }
    getRealDelta() {
        return this.delta * this.scale;
    }
    getCurrent() {
        return this.current;
    }
    getMinDelta() {
        return this.minDelta;
    }
    setMinDelta(minDelta) {
        this.minDelta = minDelta;
        return this;
    }
    getMaxDelta() {
        return this.maxDelta;
    }
    setMaxDelta(maxDelta) {
        this.maxDelta = maxDelta;
        return this;
    }
    getFrame() {
        return this.frame;
    }
    getFps() {
        return this.fps;
    }
    getScale() {
        return this.scale;
    }
    setScale(scale) {
        this.scale = scale;
        return this;
    }
    getFixedDelta() {
        return this.fixedDelta * this.scale;
    }
    setFixedDelta(fixedDelta) {
        this.fixedDelta = fixedDelta;
        return this;
    }
    now() {
        return Date.now() * 0.001 - this.startTime;
    }
    onUpdate() {
        ++this.frame;
        this.last = this.current;
        this.current = this.now();
        this.fpsFrame++;
        if (this.fpsLast + 1 < this.current) {
            this.fps = this.fpsFrame / (this.current - this.fpsLast);
            this.fpsLast = this.current;
            this.fpsFrame = 0;
        }
        this.delta = (this.current - this.last) * this.scale;
        this.delta =
            this.delta < this.minDelta
                ? this.minDelta
                : this.delta > this.maxDelta
                    ? this.maxDelta
                    : this.delta;
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { frame: this.frame, scale: this.scale, fixedDelta: this.fixedDelta });
    }
    fromJSON(json) {
        super.fromJSON(json);
        this.frame = json.frame;
        this.scale = json.scale;
        this.fixedDelta = json.fixedDelta;
        return this;
    }
}
exports.Time = Time;
Time.pluginPriority = -Infinity;
