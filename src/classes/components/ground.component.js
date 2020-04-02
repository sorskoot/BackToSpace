import { addBarycentricCoordinates,
    unindexBufferGeometry} from '../utils/geom';

export default AFRAME.registerComponent('ground', {
    schema: {},
    init: function () { 
        const canvas = { width: 500, height: 500 }
        this.geometry = new THREE.Geometry();

        let usedVerts = [];
        this.vertices = [];
        let faces = [];
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let i = (y * canvas.width + x) * 4;
                this.geometry.vertices.push(
                    new THREE.Vector3((x - canvas.width / 2),
                        0,
                        (y - canvas.height / 2))
                );

            }
        }

        for (let x = 0; x < canvas.width - 1; x++) {
            for (let y = 0; y < canvas.height - 1; y++) {
                let d = x;
                let v1 = (y * canvas.width + d);
                let v2 = (y * canvas.width + d + 1);
                let v3 = ((y + 1) * canvas.width + d);
                let v4 = ((y + 1) * canvas.width + d + 1);
                if (this.geometry.vertices[v1] &&
                    this.geometry.vertices[v2] &&
                    this.geometry.vertices[v3] &&
                    this.geometry.vertices[v4]) {

                    this.geometry.faces.push(
                        new THREE.Face3(v1, v2, v3)
                    );


                    this.geometry.faces.push(
                        new THREE.Face3(v2, v4, v3)
                    );

                }
            }
        }
        let bufferGeometry = new THREE.BufferGeometry().
            fromGeometry(this.geometry);

        unindexBufferGeometry(bufferGeometry);
        addBarycentricCoordinates(bufferGeometry, true);

        var plane = new THREE.Mesh(bufferGeometry);
        
        this.el.setObject3D('mesh', plane);

    }
});