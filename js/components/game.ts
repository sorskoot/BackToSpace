import {
    Component,
    Material,
    Mesh,
    MeshComponent,
    Object3D,
    WonderlandEngine,
} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {gameState} from '../classes/game-state.js';
import {ReadonlyVec3, vec3} from 'gl-matrix';
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

    @property.object()
    aliensParent!: Object3D;

    @property.mesh()
    alien1Mesh?: Mesh;

    @property.mesh()
    alien2Mesh?: Mesh;

    @property.mesh()
    shardMesh?: Mesh;

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

    @property.mesh()
    missileMesh?: Mesh;
    @property.material()
    missileMaterial?: Material;

    private prefabStore?: PrefabStorage;
    private currentwave = 0;
    missilePool!: Object3D[];

    static onRegister(engine: WonderlandEngine) {
        engine.registerComponent(Missile);
        engine.registerComponent(Invader);
    }

    start() {
        if (!this.prefabStoreObject) {
            throw new Error('prefabStoreObject is not set');
        }
        this.prefabStore = this.prefabStoreObject.getComponent(PrefabStorage)!;

        gameState.spawnMissile.add((data) => {
            this.spawnMissile(data.direction, data.position);
        });
        gameState.newGame.add(this.newGame.bind(this));
    }

    newGame() {
        this.createMissilePool();
        this.spawnInvaderWave();
    }

    createMissilePool() {
        this.missilePool = [];
        this.missilePool = this.engine.scene.addObjects(1000, this.missilesParent, 3);
        for (let m = 0; m < 1000; m++) {
            const missile = this.missilePool[m];
            missile.name = `missile-${m}`;
            missile.addComponent(MeshComponent, {
                mesh: this.missileMesh,
                material: this.missileMaterial,
            })!;
            missile.addComponent(Missile, {
                aliensParent: this.aliensParent,
            })!;
            missile.active = false;
        }
    }

    private lastShot = 0;
    spawnMissile(direction: ReadonlyVec3, position: ReadonlyVec3) {
        const missileInstance = this.missilePool[this.lastShot];
        this.lastShot++;
        if (this.lastShot > this.missilePool.length) {
            this.lastShot = 0;
        }
        if (missileInstance) {
            console.log('spawn missile', missileInstance.name);
            missileInstance.resetPositionRotation();
            missileInstance.setPositionWorld(position);
            missileInstance.active = true;

            //const meshComponent = missileInstance.getComponent(MeshComponent)!;
            //meshComponent.active = true;
            const missile = missileInstance.getComponent(Missile)!;
            //missile.active = true;

            missile.liftOff(direction);
        } else {
            console.error('no missiles left, somehow');
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
            this.aliensParent
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
        const inv = obj!.addComponent(Invader);
        inv!.shardMesh = this.shardMesh;
        //obj!.getComponent(CollisionComponent)!.active = true;
        // box.setAttribute("invader", { direction: rad, type: type, speed: this.currentspeed });
        // box.setAttribute('appear', '');

        // box.setAttribute("position", position);
        // this.invadergroup.appendChild(box);
    }
}
