const wheel = document.querySelector("#wheel")
const iconGroup = document.querySelector(".icon-group");
const iconSingle = document.querySelectorAll(".icon-group>li");

const btnPresents = document.querySelector("#btn-presents");
const btnEnvelopes = document.querySelector("#btn-envelopes");
const btnReset = document.querySelector("#btn-reset");
const btnStart = document.querySelector("#btn-press");
const pointer = document.querySelector(".pointer")

const rewardBoard = document.querySelector(".banner")
const rewardGiftIndex = document.querySelector(".info-result h3")
const rewardGiftContent = document.querySelector("#selected-present")

let inWheelLoading = false
const loadingSpins = 3
const inLoadingMes = "Oops ! 前一次還未開獎！＼(●´ϖ`●)／"
const endGameMes = "Oops ! 獎品都抽完了唷(｡•ㅅ•｡)♡"


let data = [];
let game = null;
let allPlayTimes = null

// data default
const types = {
    presents: {
        playTimes: 10,
        data: [
            {
                "label": "Flight",
                "icon": "fas fa-fighter-jet",
                "num": 1
            },
            {
                "label": "Coffee",
                "icon": "fas fa-mug-hot",
                "num": 2
            },
            {
                "label": "Anything",
                "icon": "fas fa-star",
                "num": 1
            },
            {
                "label": "Sick Leave",
                "icon": "fas fa-hand-holding-medical",
                "num": 1
            },
            {
                "label": "Movie",
                "icon": "fas fa-film",
                "num": 2
            },
            {
                "label": "Wifi",
                "icon": "fas fa-wifi",
                "num": 1
            },
            {
                "label": "Break",
                "icon": "far fa-clock",
                "num": 1
            },
            {
                "label": "Bonus",
                "icon": "fas fa-coins",
                "num": 1
            }
        ]

    },
    envelopes: {
        playTimes: 25,
        data: [
            {
                "label": "1",
                "num": 1
            },
            {
                "label": "2",
                "num": 1
            },
            {
                "label": "3",
                "num": 1
            },
            {
                "label": "4",
                "num": 1
            },
            {
                "label": "5",
                "num": 2
            },
            {
                "label": "6",
                "num": 1
            },
            {
                "label": "7",
                "num": 1
            },
            {
                "label": "8",
                "num": 1
            },
            {
                "label": "9",
                "num": 2
            },
            {
                "label": "10",
                "num": 1
            },
            {
                "label": "11",
                "num": 2
            },
            {
                "label": "12",
                "num": 1
            },
            {
                "label": "13",
                "num": 1
            },
            {
                "label": "14",
                "num": 1
            },
            {
                "label": "15",
                "num": 1
            },
            {
                "label": "16",
                "num": 1
            },
            {
                "label": "17",
                "num": 1
            },
            {
                "label": "18",
                "num": 1
            },
            {
                "label": "19",
                "num": 1
            },
            {
                "label": "20",
                "num": 3
            }
        ]
    }
};
const colors = {
    blue: "#343BAA",
    blueDark: "#1F1172",
    pinkLight: " #F0BEFF",
    pink: "#FF00BA"
};

// init canvas setting default
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const radius = 270; // wheel radius
const PI2 = Math.PI * 2;
canvas.width = radius * 2;
canvas.height = radius * 2;

// draw sectors default
ctx.fillPie = function (x, y, r, start, qty) {
    let angle = PI2 / qty;
    this.beginPath()
    ctx.lineTo(radius, radius)
    this.arc(x, y, r, start * angle, (start + 1) * angle)
    ctx.lineTo(radius, radius)
    this.fill()
    this.closePath()
};

function insertContent(data, qty, type) {
    let rotate = 360 / qty
    iconGroup.innerHTML = ''
    data.forEach((item, index) => {
        let html = ''
        if (type == 'presents') {
            html = `
        <i class="icon ${item.icon}"></i>
        <h5>${item.label}</h5>
        <span class="present-qty">${item.num}</span>
        `
        } else {
            html = `
        <h5>${item.label}</h5>
        <span class="present-qty">${item.num}</span>`
        }
        let newContent = document.createElement("li")
        newContent.innerHTML = html
        iconGroup.append(newContent)
        newContent.style.transform = `rotate(${index * rotate}deg)`
    })
};

