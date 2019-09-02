
// Waves are ALWAYZ!!! 11 by 5 
const wave = [[
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3],
    [0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0],
    [0, 4, 0, 4, 0, 0, 0, 4, 0, 4, 0]]]

export default AFRAME.registerComponent('game', {
    schema: {
        spawninterval: { default: 1000 },
        currentwave: { default: 0 }
    },

    init: function () {
        this.gameover = false;
        this.spawntimer = this.data.spawninterval;
        this.invadergroup = document.getElementById("invaders");
        this.missilegroup = document.getElementById("missiles");
        this.spawnInvaderWave();

        this.el.addEventListener('fire', (data) => {
            if (this.gameover) return;
            this.spawnMissile(data.detail.direction, data.detail.position);
        });

        this.el.addEventListener('collision', e => {
            let invpos = e.detail.invader.getAttribute('position');
            let explosion = document.createElement('a-entity');
            explosion.setAttribute('position', invpos);
            explosion.setAttribute('explosion', '');
            this.missilegroup.appendChild(explosion);

            e.detail.missile.remove();
            e.detail.invader.remove();
        })

        this.el.addEventListener('game-over', () => {
            if (!~document.location.href.indexOf('godmode')) {
                this.gameover = true;
                alert('Game Over');
                document.querySelectorAll('[invader], [missile]').forEach(x => x.remove());
            }

        });
    },

    tick: function (time, timeDelta) {
        // if (this.gameover) return;
        // this.spawntimer -= timeDelta;
        // if (this.spawntimer < 0) {
        //     this.spawntimer = this.data.spawninterval;
        //     this.spawnInvader();
        // }
    },

    spawnInvaderWave() {
        for (let i = 0; i < 5; i++) { // wave rows
            for (let j = 0; j < 11; j++) { // wave columns
                if (wave[this.data.currentwave][i][j] > 0) {
                    this.spawnInvader(j, i, wave[this.data.currentwave][i][j])
                }
            }
        }
    },

    spawnInvader: function (x, y, type) {
        let box = document.createElement("a-entity");
        let rndY = -y * 150 + 1000;
        let rad = ((x / 11) - .5) * (Math.PI / 1.5);
        box.setAttribute("invader", { direction: rad, type: type });
        box.setAttribute("position", { x: Math.sin(rad) * 1500, y: rndY, z: (Math.cos(rad) * -500) - 500 });
        this.invadergroup.appendChild(box);
    },

    spawnMissile: function (direction, position) {
        let box = document.createElement("a-box");
        box.setAttribute("color", "red");
        box.setAttribute("missile", { direction: direction, position: position });
        this.missilegroup.appendChild(box);
    }
});