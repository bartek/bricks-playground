import { Brick } from './components/Brick'

export const pixel = 1

export const availableBricks = [
    {
        description: '2x2',
        dimensions: [pixel * 2, pixel * 2, pixel * 2],
        component: Brick
    },
    {
        description: '2x4',
        dimensions: [pixel * 2, pixel * 2, pixel * 4],
        component: Brick
    }
]

export function getBrickComponent(brick: number) {
    return availableBricks[brick].component
}

export function getBrickSettings(brick: number) {
    return availableBricks[brick]
}