import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {gameState} from '../classes/game-state.js';
import {vec3} from 'gl-matrix';

const handedness = ['left', 'right'];

const tempVec3 = vec3.create();

export class VrControls extends Component {
    static TypeName = 'vr-controls';

    @property.object()
    leftController?: Object3D;

    @property.object()
    rightController?: Object3D;

    @property.bool(true)
    haptics = true;

    private handedness = 1;
    private initialized = false;
    private currentlyShootingWithRight = true;
    private forward: vec3 = vec3.create();

    start() {
        this.initialized = false;
        this.engine.onXRSessionStart.add(this.onSessionStart);
    }

    onSessionStart = (session: XRSession) => {
        session.addEventListener('select', async (e) => {
            if (!this.active) {
                return;
            }
            if (e.inputSource.handedness === handedness[this.handedness]) {
                if (this.haptics) {
                    await this.pulse(e.inputSource.gamepad);
                }
                this.rightController!.getForwardWorld(this.forward);
                this.rightController!.getPositionWorld(tempVec3);
                tempVec3[1] += 0.13;
                tempVec3[2] -= 0.4;
                this.shoot(this.forward, tempVec3);
            }
        });
        this.initialized = true;
    };

    async pulse(gamepad: Gamepad | undefined) {
        if (!gamepad || !gamepad.hapticActuators) {
            return;
        }
        const actuator = gamepad.hapticActuators[0];
        if (!actuator) {
            return;
        }
        await actuator.pulse(1, 100);
    }

    shoot(transform: vec3, rotation: vec3) {
        // if (gameState.state === State.welcome || gameState.state === State.gameOver) {
        //     const result = this.engine.scene.rayCast(transform, rotation, 10);
        //     if (result && result.hitCount > 0) {
        //         if (result.objects[0]?.name === 'ZestyAd') {
        //             result.objects[0]!.getComponent(ZestyBanner)!.onClick();
        //             return;
        //         }
        //     } else {
        //         gameState.fire(transform, rotation);
        //     }
        // } else {
        gameState.fire(transform, rotation);
        //     console.log('GO!');
        // }
    }
}
