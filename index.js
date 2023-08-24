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
const sea = { x: 0, y: 0, w: window.innerWidth * 1.5, h: window.innerWidth * 3, img: "sea" } 
const map = game.addScene({ name: "map", clock: { tick: tick, delay: 10 }, sceneloader: maploader,map:"sea" })


maploader()



game.create()

console.log("Note: this is my first Github project im developing in vs code and it is synchronised with my webside / (netlify)")