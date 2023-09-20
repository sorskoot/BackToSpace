import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {CursorTarget, MouseLookComponent} from '@wonderlandengine/components';

export class MouseControls extends Component {
    static TypeName = 'mouse-controls';

    @property.object()
    cursorTargetObject!: Object3D;

    @property.object()
    mouseLookObject!: Object3D;

    private cursorTarget!: CursorTarget;
    private mouselook!: MouseLookComponent;

    start() {
        // this.cursorTarget = this.cursorTargetObject.getComponent(CursorTarget)!;
        // this.mouselook = this.mouseLookObject.getComponent(MouseLookComponent)!;
        // gameState.newGame.add(() => {
        //     this.mouselook.requireMouseDown = false;
        //     const canvas = this.engine.canvas;
        //     canvas.requestPointerLock();
        // });
        // this.cursorTarget.onDown.add(() => {
        //     this.mouselook.requireMouseDown = false;
        //     const canvas = this.engine.canvas;
        //     canvas.requestPointerLock();
        //     gameState.fire(undefined, undefined);
        // });
    }
}
