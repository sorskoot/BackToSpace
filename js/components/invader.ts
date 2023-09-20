import {CollisionComponent, Component, Mesh, MeshComponent} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {vec3} from 'gl-matrix';
import {SoundManagerInstance, Sounds} from '../classes/sfx-manager.js';
import {ExplosionParticles} from './explosion-particles.js';
import {State, gameState} from '../classes/game-state.js';
import {Easing, clamp, rng} from '@sorskoot/wonderland-components';
import {lerp} from '../classes/utils/lerp.js';

export class Invader extends Component {
    static TypeName = 'invader';

    @property.mesh()
    shardMesh?: Mesh;

    @property.int(5)
    speed = 5;

    private frequency = 2;
    private breakChange = 100;
    private amp = 1;

    private startDist = 0;
    private dir: vec3 = vec3.create();
    private deltaFreq = 0;
    private orgX = 0;
    private broken = false;
    private collision?: CollisionComponent;
    private gameOver = false;
    private isShowing = false;
    private timer = Math.random() * -3;

    start() {
        const pos: vec3 = this.object.getPositionWorld();
        const dist = vec3.length(pos);
        this.startDist = dist;
        this.dir = vec3.normalize(vec3.create(), pos);
        this.deltaFreq = (this.frequency * Math.PI * 2) / dist;
        this.orgX = pos[0];
        gameState.stateSubject.subscribe((state) => {
            if (state === State.gameOver) {
                this.gameOver = true;
            }
        });
        this.isShowing = true;
        this.object.scaleLocal([0, 0, 0]);
    }

    hit() {
        SoundManagerInstance.playSound(Sounds.explosion);
        const obj = this.engine.scene.addObject();
        obj.setPositionWorld(this.object.getPositionWorld());
        obj.addComponent(ExplosionParticles, {
            mesh: this.shardMesh!,
            material: this.object.getComponent(MeshComponent)!.material,
            maxParticles: 250,
            particleScale: 1,
            size: 1,
            initialSpeed: 100,
        });
        this.object.destroy();
        return;
    }

    update(dt: number) {
        if (this.gameOver) {
            return;
        }
        if (this.isShowing) {
            this.timer += dt;
            if (this.timer >= 0) {
                const clampTimer = clamp(this.timer, 0, 1);
                const scaleValue = lerp(0, 1.5, clampTimer, Easing.OutCubic);
                this.object.setScalingLocal([scaleValue, scaleValue, scaleValue]);
            }
            if (this.timer >= 1) {
                this.isShowing = false;
                this.object.setScalingLocal([1.5, 1.5, 1.5]);
            }
        }

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
        if (currentDist < 10) {
            gameState.gameOver();
        }
        if (currentDist > 10 && !this.broken) {
            if (Math.random() * 1000000 <= this.breakChange) {
                this.broken = true;
                this.speed *= 2;
                this.frequency *= 4;
                this.amp *= 5;
            }
        }
    }
}
