import { createMesh } from '../utils/createMesh';

export default AFRAME.registerComponent('bunker', {
    schema:{
        position:{type: 'vec3'}
    },
    init: function () {
        let mesh = createMesh(
            [0.0,1.0,0.0,-0.5,0.0,-0.5,0.5,0.0,-0.5,0.5,0.0,0.5,-0.5,0.0,0.5],
            [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1])
        this.el.setObject3D('mesh', mesh);
        //this.el.setAttribute('position',this.data.position);
    },
});