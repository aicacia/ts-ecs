import { none, Option } from "@aicacia/core";
import { Component } from "../../Component";
import { Time } from "../../plugins/Time";
import { Sprite } from "./Sprite";
export class SpriteSheet extends Component {
    constructor() {
        super(...arguments);
        this.currentTime = 0;
        this.currentFrame = 0;
        this.playBack = 1;
        this.currentName = none();
        this.spriteSheets = {};
        this.get = (name) => {
            return Option.from(this.spriteSheets[name]);
        };
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
        this.currentName.replace(name);
        this.currentFrame = 0;
        this.currentTime = 0;
        return this;
    }
    getCurrent() {
        return this.currentName.flatMap(this.get);
    }
    onUpdate() {
        this.getCurrent().ifSome((clips) => {
            const clip = clips[this.currentFrame];
            if (clip) {
                const sprite = this.getRequiredComponent(Sprite);
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
                    this.getRequiredPlugin(Time).getDelta() * this.playBack;
            }
        });
        return this;
    }
}
SpriteSheet.requiredComponents = [Sprite];
SpriteSheet.requiredPlugins = [Time];
