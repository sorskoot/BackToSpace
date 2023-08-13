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

    private _score = 0;
    public get score(): number {
        return this._score;
    }
    public set score(v: number) {
        this._score = v;
    }

    constructor() {
        this.stateSubject = new Subject<State>();
        this.setState(State.welcome);
    }

    setState(state: State) {
        this.state = state;
    }

    spawnMissile: Emitter<
        {direction: ReadonlyVec3 | undefined; position: ReadonlyVec3 | undefined}[]
    > = new Emitter();

    newGame: Emitter = new Emitter();
    invaderHit: Emitter = new Emitter();

    /**
     * Space or trigger is pressed, fire a bullet or start the game
     */
    fire(direction: ReadonlyVec3 | undefined, position: ReadonlyVec3 | undefined) {
        switch (this.state) {
            case State.welcome:
            case State.gameOver:
                this.setState(State.playing);
                this.score = 0;
                this.newGame.notify();
                break;
            case State.playing:
                this.spawnMissile.notify({direction, position});
                SoundManagerInstance.playSound(Sounds.shoot);
                break;
        }
    }

    hit() {
        this.score++;
        this.invaderHit.notify();
    }

    gameOver() {
        // remove missiles
        this.setState(State.gameOver);
    }
}

export const gameState = new GameState();
