import React, { useRef } from 'react';
import { Canvas, useThree, extend, useFrame } from 'react-three-fiber';
import ReactDOM from 'react-dom'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

extend({ OrbitControls })


const RollOver = (props) => {
    return (
        <mesh position={[0, 0, 0]}>
            <boxBufferGeometry attach="geometry" />
            <meshBasicMaterial attach="material" color={0xff0000} opacity={0.5} transparent />
        </mesh>
    )
}

// Adds both a visual grid and defines the geometry necessary for
// snapping blocks to.
const PlaneEditor = (props) => {
    const { gridSize, divisions } = props;
    const { mouse, raycaster, camera, scene } = useThree()

    const rollover = useRef();

    const objects = []

    // TODO: Understand .current in useRef
    const plane = useRef();
    objects.push(plane)

    useFrame(state => {

        raycaster.setFromCamera(mouse.clone(), camera)

        let currentObjects = objects.filter(o => o.current).map(o => o.current)
        let intersects = raycaster.intersectObjects(currentObjects)
        if (intersects.length > 0) {
            let intersect = intersects[0]
            console.log(intersect)

            //rollover.position.copy(intersect.point).add(intersect.face.normal)
        }

    })


    return (
        <group>
            <mesh ref={plane}>
                <planeGeometry attach="geometry" args={[gridSize, divisions]} />
                <meshStandardMaterial attach="material" opacity={0.1} alphaTest={0.5} />
            </mesh>
            <RollOver ref={rollover} />
            <gridHelper
                args={[gridSize, divisions, 0x880000]}
            />
        </group>
    )
}

// Within the canvas, so can useThree
function Main() {
    const {
        camera,
        gl: { domElement }
    } = useThree()

    return (
        <>
            <orbitControls args={[camera, domElement]} />

            <ambientLight />
            <PlaneEditor gridSize={1000} divisions={20} />
        </>
    )


}


// Application scaffolding
function App() {

    const camera = {
        position: [500, 800, 900],
        fov: 45,
        aspect: window.innerWidth / window.innerHeight,
        near: 1,
        far: 10000
    }

    return (
        <>
            <Canvas resize={{ scroll: false }} pixelRatio={window.devicePixelRatio} camera={camera}>
                <Main />
            </Canvas>
        </>
    )
}
ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
