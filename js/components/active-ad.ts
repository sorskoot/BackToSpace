import {Component, Object3D} from '@wonderlandengine/api';
import {gameState, State} from '../classes/game-state.js';

export class ActiveAd extends Component {
    static TypeName = 'active-ad';

    components!: Component[];

    start() {
        this.components = [];
        this.getComponents(this.object);
        this.onStateChange(gameState.state);
        gameState.stateSubject.subscribe(this.onStateChange.bind(this));
    }

    onStateChange(newState: State) {
        if (newState === State.gameOver || newState === State.welcome) {
            this.components.forEach((c) => (c.active = true));
        } else {
            this.components.forEach((c) => (c.active = false));
        }
    }

    getComponents(obj: Object3D) {
        const comps = obj.getComponents().filter((c) => c.type !== ActiveAd.TypeName);
        this.components = this.components.concat(comps);
    }
}
