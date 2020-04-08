import { Element } from "../types"

const LOCAL_STORAGE_KEY = "bricks"

const restore = (
    elements: Element[],
) => {
    return elements
}

export const clearStorage = () => {
    return localStorage.removeItem(LOCAL_STORAGE_KEY)
}

export const saveToLocalStorage = (elements: Element[]) => {
    localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(elements)
    )

    // TODO: Also save app state on a different key
}

export const restoreFromLocalStorage = () => {
    const savedElements = localStorage.getItem(LOCAL_STORAGE_KEY)
    let elements = []
    if (savedElements) {
        try {
            elements = JSON.parse(savedElements)
        }
        catch {
            // Do nothing because elements array is already empty 
        }
    }

    return restore(elements)
}