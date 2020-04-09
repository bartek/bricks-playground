import React, { Component } from 'react'
import { RolloverPosition } from '../types'

type Props = {
    key?: number;
    position: RolloverPosition;
    inputRef?: any;
    opacity?: number;
    transparent?: boolean;
}

// The absolute, minimal size of a lego brick that we'll
// handle in this application is at 2.5. Only the single
// pixel is defined as the variations between x, y, z
// will be per-block, but this will be consistent throughout
const ONE_PIXEL = 2.5

export class Brick2x2 extends Component<Props> {
    render() {
        const { position, inputRef, opacity, transparent } = this.props
        let scale = [
            ONE_PIXEL * 2,
            ONE_PIXEL * 2,
            ONE_PIXEL * 2,
        ]
        return (
            <mesh ref={inputRef}
                scale={scale}
                position={[position.x, position.y, position.z]}>
                <boxBufferGeometry attach="geometry" />
                <meshNormalMaterial attach="material" opacity={opacity} transparent={transparent ? transparent : false} />
            </mesh>
        )
    }
}

export class Brick1x1 extends Component<Props> {
    render() {
        const { position, inputRef, opacity } = this.props

        let scale = [
            ONE_PIXEL,
            ONE_PIXEL,
            ONE_PIXEL,
        ]

        return (
            <mesh ref={inputRef} scale={scale} position={[position.x, position.y, position.z]}>
                <boxBufferGeometry attach="geometry" />
                <meshNormalMaterial attach="material" opacity={opacity} />
            </mesh>
        )
    }
}

export class Brick2x4 extends Component<Props> {
    render() {
        const { position, inputRef, opacity, transparent } = this.props

        let scale = [
            ONE_PIXEL * 4,
            ONE_PIXEL * 2,
            ONE_PIXEL * 2,
        ]
        return (
            <mesh
                ref={inputRef}
                scale={scale}
                position={[position.x, position.y, position.z]}
            >
                <boxBufferGeometry attach="geometry" />
                <meshNormalMaterial attach="material" opacity={opacity} transparent={transparent ? transparent : false} />
            </mesh>
        )
    }
}