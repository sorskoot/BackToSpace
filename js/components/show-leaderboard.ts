import {Component} from '@wonderlandengine/api';
import {vec3} from 'gl-matrix';
import {Easing, lerpVec3} from '../classes/utils/lerp.js';
import {clamp} from '@sorskoot/wonderland-components';

const tempVec3 = vec3.create();
export class ShowLeaderboard extends Component {
    static TypeName = 'show-leaderboard';

    private originalPosition = vec3.create();
    private hiddenPosition = vec3.create();
    private timer = 0;
    private isShown = true;

    start(): void {
        this.object.getPositionWorld(this.originalPosition);
        vec3.copy(this.hiddenPosition, this.originalPosition);
        this.hiddenPosition[1] = -3.5;
    }

    show() {
        this.isShown = true;
        this.active = true;
        this.timer = 0;
    }

    hide() {
        this.isShown = false;
        this.active = true;
        this.timer = 0;
    }

    update(dt: number) {
        this.timer += dt;
        clamp(this.timer, 0, 1);
        if (this.isShown) {
            lerpVec3(
                tempVec3,
                this.hiddenPosition,
                this.originalPosition,
                this.timer,
                Easing.InCubic
            );
        } else {
            lerpVec3(
                tempVec3,
                this.originalPosition,
                this.hiddenPosition,
                this.timer,
                Easing.OutCubic
            );
        }
        this.object.setPositionWorld(tempVec3);
        if (this.timer >= 1) {
            this.active = false;
        }
    }
}
