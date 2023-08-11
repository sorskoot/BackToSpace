import {
    CollisionComponent,
    Component,
    Material,
    Mesh,
    MeshComponent,
    Object3D,
} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {gameState} from '../classes/game-state.js';
import {ReadonlyVec3, quat, vec3} from 'gl-matrix';
import {PrefabStorage} from '@sorskoot/wonderland-components';
import {Missile} from './missile.js';
import {Waves} from '../data/Waves.js';
import {Invader} from './invader.js';

export class Game extends Component {
    static TypeName = 'game';

    @property.object()
    prefabStoreObject?: Object3D;

    @property.object()
    missilesParent!: Object3D;

    @property.mesh()
    alien1Mesh?: Mesh;

    @property.mesh()
    alien2Mesh?: Mesh;

    @property.material()
    alienMaterial1?: Material;
    @property.material()
    alienMaterial2?: Material;
    @property.material()
    alienMaterial3?: Material;
    @property.material()
    alienMaterial4?: Material;
    @property.material()
    alienMaterial5?: Material;
    @property.material()
    alienMaterial6?: Material;

    private prefabStore?: PrefabStorage;
    private currentwave = 0;

    start() {
        if (!this.prefabStoreObject) {
            throw new Error('prefabStoreObject is not set');
        }
        this.prefabStore = this.prefabStoreObject.getComponent(PrefabStorage)!;

        gameState.spawnMissile.add((data) => {
            this.spawnMissile(data.direction, data.position);
        });

        this.spawnInvaderWave();
    }

    spawnMissile(direction: ReadonlyVec3, position: ReadonlyVec3) {
        const missileInstance = this.prefabStore?.instantiate(
            'Missile',
            this.missilesParent
        );
        if (missileInstance) {
            missileInstance.setPositionWorld(position);
            const missile = missileInstance.addComponent(Missile)!;
            missile.liftOff(direction);
            missileInstance.getComponent(CollisionComponent)!.active = true;
        }
    }

    spawnInvaderWave() {
        let spawned = 0;
        for (let i = 0; i < 5; i++) {
            // wave rows
            for (let j = 0; j < 11; j++) {
                // wave columns
                if (Waves[this.currentwave][i][j] > 0) {
                    spawned++;
                    this.spawnInvader(j, i, Waves[this.currentwave][i][j]);
                }
            }
        }
        return spawned;
    }

    spawnInvader(x: number, y: number, type: number) {
        const rndY = -y * 25 + 150;
        const rad = ((x + 0.5) / 11 - 0.5) * (Math.PI / 1.5);

        const obj = this.prefabStore?.instantiate(
            type % 2 ? 'Alien2' : 'Alien1',
            this.object
        );
        const meshComponent = obj!.getComponent(MeshComponent)!;
        // const obj = this.engine.scene.addObject();
        // const meshComponent = obj.addComponent(MeshComponent)!;
        // meshComponent.mesh = type % 2 ? this.alien1Mesh! : this.alien2Mesh!;
        switch (type) {
            case 1:
                meshComponent.material = this.alienMaterial1!;
                break;
            case 2:
                meshComponent.material = this.alienMaterial2!;
                break;
            case 3:
                meshComponent.material = this.alienMaterial3!;
                break;
            case 4:
                meshComponent.material = this.alienMaterial4!;
                break;
            case 5:
            case 6:
                meshComponent.material = this.alienMaterial5!;
                break;
            case 7:
            case 8:
                meshComponent.material = this.alienMaterial6!;
                break;
            default:
                meshComponent.material = this.alienMaterial1!;
                break;
        }

        const position = vec3.fromValues(Math.sin(rad) * 250, rndY, Math.cos(rad) * -150);
        obj!.setPositionWorld(position);
        //obj.rotateLocal(quat.fromEuler(quat.create(), 0, rad * (180 / Math.PI) + 90, 0));
        obj!.lookAt(vec3.fromValues(0, 0, 0));
        obj!.addComponent(Invader);
        obj!.getComponent(CollisionComponent)!.active = true;
        // box.setAttribute("invader", { direction: rad, type: type, speed: this.currentspeed });
        // box.setAttribute('appear', '');

        // box.setAttribute("position", position);
        // this.invadergroup.appendChild(box);
    }
}
