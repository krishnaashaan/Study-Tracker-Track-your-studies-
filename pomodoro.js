// DOM Elements
const modeButtons = document.querySelectorAll(".mode-btn")
const startButton = document.getElementById("start-btn")
const pauseButton = document.getElementById("pause-btn")
const resetButton = document.getElementById("reset-btn")
const timeDisplay = document.querySelector(".timer-display .time")
const sessionLabelDisplay = document.getElementById("current-session-label")
const sessionCountDisplay = document.getElementById("session-count")
const sessionLabelInput = document.getElementById("session-label-input")
const sessionSubjectSelect = document.getElementById("session-subject")
const timerRingProgress = document.querySelector(".timer-ring-progress")
const notificationSound = document.getElementById("notification-sound")
const todayFocusElement = document.getElementById("today-focus")
const sessionsCompletedElement = document.getElementById("sessions-completed")
const pomodoroStreakElement = document.getElementById("pomodoro-streak")
const sessionHistoryElement = document.getElementById("session-history")

// Settings elements
const focusDurationInput = document.getElementById("focus-duration")
const shortBreakDurationInput = document.getElementById("short-break-duration")
const longBreakDurationInput = document.getElementById("long-break-duration")
const longBreakIntervalInput = document.getElementById("long-break-interval")
const autoStartBreaksInput = document.getElementById("auto-start-breaks")
const autoStartFocusInput = document.getElementById("auto-start-focus")
const soundEnabledInput = document.getElementById("sound-enabled")
const saveToStatsInput = document.getElementById("save-to-stats")
const saveSettingsButton = document.getElementById("save-settings")

// Timer state
const timerState = {
  mode: "focus", // 'focus', 'short-break', 'long-break'
  timeRemaining: 25 * 60, // in seconds
  totalTime: 25 * 60, // in seconds
  isRunning: false,
  interval: null,
  sessionsCompleted: 0,
  currentSessionLabel: "",
  currentSessionSubject: "",
  todayFocusTime: 0, // in minutes
  pomodoroStreak: 0,
  lastPomodoroDate: null,
  sessionHistory: [],
}

// Settings
let timerSettings = {
  focusDuration: 25, // in minutes
  shortBreakDuration: 5, // in minutes
  longBreakDuration: 15, // in minutes
  longBreakInterval: 4, // sessions
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  saveToStats: true,
}

// Calculate the circumference of the timer ring
const timerRingCircle = document.querySelector(".timer-ring-progress")
const radius = timerRingCircle.getAttribute("r")
const circumference = 2 * Math.PI * radius
timerRingCircle.style.strokeDasharray = `${circumference} ${circumference}`

// Load data from localStorage
function loadData() {
  // Load timer settings
  const savedSettings = localStorage.getItem("pomodoroSettings")
  if (savedSettings) {
    timerSettings = JSON.parse(savedSettings)
    updateSettingsUI()
  }

  // Load timer state
  const savedState = localStorage.getItem("pomodoroState")
  if (savedState) {
    const parsedState = JSON.parse(savedState)

    // Only load non-running state properties
    timerState.sessionsCompleted = parsedState.sessionsCompleted || 0
    timerState.todayFocusTime = parsedState.todayFocusTime || 0
    timerState.pomodoroStreak = parsedState.pomodoroStreak || 0
    timerState.lastPomodoroDate = parsedState.lastPomodoroDate
    timerState.sessionHistory = parsedState.sessionHistory || []

    // Check if it's a new day
    const today = new Date().toLocaleDateString()
    if (timerState.lastPomodoroDate !== today) {
      // Reset daily counters but keep streak if yesterday
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toLocaleDateString()

      if (timerState.lastPomodoroDate === yesterdayString) {
        // Keep streak
      } else if (timerState.lastPomodoroDate) {
        // Reset streak if not yesterday
        timerState.pomodoroStreak = 0
      }

      timerState.lastPomodoroDate = today
      timerState.todayFocusTime = 0
      timerState.sessionHistory = []
    }
  }

  // Update UI with loaded data
  updateStatsUI()
  updateSessionHistoryUI()
  updateSessionCountUI()
}

