const colors = ['#00FF00', '#FF0000', '#0000FF']
const data =
    [[0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 2, 1, 1, 2, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0]]


export default AFRAME.registerComponent('invader', {
    schema: {
        direction: { default: 0 },
    },

    init: function () {
        const height = data.length;
        const width = data[0].length;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j]) {
                    let inv = document.createElement('a-box');
                    inv.setAttribute('position', { x: j - (width / 2), y: i - (height / 2), z: 0 })
                    inv.setAttribute('color', colors[data[i][j]-1]);
                    this.el.appendChild(inv);
                };
            }
        }

        let pos = this.el.getAttribute('position')
        this.el.setAttribute('scale', { x: .3, y: .3, z: .3 })
        let dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        this.dir = { x: pos.x / dist, y: pos.y / dist, z: pos.z / dist };
    },

    update: function (oldData) {

    },
    tick: function (time, timeDelta) {
        let pos = this.el.getAttribute('position');
        if (pos.y > 0) {
            pos.x -= this.dir.x;
            pos.y -= this.dir.y;
            pos.z -= this.dir.z;
        } else {
            this.el.parentEl.removeChild(this.el);
            document.querySelector('[game]').emit('game-over');
        }
    },
    tock: function (time, timeDelta, camera) { },
    remove: function () { },
    pause: function () { },
    play: function () { },
    updateSchema: function (data) { }
});