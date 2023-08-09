import { Subject } from "rxjs";

export enum State {
    welcome,
    playing,
    gameOver
}

class GameState{
    stateSubject: Subject<State>;

    constructor(){
        this.stateSubject = new Subject<State>();
    }

    setState(state: State){
        this.stateSubject.next(state);
    }

}

export const gameState = new GameState();