// Save data to localStorage
function saveData() {
  // Save timer settings
  localStorage.setItem("pomodoroSettings", JSON.stringify(timerSettings))

  // Save timer state
  localStorage.setItem(
    "pomodoroState",
    JSON.stringify({
      sessionsCompleted: timerState.sessionsCompleted,
      todayFocusTime: timerState.todayFocusTime,
      pomodoroStreak: timerState.pomodoroStreak,
      lastPomodoroDate: timerState.lastPomodoroDate,
      sessionHistory: timerState.sessionHistory,
    }),
  )
}

// Update settings UI
function updateSettingsUI() {
  focusDurationInput.value = timerSettings.focusDuration
  shortBreakDurationInput.value = timerSettings.shortBreakDuration
  longBreakDurationInput.value = timerSettings.longBreakDuration
  longBreakIntervalInput.value = timerSettings.longBreakInterval
  autoStartBreaksInput.checked = timerSettings.autoStartBreaks
  autoStartFocusInput.checked = timerSettings.autoStartFocus
  soundEnabledInput.checked = timerSettings.soundEnabled
  saveToStatsInput.checked = timerSettings.saveToStats
}

// Save settings
function saveSettings() {
  timerSettings.focusDuration = Number.parseInt(focusDurationInput.value) || 25
  timerSettings.shortBreakDuration = Number.parseInt(shortBreakDurationInput.value) || 5
  timerSettings.longBreakDuration = Number.parseInt(longBreakDurationInput.value) || 15
  timerSettings.longBreakInterval = Number.parseInt(longBreakIntervalInput.value) || 4
  timerSettings.autoStartBreaks = autoStartBreaksInput.checked
  timerSettings.autoStartFocus = autoStartFocusInput.checked
  timerSettings.soundEnabled = soundEnabledInput.checked
  timerSettings.saveToStats = saveToStatsInput.checked

  saveData()

  // Update current timer if not running
  if (!timerState.isRunning) {
    updateTimerForMode(timerState.mode)
  }

  showNotification("Settings Saved", "Your timer settings have been updated.")
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Update timer display
function updateTimerDisplay() {
  timeDisplay.textContent = formatTime(timerState.timeRemaining)
  
  // Add animation class when less than 10 seconds remain
  if (timerState.timeRemaining <= 10 && timerState.timeRemaining > 0) {
    timeDisplay.classList.add("time-ending");
  } else {
    timeDisplay.classList.remove("time-ending");
  }

  // Update progress ring
  const progress = 1 - timerState.timeRemaining / timerState.totalTime
  const dashoffset = circumference * progress
  timerRingProgress.style.strokeDashoffset = dashoffset

  // Update document title
  document.title = `${formatTime(timerState.timeRemaining)} - ${timerState.mode.charAt(0).toUpperCase() + timerState.mode.slice(1)} - Study Tracker`
}

// Update timer for selected mode
function updateTimerForMode(mode) {
  timerState.mode = mode

  // Set time based on mode
  switch (mode) {
    case "focus":
      timerState.timeRemaining = timerSettings.focusDuration * 60
      timerState.totalTime = timerSettings.focusDuration * 60
      sessionLabelDisplay.textContent = sessionLabelInput.value || "Focus Time"
      document.querySelector(".pomodoro-container").className = "pomodoro-container mode-focus"
      break
    case "short-break":
      timerState.timeRemaining = timerSettings.shortBreakDuration * 60
      timerState.totalTime = timerSettings.shortBreakDuration * 60
      sessionLabelDisplay.textContent = "Short Break"
      document.querySelector(".pomodoro-container").className = "pomodoro-container mode-short-break"
      break
    case "long-break":
      timerState.timeRemaining = timerSettings.longBreakDuration * 60
      timerState.totalTime = timerSettings.longBreakDuration * 60
      sessionLabelDisplay.textContent = "Long Break"
      document.querySelector(".pomodoro-container").className = "pomodoro-container mode-long-break"
      break
  }

  updateTimerDisplay()
}

// Start timer
function startTimer() {
  if (timerState.isRunning) return

  // Save current session label and subject
  timerState.currentSessionLabel = sessionLabelInput.value || "Focus Time"
  timerState.currentSessionSubject = sessionSubjectSelect.value

  timerState.isRunning = true
  startButton.disabled = true
  pauseButton.disabled = false

  timerState.interval = setInterval(() => {
    timerState.timeRemaining--
    updateTimerDisplay()

    if (timerState.timeRemaining <= 0) {
      completeTimer()
    }
  }, 1000)
}

// Pause timer
function pauseTimer() {
  if (!timerState.isRunning) return

  timerState.isRunning = false
  clearInterval(timerState.interval)
  startButton.disabled = false
  pauseButton.disabled = true
}

// Reset timer
function resetTimer() {
  pauseTimer()
  updateTimerForMode(timerState.mode)
}

// Complete timer
function completeTimer() {
  pauseTimer()

  // Play notification sound
  if (timerSettings.soundEnabled) {
    notificationSound.play()
  }

  // Handle session completion
  if (timerState.mode === "focus") {
    // Increment session count
    timerState.sessionsCompleted++

    // Add to today's focus time
    timerState.todayFocusTime += timerSettings.focusDuration

    // Update streak
    const today = new Date().toLocaleDateString()
    if (timerState.lastPomodoroDate !== today) {
      timerState.lastPomodoroDate = today
      timerState.pomodoroStreak++
    }

    // Add to session history
    timerState.sessionHistory.push({
      type: "focus",
      label: timerState.currentSessionLabel,
      subject: timerState.currentSessionSubject,
      duration: timerSettings.focusDuration,
      timestamp: new Date().toISOString(),
    })

    // Save to study stats if enabled
    if (timerSettings.saveToStats) {
      saveToStudyStats()
    }

    // Determine next break type
    const nextMode = timerState.sessionsCompleted % timerSettings.longBreakInterval === 0 ? "long-break" : "short-break"

    // Auto-start break if enabled
    if (timerSettings.autoStartBreaks) {
      // Switch to appropriate break mode
      modeButtons.forEach((btn) => {
        if (btn.dataset.mode === nextMode) {
          btn.click()
        }
      })
      startTimer()
    } else {
      // Just switch the mode without starting
      modeButtons.forEach((btn) => {
        if (btn.dataset.mode === nextMode) {
          btn.click()
        }
      })
    }
  } else {
    // Break completed
    // Auto-start focus if enabled
    if (timerSettings.autoStartFocus) {
      modeButtons.forEach((btn) => {
        if (btn.dataset.mode === "focus") {
          btn.click()
        }
      })
      startTimer()
    } else {
      // Just switch to focus mode without starting
      modeButtons.forEach((btn) => {
        if (btn.dataset.mode === "focus") {
          btn.click()
        }
      })
    }
  }

  // Update UI
  updateStatsUI()
  updateSessionHistoryUI()
  updateSessionCountUI()

  // Save state
  saveData()

  // Show notification
  showNotification(
    `${timerState.mode.charAt(0).toUpperCase() + timerState.mode.slice(1)} Completed!`,
    timerState.mode === "focus" ? `Great job! Time for a break.` : `Break finished. Ready to focus again?`,
  )
}

// Save completed focus session to study stats
function saveToStudyStats() {
  try {
    // Load study tracker data
    const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

    // Add session
    if (!studyData.sessions) {
      studyData.sessions = []
    }

    studyData.sessions.push({
      subject: timerState.currentSessionSubject || "Pomodoro Focus",
      time: timerSettings.focusDuration,
      timestamp: new Date().toISOString(),
      tag: "Pomodoro",
    })

    // Add XP (1 XP per minute)
    if (studyData.xp !== undefined) {
      studyData.xp += timerSettings.focusDuration
    }

    // Save back to localStorage
    localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
  } catch (error) {
    console.error("Error saving to study stats:", error)
  }
}

// Update stats UI
function updateStatsUI() {
  todayFocusElement.textContent = `${timerState.todayFocusTime} min`
  sessionsCompletedElement.textContent = timerState.sessionsCompleted
}

// Update session count UI
function updateSessionCountUI() {
  sessionCountDisplay.textContent = timerState.sessionsCompleted.toString()
}

// Update session history UI
function updateSessionHistoryUI() {
  sessionHistoryElement.innerHTML = ""

  if (timerState.sessionHistory.length === 0) {
    sessionHistoryElement.innerHTML =
      '<p class="empty-message">No sessions completed today. Start your first Pomodoro!</p>'
    return
  }

  // Sort by most recent first
  const sortedHistory = [...timerState.sessionHistory].reverse()

  sortedHistory.forEach((session) => {
    const historyItem = document.createElement("div")
    historyItem.className = `history-item ${session.type}`

    const timestamp = new Date(session.timestamp)
    const timeString = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    historyItem.innerHTML = `
          <div class="history-item-details">
              <div class="history-item-label">${session.label}</div>
              ${session.subject ? `<div class="history-item-subject">${session.subject}</div>` : ""}
          </div>
          <div class="history-item-time">${timeString} (${session.duration} min)</div>
      `

    sessionHistoryElement.appendChild(historyItem)
  })
}

// Show notification
function showNotification(title, message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"

  const notificationTitle = document.createElement("h3")
  notificationTitle.textContent = title

  const notificationMessage = document.createElement("p")
  notificationMessage.textContent = message

  notification.appendChild(notificationTitle)
  notification.appendChild(notificationMessage)

  // Add to document
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
}

// Event Listeners
modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Only allow mode change if timer is not running
    if (timerState.isRunning) {
      showNotification("Timer Running", "Please pause the timer before changing modes.")
      return
    }

    modeButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    updateTimerForMode(button.dataset.mode)
  })
})

