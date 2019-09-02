export default AFRAME.registerComponent('keyboardcontrols', {
    init: function () {

        document.body.addEventListener('keydown', e => {
            if (e.keyCode === 32) {
                let cam = document.querySelector('a-entity[camera]');
                document.querySelector('[game]').emit('fire', {
                    direction: {
                        x: cam.object3D.rotation.x,
                        y: cam.object3D.rotation.y,
                        z: cam.object3D.rotation.z
                    },
                    position: { x: 0, y: 0, z: 0 }
                });
            }
        });

    }
});