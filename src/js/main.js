let floors = []
let lifts = []
let floorsCalled = []
let liftsAvailable = []

function generate() {
    let simulation = document.getElementById("simulation")
    simulation.innerHTML = ''
    floors = []
    lifts = []

    let floorCount = +document.getElementById("floor-count").value
    let liftCount = +document.getElementById("lift-count").value

    if (floorCount == undefined || floorCount <= 0 || floorCount > 10) {
        alert("Invalid Floors")
        return
    } else if (liftCount == undefined || liftCount <= 0 || liftCount > 10) {
        alert("Invalid Lifts")
        return
    }

    for (let i = 0; i < floorCount; i++) {
        let floor = document.createElement('div')
        floor.id = `floor-${i}`
        floor.className = 'floor'
        let button = document.createElement('button')
        button.id = `floor-btn-${i}`
        button.addEventListener('click', () => callLift(`${i}`))
        button.innerHTML = "Call"
        floor.appendChild(button)
        simulation.appendChild(floor)
        floors.push(floor)
    }

    let offset = floors[floors.length - 1].offsetTop
    let leftOffset = 6;
    for (let i = 0; i < liftCount; i++) {
        let lift = document.createElement('div')
        lift.className = 'lift'
        simulation.appendChild(lift)
        lift.style.top = offset + "px"
        lift.style.left = (leftOffset + i * 10) + "%"
        lifts.unshift(lift)
    }

    for (let lift of lifts) {
        liftsAvailable.push(lift)
    }
}

function callLift(floor) {
    floorsCalled.push(floor)
    moveLift()
}

function moveLift() {
    if (liftsAvailable.length === 0) {
        return
    }

    let lift = liftsAvailable.pop()
    let floor = floorsCalled.pop()

    let liftPos = lift.offsetTop
    let floorPos = floors[floor].offsetTop
    let direction = liftPos > floorPos ? -1 : 1
    let animation = setInterval(frame, 10)

    function frame() {
        if (liftPos === floorPos) {
            liftsAvailable.push(lift)
            clearInterval(animation)
        } else {
            liftPos += direction
            lift.style.top = liftPos + "px"
        }
    }
}

generate()