export default AFRAME.registerComponent('neontext', {
    schema: {
        text: { default: 'Neon text' },
        fontsize: { default: 150 },
        font: { default: 'Serif' },
        color: { type: 'color', default: '#e21b90' }
    },
    init: function () {
        this.update();
    },
    update: function () {
        let canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1024;
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = 'white';
        ctx.font = `${this.data.fontsize}px ${this.data.font}` ;
        ctx.textAlign = 'center';

        ctx.fillText(this.data.text, 512, 123);

        ctx.strokeStyle = this.data.color;
        ctx.lineWidth = (this.data.fontsize/75);
        ctx.strokeText(this.data.text, 512, 123);


        ctx.fillStyle = this.data.color;
        ctx.shadowColor = this.data.color;
        ctx.shadowBlur = 15;
        ctx.fillText(this.data.text, 512+(this.data.fontsize/50), 123+(this.data.fontsize/50));

        this.el.setAttribute('material', {
            transparent: true,
            src: canvas,
        });
    },
});