startButton.addEventListener("click", startTimer)
pauseButton.addEventListener("click", pauseTimer)
resetButton.addEventListener("click", resetTimer)
saveSettingsButton.addEventListener("click", saveSettings)

// Fix toggle switches to work when clicking the button
document.querySelectorAll('.toggle-switch').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    // Only toggle if the click wasn't directly on the checkbox
    // (since the checkbox already handles its own state)
    if (e.target.type !== 'checkbox') {
      const checkbox = this.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      
      // Trigger change event to ensure event handlers run
      const event = new Event('change');
      checkbox.dispatchEvent(event);
    }
  });
});

// Add event listeners for toggle switches
autoStartBreaksInput.addEventListener("change", function () {
  timerSettings.autoStartBreaks = this.checked
  saveData()
})

autoStartFocusInput.addEventListener("change", function () {
  timerSettings.autoStartFocus = this.checked
  saveData()
})

soundEnabledInput.addEventListener("change", function () {
  timerSettings.soundEnabled = this.checked
  saveData()
})

saveToStatsInput.addEventListener("change", function () {
  timerSettings.saveToStats = this.checked
  saveData()
})

document.querySelector(".theme-toggle").addEventListener("click", toggleDarkMode)

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
  }

  // Load data
  loadData()

  // Initialize timer
  updateTimerForMode("focus")

  // Add Pomodoro link to other pages
  if (window.location.pathname !== "/pomodoro.html") {
    const nav = document.querySelector("nav ul")
    if (nav && !document.querySelector('nav ul li a[href="pomodoro.html"]')) {
      const pomodoroItem = document.createElement("li")
      pomodoroItem.innerHTML = '<a href="pomodoro.html"><i class="fas fa-clock"></i> Pomodoro</a>'
      nav.appendChild(pomodoroItem)
    }
  }
})

