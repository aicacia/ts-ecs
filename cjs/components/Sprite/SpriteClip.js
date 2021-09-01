"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteClip = void 0;
class SpriteClip {
    constructor() {
        this.duration = 1.0;
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
    }
    getDuration() {
        return this.duration;
    }
    setDuration(duration) {
        this.duration = duration;
        return this;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
        return this;
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
    toJSON() {
        return {
            duration: this.duration,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }
    fromJSON(json) {
        this.duration = json.duration;
        this.x = json.x;
        this.y = json.y;
        this.width = json.width;
        this.height = json.height;
        return this;
    }
}
exports.SpriteClip = SpriteClip;
