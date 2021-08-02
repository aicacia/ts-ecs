import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
import type { Sprite } from "./Sprite";
export declare class SpriteManager extends DefaultDescriptorManager<Sprite> {
    private layers;
    isEmpty(): boolean;
    getComponents(): Sprite[];
    addComponent(sprite: Sprite): this;
    removeComponent(sprite: Sprite): this;
    sortFunction: (a: Sprite, b: Sprite) => number;
    sort(): this;
    private getOrCreateLayer;
}
