const game = new TobGameEngine("Idle World")

// Load textures
game.loadTeaxture("sea", "/imgs/sea.png")
game.loadTeaxture("topbar", "/imgs/topbar.png")
game.loadTeaxture("title", "/imgs/iwtxt.png")
game.loadTeaxture("hqisle", "/imgs/headquaterisle.png")
game.loadTeaxture("background", "/imgs/background.png")
game.loadTeaxture("close-icon", "/imgs/close.png")

//add scenes
//const menu = game.addScene({ name: "menu", sceneloader: loadMenu })
const map = game.addScene({ name: "map", sceneloader: loadMap, map: "sea" })
const hqmenu = game.addScene({ name: "hqmenu", sceneloader: loadHQMenu, map: "page" })
game.create()

console.log("Note: this is my first Github project im developing in vs code and it is synchronised with my webside / (netlify) :)")