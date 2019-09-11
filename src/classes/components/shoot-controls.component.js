/* global AFRAME */
export default AFRAME.registerComponent('shoot-controls', {
    // dependencies: ['tracked-controls'],
    schema: {
        hand: { default: 'left' }
    },

    init: function () {
        var self = this;
        this.onButtonChanged = this.onButtonChanged.bind(this);
        this.onButtonDown = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
        this.onButtonUp = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };
    },

    play: function () {
        var el = this.el;
        el.addEventListener('buttonchanged', this.onButtonChanged);
        el.addEventListener('buttondown', this.onButtonDown);
        el.addEventListener('buttonup', this.onButtonUp);
    },

    pause: function () {
        var el = this.el;
        el.removeEventListener('buttonchanged', this.onButtonChanged);
        el.removeEventListener('buttondown', this.onButtonDown);
        el.removeEventListener('buttonup', this.onButtonUp);
    },

    // buttonId
    // 0 - trackpad
    // 1 - trigger ( intensity value from 0.5 to 1 )
    // 2 - grip
    // 3 - menu ( dispatch but better for menu options )
    // 4 - system ( never dispatched on this layer )
    mapping: {
        axis0: 'trackpad',
        axis1: 'trackpad',
        button0: 'trackpad',
        button1: 'trigger',
        button2: 'grip',
        button3: 'menu',
        button4: 'system'
    },

    onButtonChanged: function (evt) {
        var buttonName = this.mapping['button' + evt.detail.id];
        if (buttonName !== 'trigger') { return; }
        
        
    },

    onButtonEvent: function (id, evtName) {
        var buttonName = this.mapping['button' + id];
        //this.el.emit(buttonName + evtName);

        if (evtName === 'down') {
            let camrot = new THREE.Euler(
                this.el.object3D.rotation.x,
                this.el.object3D.rotation.y,
                this.el.object3D.rotation.z, 'XYZ');
            let v = new THREE.Vector3(0, 0, 1);
            v.applyEuler(camrot);

            document.querySelector('[game]').emit('fire', {
                direction: {
                    x: v.x,
                    y: v.y,
                    z: v.z
                }, position: {
                    x: this.el.object3D.position.x,
                    y: this.el.object3D.position.y,
                    z: this.el.object3D.position.z
                }
            });
        }
    },

    update: function () {
        var data = this.data;
        var el = this.el;
        el.setAttribute('keyboardcontrols', {});
        el.setAttribute('touchcontrols', {});
        el.setAttribute('vive-controls', { hand: data.hand, model: false });
        el.setAttribute('oculus-touch-controls', { hand: data.hand, model: false });
        el.setAttribute('windows-motion-controls', { hand: data.hand, model: false });
        if (data.hand === 'right') {
            el.setAttribute('daydream-controls', { hand: data.hand, model: false });
            el.setAttribute('gearvr-controls', { hand: data.hand, model: false });
        }
    }
});