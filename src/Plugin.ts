import type { IConstructor } from "@aicacia/core";
import {
  IRequirement,
  filterRequirements,
  requirementToString,
} from "./IRequirement";
import type { Manager } from "./Manager";
import type { Scene } from "./Scene";
import type { ValidEventTypes } from "eventemitter3";
import { ToFromJSONEventEmitter } from "./ToFromJSONEventEmitter";

export abstract class Plugin<
  EventTypes extends ValidEventTypes = any
> extends ToFromJSONEventEmitter<EventTypes> {
  static pluginPriority = 0;
  static requiredPlugins: IRequirement<Plugin>[] = [];

  static getPluginPriority() {
    return this.pluginPriority;
  }
  static getRequiredPlugins(): IRequirement<Plugin>[] {
    return this.requiredPlugins;
  }

  private scene: Scene | null = null;

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }
  getPluginPriority(): number {
    return Object.getPrototypeOf(this).constructor.getPluginPriority();
  }
  getRequiredPlugins(): IConstructor<Plugin>[] {
    return Object.getPrototypeOf(this).constructor.requiredPlugins;
  }

  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P | null {
    const scene = this.getScene();
    if (scene) {
      return scene.getPlugin(Plugin);
    } else {
      return null;
    }
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P {
    const plugin = this.getPlugin<P>(Plugin);
    if (!plugin) {
      throw new Error(`${this.getConstructor()} required ${Plugin} Plugin`);
    }
    return plugin;
  }

  getManager<M extends Manager = Manager>(Manager: IConstructor<M>): M | null {
    const scene = this.getScene();
    if (scene) {
      return scene.getManager(Manager);
    } else {
      return null;
    }
  }
  getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>) {
    const manager = this.getManager<M>(Manager);
    if (!manager) {
      throw new Error(`${this.getConstructor()} required ${Manager} Manager`);
    }
    return manager;
  }

  validateRequirements() {
    const missingPlugins: IRequirement<Plugin>[] = [];

    for (const plugin of this.getRequiredScene().getPlugins()) {
      const missingRequiredPlugins = filterRequirements(
        plugin.getRequiredPlugins(),
        (P) => !this.getRequiredScene().hasPlugin(P)
      );

      if (missingRequiredPlugins.length > 0) {
        missingPlugins.push(...missingRequiredPlugins);
      }
    }

    if (missingPlugins.length > 0) {
      const pluginMessage = missingPlugins
        .map(
          (missingRequirement) =>
            `${requirementToString(
              this.getConstructor()
            )} Plugin requires ${requirementToString(
              missingRequirement
            )} Plugin`
        )
        .join("\n");

      throw new Error(pluginMessage);
    }
  }

  /**
   * @ignore
   */
  UNSAFE_setScene(scene: Scene) {
    this.scene = scene;
    return this;
  }
  /**
   * @ignore
   */
  UNSAFE_removeScene() {
    this.scene = null;
    return this;
  }
  getScene() {
    return this.scene;
  }
  getRequiredScene() {
    const scene = this.getScene();
    if (!scene) {
      throw new Error(`${this.getConstructor()} required a Scene`);
    }
    return scene;
  }

  onInit() {
    return this;
  }
  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
  onUpdate() {
    return this;
  }
}
