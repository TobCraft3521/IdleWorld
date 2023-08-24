class TobGameEngine {
    constructor(gameName) {
        this.gameName = gameName
        document.title = gameName
    }

    addScene(scene) {
        if (scene?.name) {
            scene = { name: scene.name, objs: {}, cam: { x: 0, y: 0, zoom: 1 }, clock: scene.clock }
            enginestuff.scenes[scene.name] = scene
            if (enginestuff.activeSceneName === "") {
                this.switchToScene(scene.name)
            }
            return scene
        } else {
            this.#logError("Please make sure to follow this structure in the overgiven object: { name: \"your-scene-name\"}")
            return
        }
    }

    switchToScene(name) {
        enginestuff.scenes[name] ? enginestuff.activeSceneName = name : this.#logError("There is no scene with the name: " + name)
        if (enginestuff.scenes[name] && enginestuff.scenes[name].clock) {
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

        enginestuff.canvas.onmousemove = (e) => {
            enginestuff.mouseX = e.x
            enginestuff.mouseY = e.y
        }

        document.onkeydown = (e) => {
            this.pressedKeys[e.key.toLowerCase()] = true
        }

        document.onkeyup = (e) => {
            delete this.pressedKeys[e.key.toLowerCase()]
        }

        document.onmousedown = (e) => {
            for (const [key, obj] of Object.entries(enginestuff.scenes[enginestuff.activeSceneName].objs)) {
                if (enginestuff.getHoveredObjects(enginestuff.scenes[enginestuff.activeSceneName]).includes(obj)) {
                    obj.onclick ? obj.onclick() : undefined
                }
            }
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
    activeSceneName: "",
    textures: {},
    gameStartTimeStamp: 0,
    layers: [],
    renderGame() {
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
                const xOnScreen = Math.round(((canvasWidth / 2) + ((obj.x - cam.x) * cam.zoom) - (enginestuff.ctx.measureText(obj.text).width / 2)))
                const yOnScreen = Math.round(((canvasHeight / 2) + ((obj.y - cam.y) * cam.zoom)))
                enginestuff.ctx.fillText(obj.text, xOnScreen, yOnScreen)
            } else if (obj.type === "button") {
                const xOnScreen = Math.round(((canvasWidth / 2) + ((obj.x - cam.x) * cam.zoom) - ((obj.w / 2) * cam.zoom)))
                const yOnScreen = Math.round(((canvasHeight / 2) + ((obj.y - cam.y) * cam.zoom) - ((obj.h / 2) * cam.zoom)))
                //check hovered
                if (!enginestuff.getHoveredObjects().includes(obj)) {
                    //not hovered
                    enginestuff.ctx.drawImage(enginestuff.textures[obj.img], xOnScreen, yOnScreen, widthOnScreen, heightOnScreen)
                } else {
                    //hovered    
                    enginestuff.ctx.drawImage(enginestuff.textures[obj.hoveredImg], xOnScreen, yOnScreen, widthOnScreen, heightOnScreen)
                }
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

        for (const [key, obj] of Object.entries(scene.objs)) {
            const objDisX = obj.x - scene.cam.x
            const objDisY = obj.y - scene.cam.y

            const mouseToObjDisX = mouseDisX - objDisX
            const mouseToObjDisY = mouseDisY - objDisY

            if (((-(obj.w / 2)) < mouseToObjDisX) && ((obj.w / 2) > mouseToObjDisX)) {
                if (((-(obj.h / 2)) < mouseToObjDisY) && ((obj.h / 2) > mouseToObjDisY)) {
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




