export default AFRAME.registerComponent('invader', {
    schema: {
        direction: { default: 0 },
    },

    init: function () {
        let pos = this.el.getAttribute('position')
        let dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        this.dir = { x: pos.x / dist, y: pos.y / dist, z: pos.z / dist };
    },

    update: function (oldData) {

    },
    tick: function (time, timeDelta) {
        let pos = this.el.getAttribute('position');
        if (pos.y > 0){
            pos.x -= this.dir.x;
            pos.y -= this.dir.y;
            pos.z -= this.dir.z;
        }else{
            this.el.parentEl.removeChild(this.el);
        }
    },
    tock: function (time, timeDelta, camera) { },
    remove: function () { },
    pause: function () { },
    play: function () { },
    updateSchema: function (data) { }
});