// variables
let timer = null;
let total = 25 * 60;
let timeLeft = total;
let isRunning = false;
let isBreak = false;

// get elements form html
const timeEl = document.getElementById("time");
const circle = document.getElementById("circle");
const mode = document.getElementById("mode");
const bell = document.getElementById("bell");
const subjectSelect = document.getElementById("subject");

// get subjects from todayPlan
let todayPlan = JSON.parse(
    localStorage.getItem("todayPlan")
) || [];

// add subjects to select
subjectSelect.innerHTML = "";

// default option
const defaultOption = document.createElement("option");

defaultOption.value = "";
defaultOption.textContent = "Select Subject";
defaultOption.disabled = true;
defaultOption.selected = true;

subjectSelect.appendChild(defaultOption);

if (todayPlan.length === 0) {

    const option = document.createElement("option");

    option.value = "";
    option.textContent = "No subjects available";
    option.disabled = true;

    subjectSelect.appendChild(option);

} else {

    todayPlan.forEach(sub => {

        const option = document.createElement("option");

        option.value = sub.name;
        option.textContent = sub.name;

        subjectSelect.appendChild(option);
    });
}

// style timer
function update_time() {

    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;

    timeEl.innerText =
        `${m}:${s < 10 ? "0" : ""}${s}`;

    let deg = (timeLeft / total) * 360;

    if (isBreak) {

        // circle rest style
        circle.style.background =
            `conic-gradient(#22c55e ${deg}deg, #222 ${deg}deg)`;

        circle.style.boxShadow =
            "0 0 25px rgba(34,197,94,0.6)";


    } else {

        // circle study style
        circle.style.background =
            `conic-gradient(#8b5cf6 ${deg}deg, #222 ${deg}deg)`;

        circle.style.boxShadow =
            "0 0 25px rgba(139,92,246,0.6)";

    }
}
// sound
function playBell() {
    bell.currentTime = 0;
    bell.play();
}

// popup
function showPopup(message) {

    const popup = document.createElement("div");

    popup.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #111;
        color: #fff;
        padding: 12px 18px;
        border-radius: 10px;
        z-index: 9999;
        font-family: sans-serif;
    `;

    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 2500);
}

// save study time
function saveStudyTime() {

    let selected = subjectSelect.value;

    if (!selected) return;

    let data = JSON.parse(
        localStorage.getItem("name_data_subj")
    ) || { subjects: [] };

    let subject = data.subjects.find(
        s => s.name === selected
    );

    if (!subject) return;

    subject.time = subject.time || 0;
    subject.sessions = subject.sessions || 0;
    subject.target = subject.target || 0;

    if (subject.time / 60 >= subject.target) {

        showPopup(
            "You already completed this subject target"
        );

        return;
    }

    subject.time += 25;
    subject.sessions += 1;

    localStorage.setItem(
        "name_data_subj",
        JSON.stringify(data)
    );
}

// timer
function startTimer() {

    timer = setInterval(() => {

        if (timeLeft > 0) {

            if (isBreak && timeLeft === 10) {
                playBell();
            }

            timeLeft--;

            update_time();

        } else {

            clearInterval(timer);

            playBell();

            if (!isBreak) {

                saveStudyTime();

                isBreak = true;
                total = 5 * 60;

            } else {

                isBreak = false;
                total = 25 * 60;
            }

            timeLeft = total;

            update_time();

            startTimer();
        }

    }, 1000);
}

// start
function start() {

    let data = JSON.parse(
        localStorage.getItem("name_data_subj")
    ) || { subjects: [] };

    let selected = subjectSelect.value;

    if (!selected) {

        showPopup("Please select a subject");

        return;
    }

    let subject = data.subjects.find(
        s => s.name === selected
    );

    if (subject) {

        subject.time = subject.time || 0;
        subject.target = subject.target || 0;

        // popup to alert target time
        if (subject.time / 60 >= subject.target) {

            showPopup(
                "This subject is already completed"
            );

            return;
        }

        if (!subject.startedat) {

            subject.startedat =
                new Date().getHours();
        }
        // get day name
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        let day = new Date().getDay();

        subject.day = days[day];

        localStorage.setItem(
            "name_data_subj",
            JSON.stringify(data)
        );
    }

    if (isRunning) return;

    isRunning = true;

    startTimer();
}

// pause
function pause() {

    clearInterval(timer);

    isRunning = false;
}

// reset
function reset() {

    clearInterval(timer);

    isRunning = false;
    isBreak = false;

    total = 25 * 60;
    timeLeft = total;

    update_time();
}

// sound controls
const music = document.getElementById("music");
const ambient = document.getElementById("ambient");

function toggleMusic() {

    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

function toggleAmbient() {

    if (ambient.paused) {
        ambient.play();
    } else {
        ambient.pause();
    }
}
function back() {
    window.location.href = "../dash-board/add_task_pro.html"
}
update_time();