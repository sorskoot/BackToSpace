import { jsfxr } from './jsfxr';

export const sound = {
    play: function (params) {
        try {
            var soundURL = jsfxr(params);
            var player = new Audio();
            player.src = soundURL;
            player.play();
        } catch { }
    },
    fire: [0, , 0.33, 0.0853, 0.1802, 0.5299, 0.2, -0.2399, -0.0599, , , -1, , 0.8922, -0.5931, , 0.0246, -0.0455, 1, , , 0.0036, , 0.28],
    explosion: [3, , 0.58, 0.35, 0.0547, 0.16, , -0.18, , , , -0.3774, 0.6619, , , , 0.598, -0.1327, 1, , , , , 0.28],
    gameover: [3, 0.09, 0.67, 0.35, 0.93, 0.2, , -0.12, , , , -0.3774, 0.62, , , , 0.1399, -0.3, 1, , , , , 0.28]
}