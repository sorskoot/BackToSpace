import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {gameState, State} from '../classes/game-state.js';

export class ActiveOnState extends Component {
    static TypeName = 'active-on-state';

    /**
     * The state that this component should be active on.
     */
    @property.enum(Object.keys(State).filter((k) => isNaN(Number(k))))
    state = State.welcome;

    /**
     * whether child object's components should be affected
     */
    @property.bool(true)
    affectChildren = true;

    /**
     * If this property is true everything will be inactive instead of active
     */
    @property.bool(false)
    inactive = false;

    components!: Component[];

    start() {
        this.components = [];
        this.getComponents(this.object);
        this.onStateChange(gameState.state);
        gameState.stateSubject.subscribe(this.onStateChange.bind(this));
    }

    onStateChange(newState: State) {
        if (newState === this.state) {
            this.components.forEach((c) => (c.active = !this.inactive));
        } else {
            this.components.forEach((c) => (c.active = this.inactive));
        }
    }

    getComponents(obj: Object3D) {
        const comps = obj.getComponents().filter((c) => c.type !== ActiveOnState.TypeName);
        this.components = this.components.concat(comps);

        if (this.affectChildren) {
            const children = obj.children;
            for (let i = 0; i < children.length; ++i) {
                this.getComponents(children[i]);
            }
        }
    }
}
