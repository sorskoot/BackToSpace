import {Component} from '@wonderlandengine/api';
import {ReadonlyVec3, quat, vec3} from 'gl-matrix';

export class Missile extends Component {
    static TypeName = 'missile';

    speed = 133;
    lifetime = 2.5;
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

        // this.object.setPositionWorld(newPosition);
        this.lifetime -= dt;
        if (this.lifetime < 0) {
            this.object.destroy();
        }
    }

    liftOff(direction: ReadonlyVec3) {
        this.direction = vec3.clone(direction);
        // make the missile face the direction it's going by converting the direction vector to a quaternion
        const quaternion = quat.create();
        quat.rotationTo(quaternion, vec3.fromValues(0, 0, -1), this.direction);
        this.object.rotateObject(quaternion);
        this.fired = true;
    }
}