function drawButton() {
    ctx.beginPath();
    ctx.fillStyle = colors.blueDark;
    ctx.arc(radius, radius, 55, 0, PI2);
    ctx.closePath();
    ctx.fill();
}

function drawSectors(qty) {
    for (let i = 0; i <= qty; i += 2) {
        ctx.fillStyle = colors.pinkLight;
        ctx.fillPie(radius, radius, radius, i, qty);
    }
    for (let i = 1; i <= qty; i += 2) {
        ctx.fillStyle = colors.blue;
        ctx.fillPie(radius, radius, radius, i, qty);
    }
}


function draw(data, qty, type) {
    drawSectors(qty)
    // draw press button
    drawButton();
    insertContent(data, qty, type);
};


init(btnPresents.value);

// start from here

function init(typeValue) {
    let type = typeValue
    draw(types[type].data, types[type].data.length, type)

    game = JSON.parse(JSON.stringify(types[type].playTimes))
    data = JSON.parse(JSON.stringify(types[type].data))
    allPlayTimes = game

    pointer.style.transform = 'rotate(0deg)'
    rewardBoard.style.display = 'none'
};


function randomWheel() {
    const remainRewards = data.filter((item) => item.num !== 0)

    if (remainRewards.length === 0) return alert(endGameMes)

    inWheelLoading = true
    rewardBoard.style.display = 'none'

    const randomRewardIndex = Math.floor(Math.random() * remainRewards.length)
    const specifyReward = remainRewards[randomRewardIndex]
    const specifyInOriginIndex = data.findIndex((item) => item.label === specifyReward.label)

    const pointerDegree = (360 / data.length) * specifyInOriginIndex
    renderPointer(pointerDegree)

    setTimeout(() => {
        renderRewardBoard(game, specifyReward);
        data[specifyInOriginIndex].num -= 1;
        game -= 1;
        clearPointerTransition(pointerDegree);
        const isEnvelopesMode = wheel.matches('.new')
        curGameType = isEnvelopesMode ? "envelopes" : "presents"
        draw(data, data.length, curGameType);
        inWheelLoading = false;

    }, 1000);
}

function renderPointer(pointerDegree) {
    const spinDegree = pointerDegree + 360 * loadingSpins
    pointer.style.transform = `rotate(${spinDegree}deg)`
    pointer.style.transition = `all 1s ease-in-out`
}
function clearPointerTransition(pointerDegree) {
    pointer.style.transition = ''
    pointer.style.transform = `rotate(${pointerDegree}deg)`
}

function renderRewardBoard(remainGameTimes, specifyReward) {
    const gameNumber = allPlayTimes - remainGameTimes + 1
    rewardBoard.style.display = 'flex'
    rewardGiftIndex.textContent = `${gameNumber} / ${allPlayTimes} `
    rewardGiftContent.textContent = specifyReward.label
}

function handlePresents() {
    init(btnPresents.value);
    wheel.classList.remove("new");
    iconGroup.classList.remove("new");
}

function handleEnvelops() {
    init(btnEnvelopes.value);
    wheel.classList.add("new");
    iconGroup.classList.add("new");
}

function handleReset() {
    const isEnvelopesMode = wheel.matches('.new')
    curGameType = isEnvelopesMode ? "envelopes" : "presents"
    init(curGameType)
}

function handleStart() {
    if (inWheelLoading) return alert(inLoadingMes)
    if (game < 1) return alert(endGameMes)
    randomWheel()
}

btnPresents.addEventListener("click", handlePresents);
btnEnvelopes.addEventListener('click', handleEnvelops)
btnReset.addEventListener('click', handleReset)
btnStart.addEventListener('click', handleStart)
