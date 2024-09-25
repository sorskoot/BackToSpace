import {RNG} from './utils/rng.js';

export enum Sounds {
    shoot = 'shoot',
    explosion = 'explosion',
    gameOVer = 'gameOver',

    musGamePlay = 'musGamePlay',
}

type SoundPreset = {
    [value in Sounds]: string[];
};

const soundsPresets: SoundPreset = {
    explosion: ['explosion.wav', 'explosion2.wav', 'explosion3.wav'],
    gameOver: ['bigExplosion.wav'],
    musGamePlay: ['BackToSpaceMusic192.mp3'],
    shoot: ['laserShoot.wav'],
};

// /**
//  * General manager for playing sound effects.
//  */
// class SoundManager {
//     private sounds: Record<Sounds, Howl[]>;

//     constructor() {
        
//         this.sounds = {} as Record<Sounds, Howl[]>;
//         for (const key in soundsPresets) {
//             const soundsKey = key as Sounds;
//             this.addSound(soundsKey, soundsPresets[soundsKey]);
//         }
//     }

//     private addSound(name: Sounds, paths: string[]) {
//         this.sounds[name] = [];
//         for (const path of paths) {
//             this.sounds[name].push(new Howl({src: path}));
//         }
//     }

//     /**
//      * Plays a sound from the sound manager.
//      * @param name Name of the sound to play.
//      * @param loop loop the sound; default false.
//      * @param volume volume of the sound; default 1.0.
//      * @returns the id of the sound played.
//      */
//     public playSound(name: Sounds, loop = false, volume = 1.0): number | null {
//         let id: number | null = null;

//         if (this.sounds[name]) {
//             const audio: Howl | null = RNG.getItem(this.sounds[name]);
//             if (audio) {
//                 audio.loop(loop);
//                 audio.volume(volume);
//                 id = audio.play();
//             }
//         }
//         return id;
//     }

//     /**
//      * Stops a sound that is playing
//      * @param name Name of the sound to stop.
//      */
//     public stopSound(name: Sounds) {
//         this.sounds[name].forEach((sound) => {
//             sound.stop();
//         });
//     }
// }

// export const SoundManagerInstance = new SoundManager();
