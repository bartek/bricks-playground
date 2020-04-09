# Satuday April 12 2020

[ ] Don't allow a brick to collide with another
[ ] Add one test. Block placement calculation
[ ] Abstract Cube into its own module
[ ] Drop any notion of "default" sizing, size based on cube/block
[ ] Add lego brick material (https://github.com/nicmosc/brick-builder/blob/master/app/components/engine/Brick.js)


This was living in the onMouseDown stuff
            // Before creating the block, ensure it's not colliding
            // with anything else.
            /*
            if (intersect) {
                console.log(intersect)
                const meshBoundingBox = new THREE.Box3().setFromArray(Object.values(rolloverPosition))
                const brickBoundingBox = new THREE.Box3().setFromArray(Object.values(intersect.point))

                console.log(meshBoundingBox, brickBoundingBox)


                const collision = meshBoundingBox.intersectsBox(brickBoundingBox)
                if (collision) {
                    console.log("Collision detected, verifying...")
                    const dx = Math.abs(brickBoundingBox.max.x - meshBoundingBox.max.x);
                    const dz = Math.abs(brickBoundingBox.max.z - meshBoundingBox.max.z);
                    const yIntersect = brickBoundingBox.max.y - 9 > meshBoundingBox.min.y;
                    if (yIntersect && dx !== 1 && dz !== 1) {
                        // Can't create
                        console.log("Not creating, collision!")
                        return
                    }
                }
            }
            */


# Wednesday April 9 2020

[x] Fixed issue in restoring references from localStorage
[x] Added useMouseOnCanvas hook to prevent misplaced bricks


[x] When we add a brick, we need to know its type, and then use that when rendering all the bricks (in blocks.map in PlaneEditor)
[x] Add Rectangle, and ensure Rollover considers current brick
[x] Start using Constants and treat Cube as 2x2 square

# Tuesday April 7 2020

Reading:

https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html

[x] Migrate to TypeScript
[ ] Add Brick selection


# Monday April 6 2020

[x] Look into fixing camera (see: https://threejs.org/docs/#api/en/helpers/PointLightHelper )
[x] On placement, reposition rollover, not relying on mousemove

[x] Implement saving scene to localStorage. Requires structuring of app

How will state work?

Keep it to auto save for tonight

On object add, update localStorage. Passive save
What do we add? I suppose, all the block references? If we have those in the array, we can load them

Continue to focus on the idea:

- Allow people to build a "brick building manual"
- Manual can be saved, shared, and viewed
- Manual can be printed? Perhaps, eventually
- Looks good on iPhone and iPad


# Sunday April 5 2020

Start considering global app state, since we'll want to use that for functions like export/import

https://github.com/excalidraw/excalidraw/blob/d5366db341bca242ba6f383148d05af3e5b9e3c7/src/components/App.tsx

And

https://github.com/excalidraw/excalidraw/blob/d5366db341bca242ba6f383148d05af3e5b9e3c7/src/data/index.ts

Also, TypeScript? I like the approach used by Excalidraw so let's jump into that.

# Friday, April 3, 2020

- Need to write up codesandbox example of object.raycast not being a function
- Post to react-three-fiber chat

ISSUES

[ ] On mouse press should only work when in grid
