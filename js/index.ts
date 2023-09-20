/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
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
import {ZestyBanner} from '@zestymarket/wonderland-sdk';
import {ActiveAd} from './components/active-ad.js';
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

import {loadRuntime} from '@wonderlandengine/api';
/* wle:auto-constants:start */
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    canvas: 'canvas',
};
const Constants = {
    ProjectName: 'BackToSpace',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','local-floor','hand-tracking','hit-test',],
};
/* wle:auto-constants:end */

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);

engine.onSceneLoaded.once(() => {
    const el = document.getElementById('version');
    if (el) {
        setTimeout(() => el.remove(), 2000);
    }
});

/* WebXR setup. */

function requestSession(mode: XRSessionMode) {
    engine
        .requestXRSession(
            mode,
            Constants.WebXRRequiredFeatures,
            Constants.WebXROptionalFeatures
        )
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const arButton = document.getElementById('ar-button') as HTMLDivElement;
    if (arButton) {
        arButton.dataset.supported = engine.arSupported.toString();
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.dataset.supported = engine.vrSupported.toString();
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

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
engine.registerComponent(ZestyBanner);
engine.registerComponent(ActiveAd);
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

engine.scene.load(`${Constants.ProjectName}.bin`).catch((e: string) => {
    throw new Error(e);
});

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
