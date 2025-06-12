/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

import { loadRuntime } from '@wonderlandengine/api';

/* wle:auto-constants:start */
const Constants = {
    ProjectName: 'BackToSpace',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','local-floor','hand-tracking','hit-test',],
};
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    xrOfferSession: {
        mode: 'auto',
        features: Constants.WebXRRequiredFeatures,
        optionalFeatures: Constants.WebXROptionalFeatures,
    },
    canvas: 'canvas',
};
/* wle:auto-constants:end */

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
engine.onLoadingScreenEnd.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});

/* WebXR setup. */

function requestSession(mode) {
    engine
        .requestXRSession(mode, Constants.WebXRRequiredFeatures, Constants.WebXROptionalFeatures)
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.setAttribute('data-supported', engine.vrSupported.toString());
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

async function reload(name) {
    /* Registers all components exported from the scene. */
    const register = (await import(`./${name}-bundle.js?t=${Date.now()}`)).default;
    register(engine);

    /* Load main scene */
    try {
        await engine.loadMainScene(`${name}.bin`);
    } catch (e) {
        console.error(e);
        window.alert(`Failed to load ${name}.bin:`, e);
    }
}
engine.onHotReloadRequest.add(reload);

reload(Constants.ProjectName);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
