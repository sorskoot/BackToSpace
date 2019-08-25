export default AFRAME.registerComponent('keyboardcontrols', {
    init: function () {

        document.body.addEventListener('keydown', e =>{
            if(e.keyCode === 32){
                this.el.emit('fire');
            }
        });

     }
});