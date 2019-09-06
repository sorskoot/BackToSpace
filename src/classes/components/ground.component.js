import { addBarycentricCoordinates,
    unindexBufferGeometry} from '../utils/geom';

export default AFRAME.registerComponent('ground', {
    schema: {},
    init: function () { 
       

        var bufferGeometry = new THREE.PlaneBufferGeometry( 500,500, 500, 500 );

        unindexBufferGeometry(bufferGeometry);
        addBarycentricCoordinates(bufferGeometry, true);

        var plane = new THREE.Mesh(bufferGeometry);
        
        this.el.setObject3D('mesh', plane);
        this.el.setAttribute('rotation',{x:-90,y:0,z:0});
    }
});