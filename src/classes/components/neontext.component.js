export default AFRAME.registerComponent('neontext', {
    schema: {
        text: { default: 'Neon text' }
    },
    init: function () {
        this.update();
    },
    update: function () {
        let canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1024;
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = 'white';
        ctx.font = "150px Serif";
        ctx.textAlign = 'center';

        ctx.fillText(this.data.text, 512, 123);
        
        ctx.strokeStyle = '#e21b90';
        ctx.lineWidth = 2;
        ctx.strokeText(this.data.text, 512, 123);


        ctx.fillStyle = '#e21b90';
        ctx.shadowColor = '#e21b90';
        ctx.shadowBlur = 15;
        ctx.fillText(this.data.text, 515, 126);

        this.el.setAttribute('material', {
            transparent: true,
            src: canvas,
        });
    },
});