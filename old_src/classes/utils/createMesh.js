import {
    addBarycentricCoordinates,
    unindexBufferGeometry
} from './geom';

export function createMesh(verts, faces, removeEdge = false){
    var geometry = new THREE.Geometry();
        
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

    let bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

    unindexBufferGeometry(bufferGeometry);
    addBarycentricCoordinates(bufferGeometry, removeEdge);

    return new THREE.Mesh(bufferGeometry);
}