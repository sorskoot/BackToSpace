import vertShader from '../../shaders/shader.vert';
import fragShader from '../../shaders/shader.frag';
import {
    addBarycentricCoordinates,
    unindexBufferGeometry
} from '../utils/geom';

const colors = ['#00FF00', '#0000FF', '#00FFFF', '#FFFF00', '#FF00FF'];

const verts = [-1.0, 3.0, 1.65, -1.0, 3.0, -1.34, -1.0, 4.0, -1.34, -3.01, -1.0, -0.34, -3.0, 1.0, -0.34, -3.0, 1.0, -1.34, -1.0, -3.0, -0.34, -1.0, -3.0, -1.34, -1.0, 2.0, -0.34, -2.0, -2.0, -0.34, -2.0, -2.0, -1.34, -2.0, 2.0, -0.34, -2.0, 2.0, -1.34, -2.0, 3.0, 1.66, -2.0, 3.0, -1.34, -2.0, 4.0, -1.34, -1.0, 2.0, -1.34, 0.0, 2.0, -1.34, -4.0, 1.0, -0.34, -4.0, 0.0, -1.34, -4.0, -2.0, 0.66, -2.0, -4.0, 1.66, -3.99, 2.0, -1.34, -3.99, 0.0, -3.34, -3.99, -4.0, 0.66, -3.0, 2.0, -1.35, -3.01, 0.0, -3.34, -3.01, -4.0, 0.66, -3.01, -2.0, 0.66, -3.01, 0.0, -1.34, 0.0, -3.0, -1.34, 0.0, -3.0, -0.34, 0.0, -1.0, 1.64, 0.0, 2.0, -0.34, 1.0, 4.0, -1.34, 1.0, 3.0, -1.34, 1.0, 3.0, 1.65, 3.0, 1.0, -0.34, 3.0, 1.0, -1.34, 2.0, 2.0, -0.34, 2.0, 2.0, -1.34, 2.0, 3.0, 1.66, 2.0, 3.0, -1.34, 2.0, 4.0, -1.34, 1.0, -3.0, -0.34, 1.0, 2.0, -0.34, 1.0, 2.0, -1.34, 4.0, 1.0, -0.34, 3.99, 2.0, -1.34, 3.01, 2.0, -1.34, 4.0, -2.0, 0.66, 4.0, 0.0, -1.34, 3.01, 0.0, -1.34, 3.01, -2.0, 0.66, 3.99, 0.0, -3.34, 3.99, -4.0, 0.66, 3.01, 0.0, -3.34, 3.01, -4.0, 0.66, 2.0, -4.0, 1.66, 3.0, -1.0, -0.34, 1.0, -3.0, -1.34, 2.0, -2.0, -0.34, 2.0, -2.0, -1.34];
const faces = [2, 1, 0, 4, 5, 11, 11, 5, 12, 13, 14, 15, 13, 2, 0, 15, 2, 13, 30, 6, 31, 8, 33, 32, 31, 6, 32, 12, 16, 8, 8, 11, 12, 14, 13, 8, 8, 16, 14, 18, 22, 25, 18, 25, 4, 20, 19, 29, 20, 29, 28, 19, 18, 4, 19, 4, 29, 23, 20, 24, 23, 19, 20, 22, 19, 23, 22, 18, 19, 26, 27, 28, 26, 28, 29, 25, 26, 29, 27, 24, 21, 24, 20, 21, 20, 28, 21, 28, 27, 21, 3, 29, 4, 6, 7, 9, 7, 10, 9, 10, 3, 9, 5, 4, 25, 7, 6, 30, 4, 11, 32, 3, 4, 32, 9, 3, 32, 11, 8, 32, 6, 9, 32, 13, 0, 33, 33, 8, 13, 1, 17, 33, 33, 0, 1, 35, 34, 36, 38, 37, 39, 38, 39, 40, 42, 41, 43, 34, 41, 36, 34, 43, 41, 44, 30, 31, 33, 45, 32, 44, 31, 32, 46, 40, 45, 39, 45, 40, 41, 42, 45, 46, 45, 42, 48, 47, 49, 49, 47, 37, 51, 50, 52, 52, 50, 53, 47, 51, 37, 37, 51, 52, 50, 54, 55, 51, 54, 50, 51, 48, 54, 47, 48, 51, 57, 56, 53, 53, 56, 52, 56, 49, 52, 55, 57, 58, 50, 55, 58, 53, 50, 58, 57, 53, 58, 52, 59, 37, 60, 44, 61, 62, 60, 61, 59, 62, 61, 37, 38, 49, 44, 60, 30, 39, 37, 32, 37, 59, 32, 59, 61, 32, 45, 39, 32, 61, 44, 32, 36, 41, 33, 45, 33, 41, 17, 35, 33, 36, 33, 35, 54, 55, 57, 56, 54, 57, 26, 27, 24, 26, 24, 23];

export default AFRAME.registerComponent('invader', {
    schema: {
        direction: { default: 0 },
        type: { default: 1 },
        speed: { default: 5 },
        frequency: { default: 2 }
    },

    init: function () {
        this.movement = 0;
        var geometry = new THREE.Geometry();

        var material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: true
            },
            uniforms: { // some parameters for the shader
                time: { value: 0 },
                fill: { value: new THREE.Color('#000000') },
                stroke: { value: new THREE.Color(colors[this.data.type - 1]) },
                noiseA: { value: false },
                noiseB: { value: false },
                dualStroke: { value: false },
                seeThrough: { value: false },
                insideAltColor: { value: true },
                thickness: { value: 0.05 },
                secondThickness: { value: 0.05 },
                dashEnabled: { value: false },
                dashRepeats: { value: 2.0 },
                dashOverlap: { value: false },
                dashLength: { value: 0.55 },
                dashAnimate: { value: false },
                squeeze: { value: false },
                squeezeMin: { value: 0.1 },
                squeezeMax: { value: 1.0 }
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
        });

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

        var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

        unindexBufferGeometry(bufferGeometry);
        addBarycentricCoordinates(bufferGeometry, false);

        var cube = new THREE.Mesh(bufferGeometry, material);

        this.el.setObject3D('invader', cube);
        cube.lookAt(new THREE.Vector3(0, 0, 0));
        let pos = this.el.getAttribute('position')
        //this.el.setAttribute('rotation', { x: -10, y: 180, z: 0 });
        let dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
        this.startDist = dist;
        this.dir = { x: pos.x / dist, y: pos.y / dist, z: pos.z / dist };
        this.deltaFreq = (this.data.frequency * Math.PI * 2) / dist;
        this.orgX = pos.x;
        this.el.getObject3D('invader').lookAt(new THREE.Vector3(0, 0, 0));
    },
    tick: function (time, timeDelta) {
        if (document.querySelector('[game]').components['game'].gameover) return;
        let deltaTime = timeDelta / 1000 * this.data.speed;
        let pos = this.el.getAttribute('position');

        this.orgX -= this.dir.x * deltaTime;
        pos.y -= this.dir.y * deltaTime;
        pos.z -= this.dir.z * deltaTime;
        let currentDist = Math.sqrt(this.orgX * this.orgX + pos.y * pos.y + pos.z * pos.z);
        pos.x =
            (Math.sin((this.startDist * this.deltaFreq) - (this.deltaFreq * currentDist)) * currentDist / 10) +
            this.orgX;

        if (currentDist < 10) {
            //this.el.parentEl.removeChild(this.el);
            this.gameover = true;
            document.querySelector('[game]').emit('game-over');
        }
    }
});

