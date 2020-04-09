import React, { createRef, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, extend, useThree, ReactThreeFiber } from 'react-three-fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useMouseDown } from './events/mouse'
import { useRolloverPosition, useMouseOnCanvas } from './events/rollover'
import {
    clearStorage,
    saveToLocalStorage,
    restoreFromLocalStorage
} from './data/localStorage'
import { Brick2x2, Brick2x4 } from './components/Cube'
import { Element, RolloverPosition } from './types'

extend({ OrbitControls })

// This is necessary because OrbitControls complains about the lack
// of this interface otherwise
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
        }
    }
}

function getBrickComponent(brick: string) {
    // Set the active brick in a un-fancy switch statement, for now
    // Work it like this: https://dev.to/arpit016/dynamic-components-in-react-4iic
    switch (brick) {
        case '2x2':
            var BrickComponent = Brick2x2
            break
        case '2x4':
            var BrickComponent = Brick2x4
            break
        default:
            var BrickComponent = Brick2x2
    }

    return BrickComponent
}

function RollOver(props: {
    position: RolloverPosition,
    brickType: string
}) {
    const { position, brickType } = props

    let Component = getBrickComponent(brickType)

    return (
        <Component position={position} opacity={0.5} transparent={true} />
    )
}

// Adds both a visual grid and defines the geometry necessary for
// snapping blocks to.

type EditorType = {
    elements: Element[];
    gridSize: number;
    divisions: number;
    gridHelper: boolean;
    currentBrick: string;
}

const PlaneEditor = (props: EditorType) => {
    const {
        elements, // Initial elements (blocks) to render
        gridSize,
        divisions,
        currentBrick,
        gridHelper,
    } = props;


    const [blocks, setBlocks] = useState(elements)

    // TODO: Consider useReducer for this:
    // https://reactjs.org/docs/hooks-reference.html#usereducer
    const [blockRefs, setBlockRefs] = useState<React.RefObject<HTMLDivElement>[]>(
        Array.from({ length: elements.length }, a => createRef())
    )

    const gridRef = useRef();
    const planeRef = useRef();

    const isMouseDown = useMouseDown()
    const isMouseOnCanvas = useMouseOnCanvas()

    // Capture the rollover position, in consideration of the
    // existing blocks and base plane.
    const { rolloverPosition, intersect } = useRolloverPosition([
        ...blockRefs.filter(
            (b: React.RefObject<any>) => b.current
        ).map((b: React.RefObject<any>) => b.current),
        planeRef.current
    ])

    if (isMouseOnCanvas && isMouseDown) {
        setTimeout(() => {

            const newBlock = {
                position: rolloverPosition,
                componentType: currentBrick
            }
            setBlocks([...blocks, newBlock])

            // Create a reference for the new block as well
            setBlockRefs([...blockRefs, createRef()])

            // Nudge the rollover position to update.
            window.dispatchEvent(new Event('mousemove'))

        }, 50)
    }


    // Update localStorage on each change in blocks
    useEffect(() => {
        saveToLocalStorage(blocks)
    }, [blocks])

    return (
        <group>
            <ambientLight />
            <RollOver brickType={currentBrick} position={rolloverPosition} />
            <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeBufferGeometry
                    attach="geometry"
                    args={[100, 100]} />
                <meshBasicMaterial
                    attach="material"
                    flatShading
                />
            </mesh>
            r
            {blocks.map((block, idx) => {
                let Component = getBrickComponent(block.componentType)
                return <Component key={idx} inputRef={blockRefs[idx]} position={block.position} />
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
    currentBrick: string;
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
    const [brickPicker, setBrickPicker] = useState(false)
    const [brickComponent, setBrickComponent] = useState("")

    // Load elements from localStorage
    const elements = restoreFromLocalStorage()

    // Setup brick picker
    const bricks = [
        {
            description: "2x2",
            component: Brick2x2
        },
        {
            description: "2x4",
            component: Brick2x4
        }
    ]

    return (
        <div className="app">
            <div className="toolbar">
                <ul>
                    <li><button onClick={() => setBrickPicker(!brickPicker)}>Edit</button></li>
                    <li>
                        <button
                            onClick={() => setGridHelper(!gridHelper)}>
                            Grid On/Off
                        </button>
                    </li>
                    <li>
                        <button onClick={() => clearStorage()}>Erase</button>
                    </li>
                </ul>
            </div>
            {brickPicker && (
                <div className="picker">
                    <ul>
                        {bricks.map((brick, idx) => {
                            let { description, component } = brick
                            return (
                                <li key={idx} className={brickComponent === description ? 'active' : 'item'}><button onClick={() => setBrickComponent(description)}>{description}</button></li>
                            )
                        })}
                    </ul>
                </div>
            )}
            <Canvas
                resize={{ scroll: false }}
                pixelRatio={window.devicePixelRatio}
                camera={cameraProps}>
                <Main
                    elements={elements}
                    currentBrick={brickComponent}
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
