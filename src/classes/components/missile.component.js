export default AFRAME.registerComponent('missile', {
    schema: {
        speed: {
            default: 133 // m/s (roughly the speed of a Tomahawk)
        },
        lifetime: {
            default: 1000
        }
    },
    init: function () {
        let cam = document.querySelector('a-entity[camera]');
        this.camrot = cam.object3D.rotation;
        this.v = new THREE.Vector3(0, 0, 1);
        this.v.applyEuler(this.camrot);
        this.collision = false;
    },
    tick: function (time, timeDelta) {
        if (this.collision) return;
        let pos = this.el.getAttribute('position');
        pos.x -= this.v.x * this.data.speed * (timeDelta / 1000);
        pos.y -= this.v.y * this.data.speed * (timeDelta / 1000);
        pos.z -= this.v.z * this.data.speed * (timeDelta / 1000);
        if (pos.z < -this.data.lifetime) {
            this.el.parentEl.removeChild(this.el);
        }

        let invaders = document.querySelectorAll('[invader]');
        let missilePos = new THREE.Vector3(pos.x, pos.y, pos.z);

        for (let i = 0; i < invaders.length; i++) {
            let ipos = invaders[i].getAttribute('position');
            let invaderPos = new THREE.Vector3(ipos.x, ipos.y, ipos.z);
            let distVector = new THREE.Vector3();
            distVector.subVectors(missilePos, invaderPos);
            let dist = Math.sqrt(distVector.x * distVector.x + distVector.y * distVector.y + distVector.z * distVector.z);

            if (dist < 2 && !this.collision) {
                this.collision = true;
                document.querySelector('[game]').emit('collision', { missile: this.el, invader: invaders[i] });
            }
        }
    }
});