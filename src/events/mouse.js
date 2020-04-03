import * as THREE from 'three';
import { useEffect, useState } from 'react';

export const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0, });
    useEffect(() => {
        const setFromEvent = e => {
            let x = (e.clientX / window.innerWidth) * 2 - 1;
            let y = (e.clientY / window.innerHeight) * 2 + 1;

            setPosition({
                x: x,
                y: y,
            });
        }
        window.addEventListener('mousemove', setFromEvent);

        return () => {
            window.removeEventListener('mousemove', setFromEvent);
        };
    }, []);

    return position;
};

export const HandleMouseDown = () => {
    const [mouseDown, setMouseDown] = useState(false)
    useEffect(() => {
        const handleDocumentMouseDown = event => {
            if (event.button !== 2) {
                setMouseDown(true)
                setTimeout(() => setMouseDown(false), 10)
            }
        }

        // On mount
        document.addEventListener('mousedown', handleDocumentMouseDown)

        // When umounted
        return () => {
            document.removeEventListener('mousedown', handleDocumentMouseDown)
        }
    }, [])

    return mouseDown
}