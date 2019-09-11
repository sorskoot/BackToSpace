export default AFRAME.registerComponent('explosion', {
    schema: {},
    init: function () {
        let sphere = document.createElement('a-sphere');
        sphere.setAttribute('selfdestruct', { timer: 500 });
        sphere.setAttribute('color','yellow');
        sphere.setAttribute('scale', { x: 2, y: 2, z: 2 });
        this.el.appendChild(sphere);
    }
});