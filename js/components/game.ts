import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {gameState} from '../classes/game-state.js';
import {ReadonlyVec3} from 'gl-matrix';
import {PrefabStorage} from '@sorskoot/wonderland-components';
import {Missile} from './missile.js';

export class Game extends Component {
    static TypeName = 'game';

    @property.object()
    prefabStoreObject?: Object3D;

    @property.object()
    missilesParent!: Object3D;

    prefabStore?: PrefabStorage;

    start() {
        if (!this.prefabStoreObject) {
            throw new Error('prefabStoreObject is not set');
        }
        this.prefabStore = this.prefabStoreObject.getComponent(PrefabStorage)!;

        gameState.spawnMissile.add((data) => {
            this.spawnMissile(data.direction, data.position);
        });
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
        }
    }
}
