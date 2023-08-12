import {Component, MeshComponent, Object3D} from '@wonderlandengine/api';
import {ReadonlyVec3, quat, vec3} from 'gl-matrix';
import {Invader} from './invader.js';
import {property} from '@wonderlandengine/api/decorators.js';

export class Missile extends Component {
    static TypeName = 'missile';

    @property.object()
    aliensParent!: Object3D;

    speed = 100;
    lifetime = 2.0;
    fired = false;
    direction: vec3 = vec3.create();
    velocity: vec3 = vec3.create();

    update(dt: number) {
        if (!this.fired) {
            return;
        }

        // scale the direction vector by the speed and the time since the last frame
        const distance = this.speed * dt;
        vec3.scale(this.velocity, this.direction, distance);

        const pos = this.object.getPositionWorld();
        const newPosition = vec3.create();
        vec3.add(newPosition, pos, this.velocity);
        this.object.setPositionWorld(newPosition);

        this.aliensParent.children.forEach((alien) => {
            const alienPos = alien.getPositionWorld();
            const distance = vec3.distance(alienPos, newPosition);
            if (distance < 5.0) {
                alien.getComponent(Invader)?.hit();
                this.end();
                return;
            }
        });
        // this.object.setPositionWorld(newPosition);
        this.lifetime -= dt;
        if (this.lifetime < 0 || newPosition[1] < -150.0) {
            this.end();
        }
    }

    end() {
        this.object.active = false;
        this.fired = false;
        // this.object.getComponent(Missile)!.active = false;
        // this.object.getComponent(MeshComponent)!.active = false;
    }

    liftOff(direction: ReadonlyVec3) {
        this.direction = vec3.clone(direction);
        // make the missile face the direction it's going by converting the direction vector to a quaternion
        const quaternion = quat.create();
        quat.rotationTo(quaternion, vec3.fromValues(0, 0, -1), this.direction);
        this.object.rotateObject(quaternion);
        this.fired = true;
        this.lifetime = 2;
    }
}
