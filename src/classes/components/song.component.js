import { CPlayer } from '../utils/player';
import { song } from '../utils/song';

export default AFRAME.registerElement('a-asset-song', {
    prototype: Object.create(AFRAME.ANode.prototype, {
        createdCallback: {
            value: function () {
                this.isAssetItem = true;
            }
        },

        attachedCallback: {
            value: function () {
                var t0 = new Date();
                var player = new CPlayer();
                player.init(song);

                // Generate music...
                var done = false;
                setInterval(function () {
                    if (done) {
                        return;
                    }
                    done = player.generate() >= 1;
                    if (done) {
                        var wave = player.createWave();
                        var audio = document.createElement("audio");
                        audio.volume = 0.2;
                        audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
                        audio.play();
                    }
                }, 0);
            }
        }
    })
});

// var t0 = new Date();
// var player = new CPlayer();
// player.init(song);

// // Generate music...
// var done = false;
// setInterval(function () {
//     if (done) {
//         return;
//     }
//     done = player.generate() >= 1;
//     if (done) {
//         var wave = player.createWave();
//         var audio = document.createElement("audio");
//         audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
//         //   audio.play();
//     }
// }, 0);