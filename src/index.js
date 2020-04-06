import * as THREE from 'three'
import React, { useState, useRef, useEffect, createRef } from 'react';
import { Canvas, useThree, extend, useFrame, Dom, stateContext } from 'react-three-fiber';
import ReactDOM from 'react-dom'
import { useMouseDownHandler } from './events/mouse'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })


const RollOver = (props) => {
    const { position } = props

    return (
        <mesh scale={[5, 5, 5]} position={[position.x, position.y, position.z]}>
            <boxBufferGeometry attach="geometry" />
            <meshBasicMaterial attach="material" color={0xff0000} opacity={0.5} transparent />
        </mesh>
    )
}

// This must be a class component because we pass refs to it from PlaneEditor
class Cube extends React.Component {
    render() {
        const { position, inputRef } = this.props
        return (
            <mesh ref={inputRef} scale={[5, 5, 5]} position={[position.x, position.y, position.z]}>
                <boxBufferGeometry attach="geometry" />
                <meshBasicMaterial attach="material" color={'orange'} opacity={1} />
            </mesh>
        )
    }
}

// Adds both a visual grid and defines the geometry necessary for
// snapping blocks to.
const PlaneEditor = (props) => {
    // First, extract from expected props.
    const {
        gridSize,
        divisions,
        gridHelper,
        x, y, z } = props;
    const { mouse, raycaster, camera } = useThree()

    const [rolloverPosition, setRollover] = useState({ x: x, y: y, z: z })
    const [blocks, setBlocks] = useState([])

    // TODO: Consider useReducer for this:
    // https://reactjs.org/docs/hooks-reference.html#usereducer
    const [blockRefs, setBlockRefs] = useState([])

    const isMouseDown = useMouseDownHandler()

    const gridRef = useRef();

    if (isMouseDown === true) {
        setTimeout(() => {
            const newBlock = {
                position: rolloverPosition
            }
            setBlocks([...blocks, newBlock])

            // Create a reference for the new block as well
            setBlockRefs([...blockRefs, createRef()])

        }, 50)
    }


    // We want to know all the references to all blocks added, so we can check
    // for intersection there.
    useEffect(() => {
        const setIntersections = () => {

            // Check for intersections against the grid helper
            raycaster.setFromCamera(mouse.clone(), camera)
            let brickObjects = blockRefs.filter(b => b.current).map(b => b.current)
            let intersects = raycaster.intersectObjects([...brickObjects, gridRef.current], true)
            if (intersects.length > 0) {

                // This is the grid intersection
                let intersect = intersects[0]

                // Store the new position in a Vector, so we can do vector math on it!
                // FIXME: There may be better ways, by copying the position of the intersect.point
                // And adding the face, etc. Not sure why yet, so hold off on that for now.
                let newVec = new THREE.Vector3(intersect.point.x, intersect.point.y, intersect.point.z)

                // Each cell is 5 in width (100 size, divisions 20 = 5)
                newVec.x = (Math.round(newVec.x / 5) * 5) + 2.5
                newVec.z = (Math.round(newVec.z / 5) * 5) + 2.5
                newVec.y = (Math.round(newVec.y / 5) * 5) + 2.5
                setRollover(newVec)
            }
        }

        window.addEventListener('mousemove', setIntersections)
        return () => {
            window.removeEventListener('mousemove', setIntersections)
        }
    }, [blockRefs])

    return (
        <group>
            <RollOver position={rolloverPosition} />
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


function Main(props) {
    const scene = useRef()
    const {
        camera,
        gl: { domElement }
    } = useThree()


    useFrame(({ gl }) => void ((gl.autoClear = true), gl.render(scene.current, camera)), 100)

    return <scene ref={scene}>
        <orbitControls args={[camera, domElement]} />
        <ambientLight />
        <pointLight position={[250, 400, 700]} />
        <PlaneEditor {...props} gridSize={100} divisions={20} />
    </scene>
}

const HeadsUpDisplay = () => {
    const scene = useRef()
    const { camera } = useThree()
    useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(scene.current, camera)), 10)
    return <scene ref={scene}>
        <Dom position={[-100, 0, 0]}>
        </Dom>

    </scene>
}

// Within the canvas, so can useThree
function Scene(props) {
    const {
        size,
        setDefaultCamera,
        camera,
        gl: { domElement }
    } = useThree()

    return (
        <>
            <Main {...props} />
            <HeadsUpDisplay />
        </>
    )
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


    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [z, setZ] = useState(0)

    return (
        <div className="app">
            <div className="header">
                <ul>
                    <li>
                        <button
                            onClick={() => setGridHelper(!gridHelper)}>
                            Grid On/Off
                        </button>
                    </li>
                </ul>
            </div>
            <Canvas
                resize={{ scroll: false }}
                pixelRatio={window.devicePixelRatio}
                camera={cameraProps}>
                <Scene
                    gridHelper={gridHelper}
                    {...{ x: x, y: y, z: z }}
                />
            </Canvas>
        </div>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
