import { noise2d } from '../utils/perlin';

export default AFRAME.registerComponent('space', {
    schema: {},
    init: function () {
        var canvas = document.createElement("canvas");
        canvas.width = 2048;
        canvas.height = 2048;
        var c2d = canvas.getContext("2d");
        c2d.fillStyle = "#FF00FF";
        c2d.fillRect(0, 0, canvas.width, canvas.height)
        var imageData = c2d.createImageData(canvas.width, canvas.height);
        var data = imageData.data;
        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                var v = noise2d(5 * x / canvas.width, 5 * y / canvas.height);
                var i = (y * canvas.width + x) * 4;
                data[i + 0] = -25 * v + 41;//((1 + v) / 2 * 255)/2 + 128;
                data[i + 1] = 7 * v + 10//0x00;
                data[i + 2] = -8 * v + 59//0x4f;
                data[i + 3] = 0xff;// | ((1 + v) / 2 * 255);
            }
        }

        for (let s = 0; s < 10000; s++) {
            let x = ~~(Math.random() * canvas.width);
            let y = ~~(Math.random() * canvas.height);
            var i = (y * canvas.width + x) * 4;
            const v = ~~(Math.random() * 255);
            data[i + 0] = v/2+128;
            data[i + 1] = v;
            data[i + 2] = v/2+128;
            data[i + 3] = 0xff;
        }
        //66, 10, 77
        //41, 17, 69
        //-25*v+41, 7*v+10, -8*v+59
        c2d.putImageData(imageData, 0, 0);

        this.el.setAttribute('material', {
            shader: 'flat',
            color: 'white',
            src: canvas,
        });
        this.el.setAttribute('rotation',"0 -90 0");
    }
});