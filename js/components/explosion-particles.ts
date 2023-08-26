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

    selfDestructCountdown = 2.5;

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
            this.maxParticles * 3
        );

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
            const obj = this.objects[i];
            obj.name = 'particle' + this.count.toString();
            const mesh = obj.addComponent(MeshComponent);

            mesh!.mesh = this.mesh;
            mesh!.material = this.material;
            /* Most efficient way to hide the mesh */
            obj.scaleLocal([0, 0, 0]);
        }

        /* Time to spawn particles */
        for (let i = 0; i < this.maxParticles; i++) {
            this.spawn();
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
            quat2.getTranslation(origin, this.objects[i].getTransformWorld());

            /* Apply rotation */
            const rot = this.rotations[i];
            const objRot = this.objects[i].getRotationWorld();
            quat.rotateX(objRot, objRot, rot[0] * dt);
            quat.rotateY(objRot, objRot, rot[1] * dt);
            quat.rotateZ(objRot, objRot, rot[2] * dt);

            this.objects[i].setRotationWorld(objRot);
            this.lifetime[i] -= dt;
            if (this.lifetime[i] <= 0) {
                this.objects[i].scaleLocal([0, 0, 0]);
                continue;
            }
        }

        for (let i = 0; i < this.objects.length; ++i) {
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
