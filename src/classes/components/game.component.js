export default AFRAME.registerComponent('game', {
    schema: {
        spawninterval: { default: 3000 }
    },

    init: function () {
        this.spawntimer = this.data.spawninterval;
        this.invadergroup = document.getElementById("invaders");
        this.spawnInvader();
    },

    tick: function (time, timeDelta) {
        this.spawntimer -= timeDelta;
        if (this.spawntimer < 0) {
            this.spawntimer = this.data.spawninterval;
            this.spawnInvader();
        }
    },

    spawnInvader: function () {
        let box = document.createElement("a-box");
        let rndY = Math.random() * 150 + 50;
        let rad = (Math.random() - .5) * (Math.PI/1.5);
        box.setAttribute("color","green");
        box.setAttribute("invader",{direction:rad});
        box.setAttribute("position", { x: Math.sin(rad)*250, y: rndY, z: Math.cos(rad) * -250 });
        this.invadergroup.appendChild(box);
    }
});