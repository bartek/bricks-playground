import React, { createRef, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, extend, useThree, ReactThreeFiber } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useMouseDown } from './events/mouse'
import {
    useMouseRotation,
    useRolloverPosition,
    useMouseOnCanvas
} from './events/rollover'
import {
    clearStorage,
    saveToLocalStorage,
    restoreFromLocalStorage
} from './data/localStorage'
import { Element, RolloverPosition } from './types'
import {
    availableBricks,
    getBrickSettings,
    getBrickComponent
} from './bricks'
import { GithubPicker } from 'react-color'

extend({ OrbitControls })

// This is necessary for TypeScript to compile because OrbitControls
//  complains about the lack of this interface otherwise
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'orbitControls': ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
        }
    }
}

type EditorType = {
    elements: Element[];
    gridSize: number;
    divisions: number;
    gridHelper: boolean;
    activeBrick: number;
    activeColor: string;
}

const PlaneEditor = (props: EditorType) => {
    const {
        elements, // Initial elements (blocks) to render
        gridSize,
        divisions,
        activeBrick,
        activeColor,
        gridHelper,
    } = props;

    const [blocks, setBlocks] = useState(elements)
    const [blockRefs, setBlockRefs] = useState<React.RefObject<HTMLDivElement>[]>(
        Array.from({ length: elements.length }, a => createRef())
    )

    const gridRef = useRef();
    const planeRef = useRef();

    const isMouseDown = useMouseDown()
    const isMouseOnCanvas = useMouseOnCanvas()
    const rotation = useMouseRotation()

    let activeBrickSettings = getBrickSettings(activeBrick)
    let RolloverComponent = getBrickComponent(activeBrick)
    let RolloverComponentRef = useRef<HTMLDivElement>(null)

    // Provide the expected brick to lay down, and then identify
    // its position based on the collection of existing blocks
    // and the plane itself.
    const references = [
        ...blockRefs.filter(
            (b: React.RefObject<any>) => b.current
        ).map((b: React.RefObject<any>) => b.current),
        planeRef.current
    ]

    // Capture the rollover position, in consideration of the
    // existing blocks and base plane.
    // The rollover position and intersect are then used when checking
    // for collision and eventually placing a new brick.
    const { rolloverPosition, intersect } = useRolloverPosition(
        RolloverComponentRef,
        references
    )

    if (isMouseOnCanvas && isMouseDown) {
        setTimeout(() => {

            // Ensure we copy the rollover position, given all objects
            // in JS are by reference.
            const newBlock = {
                position: { ...rolloverPosition },
                color: activeColor,
                brickIndex: activeBrick
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
            <RolloverComponent
                dimensions={activeBrickSettings.dimensions!}
                inputRef={RolloverComponentRef}
                opacity={0.5}
                position={rolloverPosition}
                color={activeColor}
                rotation={[0, rotation, 0]} />

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
                let settings = getBrickSettings(block.brickIndex)
                let Component = getBrickComponent(block.brickIndex)
                return <Component
                    key={idx}
                    dimensions={settings.dimensions}
                    inputRef={blockRefs[idx]}
                    color={block.color}
                    position={block.position} />
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
    activeBrick: number;
    activeColor: string;
}
function Main(props: MainProps) {
    const scene = useRef()
    const {
        camera,
        gl: { domElement }
    } = useThree()

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

    const [activeBrick, setActiveBrick] = useState(0)

    // Colour pickin'
    const [colorPicker, setColorPicker] = useState(false)
    const [activeColor, setActiveColor] = useState("")

    // Load elements from localStorage
    const elements = restoreFromLocalStorage()

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
                    <li>
                        <button onClick={() => setColorPicker(!colorPicker)}>
                            Color
                        </button>
                        {colorPicker && (
                            <GithubPicker
                                onChangeComplete={(color) => {
                                    setActiveColor(color.hex)
                                    setColorPicker(!colorPicker)
                                }}
                            />
                        )}
                    </li>
                </ul>
            </div>
            {brickPicker && (
                <div className="picker">
                    <ul>
                        {availableBricks.map((brick, index) => {
                            let { description } = brick
                            return (
                                <li
                                    key={index}
                                    className={activeBrick === index ? 'active' : 'item'}>
                                    <button onClick={() => setActiveBrick(index)}>
                                        {description}
                                    </button>
                                </li>
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
                    activeBrick={activeBrick}
                    activeColor={activeColor}
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
