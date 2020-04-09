export default AFRAME.registerElement('a-asset-song', {
    prototype: Object.create(AFRAME.ANode.prototype, {
        createdCallback: {
            value: function () {
                this.isAssetItem = true;
            }
        },

        attachedCallback: {
            value: function () {
  
                        var audio = document.createElement("audio");
                        audio.volume = 0.2;
                        audio.addEventListener('ended', function() {
                            this.currentTime = 0;
                            this.play();
                        }, false);

                        audio.src = 'BackToSpaceMusic192.mp3';
                        document.querySelector('a-scene').setAttribute('visible','true');
                        audio.play();

            }
        }
    })
});
