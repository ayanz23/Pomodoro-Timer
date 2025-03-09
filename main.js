let timerDuration = 25 * 60; // 25 minutes
let shortBreakDuration = 5 * 60; // 5 minutes
let longBreakDuration = 15 * 60; // 15 minutes
let timerInterval; // Variable to hold the timer interval
let isPaused = false; // Flag to check if the timer is paused
let sessionCounter = 1; // Counter for the number of sessions completed
let currentSessionType = "Pomodoro"; // Current session type
let startTimerCount = 0; // Count of how many times the timer has started

function updateTimerLabel() {
    // Update the timer label to reflect the current session type
    document.getElementById('timer-label').textContent = currentSessionType;
}

function updateTimerBoxColor() {
    // Change the color of the timer box based on the current session type
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
    // Display the settings modal
    document.getElementById('settings-modal').style.display = 'block';
    // Don't reset the timer when settings are opened
    clearInterval(timerInterval); // Just clear the interval to pause the timer
}

function hideSettingsModal() {
    // Hide the settings modal
    document.getElementById('settings-modal').style.display = 'none';
}

function resetTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    isPaused = false; // Reset pause state
    startTimerCount = 0; // Reset start count
    sessionCounter = 1; // Reset session counter
    currentSessionType = "Pomodoro"; // Reset session type
    updateTimerLabel(); // Update the label
    updateTimerBoxColor(); // Update the box color
    document.getElementById('timer').textContent = "25:00"; // Reset timer display
    document.getElementById('pause-button').textContent = 'Pause'; // Reset pause button text
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    updateTimerBoxColor(); // Change the box color to reflect the active timer state
    timerInterval = setInterval(() => {
        if (!isPaused) { // Only update if not paused
            minutes = parseInt(timer / 60, 10); // Calculate minutes
            seconds = parseInt(timer % 60, 10); // Calculate seconds

            // Format minutes and seconds to always show two digits
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            // Update the timer display
            document.getElementById('timer').textContent = minutes + ":" + seconds;

            if (--timer < 0) { // Decrement timer and check if it reached zero
                startTimerCount++; // Increment the start count

                if (startTimerCount % 2 == 0) {
                    sessionCounter++; // Increment session counter every two starts
                }

                clearInterval(timerInterval); // Stop the timer
                // Determine the next session type
                if (currentSessionType === "Pomodoro") {
                    currentSessionType = (sessionCounter % 4 === 0) ? "Long Break" : "Short Break";
                } else {
                    currentSessionType = "Pomodoro"; // Reset to Pomodoro after breaks
                }

                // Update session counter display
                document.getElementById('session-counter').textContent = "Session: " + sessionCounter;
                updateTimerLabel(); // Update the timer label
                updateTimerBoxColor(); // Update the timer box color
                // Start the next timer based on the current session type
                startTimer(currentSessionType === "Pomodoro" ? timerDuration : (currentSessionType === "Short Break" ? shortBreakDuration : longBreakDuration));
            }
        }
    }, 1000); // Update every second
}

// Event listener for the start button
document.getElementById('start-button').addEventListener('click', () => {
    clearInterval(timerInterval); // Clear any existing timer
    isPaused = false; // Reset pause state
    document.getElementById('pause-button').textContent = 'Pause'; // Reset pause button text
    
    // If timer was previously started and paused, start a new timer with current settings
    if (currentSessionType === "Pomodoro") {
        startTimer(timerDuration);
    } else if (currentSessionType === "Short Break") {
        startTimer(shortBreakDuration);
    } else {
        startTimer(longBreakDuration);
    }
});

// Event listener for the pause button
document.getElementById('pause-button').addEventListener('click', () => {
    isPaused = !isPaused; // Toggle pause state
    document.getElementById('pause-button').textContent = isPaused ? 'Resume' : 'Pause'; // Update button text
});

// Event listener for the settings button
document.getElementById('settings-button').addEventListener('click', showSettingsModal);

// Event listener for the done button in the settings modal
document.getElementById('done-button').addEventListener('click', () => {
    // Get user input for timer durations
    const pomodoroMinutes = parseInt(document.getElementById('pomodoro-time-minutes').value) || 0;
    const pomodoroSeconds = parseInt(document.getElementById('pomodoro-time-seconds').value) || 0;
    const shortBreakMinutes = parseInt(document.getElementById('short-break-time-minutes').value) || 0;
    const shortBreakSeconds = parseInt(document.getElementById('short-break-time-seconds').value) || 0;
    const longBreakMinutes = parseInt(document.getElementById('long-break-time-minutes').value) || 0;
    const longBreakSeconds = parseInt(document.getElementById('long-break-time-seconds').value) || 0;

    // Update timer durations based on user input
    timerDuration = (pomodoroMinutes * 60) + pomodoroSeconds;
    shortBreakDuration = (shortBreakMinutes * 60) + shortBreakSeconds;
    longBreakDuration = (longBreakMinutes * 60) + longBreakSeconds;

    // Update the timer display without changing the background color
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

    hideSettingsModal(); // Hide the settings modal
});

// Function to add a new task to the to-do list
function addTask() {
    const input = document.getElementById('todo-input');
    const taskText = input.value.trim();
    if (taskText) {
        const li = document.createElement('li'); // Create a new list item
        li.textContent = taskText; // Set the text of the list item
        li.className = 'todo-item'; // Add a class for styling

        // Add hover effect and delete functionality
        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#555'; // Darken on hover
        });
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = ''; // Reset background
        });
        li.addEventListener('click', () => {
            li.remove(); // Remove task on click
        });

        document.getElementById('todo-list').appendChild(li); // Add the task to the list
        input.value = ''; // Clear the input field
    }
}

// Event listener for the submit button
document.getElementById('submit-todo-button').addEventListener('click', addTask);