export default AFRAME.registerComponent('keyboardcontrols', {
    init: function () {

        document.body.addEventListener('keydown', e => {
            if (e.keyCode === 32) {
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
        });

    }
});