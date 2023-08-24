const game = new TobGameEngine("Tycoon World")

// Load textures
game.loadTeaxture("sea", "/imgs/sea.png")

let isSwiping = false
let startSwipeX = 0
let startSwipeY = 0
let prevSwipePositionX = 0 // Previous swipe position (X)
let prevSwipePositionY = 0 // Previous swipe position (Y)
let swipePositionX = 0
let swipePositionY = 0

function tick() {
    try {
        map.cam.x = -swipePositionX // Adjusted for left offset
        map.cam.y = -swipePositionY
    } catch (e) {
        // Not initialized yet
    }
}

function maploader() {
    map.objs.sea = sea
}

const map = game.addScene({ name: "map", clock: { tick: tick, delay: 10 }, sceneloader: maploader })
const sea = { x: 0, y: 0, w: window.innerWidth * 1.5, h: window.innerWidth * 3, img: "sea" } 

if (window.matchMedia("(pointer: coarse)").matches) {
    // touchscreen
    game.log("Found touchscreen")
    window.ontouchstart = (e) => {


        isSwiping = true
        startSwipeX = e.touches[0].clientX
        startSwipeY = e.touches[0].clientY

        prevSwipePositionX = swipePositionX // Store the previous position (X)
        prevSwipePositionY = swipePositionY // Store the previous position (Y)
    }

    window.ontouchend = () => {

        isSwiping = false
        prevSwipePositionX = swipePositionX // Update the previous position (X)
        prevSwipePositionY = swipePositionY // Update the previous position (Y)
    }

    window.ontouchmove = (e) => {

        if (isSwiping) {
            const deltaX = e.touches[0].clientX - startSwipeX
            const deltaY = e.touches[0].clientY - startSwipeY



            swipePositionX = Math.min(Math.max(prevSwipePositionX + deltaX, -((sea.w / 2) - (enginestuff.canvas.width / 2))), ((sea.w / 2) - (enginestuff.canvas.width / 2)))
            swipePositionY = Math.min(Math.max(prevSwipePositionY + deltaY, -((sea.h / 2) - (enginestuff.canvas.height / 2))), ((sea.h / 2) - (enginestuff.canvas.height / 2)))
        }
    }
} else {
    window.onmousedown = (e) => {
        isSwiping = true
        startSwipeX = e.clientX
        startSwipeY = e.clientY
        prevSwipePositionX = swipePositionX // Store the previous position (X)
        prevSwipePositionY = swipePositionY // Store the previous position (Y)
    }

    window.onmouseup = () => {
        isSwiping = false
        prevSwipePositionX = swipePositionX // Update the previous position (X)
        prevSwipePositionY = swipePositionY // Update the previous position (Y)
    }

    window.onmousemove = (e) => {
        if (isSwiping) {
            const deltaX = e.clientX - startSwipeX
            const deltaY = e.clientY - startSwipeY


            swipePositionX = Math.min(Math.max(prevSwipePositionX + deltaX, -((sea.w / 2) - (enginestuff.canvas.width / 2))), ((sea.w / 2) - (enginestuff.canvas.width / 2)))
            swipePositionY = Math.min(Math.max(prevSwipePositionY + deltaY, -((sea.h / 2) - (enginestuff.canvas.height / 2))), ((sea.h / 2) - (enginestuff.canvas.height / 2)))
        }
    }
}

game.create()

console.log("Note: this is my first Github project im developing in vs code and it is synchronised with my webside / (netlify)")