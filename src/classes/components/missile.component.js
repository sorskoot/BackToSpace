export default AFRAME.registerComponent('missile', {
    schema: {
        speed:{
            default: 133 // m/s (roughly the speed of a Tomahawk)
        },
        lifetime:{
            default: 1000
        }
    },
    init: function () { 
        let cam = document.querySelector('a-entity[camera]');
        this.camrot = cam.object3D.rotation;
        this.v = new THREE.Vector3(0,0,1);
        this.v.applyEuler(this.camrot);
    },
    tick: function (time, timeDelta) {
        let pos = this.el.getAttribute('position');
        pos.x -= this.v.x * this.data.speed * (timeDelta/1000);
        pos.y -= this.v.y * this.data.speed * (timeDelta/1000);
        pos.z -= this.v.z * this.data.speed * (timeDelta/1000);
        if(pos.z < -this.data.lifetime){
            this.el.parentEl.removeChild(this.el);
        }
    }
 });