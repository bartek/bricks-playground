import * as THREE from 'three'
import React, { useState, useRef } from 'react';
import { Canvas, useThree, extend, useFrame, Dom, stateContext } from 'react-three-fiber';
import ReactDOM from 'react-dom'
import { HandleMouseDown } from './events/mouse'
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

const Cube = (props) => {
    const { position } = props

    return (
        <mesh scale={[5, 5, 5]} position={[position.x, position.y, position.z]}>
            <boxBufferGeometry attach="geometry" />
            <meshBasicMaterial attach="material" color={0x274E13} opacity={1} transparent />
        </mesh>
    )
}

// Adds both a visual grid and defines the geometry necessary for
// snapping blocks to.
const PlaneEditor = (props) => {
    const { gridSize, divisions, x, y, z } = props;
    const { mouse, raycaster, camera } = useThree()

    const [rolloverPosition, setRollover] = useState({ x: x, y: y, z: z })
    const [blocks, setBlocks] = useState([])

    const isMouseDown = HandleMouseDown()

    // Store potential intersections
    const objects = []

    const gridRef = useRef();
    objects.push(gridRef)

    if (isMouseDown === true) {
        setTimeout(() => {
            const newBlock = {
                position: rolloverPosition
            }
            setBlocks([...blocks, newBlock])

        }, 50)
    }

    // Called on every frame, set the rollover position
    useFrame(state => {

        raycaster.setFromCamera(mouse.clone(), camera)

        let currentObjects = objects.filter(o => o.current).map(o => o.current)
        let intersects = raycaster.intersectObjects(currentObjects)
        if (intersects.length > 0) {
            let intersect = intersects[0]

            // Store the new position in a Vector, so we can do vector match on it!
            let newVec = new THREE.Vector3(intersect.point.x, intersect.point.y, intersect.point.z)

            // Each cell is 5 in width (100 size, divisions 20 = 5)
            newVec.x = (Math.round(newVec.x / 5) * 5) + 2.5
            newVec.z = (Math.round(newVec.z / 5) * 5) + 2.5
            newVec.y = 2.5 // FIXME.
            setRollover(newVec)

        }
    })

    console.log("??", blocks)

    return (
        <group>
            <RollOver position={rolloverPosition} />
            {blocks.map(block => {
                return <Cube position={block.position} />
            })}
            <gridHelper ref={gridRef}
                args={[gridSize, divisions, 0x880000]}
            />
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

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [z, setZ] = useState(0)

    return (
        <>
            <div>
                <label>x: <input type='text' onChange={e => setX(parseInt(e.target.value))} /></label>
                <label>y: <input type='text' onChange={e => setY(parseInt(e.target.value))} /></label>
                <label>z: <input type='text' onChange={e => setZ(parseInt(e.target.value))} /></label>
            </div>
            <Canvas resize={{ scroll: false }} pixelRatio={window.devicePixelRatio} camera={cameraProps}>
                <Scene {...{ x: x, y: y, z: z }} />
            </Canvas>
        </>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
