import {
    Component,
    Object3D,
    MeshComponent,
    Mesh,
    Material,
    WonderlandEngine,
} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

import {quat, quat2, vec3} from 'gl-matrix';

const tempQuat2 = quat2.create();
const tempQuat = quat.create();

const TOTALPARTICLES = 25000;

export class ParticlePool {
    static instance: ParticlePool;

    private objects: Object3D[];
    private pointer = 0;
    constructor(engine: WonderlandEngine) {
        this.objects = engine.scene.addObjects(TOTALPARTICLES, null, TOTALPARTICLES * 3);

        for (let i = 0; i < this.objects.length; ++i) {
            const obj = this.objects[i];
            obj.scaleLocal([0, 0, 0]);
            obj.addComponent(MeshComponent);
        }
    }

    request(amount: number): Object3D[] {
        const result: Object3D[] = [];
        for (let i = 0; i < amount; ++i) {
            result.push(this.objects[this.pointer]);
            this.pointer = (this.pointer + 1) % this.objects.length;
        }
        return result;
    }
}

export class ExplosionParticles extends Component {
    static TypeName = 'explosion-particles';

    @property.mesh()
    mesh!: Mesh;

    @property.material()
    material!: Material;

    @property.int(100)
    maxParticles!: number;

    @property.float(25)
    initialSpeed!: number;

    @property.float(0.01)
    particleScale!: number;

    @property.int(16)
    size!: number;

    private time = 0.0;

    private selfDestructCountdown = 2.5;

    /**
     * @type {number[][]}
     */
    private velocities: vec3[] = [];
    private objects: Object3D[] = [];

    private rotations: vec3[] = [];

    private lifetime: number[] = [];

    start() {
        this.objects = ParticlePool.instance.request(this.maxParticles);

        for (let i = 0; i < this.maxParticles; i++) {
            this.velocities.push([
                (Math.random() * 2 - 1) * this.initialSpeed,
                (Math.random() * 2 - 0.5) * this.initialSpeed,
                (Math.random() * 2 - 1) * this.initialSpeed,
            ]);
            this.rotations.push([
                (Math.random() * 2 - 1) * 10,
                (Math.random() * 2 - 1) * 10,
                (Math.random() * 2 - 1) * 10,
            ]);
            this.lifetime.push(Math.random() * 0.5 + 1);
            this.objects[i].scaleLocal([0, 0, 0]);
            /* Most efficient way to hide the mesh */
        }
        /* Time to spawn particles */
        for (let i = 0; i < this.maxParticles; i++) {
            const obj = this.objects[i];
            obj.resetTransform();
            obj.scaleLocal([this.particleScale, this.particleScale, this.particleScale]);

            /* Activate component, otherwise it will not show up! */
            obj.getComponent(MeshComponent)!.active = true;
            obj.getComponent(MeshComponent)!.material = this.material;
            obj.getComponent(MeshComponent)!.mesh = this.mesh;

            const pos = this.object.getPositionWorld();
            obj.setPositionWorld(pos);
        }
    }

    update(dt: number) {
        this.selfDestructCountdown -= dt;
        if (this.selfDestructCountdown < 0) {
            console.log('destroying explosion particles');
            this.destroy();
            return;
        }

        /* Target for retrieving particles world locations */
        const origin = vec3.fromValues(0, 0, 0);
        const distance = vec3.fromValues(0, 0, 0);

        for (let i = 0; i < this.objects.length; ++i) {
            if (this.lifetime[i] <= 0) {
                continue;
            }
            /* Get translation first, as object.translate() will mark
             * the object as dirty, which will cause it to recalculate
             * obj.transformWorld on access. We want to avoid this and
             * have it be recalculated in batch at the end of frame
             * instead */
            this.objects[i].getTransformWorld(tempQuat2);
            quat2.getTranslation(origin, tempQuat2);

            /* Apply rotation */
            const rot = this.rotations[i];
            this.objects[i].getRotationWorld(tempQuat);
            quat.rotateX(tempQuat, tempQuat, rot[0] * dt);
            quat.rotateY(tempQuat, tempQuat, rot[1] * dt);
            quat.rotateZ(tempQuat, tempQuat, rot[2] * dt);

            this.objects[i].setRotationWorld(tempQuat);
            this.lifetime[i] -= dt;
            if (this.lifetime[i] <= 0) {
                this.objects[i].scaleLocal([0, 0, 0]);
                continue;
            }
        }

        for (let i = 0; i < this.objects.length; ++i) {
            this.velocities[i][1] -= 9.81 * dt;
            /* Apply velocity */
            vec3.scale(distance, this.velocities[i], dt);
            this.objects[i].translateWorld(distance);
        }
    }
}
