export default AFRAME.registerComponent('appear', {
    schema: {},
    init: function () { 
        this.el.setAttribute('scale', `0 0 0`);
        this.scale = 0;
        this.delay = Math.random() * 1000;
    },
    tick: function (time, timeDelta) { 
        if(this.delay > 0){
            this.delay-=timeDelta;
            return;
        }

        this.scale += (1.5 / 100.0) * timeDelta
        this.el.object3D.scale.setScalar(this.scale);
        if(this.scale > 1.5){
            this.el.removeAttribute('appear');
        }
    },
});