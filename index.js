const game = new TobGameEngine("Idle World")

// Load textures
game.loadTeaxture("sea", "/imgs/sea.png")
//add scenes
const map = game.addScene({ name: "map", sceneloader: loadMap, map: "sea", clearonunload: true })
const bank = game.addScene({ name: "bank", sceneloader: loadBank, /*map: ""*/ })

loadMap(map)
game.create()

console.log("Note: this is my first Github project im developing in vs code and it is synchronised with my webside / (netlify) :)")