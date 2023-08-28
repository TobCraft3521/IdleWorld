function loadMap(map) {
    //objects
    map.objs.sea = { x: 0, y: 0, w: window.innerWidth * 1.5, h: window.innerWidth * 3, img: "sea" }

    //gui
    //map.gui.testtext = { x: 100 , y:100, text:"abc", type:"text",color:"yellow",font:"100px sans-serif"}
    //map.gui.testimg = { x: 100, y: 100, w: 100, h: 200, img: "sea",type:"image" }

    map.gui.topbar = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight / 16, img: "topbar", type: "image" }
    map.gui.title = { x: (window.innerWidth / 2) - (window.innerHeight / 8), y: window.innerHeight / 200, w: window.innerHeight / 4, h: window.innerHeight / 16.8, img: "title", type: "image" }

    //isles
    map.objs.hqisle = { x: 0, y: 0, w: window.innerWidth / 2, h: window.innerWidth / 2, img: "hqisle",hoveredImg:"hqisle", type: "button" }
}