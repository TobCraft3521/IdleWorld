const game = new TobGameEngine("Idle World")

// Load textures
game.loadTeaxture("sea", "/imgs/sea.png")

function maploader() {
    map.objs.sea = sea
}
const sea = { x: 0, y: 0, w: window.innerWidth * 1.5, h: window.innerWidth * 3, img: "sea" }
const map = game.addScene({ name: "map", sceneloader: maploader, map: "sea" })

maploader()
game.create()

console.log("Note: this is my first Github project im developing in vs code and it is synchronised with my webside / (netlify) :)")