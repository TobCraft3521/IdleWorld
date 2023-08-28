class TobGameEngine {
    constructor(gameName) {
        this.gameName = gameName
        document.title = gameName
    }

    addScene(scene) {
        if (scene?.name) {
            enginestuff.scenedata[scene.name] = { swipePositionX: 0, swipePositionY: 0, clearonunload: scene.clearonunload, clearguionunload: scene.clearguionunload, sceneloader: scene.sceneloader, clock: scene.clock }
            scene = { name: scene.name, objs: {}, cam: { x: 0, y: 0, zoom: 1 }, gui: {}, map: scene.map, clearguionunload: scene.clearguionunload }
            enginestuff.scenes[scene.name] = scene

            if (enginestuff.activeSceneName === "") {
                this.switchToScene(scene.name)
            }
            return scene
        } else {
            this.#logError("Please make sure to follow this structure in the overgiven object: { name: \"your-scene-name\", (tick: your-clock-function),(sceneloader: your-sceneloader-function),(map:\"map-name\"),(clearonunload:true & clearguionunload: true #if you want to automatically delete all objects when switching to another scene - if not, just leave it out} Note: Sceneloaders do only work after the scene has been added and you switch to that scene.")
            return
        }
    }

    switchToScene(name) {
        if (enginestuff.activeSceneName === name) {
            this.#logError("You cant switch to the same scene (" + enginestuff.activeSceneName + " => " + name + ")")
            return
        }
        if (enginestuff.scenes[enginestuff.activeSceneName]) {
            if (enginestuff.scenedata[enginestuff.activeSceneName]) {
                if (enginestuff.scenedata[enginestuff.activeSceneName].clearonunload) {
                    this.#enginelog("Clearing " + enginestuff.activeSceneName)
                    enginestuff.scenes[enginestuff.activeSceneName].objs = {}
                }
                if (enginestuff.scenedata[enginestuff.activeSceneName].clearguionunload) {
                    this.#enginelog("Clearing gui for " + enginestuff.activeSceneName)
                    enginestuff.scenes[enginestuff.activeSceneName].gui = {}
                }
            }
        }
        enginestuff.scenes[name] ? enginestuff.activeSceneName = name : this.#logError("There is no scene with the name: " + name)

        if (enginestuff.scenedata[name].sceneloader) {
            this.#enginelog("Loading " + name)
            enginestuff.scenedata[name].sceneloader(enginestuff.scenes[name])
            this.#enginelog("Done loading  " + name)
        }
        if (enginestuff.scenes[name] && enginestuff.scenedata[name].clock) {
            const clock = (sceneName) => {
                const startTime = Date.now()
                enginestuff.scenes[name].clock.tick()
                const endTime = Date.now()
                if (enginestuff.scenes[sceneName].clock.delay < endTime - startTime + 5) {
                    this.#logError("Clock tick function took to long! Execution took " + (endTime - startTime) + " ms (+clock engine time), but the delay is only " + enginestuff.scenes[sceneName].clock.delay)
                }
                if (enginestuff.activeSceneName === name) {
                    setTimeout(clock, enginestuff.scenes[sceneName].clock.delay - Math.min(endTime - startTime, enginestuff.scenes[sceneName].clock.delay), name)
                }
            }
            clock(name)
        }
    }

    create() {
        Object.keys(enginestuff.scenes).length !== 0 ? this.#setUp() : this.#logError("Please add at least one scene before you start the game")
    }

    log(msg) {
        if (typeof msg == "object") {
            console.log("[!] Game> " + JSON.stringify(msg))
        } else {
            console.log("[!] Game> " + msg)
        }
    }

    loadTeaxture(name, url) {
        const img = document.createElement("img")
        img.src = url
        enginestuff.textures[name] = img
    }

    setIcon(url) {
        const link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
        link.href = url
    }

    pressedKeys = {}

    isKeyDown(key) {
        return this.pressedKeys[key] || false
    }

    /**
     * @param {Function} listener 
     */
    setKeyListener(listener) {
        enginestuff.canvas.onkeydown = (e) => {
            listener({ key: e.key })
        }
    }

    #enginelog(msg) {
        console.log("[!] TobGameEngine> " + msg)
    }

    #logError(err) {
        console.error(this.gameName + " [!] TobGameEngine> " + err)
    }

    #setUp() {

        //set gameStartTimeStamp
        enginestuff.gameStartTimeStamp = Date.now()

        //query canvas
        try {
            enginestuff.canvas = document.getElementById("tobgameenginecanvas")
            enginestuff.canvas.width = window.innerWidth
            enginestuff.canvas.height = window.innerHeight
            enginestuff.ctx = enginestuff.canvas.getContext("2d")
        } catch (error) {
            this.#logError("Couldn't acces the game canvas. Make sure to set \"id\" to \"tobgameenginecanvas\"")
            return
        }

        for (const [key, value] of Object.entries(enginestuff.scenes)) {
            for (const [key, obj] of Object.entries(value.objs)) {
                if (!obj.img && !obj.type) {
                    this.#logError("One of your objects has no texture \"img\" set. Please set the name of your texture after loading it with Game.loadTexture(\"name\",\"URL\")")
                }
            }
        }

        if (window.matchMedia("(pointer: coarse)").matches) {
            this.#enginelog("Using touchscreen as primary input for clicking")
            window.ontouchstart = (e) => {
                if (enginestuff.scenes[enginestuff.activeSceneName].map) {
                    enginestuff.scenedata[enginestuff.activeSceneName].isSwiping = true
                    enginestuff.scenedata[enginestuff.activeSceneName].startSwipeX = e.touches[0].clientX
                    enginestuff.scenedata[enginestuff.activeSceneName].startSwipeY = e.touches[0].clientY
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionX = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX // Store the previous position (X)
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionY = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY // Store the previous position (Y)
                }
            }

            window.ontouchend = () => {
                if (enginestuff.scenes[enginestuff.activeSceneName].map) {
                    enginestuff.scenedata[enginestuff.activeSceneName].isSwiping = false
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionX = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX // Update the previous position (X)
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionY = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY // Update the previous position (Y)
                }
            }

            window.ontouchmove = (e) => {
                enginestuff.mouseX = e.touches[0].clientX
                enginestuff.mouseY = e.touches[0].clientY
                if (enginestuff.scenes[enginestuff.activeSceneName].map) {
                    if (enginestuff.scenedata[enginestuff.activeSceneName].isSwiping) {
                        const deltaX = e.touches[0].clientX - enginestuff.scenedata[enginestuff.activeSceneName].startSwipeX
                        const deltaY = e.touches[0].clientY - enginestuff.scenedata[enginestuff.activeSceneName].startSwipeY

                        enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX = Math.min(Math.max(enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionX + deltaX, -((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].w / 2) - (enginestuff.canvas.width / 2))), ((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].w / 2) - (enginestuff.canvas.width / 2)))
                        enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY = Math.min(Math.max(enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionY + deltaY, -((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].h / 2) - (enginestuff.canvas.height / 2))), ((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].h / 2) - (enginestuff.canvas.height / 2)))
                    }
                }
            }

        } else {
            this.#enginelog("Using mouse as primary input for clicking")
            window.onmousemove = (e) => {
                enginestuff.mouseX = e.clientX
                enginestuff.mouseY = e.clientY
                if (enginestuff.scenes[enginestuff.activeSceneName].map) {
                    if (enginestuff.scenedata[enginestuff.activeSceneName].isSwiping) {
                        const deltaX = e.clientX - enginestuff.scenedata[enginestuff.activeSceneName].startSwipeX
                        const deltaY = e.clientY - enginestuff.scenedata[enginestuff.activeSceneName].startSwipeY

                        enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX = Math.min(Math.max(enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionX + deltaX, -((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].w / 2) - (enginestuff.canvas.width / 2))), ((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].w / 2) - (enginestuff.canvas.width / 2)))
                        enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY = Math.min(Math.max(enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionY + deltaY, -((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].h / 2) - (enginestuff.canvas.height / 2))), ((enginestuff.scenes[enginestuff.activeSceneName].objs[enginestuff.scenes[enginestuff.activeSceneName].map].h / 2) - (enginestuff.canvas.height / 2)))
                    }
                }
            }

            window.onmousedown = (e) => {
                for (const [key, obj] of Object.entries(enginestuff.scenes[enginestuff.activeSceneName].objs)) {
                    if (enginestuff.getHoveredObjects(enginestuff.scenes[enginestuff.activeSceneName]).includes(obj)) {
                        obj.onclick ? obj.onclick() : undefined
                    }
                }

                if (enginestuff.scenes[enginestuff.activeSceneName].map) {
                    enginestuff.scenedata[enginestuff.activeSceneName].isSwiping = true
                    enginestuff.scenedata[enginestuff.activeSceneName].startSwipeX = e.clientX
                    enginestuff.scenedata[enginestuff.activeSceneName].startSwipeY = e.clientY
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionX = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX // Store the previous position (X)
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionY = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY // Store the previous position (Y)
                }
            }

            window.onmouseup = (e) => {
                if (enginestuff.scenes[enginestuff.activeSceneName].map) {
                    enginestuff.scenedata[enginestuff.activeSceneName].isSwiping = false
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionX = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX // Update the previous position (X)
                    enginestuff.scenedata[enginestuff.activeSceneName].prevSwipePositionY = enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY // Update the previous position (Y)
                }
            }
        }



        document.onkeydown = (e) => {
            this.pressedKeys[e.key.toLowerCase()] = true
        }

        document.onkeyup = (e) => {
            delete this.pressedKeys[e.key.toLowerCase()]
        }

        enginestuff.renderGame()
        this.#enginelog("Game started succesfully")
    }

    addLayer(drawFunction) {
        enginestuff.layers.push(drawFunction)
    }

}
const enginestuff = {
    /**
     * @type HTMLCanvasElement
     */
    canvas: undefined,
    /**
     * @type CanvasRenderingContext2D 
     */
    ctx: undefined,
    scenes: {},
    scenedata: {},
    activeSceneName: "",
    textures: {},
    gameStartTimeStamp: 0,
    layers: [],
    renderGame() {

        if (enginestuff.scenes[enginestuff.activeSceneName].map) {
            enginestuff.scenes[enginestuff.activeSceneName].cam.x = -enginestuff.scenedata[enginestuff.activeSceneName].swipePositionX
            enginestuff.scenes[enginestuff.activeSceneName].cam.y = -enginestuff.scenedata[enginestuff.activeSceneName].swipePositionY
        }

        //quality
        enginestuff.ctx.imageSmoothingEnabled = false

        enginestuff.ctx.clearRect(0, 0, enginestuff.canvas.width, enginestuff.canvas.height)

        //background
        enginestuff.ctx.fillStyle = "black"
        enginestuff.ctx.fillRect(0, 0, enginestuff.canvas.width, enginestuff.canvas.height)

        //objs

        const deltaT = Date.now() - enginestuff.gameStartTimeStamp

        const exampleAniLenght = 1000
        const exampleAniImageLenght = exampleAniLenght / 5

        const exampleState = Math.floor(deltaT % exampleAniLenght / exampleAniImageLenght)
        //console.log(exampleState)

        const cam = enginestuff.scenes[enginestuff.activeSceneName].cam

        const canvasWidth = enginestuff.canvas.width
        const canvasHeight = enginestuff.canvas.height

        //WORLD

        for (const [key, obj] of Object.entries(enginestuff.scenes[enginestuff.activeSceneName].objs)) {

            let widthOnScreen
            let heightOnScreen
            if (obj.w && obj.h) {
                widthOnScreen = Math.round(obj.w * cam.zoom)
                heightOnScreen = Math.round(obj.h * cam.zoom)
            }
            if (!obj.type) {
                const xOnScreen = Math.round(((canvasWidth / 2) + ((obj.x - cam.x) * cam.zoom) - ((obj.w / 2) * cam.zoom)))
                const yOnScreen = Math.round(((canvasHeight / 2) + ((obj.y - cam.y) * cam.zoom) - ((obj.h / 2) * cam.zoom)))
                enginestuff.ctx.drawImage(enginestuff.textures[obj.img], xOnScreen, yOnScreen, widthOnScreen, heightOnScreen)
            } else if (obj.type === "text") {
                const { text, font, color } = obj
                enginestuff.ctx.textBaseline = "top"
                if (font) {
                    enginestuff.ctx.font = font
                } else {
                    enginestuff.ctx.font = "10px sans-serif"
                }
                if (color) {
                    enginestuff.ctx.fillStyle = color
                } else {
                    enginestuff.ctx.fillStyle = "white"
                }
                const xOnScreen = Math.round(((canvasWidth / 2) + ((obj.x - cam.x) * cam.zoom) - (enginestuff.ctx.measureText(obj.text).width / 2)))
                const yOnScreen = Math.round(((canvasHeight / 2) + ((obj.y - cam.y) * cam.zoom)))
                enginestuff.ctx.fillText(text, xOnScreen, yOnScreen)
            } else if (obj.type === "button") {
                const xOnScreen = Math.round(((canvasWidth / 2) + ((obj.x - cam.x) * cam.zoom) - ((obj.w / 2) * cam.zoom)))
                const yOnScreen = Math.round(((canvasHeight / 2) + ((obj.y - cam.y) * cam.zoom) - ((obj.h / 2) * cam.zoom)))
                //check hovered
                if (!enginestuff.getHoveredObjects(enginestuff.scenes[enginestuff.activeSceneName]).includes(obj)) {
                    //not hovered
                    enginestuff.ctx.drawImage(enginestuff.textures[obj.img], xOnScreen, yOnScreen, widthOnScreen, heightOnScreen)
                } else {
                    //hovered    
                    enginestuff.ctx.drawImage(enginestuff.textures[obj.hoveredImg], xOnScreen, yOnScreen, widthOnScreen, heightOnScreen)
                }
            }
        }

        //GUI

        for (const [key, obj] of Object.entries(enginestuff.scenes[enginestuff.activeSceneName].gui)) {
            let widthOnScreen
            let heightOnScreen
            if (obj.w && obj.h) {
                widthOnScreen = Math.round(obj.w * cam.zoom)
                heightOnScreen = Math.round(obj.h * cam.zoom)
            }

            if (obj.type === "text") {
                enginestuff.ctx.textBaseline = "top"
                const { x, y, text, font, color } = obj
                if (font) {
                    enginestuff.ctx.font = font
                } else {
                    enginestuff.ctx.font = "10px sans-serif"
                }
                if (color) {
                    enginestuff.ctx.fillStyle = color
                } else {
                    enginestuff.ctx.fillStyle = "white"
                }
                enginestuff.ctx.fillText(text, x, y)
            } else if (obj.type === "button") {
                const { x, y, w, h, img, hoveredImg } = obj
                //check hovered
                if (!enginestuff.getHoveredObjects().includes(obj)) {
                    //not hovered
                    enginestuff.ctx.drawImage(enginestuff.textures[img], x, y, w, h)
                } else {
                    //hovered    
                    enginestuff.ctx.drawImage(enginestuff.textures[hoveredImg], x, y, w, h)
                }
            } else if (obj.type === "image") {
                const { x, y, w, h, img } = obj
                enginestuff.ctx.drawImage(enginestuff.textures[img], x, y, w, h)
            }
        }

        enginestuff.layers.forEach(drawFunction => {
            drawFunction(enginestuff.ctx)
        })
        requestAnimationFrame(enginestuff.renderGame)
    },
    mouseX: 0,
    mouseY: 0,
    getHoveredObjects(scene) {
        const objs = []
        const mouseDisX = (Math.round((enginestuff.mouseX - (enginestuff.canvas.width / 2)) / scene.cam.zoom))
        const mouseDisY = (Math.round((enginestuff.mouseY - (enginestuff.canvas.height / 2)) / scene.cam.zoom))
        console.log(mouseDisX, mouseDisY,enginestuff.mouseX,enginestuff.mouseY)
        for (const [key, obj] of Object.entries(scene.objs)) {
            console.log(obj)
            const objDisX = obj.x - scene.cam.x
            const objDisY = obj.y - scene.cam.y
            console.log(objDisX, objDisY)
            const mouseToObjDisX = mouseDisX - objDisX
            const mouseToObjDisY = mouseDisY - objDisY
            console.log(mouseDisX, mouseDisY)
            if (((-(obj.w / 2)) < mouseToObjDisX) && ((obj.w / 2) > mouseToObjDisX)) {
                if (((-(obj.h / 2)) < mouseToObjDisY) && ((obj.h / 2) > mouseToObjDisY)) {
                    console.log(obj)
                    objs.push(obj)
                }
            }
        }
        return objs
    },
    getUsedRam() {
        return Math.round(window.performance.memory.usedJSHeapSize / 1048576)
    }
}




