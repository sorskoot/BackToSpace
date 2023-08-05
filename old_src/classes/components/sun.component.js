export default AFRAME.registerComponent('sun', {
    init: function () {
        let canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1024;
        let ctx = canvas.getContext("2d");

        let s = document.createElement("canvas");
        s.width = s.height = 1024;
        let sun = s.getContext("2d");


        let gradient = sun.createLinearGradient(0, 100, 0, canvas.height-100);
        gradient.addColorStop(0, '#fbf120ff');

        gradient.addColorStop(0.355, "#fd8227ff");
        gradient.addColorStop(0.356, "#fd822700");
        gradient.addColorStop(0.364, "#fd822700");
        gradient.addColorStop(0.365, "#fd8227ff");

        gradient.addColorStop(0.42, "#fe6828ff");
        gradient.addColorStop(0.421, "#fe682800");
        gradient.addColorStop(0.434, "#fe682800");
        gradient.addColorStop(0.435, "#fe6828ff");
        
        gradient.addColorStop(0.49,"#fe5430ff");
        gradient.addColorStop(0.491,"#fe543000");
        gradient.addColorStop(0.509,"#fe543000");
        gradient.addColorStop(0.51,"#fe5430ff");

        gradient.addColorStop(0.562,"#fe4b38ff");
        gradient.addColorStop(0.563,"#fe4b3800");
        gradient.addColorStop(0.582,"#fe4b3800");
        gradient.addColorStop(0.584,"#fe4b38ff");

        //64 -- fe3446
        gradient.addColorStop(0.63,"#fe3446ff");
        gradient.addColorStop(0.631,"#fe344600");
        gradient.addColorStop(0.657,"#fe344600");
        gradient.addColorStop(0.658,"#fe3446ff");
        
        //73 -- fe2558
        gradient.addColorStop(0.710,"#fe2558ff");
        gradient.addColorStop(0.711,"#fe255800");
        gradient.addColorStop(0.739,"#fe255800");
        gradient.addColorStop(0.74,"#fe2558ff");

        //80 -- fe1f5f
        gradient.addColorStop(0.785,"#fe1f5fff");
        gradient.addColorStop(0.786,"#fe1f5f00");
        gradient.addColorStop(0.825,"#fe1f5f00");
        gradient.addColorStop(0.826,"#fe1f5fff");
        //87 -- fe1967
        gradient.addColorStop(0.860,"#fe1967ff");
        gradient.addColorStop(0.861,"#fe196700");
        gradient.addColorStop(0.905,"#fe196700");
        gradient.addColorStop(0.906,"#fe1967ff");
        //94 -- ff1270
        gradient.addColorStop(.940, '#ff1270ff');
        gradient.addColorStop(.941, '#ff127000');
        sun.fillStyle = gradient;
        sun.beginPath();
        sun.arc(canvas.height/2, canvas.height/2, 412, 0, 2 * Math.PI);
        sun.fill();
        
        ctx.shadowColor = '#ff0d77ff';
        ctx.shadowBlur = 100;
        ctx.drawImage(s, 0,0);

        this.el.setAttribute('material', {
            transparent: true,
            src: canvas,
        });
    },
});