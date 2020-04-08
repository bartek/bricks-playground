import React, { createRef, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, extend, useThree, ReactThreeFiber } from 'react-three-fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useMouseDown } from './events/mouse'
import { useRolloverPosition } from './events/rollover'
import {
    saveToLocalStorage,
    restoreFromLocalStorage
} from './data/localStorage'
import { Element } from './types'

extend({ OrbitControls })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
        }
    }
}

// Globals are OK, sometimes, right?
// localStorage stuff

type RolloverPosition = {
    x: number,
    y: number,
    z: number
}

function RollOver(props: {
    position: RolloverPosition
}) {
    const { position } = props

    return (
        <mesh scale={[5, 5, 5]} position={[position.x, position.y, position.z]}>
            <boxBufferGeometry attach="geometry" />
            <meshBasicMaterial attach="material" color={0xff0000} opacity={0.5} transparent />
        </mesh>
    )
}


// This must be a class component because we pass refs to it from PlaneEditor

type CubeProps = {
    key: number;
    position: RolloverPosition;
    inputRef: any;
}
class Cube extends React.Component<CubeProps> {
    render() {
        const { position, inputRef } = this.props
        return (
            <mesh ref={inputRef} scale={[5, 5, 5]} position={[position.x, position.y, position.z]}>
                <boxBufferGeometry attach="geometry" />
                <meshNormalMaterial attach="material" />
            </mesh>
        )
    }
}

// Adds both a visual grid and defines the geometry necessary for
// snapping blocks to.

type EditorType = {
    elements: Element[];
    gridSize: number;
    divisions: number;
    gridHelper: boolean;
}

const PlaneEditor = (props: EditorType) => {
    const {
        elements, // Initial elements (blocks) to render
        gridSize,
        divisions,
        gridHelper,
    } = props;

    const [blocks, setBlocks] = useState(elements)

    // TODO: Consider useReducer for this:
    // https://reactjs.org/docs/hooks-reference.html#usereducer
    const [blockRefs, setBlockRefs] = useState<React.RefObject<HTMLDivElement>[]>([])

    const gridRef = useRef();
    const planeRef = useRef();

    const isMouseDown = useMouseDown()

    // Placing a block
    if (isMouseDown === true) {
        setTimeout(() => {
            const newBlock = {
                position: rolloverPosition
            }
            setBlocks([...blocks, newBlock])

            // Create a reference for the new block as well
            setBlockRefs([...blockRefs, createRef()])

            // Nudge the rollover position to update.
            window.dispatchEvent(new Event('mousemove'))

        }, 50)
    }

    // Capture the rollover position, in consideration of the
    // existing blocks and base plane.
    const rolloverPosition = useRolloverPosition([
        ...blockRefs.filter((b: React.RefObject<any>) => b.current).map((b: React.RefObject<any>) => b.current),
        planeRef.current
    ])

    // Update localStorage on each change in blocks
    useEffect(() => {
        saveToLocalStorage(blocks)
    }, [blocks])


    return (
        <group>
            <ambientLight />
            <RollOver position={rolloverPosition} />
            <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeBufferGeometry
                    attach="geometry"
                    args={[100, 100]} />
                <meshBasicMaterial
                    attach="material"
                    flatShading
                />
            </mesh>
            {blocks.map((block, idx) => {
                return <Cube key={idx} inputRef={blockRefs[idx]} position={block.position} />
            })}
            {gridHelper &&
                <gridHelper ref={gridRef}
                    args={[gridSize, divisions, 0x880000]}
                />
            }
        </group>
    )
}


type MainProps = {
    elements: Element[];
    gridHelper: boolean;
}
function Main(props: MainProps) {
    const scene = useRef()
    const {
        camera,
        gl: { domElement }
    } = useThree()

    //useFrame(({gl}) => void ((gl.autoClear = true), gl.render(scene.current, camera)), 100)

    return <scene ref={scene}>
        <orbitControls args={[camera, domElement]} />
        <PlaneEditor {...props} gridSize={100} divisions={20} />
    </scene>
}




// Application scaffolding
function App() {
    const cameraProps = {
        position: [250, 400, 700],
        fov: 3,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 10000
    }

    const [gridHelper, setGridHelper] = useState(true)


    // Load elements from localStorage
    const elements = restoreFromLocalStorage()

    return (
        <div className="app">
            <div className="header">
                <ul>
                    <li><button>Brick</button></li>
                    <li>
                        <button
                            onClick={() => setGridHelper(!gridHelper)}>
                            Grid On/Off
                        </button>
                    </li>
                    <li>
                        <button>Save</button>
                    </li>
                </ul>
            </div>
            <Canvas
                resize={{ scroll: false }}
                pixelRatio={window.devicePixelRatio}
                camera={cameraProps}>
                <Main
                    elements={elements}
                    gridHelper={gridHelper}
                />
            </Canvas>
        </div >
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
