function loadMap(map) {
    game.log("Loading map")
    //objects
    map.objs.sea = { x: 0, y: 0, w: window.innerWidth * 1.5, h: window.innerWidth * 3, img: "sea" }

    //gui
    //map.gui.testtext = { x: 100 , y:100, text:"abc", type:"text",color:"yellow",font:"100px sans-serif"}
    //map.gui.testimg = { x: 100, y: 100, w: 100, h: 200, img: "sea",type:"image" }
    game.log("Done loading map")
}