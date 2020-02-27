import * as THREE from 'three';
import { useEffect, useState } from 'react';

export const useMousePosition = (props) => {
    const { scene, camera, raycaster, mouse } = props;
    const [position, setPosition] = useState({ x: 0, y: 0, intersect: [] });
    useEffect(() => {
        const setFromEvent = e => {
            let x = (e.clientX / window.innerWidth) * 2 - 1;
            let y = (e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse.clone(), camera);

            let intersect = raycaster.intersectObjects(scene.children);

            setPosition({
                x: x,
                y: y,
                intersect: intersect,
            });
        }
        window.addEventListener('mousemove', setFromEvent);

        return () => {
            window.removeEventListener('mousemove', setFromEvent);
        };
    }, []);

    return position;
};