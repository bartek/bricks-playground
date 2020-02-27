import React, { useState, useEffect } from 'react'
import * as THREE from 'three';
import ReactDOM from 'react-dom'
import { Canvas, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'
import { useMousePosition } from './events/mouse'

extend({ OrbitControls })

// Useful:
// https://videlais.com/2017/01/15/learning-three-js-part-5-controls/

const blockMesh = null
const greenMesh = null;

const steps = [
  // Declarative, in that each step is an addition and not representative of state
  // This would be a DSL, where-in we should define steps based on a grid
  // For example, x,y = (1,1) and x,y = (1,2) would be a block on top of x
  // 0,0 should be the centre, so normalize for that

  // Program a bunch of functions that'll declaratively add blocks, starting at one point
  // and then taking the next step to add that block.
  // The functions should identify the position based on some value, and the functions
  // can handle the size scaling stuff.
  //
  // z = 0, always?
  {
    "additions": [
      { x: 0, y: 0 }
    ],
    x: 0,
    y: 0,
    size: 25,
    mesh: blockMesh
  },
  {
    x: 1,
    y: 1,
    size: 25,
    mesh: greenMesh
  },
  {
    x: 1,
    y: 2,
    size: 25,
    mesh: blockMesh
  },
  {
    x: 2,
    y: 2,
    size: 25,
    mesh: blockMesh
  },
  {
    x: 0,
    y: 50,
    size: 25,
    mesh: blockMesh
  },
  {
    x: 0,
    y: 75,
    size: 25,
    mesh: greenMesh
  },
  {
    x: 22,
    y: 0,
    size: 25,
    mesh: greenMesh
  }
];

function MiniMap(props) {
  const { x, y, size } = props;
  let scaledX = 10 + x / 8;
  let scaledY = 10 + y / 8;
  return <rect x={scaledX} y={scaledY} width={4} height={4} fill="yellow" />;
}


const Cube = (props) => {
  const { position, color, key } = props;
  return (
    <mesh position={position} key={key}>
      <boxBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" color={color} opacity={0.5} transparent />
    </mesh>
  )
}

const Scene = (props) => {
  const {
    scene,
    mouse,
    camera,
    gl: { domElement },
    raycaster,
  } = useThree()

  const { page } = props;
  let mouseEvents = useMousePosition({ raycaster, camera, scene, mouse });


  // Given the step, iterate over each one from the beginning and accumulate the cube positions to add
  let build = [];
  for (var i = 0; i <= page; i++) {
    let step = steps[i];

    var intersect = mouseEvents.intersect[0];
    var colour = 'hotpink';
    if (intersect) {
      if (intersect.object.position.x == step.x && intersect.object.position.y == step.y) {
        colour = 'red';
      }
    }
    build.push({
      key: i,
      x: step.x,
      y: step.y,
      colour: colour
    }
    )
  }

  // Iterate over intersections and see if they map to the rendered Cubes
  // position=vector<x, y, z>
  return (
    <>
      {build.map(b => {
        return <Cube key={b.key} position={[b.x, b.y, 0]} color={b.colour} />
      }
      )}
      <orbitControls args={[camera, domElement]} minDistance={4} maxDistance={15} />
    </>
  )
}

const App = () => {
  const [page, setPage] = useState(0);

  let step = steps[page];

  return (
    <>
      <p>On page {page}</p>
      <ul>
        <li><button onClick={() => setPage(page + 1)}>Next</button></li>
        <li><button onClick={() => setPage(page - 1)}>Prev</button></li>
      </ul>
      <Canvas orthographic={false}>
        <Scene page={page} step={step} />
      </Canvas>
    </>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
