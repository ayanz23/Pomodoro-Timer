let timerDuration = 25 * 60;
let shortBreakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let timerInterval;
let isPaused = false;
let sessionCounter = 1;
let currentSessionType = "Pomodoro";
let startTimerCount = 0;

const beepSound = new Audio("supporting-files/audio.mp4");
beepSound.volume = 1;

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
    let timer = duration;
    updateTimerBoxColor();
    timerInterval = setInterval(() => {
        if (!isPaused) {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById('timer').textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                startTimerCount++;
                beepSound.play();

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

    let displayDuration;
    if (currentSessionType === "Pomodoro") {
        displayDuration = timerDuration;
    } else if (currentSessionType === "Short Break") {
        displayDuration = shortBreakDuration;
    } else {
        displayDuration = longBreakDuration;
    }

    const minutes = Math.floor(displayDuration / 60).toString().padStart(2, '0');
    const seconds = (displayDuration % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;

    if (timerInterval) {
        clearInterval(timerInterval);
        startTimer(displayDuration);
    } else {
    }

    hideSettingsModal();
});


function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            category: item.querySelector('.task-category')?.textContent || ''
        });
    });
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('pomodoroTasks') || '[]');
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    tasks.forEach(task => {
        createTaskElement(task.text, task.category);
    });
}

function createTaskElement(taskText, taskCategory = '') {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.draggable = true;

    const taskContentDiv = document.createElement('div');
    taskContentDiv.className = 'task-content';
    li.appendChild(taskContentDiv);

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = taskText;
    taskContentDiv.appendChild(textSpan);

    if (taskCategory) {
        const categorySpan = document.createElement('span');
        categorySpan.className = 'task-category';
        categorySpan.textContent = taskCategory;
        taskContentDiv.appendChild(categorySpan);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-task-btn';
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showConfirmModal(li);
    });
    li.appendChild(deleteButton);

    li.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        li.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        const nodes = Array.from(li.parentNode.children);
        e.dataTransfer.setData('text/index', nodes.indexOf(li).toString());
    });

    li.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const draggingItem = document.querySelector('.dragging');
        if (draggingItem && draggingItem !== li) {
            const boundingBox = li.getBoundingClientRect();
            const offset = boundingBox.y + (boundingBox.height / 2);

            if (e.clientY > offset) {
                li.classList.remove('drag-over-top');
                li.classList.add('drag-over-bottom');
            } else {
                li.classList.remove('drag-over-bottom');
                li.classList.add('drag-over-top');
            }
        }
    });

    li.addEventListener('dragleave', () => {
        li.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    li.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.remove('drag-over-top', 'drag-over-bottom');

        const draggedIndex = parseInt(e.dataTransfer.getData('text/index'));
        const todoList = document.getElementById('todo-list');
        const draggedItem = todoList.children[draggedIndex];

        if (draggedItem && draggedItem !== li) {
            const dropPosition = (e.clientY < (li.getBoundingClientRect().top + li.offsetHeight / 2)) ? 'before' : 'after';

            if (dropPosition === 'before') {
                todoList.insertBefore(draggedItem, li);
            } else {
                todoList.insertBefore(draggedItem, li.nextSibling);
            }
            saveTasks();
        }
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        document.querySelectorAll('.todo-item').forEach(item => {
            item.classList.remove('drag-over-top', 'drag-over-bottom');
        });
    });

    document.getElementById('todo-list').appendChild(li);
    saveTasks();
}

function addTask() {
    const input = document.getElementById('todo-input');
    const categoryInput = document.getElementById('todo-category-input');
    const taskText = input.value.trim();
    const taskCategory = categoryInput.value.trim();

    if (taskText) {
        createTaskElement(taskText, taskCategory);
        input.value = '';
        categoryInput.value = '';
    }
}

document.getElementById('submit-todo-button').addEventListener('click', addTask);

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

let taskToRemove = null;

function showConfirmModal(taskElement) {
    taskToRemove = taskElement;
    document.getElementById('confirm-modal').style.display = 'block';
}

function hideConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    taskToRemove = null;
}

document.getElementById('confirm-yes').addEventListener('click', () => {
    if (taskToRemove) {
        taskToRemove.remove();
        saveTasks();
    }
    hideConfirmModal();
});

document.getElementById('confirm-no').addEventListener('click', () => {
    hideConfirmModal();
});

updateTimerLabel();
updateTimerBoxColor();
