import React from 'react'
import * as THREE from 'three'
import { useLoader } from 'react-three-fiber'
import { RolloverPosition } from '../types'
import plasticImg from './images/plastic.jpg'

// FIXME: Type this out proper.
type Props = {
    key?: number;
    dimensions?: any
    position: RolloverPosition;
    inputRef?: any;
    rotation?: number[];
    opacity?: number;
    color?: string;
}

export const Brick = (props: Props) => {
    const {
        dimensions,
        rotation,
        position,
        inputRef,
        color,
        opacity,
    } = props

    const texture = useLoader(THREE.TextureLoader, plasticImg)

    return (
        <mesh ref={inputRef}
            position={[position.x, position.y, position.z]}
            rotation={rotation}
            castShadow>
            <boxBufferGeometry args={dimensions} attach="geometry" />
            <meshStandardMaterial
                attach="material"
                opacity={opacity}
                color={color ? color : 0x2194ce}
                map={texture}
            />
        </mesh>

    )
}