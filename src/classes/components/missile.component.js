import { createMesh } from '../utils/createMesh';

export default AFRAME.registerComponent('missile', {
    schema: {
        speed: {
            default: 133 // m/s (roughly the speed of a Tomahawk)
        },
        lifetime: {
            default: 250
        },
        collisionDistance: {
            default: 5
        },
        direction: {
            type: 'vec3'
        },
        position: {
            type: 'vec3'
        }
    },
    init: function () {
        this.collision = false;
        let m = createMesh([-0.08, 0.06, -0.54, -0.01, 0.06, -0.54, -0.15, 0.0, 0.32, 0.05, 0.0, 0.32, -0.12, 0.02, 0.46, 0.03, 0.02, 0.46, -0.08, 0.14, -0.54, -0.01, 0.14, -0.54, -0.15, 0.2, 0.32, 0.05, 0.2, 0.32, -0.12, 0.18, 0.46, 0.03, 0.18, 0.46, -0.15, 0.0, 0.17, 0.05, 0.0, 0.17, -0.15, 0.2, 0.17, 0.05, 0.2, 0.17, -0.11, 0.03, 0.29, 0.02, 0.03, 0.29, -0.11, 0.17, 0.29, 0.02, 0.17, 0.29, -0.18, -0.03, 0.23, 0.09, -0.03, 0.23, -0.18, 0.23, 0.23, 0.09, 0.23, 0.23],
            [0, 12, 13, 13, 1, 0, 2, 4, 5, 5, 3, 2, 6, 7, 15, 15, 14, 6, 8, 9, 11, 11, 10, 8, 0, 1, 7, 7, 6, 0, 1, 13, 15, 15, 7, 1, 3, 5, 11, 11, 9, 3, 5, 4, 10, 10, 11, 5, 4, 2, 8, 8, 10, 4, 12, 0, 6, 6, 14, 12, 20, 16, 21, 17, 21, 16, 18, 22, 19, 23, 19, 22, 21, 17, 23, 19, 23, 17, 16, 20, 18, 22, 18, 20, 13, 12, 20, 20, 21, 13, 2, 3, 17, 17, 16, 2, 14, 15, 23, 23, 22, 14, 9, 8, 18, 18, 19, 9, 15, 13, 21, 21, 23, 15, 3, 9, 19, 19, 17, 3, 8, 2, 16, 16, 18, 8, 12, 14, 22, 22, 20, 12]);

        let rot = document.querySelector('a-entity[camera]').getAttribute('rotation');

        this.el.setObject3D('mesh', m);
        this.el.setAttribute('rotation',rot);
        this.el.setAttribute('wireframe-material', {
            fillcolor: '#220000' ,
            color: '#FF0000',
            thickness: 0.05
        });
        this.el.setAttribute("position", this.data.position);
        
    },
    tick: function (time, timeDelta) {
        if (this.collision) return;
        let pos = this.el.getAttribute('position');
        pos.x -= this.data.direction.x * this.data.speed * (timeDelta / 1000);
        pos.y -= this.data.direction.y * this.data.speed * (timeDelta / 1000);
        pos.z -= this.data.direction.z * this.data.speed * (timeDelta / 1000);
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

            if (dist < this.data.collisionDistance && !this.collision) {
                this.collision = true;
                document.querySelector('[game]').emit('collision', { missile: this.el, invader: invaders[i] });
            }
        }
    }
});