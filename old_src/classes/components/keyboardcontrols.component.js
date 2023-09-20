export default {
    keyboard: AFRAME.registerComponent('keyboardcontrols', {
        init: function () {
            let reload = false;
            document.body.addEventListener('keydown', e => {
                if (e.keyCode === 32 && !reload) {
                    reload = true;
                    fire();
                }
            });

            document.body.addEventListener('keyup', e => {
                if (e.keyCode === 32) {
                    reload = false;
                }
            });
        }
    }),
    touch: AFRAME.registerComponent('touchcontrols', {
        init: function () {
            let reload = false;
            document.body.addEventListener('touchstart', e => {
                if (!reload) {
                    reload = true;
                    fire();
                }
            });

            document.body.addEventListener('touchstart', e => {
                reload = false;

            });
        }
    }),
}


function fire() {
    let camera = document.querySelector('a-entity[camera]').object3D;
    let v = new THREE.Vector3(0, 0, 1);
    v.applyQuaternion(camera.quaternion);
    document.querySelector('[game]').emit('fire', {
        direction: {
            x: v.x,
            y: v.y,
            z: v.z
        },
        position: { x: 0, y: 0, z: 0 }
    });
}
