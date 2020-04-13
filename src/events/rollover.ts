import React, { useState, useEffect } from 'react'
import { useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { Object3D, Intersection } from 'three'
import { RolloverPosition } from '../types'

// Capture if the mouse is on canvas, to prevent misplacement
// of blocks
export const useMouseOnCanvas = () => {
    const [mouseOnCanvas, setMouseOnCanvas] = useState(false)

    useEffect(() => {
        const onMouseMove = () => {
            // If we are not hovering over canvas, exit early
            let mouseOnCanvas = [...document.querySelectorAll(":hover")].filter(
                node => node.tagName === "CANVAS"
            )

            if (mouseOnCanvas.length > 0) {
                setMouseOnCanvas(true)
            } else {
                setMouseOnCanvas(false)
            }
        }
        window.addEventListener('mousemove', onMouseMove)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
        }
    })

    return mouseOnCanvas
}

// Scaffolding for rotation
export const useMouseRotation = () => {
    const [rotation, setRotation] = useState(0)

    useEffect(() => {
        const onMouseUp = (e: MouseEvent) => {
            if (e.button !== 2) {
                // Right button was not clicked, do nothing
                return
            }

            setRotation(0)
        }

        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mouseup', onMouseUp)
        }
    })

    return rotation
}

export const useRolloverPosition = (ref: React.RefObject<any>, references: Object3D[]) => {
    const {
        raycaster,
        mouse,
        camera
    } = useThree()

    const [rolloverPosition, setRollover] = useState<RolloverPosition>({ x: 0, y: 0, z: 0 })
    const [intersect, setIntersect] = useState<Intersection | null>(null)

    useEffect(() => {
        const setIntersections = () => {

            // Exit early if references contain an undefined value
            if (references[0] === undefined) {
                return
            }

            if (ref.current === null) {
                console.warn("No component set for rollover brick")
                return
            }

            // Check for intersections against the grid helper
            raycaster.setFromCamera(mouse.clone(), camera)
            let intersects = raycaster.intersectObjects(references, true)
            if (intersects.length > 0) {

                // The intersect being considered, brick or plane.
                let intersect = intersects[0]
                setIntersect(intersect)

                let rollover = ref.current
                let [width, height, depth] = [2.5, 2.5, 2.5]

                // For whatever reason (I blame the orbital camera), the `y` point
                // jumps between neg/positive. We'll never go below the plane, so
                // adjust to prevent jitter
                intersect.point.y = Math.abs(intersect.point.y)

                // To obtain the new position of the rollover, we do a bunch
                // of math I don't *really* understand, but is common place in
                // snapping things to a grid. The short of the answer is here:
                // https://gamedev.stackexchange.com/questions/33140/how-can-i-snap-a-game-objects-position-to-a-grid=

                // First, we capture the intersect point and make that the brick's position
                rollover.position.copy(intersect.point)

                // Do the math we've been told to do!
                rollover.position.divide(new THREE.Vector3(width, height, depth)).floor()
                    .multiply(new THREE.Vector3(width, height, depth))

                    // This ensures we "climb" up the stack, when relevant
                    .add(new THREE.Vector3(width, height, depth))

                setRollover(rollover.position)
            }
        }
        window.addEventListener('mousemove', setIntersections)
        return () => {
            window.removeEventListener('mousemove', setIntersections)
        }
    })

    return {
        rolloverPosition: rolloverPosition,
        intersect: intersect
    }
}