import { vec2, vec3 } from "gl-matrix";
import { RenderableComponent } from "./RenderableComponent";
import { TransformComponentManager } from "./TransformComponentManager";
const VEC2_0 = vec2.create(), VEC3_0 = vec3.create();
export class TransformComponent extends RenderableComponent {
    constructor() {
        super(...arguments);
        this.needsUpdate = true;
        this.localNeedsUpdate = true;
    }
    static getParentTransform(entity) {
        return entity.getParent().andThen(TransformComponent.getTransform);
    }
    static getTransform(_entity) {
        return undefined;
    }
    static getRequiredTransform(entity) {
        return TransformComponent.getTransform(entity).expect(`Entity required a TransformComponent`);
    }
    onDetach() {
        return this.setNeedsUpdate();
    }
    getParentTransform() {
        return this.getEntity().flatMap(TransformComponent.getParentTransform);
    }
    setNeedsUpdate(needsUpdate = true) {
        this.setLocalNeedsUpdate(needsUpdate);
        if (needsUpdate !== this.needsUpdate) {
            this.needsUpdate = needsUpdate;
            this.getEntity().ifSome((entity) => {
                for (const child of entity.getChildren()) {
                    for (const transform of child.getComponentsInstanceOf(TransformComponent)) {
                        transform.setNeedsUpdate(needsUpdate);
                    }
                }
            });
        }
        return this;
    }
    getNeedsUpdate() {
        return this.needsUpdate;
    }
    setLocalNeedsUpdate(localNeedsUpdate = true) {
        this.localNeedsUpdate = localNeedsUpdate;
        return this;
    }
    getLocalNeedsUpdate() {
        return this.localNeedsUpdate;
    }
    updateLocalMatrixIfNeeded() {
        if (this.localNeedsUpdate) {
            this.localNeedsUpdate = false;
            return this.updateLocalMatrix();
        }
        else {
            return this;
        }
    }
    updateMatrixIfNeeded() {
        if (this.needsUpdate) {
            this.needsUpdate = false;
            return this.updateMatrix();
        }
        else {
            return this;
        }
    }
    translate2(position) {
        const current = this.getLocalPosition2(VEC2_0);
        vec2.add(current, current, position);
        return this.setLocalPosition2(current);
    }
    translate3(position) {
        const current = this.getLocalPosition3(VEC3_0);
        vec3.add(current, current, position);
        return this.setLocalPosition3(current);
    }
    scale2(scale) {
        const current = this.getLocalScale2(VEC2_0);
        vec2.mul(current, current, scale);
        return this.setLocalPosition2(current);
    }
    scale3(scale) {
        const current = this.getLocalScale3(VEC3_0);
        vec3.mul(current, current, scale);
        return this.setLocalPosition3(current);
    }
}
TransformComponent.Manager = TransformComponentManager;
