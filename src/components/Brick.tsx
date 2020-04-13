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
    transparent?: boolean;
}

export class Brick extends Component<Props> {
    render() {
        const {
            dimensions,
            rotation,
            position,
            inputRef,
            opacity,
            transparent
        } = this.props

        return (
            <mesh ref={inputRef}
                position={[position.x, position.y, position.z]}
                rotation={rotation}>
                <boxBufferGeometry args={dimensions} attach="geometry" />
                <meshNormalMaterial attach="material" opacity={opacity} transparent={transparent ? transparent : false} />
            </mesh>
        )
    }
}