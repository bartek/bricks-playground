import { Object3D } from 'three'

export type Element = {
    position: {
        x: number;
        y: number;
        z: number
    },
    brickIndex: number
}


export type RolloverPosition = {
    x: number,
    y: number,
    z: number
}

export type Plane = Object3D