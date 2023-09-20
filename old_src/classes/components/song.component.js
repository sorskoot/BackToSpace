export default AFRAME.registerComponent('song', {
    schema: {
        playing: { default: false }
    },
    init: function () {
        var audio = document.createElement("audio");
        audio.volume = 0.2;
        audio.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);

        audio.src = 'BackToSpaceMusic192.mp3';
        document.querySelector('a-scene').setAttribute('visible', 'true');
        this.audioEl = audio;        
    },
    update: function (old) {
        if (old && old.playing === false) {
            try {
                this.audioEl.play().error(e=>{
                    console.log(e);
                    this.data.playing = false;
                });
            } catch (e) {
                this.data.playing = false;
            }
        }
    },
});
