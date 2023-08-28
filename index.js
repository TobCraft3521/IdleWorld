const game = new TobGameEngine("Idle World")

// Load textures
game.loadTeaxture("sea", "/imgs/sea.png")
game.loadTeaxture("topbar", "/imgs/topbar.png")
game.loadTeaxture("title","/imgs/iwtxt.png")
game.loadTeaxture("hqisle","/imgs/headquaterisle.png")

//add scenes
const map = game.addScene({ name: "map", sceneloader: loadMap, map: "sea", clearonunload: true })
const bank = game.addScene({ name: "bank", sceneloader: loadBank,clearonunload: true  /*map: ""*/ })

game.create()

console.log("Note: this is my first Github project im developing in vs code and it is synchronised with my webside / (netlify) :)")