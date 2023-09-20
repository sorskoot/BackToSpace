import {Material} from '@wonderlandengine/api';

export interface FlatMaterial extends Material {
    color: number[];
}

export interface FlatRepeatMaterial extends FlatMaterial {
    fillColor: number[];
    strokeColor: number[];
}
