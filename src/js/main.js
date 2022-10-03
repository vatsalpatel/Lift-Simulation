let floors = []
let lifts = []
let floorsCalled = []
let liftsAvailable = []

function generate() {
    let simulation = document.getElementById("simulation")
    let controls = document.getElementById("controls")
    simulation.innerHTML = ''
    floors = []
    lifts = []
    floorsCalled = []
    liftsAvailable = []

    let floorCount = +document.getElementById("floor-count").value
    let liftCount = +document.getElementById("lift-count").value

    if (floorCount == undefined || floorCount <= 0 || floorCount > 10) {
        alert("Floors must be between 1 and 10")
        return
    } else if (liftCount == undefined || liftCount <= 0 || liftCount > 10) {
        alert("Lifts must be between 1 and 10")
        return
    }

    for (let i = 0; i < floorCount; i++) {
        let floor = document.createElement('div')
        floor.id = `floor-${i}`
        floor.className = 'floor'
        floor.style.width = (150 * (liftCount + 1)) + "px"
        controls.style.width = (150 * (liftCount + 1)) + "px"

        if (i != 0) {
            let button = document.createElement('button')
            button.className = 'btn'
            button.id = `floor-btn-${i}`
            button.addEventListener('click', () => callLift(`${i}`))
            floor.appendChild(button)
            button.innerHTML = "Up"
        }

        if (i != floorCount - 1) {
            let button2 = document.createElement('button')
            button2.className = 'btn'
            button2.id = `floor-btn-${i}`
            button2.addEventListener('click', () => callLift(`${i}`))
            button2.innerHTML = "Down"
            floor.appendChild(button2)
        }
        
        simulation.appendChild(floor)
        floors.push(floor)
    }

    let offset = floors[floors.length - 1].offsetTop
    let leftOffset = 150
    for (let i = 0; i < liftCount; i++) {
        let lift = document.createElement('div')
        lift.className = 'lift'
        simulation.appendChild(lift)
        lift.style.top = offset + "px"
        lift.style.left = (leftOffset) + "px"
        leftOffset += 150
        let door = document.createElement('div')
        door.className = 'door'
        lift.appendChild(door)
        lifts.unshift(lift)
    }

    for (let lift of lifts) {
        liftsAvailable.push(lift)
    }
}

function callLift(floor) {
    floorsCalled.push(floor)
}

function delay (miliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, miliseconds)
    })
}

function moveLift() {
    if (liftsAvailable.length === 0 || floorsCalled.length === 0) {
        return
    }

    let lift = liftsAvailable.pop()
    let floor = floorsCalled.shift()
    let door = lift.childNodes[0]

    let liftPos = lift.offsetTop
    let floorPos = floors[floor].offsetTop
    let direction = liftPos > floorPos ? -1 : 1
    // Lift needs to move 120 pixels in 2 seconds -> 16.67 ms per pixel
    let animation = setInterval(moveframe, 16)
    let dooranimation = null

    function moveframe() {
        if (liftPos === floorPos) {
            clearInterval(animation)
            dooranimation = setInterval(openDoor, 50)
        } else {
            liftPos += direction
            lift.style.top = liftPos + "px"
        }
    }

    function openDoor() {
        let doorPos = door.offsetLeft
        let doorWidth = door.offsetWidth
        if (doorPos == 0) {
            clearInterval(dooranimation)
            // Doors cover 50 pixels in 2.5 seconds -> 50 ms per pixel
            dooranimation = setInterval(closeDoor, 50)
        } else {
            doorPos -= 1
            doorWidth += 2
            door.style.left = doorPos + "px"
            door.style.width = doorWidth + "px"
        }
    }

    function closeDoor() {
        let doorPos = door.offsetLeft
        let doorWidth = door.offsetWidth
        if (doorPos == 49) {
            clearInterval(dooranimation)
            liftsAvailable.push(lift)
        } else {
            doorPos += 1
            doorWidth -= 2
            door.style.left = doorPos + "px"
            door.style.width = doorWidth + "px"
        }
    }
}

generate()
setInterval(moveLift, 100)
