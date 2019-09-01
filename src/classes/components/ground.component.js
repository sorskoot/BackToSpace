import vertShader from '../../shaders/shader.vert';
import fragShader from '../../shaders/shader.frag';
import { addBarycentricCoordinates,
    unindexBufferGeometry} from '../utils/geom';

const colors = ['#00FF00', '#000088', '#FF00FF']


export default AFRAME.registerComponent('ground', {
    schema: {},
    init: function () { 
        var material = new THREE.ShaderMaterial({
            extensions: {
                // needed for anti-alias smoothstep, aastep()
                derivatives: true
              },
//              transparent: false,
            //  side: THREE.DoubleSide,
              uniforms: { // some parameters for the shader
                time: { value: 0 },
                fill: { value: new THREE.Color('#000000') },
                stroke: { value: new THREE.Color(colors[2]) },
                noiseA: { value: false },
                noiseB: { value: false },
                dualStroke: { value: false },
                seeThrough: { value: false },
                insideAltColor: { value: true },
                thickness: { value: 0.005 },
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

        var bufferGeometry = new THREE.PlaneBufferGeometry( 100,100, 100, 100 );

        unindexBufferGeometry(bufferGeometry);
        addBarycentricCoordinates(bufferGeometry, true);

        var plane = new THREE.Mesh(bufferGeometry, material);
        
        this.el.setObject3D('ground', plane);
        this.el.setAttribute('rotation',{x:-90,y:0,z:0});
    },
    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    tock: function (time, timeDelta, camera){ },
    remove: function () { },
    pause: function () { },
    play: function () { },
    updateSchema: function(data) { }
});