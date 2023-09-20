import {Emitter} from '@wonderlandengine/api';
import {ReadonlyVec3} from 'gl-matrix';
import {Subject} from 'rxjs';
import {SoundManagerInstance, Sounds} from './sfx-manager.js';

export enum State {
    welcome = 0,
    playing = 1,
    gameOver = 2,
    notInVR = 3,
}

class GameState {
    stateSubject: Subject<State>;
    isInVRSubject: Subject<boolean>;

    private _state: State = State.notInVR;
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

    private _isInVR = false;
    public get isInVR(): boolean {
        return this._isInVR;
    }
    public set isInVR(v: boolean) {
        this._isInVR = v;
        this.isInVRSubject.next(v);
    }

    constructor() {
        this.stateSubject = new Subject<State>();
        this.isInVRSubject = new Subject<boolean>();
        this.setState(State.notInVR);
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
            case State.notInVR:
                break;
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
