"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteSheet = void 0;
const Component_1 = require("../../Component");
const Time_1 = require("../../plugins/Time");
const Sprite_1 = require("./Sprite");
class SpriteSheet extends Component_1.Component {
    constructor() {
        super(...arguments);
        this.currentTime = 0;
        this.currentFrame = 0;
        this.playBack = 1;
        this.currentName = null;
        this.spriteSheets = {};
    }
    get(name) {
        return this.spriteSheets[name];
    }
    set(name, spriteClips) {
        this.spriteSheets[name] = spriteClips;
        return this;
    }
    getPlayBack() {
        return this.playBack;
    }
    setPlayBack(playBack) {
        this.playBack = playBack;
        return this;
    }
    setCurrent(name) {
        if (!this.spriteSheets.hasOwnProperty(name)) {
            throw new Error(`SpriteSheet setCurrent(name: string) no SpriteSheet found named ${name}`);
        }
        this.currentName = name;
        this.currentFrame = 0;
        this.currentTime = 0;
        return this;
    }
    getCurrent() {
        if (this.currentName) {
            return this.get(this.currentName);
        }
        else {
            return null;
        }
    }
    onUpdate() {
        const clips = this.getCurrent();
        if (clips) {
            const clip = clips[this.currentFrame];
            if (clip) {
                const sprite = this.getRequiredComponent(Sprite_1.Sprite);
                sprite.setClipX(clip.getX());
                sprite.setClipY(clip.getY());
                sprite.setClipWidth(clip.getWidth());
                sprite.setClipHeight(clip.getHeight());
                if (this.currentTime >= clip.getDuration()) {
                    this.currentTime = 0;
                    this.currentFrame += 1;
                    if (this.currentFrame >= clips.length) {
                        this.currentFrame = 0;
                    }
                }
                this.currentTime +=
                    this.getRequiredPlugin(Time_1.Time).getDelta() * this.playBack;
            }
        }
        return this;
    }
}
exports.SpriteSheet = SpriteSheet;
SpriteSheet.requiredComponents = [Sprite_1.Sprite];
SpriteSheet.requiredPlugins = [Time_1.Time];
