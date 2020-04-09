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

// TODO: Needs to consider block currently being used.
export const useRolloverPosition = (references: Object3D[]) => {
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

            // Check for intersections against the grid helper
            raycaster.setFromCamera(mouse.clone(), camera)
            let intersects = raycaster.intersectObjects(references, true)
            if (intersects.length > 0) {

                // The intersect being considered, brick or plane.
                let intersect = intersects[0]
                setIntersect(intersect)

                // Store the new position in a Vector, so we can do vector math on it!
                // FIXME: There may be better ways, by copying the position of the intersect.point
                // And adding the face, etc. Not sure why yet, so hold off on that for now.
                let newVec = new THREE.Vector3(intersect.point.x, intersect.point.y, intersect.point.z)

                // Each cell is 5 in width (100 size, divisions 20 = 5)
                newVec.x = (Math.round(newVec.x / 2.5) * 2.5) + 2.5
                newVec.z = (Math.round(newVec.z / 2.5) * 2.5) + 2.5
                newVec.y = (Math.round(newVec.y / 2.5) * 2.5) + 2.5
                setRollover(newVec)
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