// Add this to the end of app.js, flashcards.js, and statistics.js to add the Pomodoro link
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav ul")
  if (nav && !document.querySelector('nav ul li a[href="pomodoro.html"]')) {
    const pomodoroItem = document.createElement("li")
    pomodoroItem.innerHTML = '<a href="pomodoro.html"><i class="fas fa-clock"></i> Pomodoro</a>'
    nav.appendChild(pomodoroItem)
  }
})

// Load theme if saved
const savedThemeId = localStorage.getItem("themeId")
if (savedThemeId) {
  const storeData = JSON.parse(localStorage.getItem("storeData") || '{"inventory":[]}')
  const theme = storeData.inventory.find((item) => item.id === savedThemeId)
  if (theme) {
    applyThemeToUI(savedThemeId)
  }
}

// Apply theme to UI
function applyThemeToUI(themeId) {
  // Remove existing theme classes
  document.body.classList.remove(
    "theme-dark-forest", 
    "theme-ocean-blue", 
    "theme-sunset", 
    "theme-purple-haze", 
    "theme-mint-fresh", 
    "theme-dark-mode-pro", 
    "theme-coral-reef", 
    "theme-cherry-blossom", 
    "theme-cyber-punk"
  )

  // Add new theme class
  if (themeId === "theme_dark_forest") {
    document.body.classList.add("theme-dark-forest")
    document.documentElement.style.setProperty("--primary-color", "#2ecc71")
    document.documentElement.style.setProperty("--primary-dark", "#27ae60")
    document.documentElement.style.setProperty("--primary-light", "#a3e4c1")
  } else if (themeId === "theme_ocean_blue") {
    document.body.classList.add("theme-ocean-blue")
    document.documentElement.style.setProperty("--primary-color", "#3498db")
    document.documentElement.style.setProperty("--primary-dark", "#2980b9")
    document.documentElement.style.setProperty("--primary-light", "#a9cce3")
  } else if (themeId === "theme_sunset") {
    document.body.classList.add("theme-sunset")
    document.documentElement.style.setProperty("--primary-color", "#e67e22")
    document.documentElement.style.setProperty("--primary-dark", "#d35400")
    document.documentElement.style.setProperty("--primary-light", "#f5cba7")
  } else if (themeId === "theme_purple_haze") {
    document.body.classList.add("theme-purple-haze")
    document.documentElement.style.setProperty("--primary-color", "#9b59b6")
    document.documentElement.style.setProperty("--primary-dark", "#8e44ad")
    document.documentElement.style.setProperty("--primary-light", "#d7bde2")
  } else if (themeId === "theme_mint_fresh") {
    document.body.classList.add("theme-mint-fresh")
    document.documentElement.style.setProperty("--primary-color", "#1abc9c")
    document.documentElement.style.setProperty("--primary-dark", "#16a085")
    document.documentElement.style.setProperty("--primary-light", "#a3e4d7")
  } else if (themeId === "theme_dark_mode_pro") {
    document.body.classList.add("theme-dark-mode-pro")
    document.documentElement.style.setProperty("--primary-color", "#6c5ce7")
    document.documentElement.style.setProperty("--primary-dark", "#5641e5")
    document.documentElement.style.setProperty("--primary-light", "#a29bfe")
  } else if (themeId === "theme_coral_reef") {
    document.body.classList.add("theme-coral-reef")
    document.documentElement.style.setProperty("--primary-color", "#ff7675")
    document.documentElement.style.setProperty("--primary-dark", "#e84393")
    document.documentElement.style.setProperty("--primary-light", "#fab1a0")
  } else if (themeId === "theme_cherry_blossom") {
    document.body.classList.add("theme-cherry-blossom")
    document.documentElement.style.setProperty("--primary-color", "#fd79a8")
    document.documentElement.style.setProperty("--primary-dark", "#e84393")
    document.documentElement.style.setProperty("--primary-light", "#ffeaa7")
  } else if (themeId === "theme_cyber_punk") {
    document.body.classList.add("theme-cyber-punk")
    document.documentElement.style.setProperty("--primary-color", "#00f5d4")
    document.documentElement.style.setProperty("--primary-dark", "#00b8a9")
    document.documentElement.style.setProperty("--primary-light", "#f706cf")
  }

  // Save theme preference
  localStorage.setItem("themeId", themeId)
}
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav ul")
  if (nav && !document.querySelector('nav ul li a[href="pomodoro.html"]')) {
    const pomodoroItem = document.createElement("li")
    pomodoroItem.innerHTML = '<a href="pomodoro.html"><i class="fas fa-clock"></i> Pomodoro</a>'
    nav.appendChild(pomodoroItem)
  }
})

