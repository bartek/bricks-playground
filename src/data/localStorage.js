const LOCAL_STORAGE_KEY = "bricks"

const restore = (elements) => {
    return elements
}

export const saveToLocalStorage = (elements) => {
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