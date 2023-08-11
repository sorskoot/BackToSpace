import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {vec3} from 'gl-matrix';

export class Invader extends Component {
    static TypeName = 'invader';

    speed = 5;
    frequency = 2;
    breakChange = 100;
    amp = 1;

    startDist = 0;
    dir: vec3 = vec3.create();
    deltaFreq = 0;
    orgX = 0;
    broken = false;

    init() {}

    start() {
        const pos: vec3 = this.object.getPositionWorld();
        const dist = vec3.length(pos);
        this.startDist = dist;
        this.dir = vec3.normalize(vec3.create(), pos);
        this.deltaFreq = (this.frequency * Math.PI * 2) / dist;
        this.orgX = pos[0];
    }

    update(dt: number) {
        const deltaTime = dt * this.speed;
        const pos = this.object.getPositionWorld();

        this.orgX -= this.dir[0] * deltaTime;
        pos[1] -= this.dir[1] * deltaTime;
        pos[2] -= this.dir[2] * deltaTime;

        const currentDist = vec3.length(vec3.fromValues(this.orgX, pos[1], pos[2]));

        pos[0] =
            ((Math.sin(this.startDist * this.deltaFreq - this.deltaFreq * currentDist) *
                currentDist) /
                10) *
                this.amp +
            this.orgX;

        this.object.lookAt(vec3.fromValues(0, 0, 0));

        this.object.setPositionWorld(pos);
        // if (currentDist < 10) {
        //     //this.el.parentEl.removeChild(this.el);
        //     this.gameover = true;
        //     game.emit('game-over');
        // }
        // if (currentDist > 10 && !this.broken) {
        //     if (Math.random() * 1000000 <= this.breakChange) {
        //         this.broken = true;
        //         this.speed *= 2;
        //         this.frequency *= 4;
        //         this.amp *= 5;
        //     }
        // }
    }
}
