import {Component, Object3D, MeshComponent, Mesh, Material} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

import {quat, quat2, vec3} from 'gl-matrix';

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

    time = 0.0;
    count = 0;

    /**
     * @type {Object3D[]}
     */
    private objects: Object3D[] = [];

    /**
     * @type {number[][]}
     */
    private velocities: vec3[] = [];

    private speeds: number[] = [];

    private rotations: vec3[] = [];

    private lifetime: number[] = [];

    start() {
        this.objects = this.engine.scene.addObjects(
            this.maxParticles,
            null,
            this.maxParticles
        );

        for (let i = 0; i < this.maxParticles; ++i) {
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
            const obj = this.objects[i];
            obj.name = 'particle' + this.count.toString();
            const mesh = obj.addComponent(MeshComponent);

            mesh!.mesh = this.mesh;
            mesh!.material = this.material;
            /* Most efficient way to hide the mesh */
            obj.scaleLocal([0, 0, 0]);
        }

        /* Time to spawn particles */
        for (let i = 0; i < this.maxParticles; ++i) {
            this.spawn();
        }
    }

    update(dt: number) {
        /* Target for retrieving particles world locations */
        const origin = vec3.fromValues(0, 0, 0);
        const distance = vec3.fromValues(0, 0, 0);

        // if there's no particles elft, destroy this component
        if (this.lifetime.filter((x) => x > 0).length === 0) {
            this.object.destroy();
            return;
        }

        for (let i = 0; i < Math.min(this.count, this.objects.length); ++i) {
            if (this.lifetime[i] <= 0) {
                continue;
            }
            /* Get translation first, as object.translate() will mark
             * the object as dirty, which will cause it to recalculate
             * obj.transformWorld on access. We want to avoid this and
             * have it be recalculated in batch at the end of frame
             * instead */
            quat2.getTranslation(origin, this.objects[i].getTransformWorld());

            /* Apply gravity */
            const vel = this.velocities[i];

            // /* Check if particle would collide */
            // if (origin[0] + vel[0] * dt > 8) origin[0] -= 16;
            // else if (origin[0] + vel[0] * dt <= -8) origin[0] += 16;

            // if (origin[2] + vel[2] * dt > 8) origin[2] -= 16;
            // else if (origin[2] + vel[2] * dt <= -8) origin[2] += 16;

            // if (origin[1] + vel[1] * dt <= 0) {
            //     /* Pseudo friction */
            //     origin[1] = 5;
            //     this.objects[i].setPositionWorld(origin);
            // }

            /* Apply rotation */
            const rot = this.rotations[i];
            const objRot = this.objects[i].getRotationWorld();
            quat.rotateX(objRot, objRot, rot[0] * dt);
            quat.rotateY(objRot, objRot, rot[1] * dt);
            quat.rotateZ(objRot, objRot, rot[2] * dt);

            // rot[0] * dt,
            // rot[1] * dt,
            // rot[2] * dt);
            this.objects[i].setRotationWorld(objRot);
            this.lifetime[i] -= dt;
            if (this.lifetime[i] <= 0) {
                this.objects[i].scaleLocal([0, 0, 0]);
                this.objects[i].destroy();
                continue;
            }
        }

        for (let i = 0; i < Math.min(this.count, this.objects.length); ++i) {
            /* Apply velocity */
            vec3.scale(distance, this.velocities[i], dt);
            // add gravity
            distance[1] -= 9.81 * dt;
            this.objects[i].translateWorld(distance);
        }
    }

    /** Spawn a particle */
    spawn() {
        const index = this.count % this.maxParticles;

        const obj = this.objects[index];
        obj.resetTransform();
        obj.scaleLocal([this.particleScale, this.particleScale, this.particleScale]);

        /* Activate component, otherwise it will not show up! */
        obj.getComponent(MeshComponent)!.active = true;

        const pos = this.object.getPositionWorld();
        obj.setPositionWorld(pos);

        this.count += 1;
    }
}
