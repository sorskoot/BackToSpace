import { noise2d } from '../utils/perlin';
import {
    addBarycentricCoordinates,
    unindexBufferGeometry
} from '../utils/geom';

export default AFRAME.registerComponent('mountains', {
    init: function () {
        //let geometry = new THREE.Geometry();

        let canvas = document.createElement("canvas");
        canvas.width = canvas.height = 100;

        let ctx = canvas.getContext("2d");
        let gradient = ctx.createRadialGradient(50, 50, 20, 50, 50, 80);
        gradient.addColorStop(0, '#ffffff00');
        gradient.addColorStop(.2, '#ffffffff');
        gradient.addColorStop(.4, '#ffffff00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.height / 2, canvas.height / 2, 412, 0, 2 * Math.PI);
        ctx.fill();

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let v = noise2d(20 * x / canvas.width, 20 * y / canvas.height);
                let i = (y * canvas.width + x) * 4;
                data[i + 0] = Math.min(v * data[i + 0] + data[i + 0] / 8, 255);
                data[i + 1] = 0;//Math.min(v * data[i + 1]+ data[i + 1]/8,255);
                data[i + 2] = 0;//Math.min(v * data[i + 2]+ data[i + 2]/8,255);
                data[i + 3] = 0xff;
            }
        }
        ctx.putImageData(imageData, 0, 0);

        let heightmap = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let geometry = new THREE.Geometry();

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let i = (y * canvas.width + x) * 4;
                if (heightmap[i] !== undefined) {
                    geometry.vertices.push(
                        new THREE.Vector3((x - canvas.width / 2)*10, heightmap[i]/5,
                            (y - canvas.height / 2)*10)
                    );
                };
            }
        }

        for (let x = 0; x < canvas.width - 1; x++) {
            for (let y = 0; y < canvas.height - 1; y++) {
                let v1 = (y * canvas.width + x);
                let v2 = (y * canvas.width + x + 1);
                let v3 = ((y + 1) * canvas.width + x);
                let v4 = ((y + 1) * canvas.width + x + 1);
                if (geometry.vertices[v1] && geometry.vertices[v2] && geometry.vertices[v3] && geometry.vertices[v4]) {
                    geometry.faces.push(
                        new THREE.Face3(v1, v2, v3)
                    );
                    geometry.faces.push(
                        new THREE.Face3(v2, v4, v3)
                    );
                }
            }
        }


        // let geometry = new THREE.PlaneGeometry(20, 20, 1, 1);

        // let texture = new THREE.CanvasTexture(canvas);

        // let material = new THREE.MeshBasicMaterial( {
        //     map: texture, side: THREE.DoubleSide} );

        let mountainsGeomety = new THREE.BufferGeometry().fromGeometry(geometry);//new THREE.Points(geometry);

        unindexBufferGeometry(mountainsGeomety);
        addBarycentricCoordinates(mountainsGeomety, false);

        let mountains = new THREE.Mesh(mountainsGeomety);
        this.el.setObject3D('mesh', mountains);

        // this.el.setAttribute('material', {
        //     shader: 'flat',
        //     src: canvas,
        // });

    },
});