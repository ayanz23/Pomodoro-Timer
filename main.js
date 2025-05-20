let timerDuration = 25 * 60;
let shortBreakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let timerInterval;
let isPaused = false;
let sessionCounter = 1;
let currentSessionType = "Pomodoro";
let startTimerCount = 0;

function updateTimerLabel() {
    document.getElementById('timer-label').textContent = currentSessionType;
}

function updateTimerBoxColor() {
    const timerBox = document.getElementById('timer-box');
    if (currentSessionType === "Pomodoro") {
        timerBox.style.backgroundColor = "#bc4c4c";
        document.body.style.background = "#d5908f";
    } else if (currentSessionType === "Short Break") {
        timerBox.style.backgroundColor = "#72bdc1";
        document.body.style.background = "#40848c";
    } else if (currentSessionType === "Long Break") {
        timerBox.style.backgroundColor = "#6895bb";
        document.body.style.background = "#397097";
    }
}

function showSettingsModal() {
    document.getElementById('settings-modal').style.display = 'block';
    clearInterval(timerInterval);
}

function hideSettingsModal() {
    document.getElementById('settings-modal').style.display = 'none';
}

function resetTimer() {
    clearInterval(timerInterval);
    isPaused = false;
    startTimerCount = 0;
    sessionCounter = 1;
    currentSessionType = "Pomodoro";
    updateTimerLabel();
    updateTimerBoxColor();
    document.getElementById('timer').textContent = "25:00";
    document.getElementById('pause-button').textContent = 'Pause';
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    updateTimerBoxColor();
    timerInterval = setInterval(() => {
        if (!isPaused) {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById('timer').textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                startTimerCount++;

                if (startTimerCount % 2 == 0) {
                    sessionCounter++;
                }

                clearInterval(timerInterval);
                if (currentSessionType === "Pomodoro") {
                    currentSessionType = (sessionCounter % 4 === 0) ? "Long Break" : "Short Break";
                } else {
                    currentSessionType = "Pomodoro";
                }

                document.getElementById('session-counter').textContent = "Session: " + sessionCounter;
                updateTimerLabel();
                updateTimerBoxColor();
                startTimer(currentSessionType === "Pomodoro" ? timerDuration : (currentSessionType === "Short Break" ? shortBreakDuration : longBreakDuration));
            }
        }
    }, 1000);
}

document.getElementById('start-button').addEventListener('click', () => {
    clearInterval(timerInterval);
    isPaused = false;
    document.getElementById('pause-button').textContent = 'Pause';

    if (currentSessionType === "Pomodoro") {
        startTimer(timerDuration);
    } else if (currentSessionType === "Short Break") {
        startTimer(shortBreakDuration);
    } else {
        startTimer(longBreakDuration);
    }
});

document.getElementById('pause-button').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-button').textContent = isPaused ? 'Resume' : 'Pause';
});

document.getElementById('settings-button').addEventListener('click', showSettingsModal);

document.getElementById('done-button').addEventListener('click', () => {
    const pomodoroMinutes = parseInt(document.getElementById('pomodoro-time-minutes').value) || 0;
    const pomodoroSeconds = parseInt(document.getElementById('pomodoro-time-seconds').value) || 0;
    const shortBreakMinutes = parseInt(document.getElementById('short-break-time-minutes').value) || 0;
    const shortBreakSeconds = parseInt(document.getElementById('short-break-time-seconds').value) || 0;
    const longBreakMinutes = parseInt(document.getElementById('long-break-time-minutes').value) || 0;
    const longBreakSeconds = parseInt(document.getElementById('long-break-time-seconds').value) || 0;

    timerDuration = (pomodoroMinutes * 60) + pomodoroSeconds;
    shortBreakDuration = (shortBreakMinutes * 60) + shortBreakSeconds;
    longBreakDuration = (longBreakMinutes * 60) + longBreakSeconds;

    if (currentSessionType === "Pomodoro") {
        document.getElementById('timer').textContent =
            (Math.floor(timerDuration / 60)).toString().padStart(2, '0') + ':' +
            (timerDuration % 60).toString().padStart(2, '0');
    } else if (currentSessionType === "Short Break") {
        document.getElementById('timer').textContent =
            (Math.floor(shortBreakDuration / 60)).toString().padStart(2, '0') + ':' +
            (shortBreakDuration % 60).toString().padStart(2, '0');
    } else {
        document.getElementById('timer').textContent =
            (Math.floor(longBreakDuration / 60)).toString().padStart(2, '0') + ':' +
            (longBreakDuration % 60).toString().padStart(2, '0');
    }

    hideSettingsModal();
});

function addTask() {
    const input = document.getElementById('todo-input');
    const taskText = input.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;
        li.className = 'todo-item';

        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#555';
        });
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = '';
        });
        li.addEventListener('click', () => {
            li.remove();
        });

        document.getElementById('todo-list').appendChild(li);
        input.value = '';
    }
}

document.getElementById('submit-todo-button').addEventListener('click', addTask);