import React, { Component } from 'react'
import { RolloverPosition } from '../types'

type Dimensions = {

}

// FIXME: Type this out proper.
type Props = {
    key?: number;
    dimensions?: any
    position: RolloverPosition;
    inputRef?: any;
    rotation?: number[];
    opacity?: number;
    color?: string
}

export class Brick extends Component<Props> {
    render() {
        const {
            dimensions,
            rotation,
            position,
            inputRef,
            color,
            opacity,
        } = this.props

        return (
            <mesh ref={inputRef}
                position={[position.x, position.y, position.z]}
                rotation={rotation}>
                <boxBufferGeometry args={dimensions} attach="geometry" />
                <meshStandardMaterial
                    attach="material"
                    opacity={opacity}
                    color={color ? color : 0x2194ce}
                />
            </mesh>
        )
    }
}