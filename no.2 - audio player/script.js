// music
const musicUrl = "https://spmdl.github.io/json-files/rain.mp3";
const audio = new Audio(musicUrl);

// btn
const backBtn = document.querySelector(".audio-rotate-left");
const playBtn = document.querySelector(".audio-play");
const fastForwardBtn = document.querySelector(".audio-rotate-right");
const plusBtn = document.querySelector(".audio-plus");
const minusBtn = document.querySelector(".audio-minus");
const volumeBtn = document.querySelector(".audio-volum");
const speedBtn = document.querySelector(".audio-forward");

// time progress
const progress = document.querySelector("#progress");
const progressLine = document.querySelector("#progress-line");
const timeSpent = document.querySelector("#timeSpent");
const timeLeft = document.querySelector("#timeLeft");


// 以下為事件與監聽

// 播放與暫停
let isPlaying = false;
function playAudio() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

playBtn.addEventListener("click", playAudio);

// 前進與後退
function rewind() {
    audio.currentTime = Math.max(0, audio.currentTime - 2);
}

function fastForward() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 2);
}

backBtn.addEventListener("click", rewind);
fastForwardBtn.addEventListener("click", fastForward);

// 音量：增加、減少、靜音切換，音量最大值１，最小值０
function volumePlus() {
    audio.volume = Math.min(1, audio.volume + 0.1);
    if (audio.volume > 0) {
        audio.muted = false;
    }
    updateVolumeIcon();
}

function volumeMinus() {
    audio.volume = Math.max(0, audio.volume - 0.1);
    if (audio.volume === 0) {
        audio.muted = true;
    }
    updateVolumeIcon();
}

function volumeToggle() {
    audio.muted = !audio.muted;
    audio.volume = audio.muted ? 0 : audio.volume;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (audio.muted) {
        volumBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else if (audio.volume < 0.5) {
        volumBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
        volumBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
}

plusBtn.addEventListener("click", volumePlus);
minusBtn.addEventListener("click", volumeMinus);
volumeBtn.addEventListener("click", volumeToggle);

// 加速，倍速（1、1.25、1.5、2、5），當倍速為 5 倍時，再次點選就會回到倍速 1
const speedScope = [1, 1.25, 1.5, 2, 5];
let speedModeIndex = 0;

function speedUp() {
    speedModeIndex = (speedModeIndex + 1) % speedScope.length;
    audio.playbackRate = speedScope[speedModeIndex];
    speedBtn.innerHTML = `<i class="fa-solid fa-forward"></i> x${speedScope[speedModeIndex]}`;
}

speedBtn.addEventListener("click", speedUp);

// 進度條
function progressInit() {
    progress.value = 0;
}

function updateProgress() {
    if (audio.duration > 0) {
        const curProgress = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = curProgress;
        progressLine.style.width = `${curProgress}%`;
        timeSpent.innerText = transTime(audio.currentTime);
        timeLeft.innerText = transTime(audio.duration - audio.currentTime);
    }
    if (audio.currentTime === audio.duration) {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    }
}

function dragProgress() {
    const duration = audio.duration;
    const rawTime = Number(progress.value);
    const newTime = Math.max(0, Math.min(rawTime, duration));
    audio.currentTime = newTime;
}

function transTime(origin) {
    const minutes = Math.floor(origin / 60).toString();
    const secs = Math.floor(origin % 60).toString();
    return `${minutes.padStart(2, "0")}:${secs.padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", progressInit);
audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("input", dragProgress);
