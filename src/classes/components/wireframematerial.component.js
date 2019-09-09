import vertShader from '../../shaders/shader.vert';
import fragShader from '../../shaders/shader.frag';

export default AFRAME.registerComponent('wireframe-material', {
    schema: {
        color:{
            type:'color',
            default:"white"
        },
        fillcolor:{
            type:'color',
            default:'#000000'
        },
        thickness:{
            type:'number',
            default:0.05
        }
    },
    init: function () { 
        this.update();
    },
    update:function(){
        var material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: true
            },
            uniforms: { // some parameters for the shader
                time: { value: 0 },
                fill: { value: new THREE.Color(this.data.fillcolor) },
                stroke: { value: new THREE.Color(this.data.color) },
                noiseA: { value: false },
                noiseB: { value: false },
                dualStroke: { value: false },
                seeThrough: { value: false },
                insideAltColor: { value: true },
                thickness: { value: this.data.thickness },
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
        material.needsUpdate = true;
        this.el.getObject3D('mesh').material = material;
    },
    
});