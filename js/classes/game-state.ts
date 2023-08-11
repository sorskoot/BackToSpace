import {Emitter} from '@wonderlandengine/api';
import {ReadonlyVec3} from 'gl-matrix';
import {Subject} from 'rxjs';
import {SoundManagerInstance, Sounds} from './sfx-manager.js';

export enum State {
    welcome = 0,
    playing = 1,
    gameOver = 2,
}

class GameState {
    stateSubject: Subject<State>;

    private _state: State = State.welcome;
    public get state(): State {
        return this._state;
    }
    private set state(newState: State) {
        this._state = newState;
        this.stateSubject.next(newState);
    }

    private _currentWave = 0;
    public get currentWave(): number {
        return this._currentWave;
    }
    public set currentWave(v: number) {
        this._currentWave = v;
    }

    constructor() {
        this.stateSubject = new Subject<State>();
        this.setState(State.welcome);
    }

    setState(state: State) {
        this.state = state;
    }

    spawnMissile: Emitter<{direction: ReadonlyVec3; position: ReadonlyVec3}[]> =
        new Emitter();

    /**
     * Space or trigger is pressed, fire a bullet or start the game
     */
    fire(direction: ReadonlyVec3, position: ReadonlyVec3) {
        switch (this.state) {
            case State.welcome:
                this.setState(State.playing);
                break;
            case State.playing:
                this.spawnMissile.notify({direction, position});
                SoundManagerInstance.playSound(Sounds.shoot);
                break;
            case State.gameOver:
                this.setState(State.playing);
                break;
        }
    }
}

export const gameState = new GameState();
