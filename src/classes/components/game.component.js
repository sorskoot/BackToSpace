
// Waves are ALWAYZ!!! 11 by 5 
const wave = [[
    [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3],
    [0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0],
    [0, 4, 0, 4, 0, 0, 0, 4, 0, 4, 0]],
[
    [0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0],
    [0, 4, 0, 0, 0, 1, 0, 0, 0, 4, 0],
    [4, 2, 4, 0, 1, 3, 1, 0, 4, 2, 4],
    [2, 4, 2, 0, 3, 1, 3, 0, 2, 4, 2],
    [4, 2, 4, 0, 1, 3, 1, 0, 4, 2, 4]],
[
    [0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0],
    [0, 0, 3, 2, 1, 1, 1, 2, 3, 0, 0],
    [0, 3, 2, 1, 1, 4, 1, 1, 2, 3, 0],
    [0, 0, 3, 2, 1, 1, 1, 2, 3, 0, 0],
    [0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0]],
[
    [1, 2, 3, 4, 4, 4, 4, 4, 3, 2, 1],
    [0, 1, 2, 3, 4, 4, 4, 3, 2, 1, 0],
    [0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0],
    [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0]]]

export default AFRAME.registerComponent('game', {
    schema: {
        currentwave: { default: 0 }
    },

    init: function () {
        this.gameover = false;
        this.gameState = 0;// Title-Screen -> 1 = Playing -> 2 = Game-Over -> 1
        this.invadergroup = document.getElementById("invaders");
        this.missilegroup = document.getElementById("missiles");

        this.el.addEventListener('fire', (data) => {
            switch (this.gameState) {
                case 0:
                    document.getElementById('titlescreen')
                        .setAttribute('animation', 'property: position; to: 0 -5 0; dur: 1500; easing: easeOutCubic');
                    this.gameState = 1;
                    this.invadersLeftInWave = this.spawnInvaderWave();
                    break;
                case 1:
                    this.spawnMissile(data.detail.direction, data.detail.position);
                    break;
                case 2:
                    this.gameState = 1;
                    break;
            }
        });

        this.el.addEventListener('collision', e => {
            let invpos = e.detail.invader.getAttribute('position');
            let explosion = document.createElement('a-entity');
            explosion.setAttribute('position', invpos);
            explosion.setAttribute('explosion', '');
            this.missilegroup.appendChild(explosion);

            e.detail.missile.remove();
            e.detail.invader.remove();

            this.invadersLeftInWave -= 1;
            if (this.invadersLeftInWave == 0) {
                this.data.currentwave = (this.data.currentwave + 1) % wave.length;
                this.invadersLeftInWave = this.spawnInvaderWave();
            }
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

    },

    spawnInvaderWave() {
        let spawned = 0;
        for (let i = 0; i < 5; i++) { // wave rows
            for (let j = 0; j < 11; j++) { // wave columns
                if (wave[this.data.currentwave][i][j] > 0) {
                    spawned++;
                    this.spawnInvader(j, i, wave[this.data.currentwave][i][j])
                }
            }
        }
        return spawned;
    },

    spawnInvader: function (x, y, type) {
        let box = document.createElement("a-entity");
        let rndY = -y * 25 + 150;
        let rad = (((x + .5) / 11) - .5) * (Math.PI / 1.5);
        box.setAttribute("invader", { direction: rad, type: type });
        const position = { x: Math.sin(rad) * 250, y: rndY, z: (Math.cos(rad) * -150) };
        box.setAttribute("position", position);
        this.invadergroup.appendChild(box);
    },

    spawnMissile: function (direction, position) {
        let box = document.createElement("a-box");
        box.setAttribute("color", "red");
        box.setAttribute("missile", { direction: direction, position: position });
        this.missilegroup.appendChild(box);
    }
});