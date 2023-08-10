import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {gameState} from '../classes/game-state.js';
import {vec3} from 'gl-matrix';

export class KeyboardControls extends Component {
    static TypeName = 'keyboard-controls';

    @property.object()
    nonVRCamera?: Object3D;

    @property.object()
    missileSpawnPoint?: Object3D;

    private spacePressed = false;
    private forward = vec3.create();

    onActivate(): void {
        window.addEventListener('keydown', this.pressKeyboard);
        window.addEventListener('keyup', this.releaseKeyboard);
    }

    onDeactivate(): void {
        window.removeEventListener('keydown', this.pressKeyboard);
        window.removeEventListener('keyup', this.releaseKeyboard);
    }

    pressKeyboard = (input: KeyboardEvent): void => {
        if (input.code == 'Space' && !this.spacePressed) {
            this.spacePressed = true;
            if (this.nonVRCamera && this.missileSpawnPoint) {
                this.nonVRCamera.getForwardWorld(this.forward);
                const position = this.missileSpawnPoint.getPositionWorld();
                gameState.fire(this.forward, position);
            }
        }
    };

    releaseKeyboard = (input: KeyboardEvent): void => {
        if (input.code == 'Space' && this.spacePressed) {
            this.spacePressed = false;
        }
    };
}
