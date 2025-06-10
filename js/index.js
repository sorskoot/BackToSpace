/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 */

/* wle:auto-imports:start */
import {Prefab} from '@sorskoot/wonderland-components';
import {PrefabStorage} from '@sorskoot/wonderland-components';
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {HowlerAudioListener} from '@wonderlandengine/components';
import {HowlerAudioSource} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {PlayerHeight} from '@wonderlandengine/components';
import {VrModeActiveSwitch} from '@wonderlandengine/components';
import {AudioSource} from '@wonderlandengine/spatial-audio';
import {ActiveOnState} from './components/active-on-state.js';
import {ExplosionParticles} from './components/explosion-particles.js';
import {Game} from './components/game.js';
import {Invader} from './components/invader.js';
import {KeyboardControls} from './components/keyboard-controls.js';
import {MouseControls} from './components/mouse-controls.js';
import {ShowLeaderboard} from './components/show-leaderboard.js';
import {VrControls} from './components/vr-controls.js';
import {HeyvrLeaderboard} from './heyvr/heyvr-leaderboard.js';
/* wle:auto-imports:end */

export default function(engine) {
/* wle:auto-register:start */
engine.registerComponent(Prefab);
engine.registerComponent(PrefabStorage);
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(HowlerAudioSource);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlayerHeight);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(AudioSource);
engine.registerComponent(ActiveOnState);
engine.registerComponent(ExplosionParticles);
engine.registerComponent(Game);
engine.registerComponent(Invader);
engine.registerComponent(KeyboardControls);
engine.registerComponent(MouseControls);
engine.registerComponent(ShowLeaderboard);
engine.registerComponent(VrControls);
engine.registerComponent(HeyvrLeaderboard);
/* wle:auto-register:end */
}
