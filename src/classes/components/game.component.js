import { sound } from '../utils/sound';

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
    [4, 6, 4, 0, 1, 7, 1, 0, 4, 6, 4],
    [2, 4, 2, 0, 3, 1, 3, 0, 2, 4, 2],
    [4, 2, 4, 0, 1, 3, 1, 0, 4, 2, 4]],
[
    [0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0],
    [0, 0, 3, 2, 1, 1, 1, 2, 3, 0, 0],
    [0, 3, 2, 1, 1, 4, 1, 1, 2, 3, 0],
    [0, 0, 3, 2, 1, 1, 1, 2, 3, 0, 0],
    [0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0]],
[
    [1, 2, 3, 4, 5, 8, 5, 4, 3, 2, 1],
    [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
    [0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0],
    [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0]],
[
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    [6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6],
    [0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0]],
[
    [0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0],
    [0, 0, 8, 6, 8, 0, 8, 6, 8, 0, 0],
    [0, 8, 6, 4, 6, 8, 6, 4, 6, 8, 0],
    [8, 6, 4, 2, 4, 6, 4, 2, 4, 6, 8],
    [6, 4, 2, 0, 2, 4, 2, 0, 2, 4, 6]]]



export default AFRAME.registerComponent('game', {
    schema: {
        currentwave: { default: 0 }
    },

    init: function () {

        this.gameover = false;
        this.currentspeed = 5;
        this.score = 0;
        this.gameState = 0;
        this.invadergroup = document.getElementById("invaders");
        this.missilegroup = document.getElementById("missiles");
        this.hudscore = document.getElementById("hud-score");
        this.titlescreen = document.getElementById('titlescreen');
        this.gameoverscreen = document.getElementById('gameoverscreen');
        this.adscreen = document.getElementById('ad');
        this.aframeCanvas = document.querySelector('.a-canvas');
        this.hud = document.getElementById("hud");
        this.hud.setAttribute('visible', 'false');
        document.getElementById('gunray').setAttribute('line','visible', false);
        this.isInVR = false;
        this.isPointerLocked = false;
        this.el.sceneEl.addEventListener('enter-vr', () => {
            this.isInVR = true;
            document.getElementById('song').setAttribute('song','playing',true);
            document.querySelector('[gun]').setAttribute('visible', true);
            document.getElementById('gunray').setAttribute('line','visible', true);
        });
        this.el.sceneEl.addEventListener('exit-vr', () => {
            this.isInVR = false;
            document.querySelector('[gun]').setAttribute('visible', false);
            document.getElementById('gunray').setAttribute('line','visible', false);
        });
        // document.getElementById('titlescreen').addEventListener('click', () => {
        //     if (!this.isPointerLocked) {
        //         console.log('titlescreen clicked');
        //     }           
        // });
        this.el.addEventListener('fire', (data) => {
            switch (this.gameState) {
                case 0: // title
                    if (this.isInVR) {
                        // this.spawnMissile(data.detail.direction, data.detail.position);
                        const gunRayCaster = document.getElementById('gunray');
                        if (gunRayCaster.components.raycaster.intersectedEls.length > 0) {
                            const parents = this.filterVisibleParents(gunRayCaster.components.raycaster.intersectedEls);
                            if (parents.length > 0) {
                                if (parents[0].parentEl.components['zesty-ad']) {
                                    parents[0].emit('click');
                                }else{
                                    this.score = 0;
                                    this.updateScore();
                                    this.hud.setAttribute('visible', 'true');
                                    this.titlescreen.setAttribute('visible', 'false');
                                    this.adscreen.setAttribute('visible', 'false');                                    
                                    document.querySelector('[camera]').setAttribute('raycaster', 'enabled', 'false')
                                    gunRayCaster.setAttribute('line', 'visible', 'false')
                                    this.gameState = 1;
                                    const cursorEl = document.querySelector('[cursor]');
                                    cursorEl.setAttribute('visible', false);
                                    this.invadersLeftInWave = this.spawnInvaderWave();
                                }
                            }
                        }
                    } else {
                        if (this.isPointerLocked) {
                            const cameraRayCaster = document.querySelector('[camera]');
                            //components.raycaster.getIntersection(this.el);
                            if (cameraRayCaster.components.raycaster.intersectedEls.length > 0) {
                                if (cameraRayCaster.components.raycaster.intersectedEls[0].parentEl &&
                                    !!cameraRayCaster.components.raycaster.intersectedEls[0].parentEl.components['zesty-ad']) {
                                    cameraRayCaster.components.raycaster.intersectedEls[0].emit('click');
                                }
                                else {
                                    document.getElementById('song').setAttribute('song','playing',true);
                                    this.score = 0;
                                    this.updateScore();
                                    this.hud.setAttribute('visible', 'true');
                                    this.titlescreen.setAttribute('visible', 'false');
                                    this.adscreen.setAttribute('visible', 'false');
                                    document.querySelector('[camera]').setAttribute('raycaster', 'enabled', 'false')
                                    this.gameState = 1;
                                    const cursorEl = document.querySelector('[cursor]');
                                    cursorEl.setAttribute('visible', false);
                                    this.invadersLeftInWave = this.spawnInvaderWave();
                                }
                            };
                        }
                    }
                    //sound.play(sound.alarm);

                    // 

                    break;
                case 1: // fire missile
                    sound.play(sound.fire);
                    this.spawnMissile(data.detail.direction, data.detail.position);
                    break;
                case 3: // game over
                    if (this.isInVR) {
                        const gunRayCaster = document.getElementById('gunray');
                        if (gunRayCaster.components.raycaster.intersectedEls.length > 0) {
                            const parents = this.filterVisibleParents(gunRayCaster.components.raycaster.intersectedEls);
                            if (parents.length > 0) {
                                if (parents[0].parentEl.components['zesty-ad']) {
                                    parents[0].emit('click');
                                }else{                                    
                                    document.querySelectorAll('[invader], [missile]').forEach(x => x.remove());
                                    document.getElementById('gameoverscreen').setAttribute('visible', 'false');
                                    document.getElementById('ad').setAttribute('visible', 'false');
                                    document.querySelector('[camera]').setAttribute('raycaster', 'enabled', 'false')
                                    gunRayCaster.setAttribute('line', 'visible', 'false')
                                    this.gameover = false
                                    this.gameState = 1;
                                    this.score = 0;
                                    this.updateScore();
                                    this.hud.setAttribute('visible', 'true');
                                    this.currentspeed = 5;
                                    this.data.currentwave = 0;
                                    this.invincible = true;
                                    const cursorEl = document.querySelector('[cursor]');
                                    cursorEl.setAttribute('visible', false);
                                    setTimeout(() => {
                                        this.invincible = false;
                                    }, 5000);
                                    this.invadersLeftInWave = this.spawnInvaderWave();
                                }
                            }
                        }
                    } else {
                        const cameraRayCaster = document.querySelector('[camera]');
                        //components.raycaster.getIntersection(this.el);
                        if (cameraRayCaster.components.raycaster.intersectedEls.length > 0) {
                            const parents = this.filterVisibleParents(cameraRayCaster.components.raycaster.intersectedEls);
                            if (parents.length > 0) {
                                if (parents[0].components['zesty-ad']) {
                                    parents[0].emit('click');
                                }
                                else {
                                    document.querySelectorAll('[invader], [missile]').forEach(x => x.remove());
                                    document.getElementById('gameoverscreen').setAttribute('visible', 'false');
                                    document.getElementById('ad').setAttribute('visible', 'false');
                                    document.querySelector('[raycaster]').setAttribute('raycaster', 'enabled', 'false')
                                    this.gameover = false
                                    this.gameState = 1;
                                    this.score = 0;
                                    this.updateScore();
                                    this.hud.setAttribute('visible', 'true');
                                    this.currentspeed = 5;
                                    this.data.currentwave = 0;
                                    this.invincible = true;
                                    const cursorEl = document.querySelector('[cursor]');
                                    cursorEl.setAttribute('visible', false);
                                    setTimeout(() => {
                                        this.invincible = false;
                                    }, 5000);
                                    this.invadersLeftInWave = this.spawnInvaderWave();
                                }
                            }
                        }

                    }
                    break;
            }
        });

        this.el.addEventListener('collision', e => {
            sound.play(sound.explosion);
            let invpos = e.detail.invader.getAttribute('position');
            let explosion = document.createElement('a-entity');
            explosion.setAttribute('position', invpos);
            explosion.setAttribute('explosion', { color: e.detail.invader.components.invader.getColor() });
            this.missilegroup.appendChild(explosion);

            e.detail.missile.remove();
            e.detail.invader.remove();

            this.invadersLeftInWave -= 1;
            this.score++;
            this.updateScore();
            if (this.invadersLeftInWave == 0) {
                // sound.play(sound.alarm);
                setTimeout(() => {
                    this.data.currentwave = (this.data.currentwave + 1) % wave.length;
                    this.currentspeed++;
                    this.invadersLeftInWave = this.spawnInvaderWave();
                }, 1500);
            }
        })
        this.el.addEventListener('game-over', () => {
            if (!~document.location.href.indexOf('godmode') && !this.invincible) {
                sound.play(sound.gameover);
                document.querySelector('[ca-leaderboard]').components['ca-leaderboard'].submitScore(this.score);
                document.getElementById('score').setAttribute('neontext', { text: `${this.score} invaders shot`, fontsize: 60, color: "#1b90e2" });
                document.getElementById('gameoverscreen').setAttribute('visible', 'true');
                document.getElementById('ad').setAttribute('visible', 'true');
                document.querySelector('[raycaster]').setAttribute('raycaster', 'enabled', 'true')
                document.getElementById('gunray').setAttribute('line', 'visible', 'true')
                this.hud.setAttribute('visible', 'false');
                const cursorEl = document.querySelector('[cursor]');
                cursorEl.setAttribute('visible', true);
                this.gameState = 2;
                setTimeout(() => {
                    this.gameState = 3;
                }, 5000);
                // show game over screen;
                this.gameover = true;
            }
        });
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
        box.setAttribute("invader", { direction: rad, type: type, speed: this.currentspeed });
        box.setAttribute('appear', '');
        const position = { x: Math.sin(rad) * 250, y: rndY, z: (Math.cos(rad) * -150) };
        box.setAttribute("position", position);
        this.invadergroup.appendChild(box);
    },

    spawnMissile: function (direction, position) {
        let box = document.createElement("a-entity");
        box.setAttribute("missile", { direction: direction, position: position });
        this.missilegroup.appendChild(box);
    },

    updateScore: function () {
        this.hudscore.setAttribute("neontext", { text: this.score });
    },

    tick: function () {
        if (this.isInVR) return;
        const pointerlocked = document.pointerLockElement === this.aframeCanvas ||
            document.mozPointerLockElement === this.aframeCanvas;
        if (pointerlocked != this.isPointerLocked) {
            this.isPointerLocked = pointerlocked;
            const cursorEl = document.querySelector('[cursor]');
            cursorEl.setAttribute('visible', this.isPointerLocked && this.gameState != 1);
            // cursorEl.setAttribute('cursor','enabled',!this.isPointerLocked)
        }
    },

    filterVisibleParents: function (els) {
        let parents = [];
        els.forEach(el => {
            if (el.parentEl) {
                if (el.parentEl.components.visible) {
                    if (el.parentEl.components.visible.attrValue) {
                        parents.push(el);
                    }
                } else {
                    parents.push(el);
                }
            }
        });
        return parents;
    }

});