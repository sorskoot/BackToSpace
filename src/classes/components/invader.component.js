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

const verts = [1.0, 3.0, -2.49, 1.0, 3.0, 0.5, 1.0, 4.0, 0.5, 3.0, -1.0, -0.5, 3.0, 1.0, -0.5, 3.0, 1.0, 0.5, 1.0, -3.0, -0.5, 1.0, -3.0, 0.5, 1.0, 2.0, -0.5, 2.0, -2.0, -0.5, 2.0, -2.0, 0.5, 2.0, 2.0, -0.5, 2.0, 2.0, 0.5, 2.0, 3.0, -2.5, 2.0, 3.0, 0.5, 2.0, 4.0, 0.5, 1.0, 2.0, 0.5, 0.0, 2.0, 0.5, 4.0, 1.0, -0.5, 4.0, 0.0, 0.5, 4.0, -2.0, -1.5, 2.0, -4.0, -2.5, 3.99, 2.0, 0.5, 3.99, 0.0, 2.5, 3.99, -4.0, -1.5, 2.99, 2.0, 0.51, 3.01, 0.0, 2.5, 3.01, -4.0, -1.5, 3.01, -2.0, -1.5, 3.01, 0.0, 0.5, 0.0, -3.0, 0.5, 0.0, -3.0, -0.5, 0.0, -1.0, -2.48, 0.0, 2.0, -0.5, -1.0, 4.0, 0.5, -1.0, 3.0, 0.5, -1.0, 3.0, -2.49, -3.0, 1.0, -0.5, -3.0, 1.0, 0.5, -2.0, 2.0, -0.5, -2.0, 2.0, 0.5, -2.0, 3.0, -2.5, -2.0, 3.0, 0.5, -2.0, 4.0, 0.5, -1.0, -3.0, -0.5, -1.0, 2.0, -0.5, -1.0, 2.0, 0.5, -4.0, 1.0, -0.5, -3.99, 2.0, 0.5, -3.01, 2.0, 0.5, -4.0, -2.0, -1.5, -4.0, 0.0, 0.5, -3.01, 0.0, 0.5, -3.01, -2.0, -1.5, -3.99, 0.0, 2.5, -3.99, -4.0, -1.5, -3.01, 0.0, 2.5, -3.01, -4.0, -1.5, -2.0, -4.0, -2.5, -3.01, -1.0, -0.5, -1.0, -3.0, 0.5, -2.0, -2.0, -0.5, -2.0, -2.0, 0.5];
const faces = [2, 1, 0, 4, 5, 11, 11, 5, 12, 13, 14, 15, 13, 2, 0, 15, 2, 13, 30, 6, 31, 8, 33, 32, 31, 6, 32, 12, 16, 8, 8, 11, 12, 14, 13, 8, 8, 16, 14, 18, 22, 25, 18, 25, 4, 20, 19, 29, 20, 29, 28, 19, 18, 4, 19, 4, 29, 23, 20, 24, 23, 19, 20, 22, 19, 23, 22, 18, 19, 26, 27, 28, 26, 28, 29, 25, 26, 29, 27, 24, 21, 24, 20, 21, 20, 28, 21, 28, 27, 21, 3, 29, 4, 6, 7, 9, 7, 10, 9, 10, 3, 9, 5, 4, 25, 7, 6, 30, 4, 11, 32, 3, 4, 32, 9, 3, 32, 11, 8, 32, 6, 9, 32, 13, 0, 33, 33, 8, 13, 1, 17, 33, 33, 0, 1, 35, 34, 36, 38, 37, 39, 38, 39, 40, 42, 41, 43, 34, 41, 36, 34, 43, 41, 44, 30, 31, 33, 45, 32, 44, 31, 32, 46, 40, 45, 39, 45, 40, 41, 42, 45, 46, 45, 42, 48, 47, 49, 49, 47, 37, 51, 50, 52, 52, 50, 53, 47, 51, 37, 37, 51, 52, 50, 54, 55, 51, 54, 50, 51, 48, 54, 47, 48, 51, 57, 56, 53, 53, 56, 52, 56, 49, 52, 55, 57, 58, 50, 55, 58, 53, 50, 58, 57, 53, 58, 52, 59, 37, 60, 44, 61, 62, 60, 61, 59, 62, 61, 37, 38, 49, 44, 60, 30, 39, 37, 32, 37, 59, 32, 59, 61, 32, 45, 39, 32, 61, 44, 32, 36, 41, 33, 45, 33, 41, 17, 35, 33, 36, 33, 35];

export default AFRAME.registerComponent('invader', {
    schema: {
        direction: { default: 0 },
    },

    init: function () {
        const height = data.length;
        const width = data[0].length;

        var geometry = new THREE.Geometry();
      //  var uniforms = { 'widthFactor': { value: .1 } };
        // var material = new THREE.ShaderMaterial({
        //     uniforms: uniforms,
        //     vertexShader: document.getElementById('vertexShader').textContent,
        //     fragmentShader: document.getElementById('fragmentShader').textContent,
        //     side: THREE.DoubleSide
        // });
        // material.extensions.derivatives = true;
        
        // geometry.removeAttribute( 'normal' );
        // geometry.removeAttribute( 'uv' );
                    
        for (let i = 0; i < verts.length; i += 3) {
            geometry.vertices.push(
                new THREE.Vector3(verts[i], verts[i + 1], verts[i + 2])
            );
        }

        for (let i = 0; i < faces.length; i += 3) {
            geometry.faces.push(
                new THREE.Face3(faces[i + 2], faces[i + 1], faces[i])
            );
        }


        var cube = new THREE.Mesh(geometry, material);

        this.el.setObject3D('invader', cube);

        // for (let i = 0; i < height; i++) {
        //     for (let j = 0; j < width; j++) {
        //         if (data[i][j]) {
        //             let inv = document.createElement('a-box');
        //             inv.setAttribute('position', { x: j - (width / 2), y: i - (height / 2), z: 0 })
        //             inv.setAttribute('color', colors[data[i][j] - 1]);
        //             this.el.appendChild(inv);
        //         };
        //     }
        // }

        let pos = this.el.getAttribute('position')
       // this.el.setAttribute('scale', { x: .3, y: .3, z: .3 })
        this.el.setAttribute('rotation', { x: 0, y: 180, z: 0 });
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