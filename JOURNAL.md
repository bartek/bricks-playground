# Monday April 6 2020

[x] Look into fixing camera (see: https://threejs.org/docs/#api/en/helpers/PointLightHelper )
[ ] On placement, reposition rollover, not relying on mousemove
[ ] Start using Constants and treat Cube as 2x2 square
[ ] Implement saving scene to localStorage. Requires structuring of app

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
