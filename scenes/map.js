function loadMap(map) {
    const sea = { x: 0, y: 0, w: window.innerWidth * 1.5, h: window.innerWidth * 3, img: "sea" }
    game.log("Loading map")
    map.objs.sea = sea
    game.log("Done loading map")
}