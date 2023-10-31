function loadHQMenu(menu) {
    //objects
    menu.objs.page = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight * 1.5, img: "background" }

    const handleClose = () => game.switchToScene("map")

    //gui
    menu.gui.topbar = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight / 16, img: "topbar", type: "image" }
    menu.gui.title = { x: (window.innerWidth / 2) - (window.innerHeight / 8), y: window.innerHeight / 200, w: window.innerHeight / 4, h: window.innerHeight / 16.8, img: "title", type: "image" }
    menu.gui.close = { x: window.innerWidth - 50, y: 10, w: 35, h: 35, img: "close-icon", type: "image", onclick: handleClose }



}