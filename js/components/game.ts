import {
    Component,
    Material,
    Mesh,
    MeshComponent,
    Object3D,
    WonderlandEngine,
} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {State, gameState} from '../classes/game-state.js';
import {ReadonlyVec3, vec3} from 'gl-matrix';
import {PrefabStorage} from '@sorskoot/wonderland-components';
import {Missile} from './missile.js';
import {Waves} from '../data/Waves.js';
import {Invader} from './invader.js';
import {ParticlePool} from './explosion-particles.js';
import {filter} from 'rxjs/operators';
import {ShowLeaderboard} from './show-leaderboard.js';
import {HeyvrLeaderboard} from '../heyvr/heyvr-leaderboard.js';

const missilePoolSize = 1000;
const tempVec = vec3.create();
export class Game extends Component {
    static TypeName = 'game';

    @property.object()
    nonVRCamera!: Object3D;

    @property.object({required: true})
    leaderboardObject!: Object3D;

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

    @property.mesh({required: true})
    particleMesh!: Mesh;
    @property.material({required: true})
    particleMaterial!: Material;

    @property.object({required: true})
    startMissilePositionObject!: Object3D;

    private prefabStore?: PrefabStorage;
    private currentwave = 0;
    private missilePool!: Object3D[];
    private lastShot = 0;

    private invadersLeftInWave = 0;
    private currentspeed = 5;
    private showLeaderboardComponent?: ShowLeaderboard;
    private leaderboard?: HeyvrLeaderboard;

    static onRegister(engine: WonderlandEngine) {
        engine.registerComponent(Missile);
        engine.registerComponent(Invader);
    }

    start() {
        ParticlePool.instance = new ParticlePool(this.engine);
        if (!this.prefabStoreObject) {
            throw new Error('prefabStoreObject is not set');
        }
        this.prefabStore = this.prefabStoreObject.getComponent(PrefabStorage)!;

        this.leaderboard = this.leaderboardObject.getComponent(HeyvrLeaderboard)!;
        this.showLeaderboardComponent =
            this.leaderboardObject.getComponent(ShowLeaderboard)!;

        this.engine.onXRSessionStart.add(() => (gameState.isInVR = true));
        this.engine.onXRSessionEnd.add(() => (gameState.isInVR = false));

        gameState.spawnMissile.add((data) => {
            this.startMissilePositionObject.getPositionWorld(tempVec);
            this.spawnMissile(data.direction, tempVec);
        });
        gameState.newGame.add(this.newGame.bind(this));
        gameState.stateSubject
            .pipe(filter((x) => x === State.gameOver))
            .subscribe(this.isGameOver.bind(this));

        gameState.isInVRSubject.subscribe((isInVR) => {
            if (isInVR) {
                gameState.setState(State.welcome);
            } else {
                this.clearInvaders();
                this.clearMissilePool();
                gameState.setState(State.notInVR);
            }
        });
        gameState.invaderHit.add(() => {
            this.invadersLeftInWave--;

            if (this.invadersLeftInWave === 0) {
                this.currentwave++;
                this.currentspeed++;
                if (this.currentwave >= Waves.length) {
                    this.currentwave = 0;
                }
                this.invadersLeftInWave = this.spawnInvaderWave();
            }
        });
    }

    newGame() {
        this.showLeaderboardComponent!.hide();
        if (!this.missilePool) {
            this.createMissilePool();
        } else {
            this.clearMissilePool();
        }

        this.currentspeed = 5;
        this.currentwave = 0;
        this.clearInvaders();
        this.invadersLeftInWave = this.spawnInvaderWave();
    }

    createMissilePool() {
        this.missilePool = this.engine.scene.addObjects(
            missilePoolSize,
            this.missilesParent,
            missilePoolSize * 3
        );
        for (let m = 0; m < missilePoolSize; m++) {
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

    clearMissilePool() {
        if (!this.missilePool || this.missilePool.length === 0) {
            return;
        }
        for (let m = 0; m < missilePoolSize; m++) {
            const missile = this.missilePool[m];
            missile.active = false;
            const missileComponent = missile.getComponent(Missile)!;
            missileComponent.fired = false;
        }
    }

    spawnMissile(direction: ReadonlyVec3 | undefined, position: ReadonlyVec3 | undefined) {
        const missileInstance = this.missilePool[this.lastShot];
        this.lastShot++;
        if (this.lastShot > this.missilePool.length) {
            this.lastShot = 0;
        }
        if (missileInstance) {
            missileInstance.resetPositionRotation();
            missileInstance.setPositionWorld(position ?? [0, 0, 0]);
            missileInstance.active = true;
            const missile = missileInstance.getComponent(Missile)!;
            missile.liftOff(direction ?? [0, 0, -1]);
        } else {
            console.error('no missiles left, somehow');
        }
    }

    clearInvaders() {
        this.aliensParent.children.forEach((alien) => {
            alien.destroy();
        });
    }

    spawnInvaderWave() {
        let spawned = 0;
        this.engine.scene.addObjects(55, this.aliensParent, 1000);
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
        const obj = this.engine.scene.addObject(this.aliensParent);

        const meshComponent = obj.addComponent(MeshComponent, {
            mesh: type % 2 ? this.alien2Mesh : this.alien1Mesh,
        })!;

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

        obj.setPositionWorld(position);
        obj.lookAt(vec3.fromValues(0, 0, 0));
        obj.addComponent(Invader, {
            speed: this.currentspeed,
            shardMesh: this.shardMesh,
        });
    }
    isGameOver() {
        this.leaderboard!.submitScore(gameState.score).catch(console.error);
        this.showLeaderboardComponent!.show();
    }
}
