// DOM Elements
const modeButtons = document.querySelectorAll(".mode-btn")
const startButton = document.getElementById("start-btn")
const pauseButton = document.getElementById("pause-btn")
const resetButton = document.getElementById("reset-btn")
const timeDisplay = document.querySelector(".timer-display .time")
const sessionLabelDisplay = document.getElementById("current-session-label")
const xpMultiplierDisplay = document.getElementById("xp-multiplier")
const sessionCountDisplay = document.getElementById("session-count")
const sessionLabelInput = document.getElementById("session-label-input")
const sessionSubjectSelect = document.getElementById("session-subject")
const timerRingProgress = document.querySelector(".timer-ring-progress")
const notificationSound = document.getElementById("notification-sound")
const todayFocusElement = document.getElementById("today-focus")
const sessionsCompletedElement = document.getElementById("sessions-completed")
const pomodoroStreakElement = document.getElementById("pomodoro-streak")
const sessionHistoryElement = document.getElementById("session-history")
const musicSelection = document.getElementById("music-selection")
const playMusicBtn = document.getElementById("play-music-btn")
const stopMusicBtn = document.getElementById("stop-music-btn")
const volumeSlider = document.getElementById("volume-slider")
const boosterBanner = document.getElementById("booster-banner")
const rainSound = document.getElementById("rain-sound")
const forestSound = document.getElementById("forest-sound")
const lofiSound = document.getElementById("lofi-sound")
const whiteNoiseSound = document.getElementById("white-noise-sound")
const classicalSound = document.getElementById("classical-sound")
const newQuoteBtn = document.getElementById("new-quote-btn")
const quoteTextElement = document.querySelector(".quote-text")
const quoteAuthorElement = document.querySelector(".quote-author")
const energyBarElement = document.getElementById("energy-bar")
const energyValueElement = document.getElementById("energy-value")

// Settings elements
const focusDurationInput = document.getElementById("focus-duration")
const shortBreakDurationInput = document.getElementById("short-break-duration")
const longBreakDurationInput = document.getElementById("long-break-duration")
const longBreakIntervalInput = document.getElementById("long-break-interval")
const autoStartBreaksInput = document.getElementById("auto-start-breaks")
const autoStartFocusInput = document.getElementById("auto-start-focus")
const soundEnabledInput = document.getElementById("sound-enabled")
const saveToStatsInput = document.getElementById("save-to-stats")
const saveSettingsBtn = document.getElementById("save-settings-btn")
const themeToggle = document.querySelector(".theme-toggle")

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

// Music state
let currentMusic = null
let isPlaying = false

// Focus quotes
const focusQuotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Your focus determines your reality.",
    author: "George Lucas",
  },
  {
    text: "The more you eliminate the inefficient use of information, the better it is for productivity.",
    author: "Mohnish Pabrai",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
]

// Calculate the circumference of the timer ring
const timerRingCircle = document.querySelector(".timer-ring-progress")
const radius = timerRingCircle ? timerRingCircle.getAttribute("r") : 0
const circumference = 2 * Math.PI * radius
if (timerRingCircle) {
  timerRingCircle.style.strokeDasharray = `${circumference} ${circumference}`
}

// Initialize audio elements if they don't exist
function initializeAudioElements() {
  if (!notificationSound) {
    const audio = document.createElement("audio")
    audio.id = "notification-sound"
    audio.src = "sounds/notification.mp3"
    document.body.appendChild(audio)
  }
}

// Load data from localStorage
function loadData() {
  console.log("Loading Pomodoro data...")

  // Initialize audio elements
  initializeAudioElements()

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
    console.log("Loaded state:", parsedState)

    // Only load non-running state properties
    timerState.sessionsCompleted = parsedState.sessionsCompleted || 0
    timerState.todayFocusTime = parsedState.todayFocusTime || 0
    timerState.pomodoroStreak = parsedState.pomodoroStreak || 0
    timerState.lastPomodoroDate = parsedState.lastPomodoroDate
    timerState.sessionHistory = parsedState.sessionHistory || []

    // Check if it's a new day
    const today = new Date().toLocaleDateString()
    if (timerState.lastPomodoroDate !== today) {
      // Get the main study tracker data to sync streaks
      const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

      // Reset daily counters but keep streak if yesterday
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toLocaleDateString()

      if (timerState.lastPomodoroDate === yesterdayString) {
        // Keep streak if there was study activity yesterday
        if (studyData && studyData.lastStudyDate === yesterdayString) {
          // Sync with main streak
          timerState.pomodoroStreak = studyData.streak || timerState.pomodoroStreak
        }
      } else if (timerState.lastPomodoroDate) {
        // Reset streak if not yesterday, unless a streak freeze was applied
        const streakFreeze = checkStreakFreeze(yesterday, studyData)
        if (!streakFreeze) {
          timerState.pomodoroStreak = 0
        }
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

  // Check for active XP booster
  checkActiveBooster()

  // Display a random quote
  displayRandomQuote()

  // Load energy data
  loadEnergyData()

  console.log("Current timer state:", timerState)
}

// Add a function to ensure session history is properly loaded and saved
// Add this after the loadData function:

// Ensure session history is properly loaded
function ensureSessionHistoryLoaded() {
  // Check if we have session history in localStorage but not in memory
  const savedState = localStorage.getItem("pomodoroState");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    
    // If we have session history in storage but not in memory, load it
    if (parsedState.sessionHistory && 
        parsedState.sessionHistory.length > 0 && 
        (!timerState.sessionHistory || timerState.sessionHistory.length === 0)) {
      
      timerState.sessionHistory = parsedState.sessionHistory;
      console.log("Loaded session history from storage:", timerState.sessionHistory.length, "items");
      
      // Update UI with loaded data
      updateSessionHistoryUI();
    }
  }
}

// Modify the saveData function to ensure session history is properly saved
// Find the saveData function and replace it with:

// Save data to localStorage with improved session history handling
function saveData() {
  console.log("Saving Pomodoro data...");

  // Save timer settings
  localStorage.setItem("pomodoroSettings", JSON.stringify(timerSettings));

  // Ensure we have a session history array
  if (!timerState.sessionHistory) {
    timerState.sessionHistory = [];
  }

  // Save timer state
  const stateToSave = {
    sessionsCompleted: timerState.sessionsCompleted,
    todayFocusTime: timerState.todayFocusTime,
    pomodoroStreak: timerState.pomodoroStreak,
    lastPomodoroDate: timerState.lastPomodoroDate,
    sessionHistory: timerState.sessionHistory,
  };

  localStorage.setItem("pomodoroState", JSON.stringify(stateToSave));
  console.log("Saved state with", timerState.sessionHistory.length, "history items");
}

// Update settings UI
function updateSettingsUI() {
  if (focusDurationInput) focusDurationInput.value = timerSettings.focusDuration
  if (shortBreakDurationInput) shortBreakDurationInput.value = timerSettings.shortBreakDuration
  if (longBreakDurationInput) longBreakDurationInput.value = timerSettings.longBreakDuration
  if (longBreakIntervalInput) longBreakIntervalInput.value = timerSettings.longBreakInterval
  if (autoStartBreaksInput) autoStartBreaksInput.checked = timerSettings.autoStartBreaks
  if (autoStartFocusInput) autoStartFocusInput.checked = timerSettings.autoStartFocus
  if (soundEnabledInput) soundEnabledInput.checked = timerSettings.soundEnabled
  if (saveToStatsInput) saveToStatsInput.checked = timerSettings.saveToStats
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Add timer animation improvements
// Find the updateTimerDisplay function and enhance it:

// Update timer display with animations
function updateTimerDisplay() {
  if (!timeDisplay) return

  // Animate time change
  const currentTime = timeDisplay.textContent;
  const newTime = formatTime(timerState.timeRemaining);
  
  if (currentTime !== newTime) {
    // Add subtle animation when time changes
    timeDisplay.classList.add('animate-pulse');
    setTimeout(() => {
      timeDisplay.classList.remove('animate-pulse');
    }, 200);
  }
  
  timeDisplay.textContent = newTime;

  // Update progress ring with animation
  if (timerRingProgress) {
    const progress = 1 - timerState.timeRemaining / timerState.totalTime;
    const dashoffset = circumference * progress;
    
    // Set custom property for animation
    timerRingProgress.style.setProperty('--target-offset', dashoffset);
    timerRingProgress.style.strokeDashoffset = dashoffset;

    // Add animation when less than 10 seconds remain
    if (timerState.timeRemaining <= 10 && timerState.mode === "focus") {
      timeDisplay.classList.add("timer-ending");
      timerRingProgress.classList.add("timer-ring-ending");
    } else {
      timeDisplay.classList.remove("timer-ending");
      timerRingProgress.classList.remove("timer-ring-ending");
    }
  }

  // Update document title
  document.title = `${formatTime(timerState.timeRemaining)} - ${timerState.mode.charAt(0).toUpperCase() + timerState.mode.slice(1)} - Study Tracker`;
}

// Update timer for selected mode
function updateTimerForMode(mode) {
  timerState.mode = mode

  // Set time based on mode
  switch (mode) {
    case "focus":
      timerState.timeRemaining = timerSettings.focusDuration * 60
      timerState.totalTime = timerSettings.focusDuration * 60
      if (sessionLabelDisplay) {
        sessionLabelDisplay.textContent =
          sessionLabelInput && sessionLabelInput.value ? sessionLabelInput.value : "Focus Time"
      }
      const timerHeader = document.querySelector(".timer-header")
      if (timerHeader) timerHeader.style.backgroundColor = "var(--focus-color)"
      if (timerRingProgress) timerRingProgress.style.stroke = "var(--focus-color)"
      break
    case "short-break":
      timerState.timeRemaining = timerSettings.shortBreakDuration * 60
      timerState.totalTime = timerSettings.shortBreakDuration * 60
      if (sessionLabelDisplay) sessionLabelDisplay.textContent = "Short Break"
      const shortBreakHeader = document.querySelector(".timer-header")
      if (shortBreakHeader) shortBreakHeader.style.backgroundColor = "var(--short-break-color)"
      if (timerRingProgress) timerRingProgress.style.stroke = "var(--short-break-color)"
      break
    case "long-break":
      timerState.timeRemaining = timerSettings.longBreakDuration * 60
      timerState.totalTime = timerSettings.longBreakDuration * 60
      if (sessionLabelDisplay) sessionLabelDisplay.textContent = "Long Break"
      const longBreakHeader = document.querySelector(".timer-header")
      if (longBreakHeader) longBreakHeader.style.backgroundColor = "var(--long-break-color)"
      if (timerRingProgress) timerRingProgress.style.stroke = "var(--long-break-color)"
      break
  }

  // Update active mode button
  if (modeButtons) {
    modeButtons.forEach((btn) => {
      if (btn.dataset.mode === mode) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  // Reset timer display
  updateTimerDisplay()
}

// Start timer
function startTimer() {
  if (timerState.isRunning) return

  timerState.isRunning = true
  if (startButton) startButton.disabled = true
  if (pauseButton) pauseButton.disabled = false

  timerState.interval = setInterval(() => {
    timerState.timeRemaining--

    if (timerState.timeRemaining <= 0) {
      // Update display to show 0:00 before completing
      timerState.timeRemaining = 0
      updateTimerDisplay()

      // Clear interval and complete timer
      clearInterval(timerState.interval)
      timerState.isRunning = false

      // Small delay to ensure 0:00 is visible before proceeding
      setTimeout(() => {
        timerCompleted()
      }, 300)
    } else {
      updateTimerDisplay()
    }
  }, 1000)
}

// Pause timer
function pauseTimer() {
  if (!timerState.isRunning) return

  clearInterval(timerState.interval)
  timerState.isRunning = false
  if (startButton) startButton.disabled = false
  if (pauseButton) pauseButton.disabled = true
}

// Reset timer
function resetTimer() {
  clearInterval(timerState.interval)
  timerState.isRunning = false
  if (startButton) startButton.disabled = false
  if (pauseButton) pauseButton.disabled = true

  updateTimerForMode(timerState.mode)
}

// Timer completed
function timerCompleted() {
  console.log("Timer completed for mode:", timerState.mode)

  // Play notification sound if enabled
  if (timerSettings.soundEnabled && notificationSound) {
    notificationSound.play().catch((err) => console.error("Error playing notification:", err))
  }

  // Show notification
  showNotification(
    `${timerState.mode.charAt(0).toUpperCase() + timerState.mode.slice(1)} Completed`,
    `Your ${timerState.mode} session has ended.`,
  )

  // Handle session completion
  if (timerState.mode === "focus") {
    // Increment sessions completed
    timerState.sessionsCompleted++
    updateSessionCountUI()

    // Add to today's focus time
    const focusMinutes = Math.floor(timerState.totalTime / 60)
    timerState.todayFocusTime += focusMinutes

    console.log("Updated focus time:", timerState.todayFocusTime)

    // Update streak - sync with dashboard streak system
    const today = new Date().toLocaleDateString()

    // Get the main study tracker data to sync streaks
    const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

    if (timerState.lastPomodoroDate !== today) {
      timerState.pomodoroStreak++
      timerState.lastPomodoroDate = today

      // Sync with main streak system if this is the first pomodoro of the day
      if (studyData && studyData.lastStudyDate !== today) {
        // Update the main streak if needed
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toLocaleDateString()

        if (studyData.lastStudyDate === yesterdayString) {
          studyData.streak++
        } else if (studyData.lastStudyDate !== today) {
          studyData.streak = 1
        }

        studyData.lastStudyDate = today
        localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
      }
    }

    // Add to session history with enhanced data
    const now = new Date()
    const sessionStartTime = new Date(now.getTime() - timerState.totalTime * 1000)
    const sessionData = {
      type: timerState.mode,
      label: timerState.mode === "focus" 
        ? (sessionLabelInput && sessionLabelInput.value ? sessionLabelInput.value : "Focus Session")
        : (timerState.mode === "short-break" ? "Short Break" : "Long Break"),
      subject: sessionSubjectSelect && sessionSubjectSelect.value ? sessionSubjectSelect.value : "",
      duration: timerState.mode === "focus" ? focusMinutes : Math.floor(timerState.totalTime / 60),
      timestamp: now.toISOString(),
      startTime: sessionStartTime.toISOString(),
      endTime: now.toISOString(),
      formattedStartTime: formatTimeOfDay(sessionStartTime),
      formattedEndTime: formatTimeOfDay(now),
    }
    timerState.sessionHistory.unshift(sessionData)
    
    // Log session data to ensure it's being tracked
    console.log("Session completed:", sessionData)

    // Save to study stats if enabled
    if (timerSettings.saveToStats) {
      saveToStudyStats(sessionData)
    }

    // Update UI
    updateStatsUI()
    updateSessionHistoryUI()

    // Determine next mode
    if (timerState.sessionsCompleted % timerSettings.longBreakInterval === 0) {
      // Time for a long break
      updateTimerForMode("long-break")
    } else {
      // Time for a short break
      updateTimerForMode("short-break")
    }

    // Auto-start break if enabled
    if (timerSettings.autoStartBreaks) {
      startTimer()
    }
  } else {
    // Break completed, switch back to focus mode
    updateTimerForMode("focus")

    // Auto-start focus if enabled
    if (timerSettings.autoStartFocus) {
      startTimer()
    }
  }

  // Save data
  saveData()
}

// Add this helper function to format time of day (HH:MM AM/PM)
function formatTimeOfDay(date) {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`
}

// Update session count UI
function updateSessionCountUI() {
  if (sessionCountDisplay) {
    sessionCountDisplay.textContent = timerState.sessionsCompleted.toString()
    console.log("Updated session count display:", timerState.sessionsCompleted)
  }
}

// Update stats UI
function updateStatsUI() {
  console.log("Updating stats UI with:", {
    focusTime: timerState.todayFocusTime,
    sessions: timerState.sessionsCompleted,
    streak: timerState.pomodoroStreak,
  })

  if (todayFocusElement) {
    todayFocusElement.textContent = `${timerState.todayFocusTime} min`
    console.log("Updated focus time element:", todayFocusElement.textContent)
  }

  if (sessionsCompletedElement) {
    sessionsCompletedElement.textContent = `${timerState.sessionsCompleted}`
    console.log("Updated sessions element:", sessionsCompletedElement.textContent)
  }

  if (pomodoroStreakElement) {
    pomodoroStreakElement.textContent = `${timerState.pomodoroStreak}`
    console.log("Updated streak element:", pomodoroStreakElement.textContent)
  }
}

// Update session history UI with enhanced information
function updateSessionHistoryUI() {
  if (!sessionHistoryElement) return

  if (timerState.sessionHistory.length === 0) {
    sessionHistoryElement.innerHTML = `<p class="empty-message">No sessions completed today. Start your first Pomodoro!</p>`
    return
  }

  let historyHTML = ""
  
  // Create session history items with animation classes
  timerState.sessionHistory.forEach((session, index) => {
    const animationDelay = index * 0.1; // Stagger animation
    historyHTML += `
      <div class="history-item ${session.type} animate-fade-in" style="animation-delay: ${animationDelay}s">
        <div class="history-item-details">
          <div class="history-item-label">${session.label}</div>
          ${session.subject ? `<div class="history-item-subject">${session.subject}</div>` : ""}
          ${
            session.formattedStartTime
              ? `<div class="history-item-time-range"><i class="fas fa-clock"></i> ${session.formattedStartTime} - ${session.formattedEndTime}</div>`
              : ""
          }
        </div>
        <div class="history-item-time">${session.duration} min</div>
      </div>
    `
  })

  // Calculate summary statistics
  const totalMinutes = timerState.sessionHistory.reduce((total, session) => total + session.duration, 0)
  const totalSessions = timerState.sessionHistory.length
  const focusSessions = timerState.sessionHistory.filter((session) => session.type === "focus").length
  const shortBreakSessions = timerState.sessionHistory.filter((session) => session.type === "short-break").length
  const longBreakSessions = timerState.sessionHistory.filter((session) => session.type === "long-break").length

  // Create summary section with animation
  const summaryHTML = `
    <div class="history-summary animate-slide-down">
      <div class="summary-item">
        <div class="summary-value counter-animation" data-target="${totalMinutes}">0</div>
        <div class="summary-label">Total Minutes</div>
      </div>
      <div class="summary-item">
        <div class="summary-value counter-animation" data-target="${focusSessions}">0</div>
        <div class="summary-label">Focus Sessions</div>
      </div>
      <div class="summary-item">
        <div class="summary-value counter-animation" data-target="${shortBreakSessions + longBreakSessions}">0</div>
        <div class="summary-label">Break Sessions</div>
      </div>
    </div>
  `

  sessionHistoryElement.innerHTML = summaryHTML + historyHTML
  
  // Animate counters after rendering
  animateCounters();
  
  console.log("Updated session history with", timerState.sessionHistory.length, "items")
}

// Add this new function for counter animations
function animateCounters() {
  const counters = document.querySelectorAll('.counter-animation');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const currentValue = Math.floor(startValue + progress * (target - startValue));
        counter.textContent = currentValue;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
}

// Save to study stats
function saveToStudyStats(sessionData) {
  // Get existing study data from localStorage
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData")) || {
    sessions: [],
    totalTime: 0,
    subjects: {},
    streak: 0,
    lastStudyDate: null,
    xp: 0,
    level: 1,
  }

  // Check for active XP booster
  const booster = checkActiveBooster()
  let xpMultiplier = 1

  if (booster) {
    xpMultiplier = booster.multiplier
  }

  // Check energy level
  const energyData = JSON.parse(localStorage.getItem("energyData")) || {
    energy: 100,
    lastActive: new Date().toISOString(),
  }

  // Calculate XP based on session duration with multiplier
  let xpGained = 0
  if (energyData.energy > 0) {
    xpGained = Math.round(sessionData.duration * 2 * xpMultiplier)
  } else {
    showNotification("No Energy Left", "You're out of energy! Take a break to regenerate energy and earn XP again.")
  }

  // Drain energy based on session duration
  let energyDrain = 0
  if (sessionData.duration < 25) {
    energyDrain = 5
  } else if (sessionData.duration < 50) {
    energyDrain = 15
  } else if (sessionData.duration < 90) {
    energyDrain = 25
  } else {
    energyDrain = 40
  }

  energyData.energy = Math.max(0, energyData.energy - energyDrain)
  energyData.lastActive = new Date().toISOString()
  localStorage.setItem("energyData", JSON.stringify(energyData))
  updateEnergyUI(energyData.energy)

  // Add session to study data
  const sessionInfo = {
    date: new Date().toISOString(),
    duration: sessionData.duration,
    subject: sessionData.subject || "General",
    label: sessionData.label,
    xp: xpGained,
  }

  studyData.sessions.push(sessionInfo)
  studyData.totalTime += sessionData.duration

  // Update subject data
  if (!studyData.subjects[sessionInfo.subject]) {
    studyData.subjects[sessionInfo.subject] = {
      totalTime: 0,
      sessions: 0,
    }
  }
  studyData.subjects[sessionInfo.subject].totalTime += sessionData.duration
  studyData.subjects[sessionInfo.subject].sessions++

  // Update streak
  const today = new Date().toLocaleDateString()
  if (studyData.lastStudyDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toLocaleDateString()

    if (studyData.lastStudyDate === yesterdayString) {
      studyData.streak++
    } else if (studyData.lastStudyDate && studyData.lastStudyDate !== today) {
      studyData.streak = 1
    } else if (!studyData.lastStudyDate) {
      studyData.streak = 1
    }

    studyData.lastStudyDate = today
  }

  // Add XP and check for level up
  studyData.xp += xpGained
  const xpForNextLevel = 100 * Math.pow(1.5, studyData.level - 1)
  if (studyData.xp >= xpForNextLevel) {
    studyData.level++
    studyData.xp -= xpForNextLevel
    showNotification("Level Up!", `Congratulations! You've reached level ${studyData.level}!`)

    // Check for achievements
    checkLevelAchievements(studyData.level)
  }

  // Save updated study data
  localStorage.setItem("studyTrackerData", JSON.stringify(studyData))

  // Show XP notification if XP was gained
  if (xpGained > 0) {
    showNotification(
      "XP Gained",
      `You earned ${xpGained} XP from your focus session!${booster ? ` (${booster.multiplier}x Booster Applied)` : ""}`,
    )
  }
}

// Check for active XP booster
function checkActiveBooster() {
  const boosters = JSON.parse(localStorage.getItem("activeXPBoosters")) || []
  const now = new Date().getTime()

  // Filter out expired boosters
  const activeBoosters = boosters.filter((booster) => {
    return new Date(booster.expiresAt).getTime() > now
  })

  // Save filtered boosters back to localStorage
  localStorage.setItem("activeXPBoosters", JSON.stringify(activeBoosters))

  // If no active boosters, hide banner and return null
  if (activeBoosters.length === 0) {
    if (boosterBanner) boosterBanner.style.display = "none"
    if (xpMultiplierDisplay) xpMultiplierDisplay.textContent = ""
    return null
  }

  // Get the highest multiplier booster
  const highestBooster = activeBoosters.reduce((prev, current) => {
    return prev.multiplier > current.multiplier ? prev : current
  })

  // Calculate time remaining
  const timeRemaining = new Date(highestBooster.expiresAt).getTime() - now
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

  // Update booster banner
  if (boosterBanner) {
    boosterBanner.innerHTML = `
      <div class="booster-info">
        <div class="booster-icon"><i class="fas fa-bolt"></i></div>
        <div>
          <div class="booster-name">${highestBooster.name}</div>
          <div class="booster-timer">Expires in ${hoursRemaining}h ${minutesRemaining}m</div>
        </div>
      </div>
      <div class="booster-multiplier">${highestBooster.multiplier}x XP</div>
    `
    boosterBanner.style.display = "flex"
  }

  // Update XP multiplier display on timer
  if (xpMultiplierDisplay) {
    xpMultiplierDisplay.textContent = `${highestBooster.multiplier}x XP`
  }

  return highestBooster
}

// Check for level achievements
function checkLevelAchievements(level) {
  if (level >= 5) {
    unlockAchievement("level_5", "Dedicated Learner", "Reach level 5")
  }
  if (level >= 10) {
    unlockAchievement("level_10", "Knowledge Seeker", "Reach level 10")
  }
  if (level >= 25) {
    unlockAchievement("level_25", "Master Scholar", "Reach level 25")
  }
  if (level >= 50) {
    unlockAchievement("level_50", "Wisdom Keeper", "Reach level 50")
  }
}

// Unlock achievement
function unlockAchievement(id, name, description) {
  const achievements = JSON.parse(localStorage.getItem("achievements")) || {}

  if (!achievements[id]) {
    achievements[id] = {
      name,
      description,
      unlocked: true,
      date: new Date().toISOString(),
    }

    localStorage.setItem("achievements", JSON.stringify(achievements))

    showNotification("Achievement Unlocked!", `${name}: ${description}`)
  }
}

// Enhance the showNotification function with better animations
// Replace the showNotification function with:

// Show notification with enhanced animations
function showNotification(title, message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "notification";
    document.body.appendChild(notification);
  }

  // Set notification content
  notification.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
  `;

  // Show notification with animation
  setTimeout(() => {
    notification.classList.add("show");
    notification.classList.add("animate-slide-down");
  }, 100);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("animate-fade-in"); // Fade out animation
    
    // Remove notification from DOM after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Display random quote
function displayRandomQuote() {
  if (!quoteTextElement || !quoteAuthorElement) return

  const randomIndex = Math.floor(Math.random() * focusQuotes.length)
  const quote = focusQuotes[randomIndex]

  quoteTextElement.textContent = `"${quote.text}"`
  quoteAuthorElement.textContent = `— ${quote.author}`
}

// Handle music selection
function handleMusicSelection() {
  if (!musicSelection || !playMusicBtn || !stopMusicBtn) return

  const selection = musicSelection.value

  // Stop current music if playing
  if (isPlaying) {
    stopMusic()
  }

  // Enable/disable buttons based on selection
  if (selection) {
    playMusicBtn.disabled = false
  } else {
    playMusicBtn.disabled = true
    stopMusicBtn.disabled = true
  }
}

// Play selected music
function playMusic() {
  if (!musicSelection || !playMusicBtn || !stopMusicBtn) return

  const selection = musicSelection.value
  if (!selection) return

  // Stop current music if playing
  if (isPlaying) {
    stopMusic()
  }

  // Set current music based on selection
  switch (selection) {
    case "rain":
      currentMusic = rainSound
      break
    case "forest":
      currentMusic = forestSound
      break
    case "lofi":
      currentMusic = lofiSound
      break
    case "white-noise":
      currentMusic = whiteNoiseSound
      break
    case "classical":
      currentMusic = classicalSound
      break
  }

  // Set volume and play
  if (currentMusic && volumeSlider) {
    currentMusic.volume = volumeSlider.value / 100
    currentMusic.play().catch((err) => console.error("Error playing music:", err))
    isPlaying = true
    playMusicBtn.disabled = true
    stopMusicBtn.disabled = false
  }
}

// Stop music
function stopMusic() {
  if (!playMusicBtn || !stopMusicBtn) return

  if (currentMusic && isPlaying) {
    currentMusic.pause()
    if (typeof currentMusic.currentTime !== "undefined") {
      currentMusic.currentTime = 0
    }
    isPlaying = false
    playMusicBtn.disabled = false
    stopMusicBtn.disabled = true
  }
}

// Handle volume change
function handleVolumeChange() {
  if (currentMusic && volumeSlider) {
    currentMusic.volume = volumeSlider.value / 100
  }
}

// Load energy data
function loadEnergyData() {
  let energyData = JSON.parse(localStorage.getItem("energyData"))

  if (!energyData) {
    // Initialize energy data if it doesn't exist
    energyData = {
      energy: 100,
      lastActive: new Date().toISOString(),
    }
    localStorage.setItem("energyData", JSON.stringify(energyData))
  } else {
    // Calculate energy regeneration
    const now = new Date()
    const lastActive = new Date(energyData.lastActive)
    const hoursPassed = (now - lastActive) / (1000 * 60 * 60)

    if (hoursPassed > 0) {
      // Regenerate energy (20 EP per hour)
      const regeneratedEnergy = Math.floor(hoursPassed * 20)
      energyData.energy = Math.min(100, energyData.energy + regeneratedEnergy)
      energyData.lastActive = now.toISOString()

      // Save updated energy data
      localStorage.setItem("energyData", JSON.stringify(energyData))
    }
  }

  // Update energy UI
  updateEnergyUI(energyData.energy)
}

// Update energy UI
function updateEnergyUI(energy) {
  if (!energyBarElement || !energyValueElement) return

  // Update energy bar width
  energyBarElement.style.width = `${energy}%`

  // Update energy value text
  energyValueElement.textContent = `${energy} EP`

  // Update energy bar color based on level
  if (energy > 60) {
    energyBarElement.className = "energy-bar high"
  } else if (energy > 20) {
    energyBarElement.className = "energy-bar medium"
  } else {
    energyBarElement.className = "energy-bar low"
  }

  // Show low energy warning
  if (energy <= 20) {
    showNotification("Low Energy", "You're running low on energy. Try taking a break!")
  }
}

// Add a function to check if a streak freeze was applied in the main system
function checkStreakFreeze(date, studyData) {
  if (!studyData) return false

  // Check if the streak in the main system was maintained despite no activity
  const dateString = date.toLocaleDateString()
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}")

  if (profileData && profileData.streakFreezeHistory) {
    return profileData.streakFreezeHistory.some((freeze) => new Date(freeze.date).toLocaleDateString() === dateString)
  }

  return false
}

// Add a function to export session history
function exportSessionHistory() {
  if (!timerState.sessionHistory || timerState.sessionHistory.length === 0) {
    showNotification("No Data", "There is no session history to export.")
    return
  }

  // Create a formatted string of the session history
  let exportData = "Date,Type,Label,Subject,Duration,Start Time,End Time\n"

  timerState.sessionHistory.forEach((session) => {
    const startDate = new Date(session.startTime || session.timestamp)
    const endDate = new Date(session.endTime || session.timestamp)
    const dateStr = startDate.toLocaleDateString()

    exportData += `${dateStr},${session.type},"${session.label}","${session.subject || ""}",${session.duration},${session.formattedStartTime || ""},${session.formattedEndTime || ""}\n`
  })

  // Create a download link
  const blob = new Blob([exportData], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `pomodoro-history-${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showNotification("Export Complete", "Your session history has been exported.")
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing Pomodoro timer...");

  // Load data
  loadData();
  
  // Ensure session history is loaded
  ensureSessionHistoryLoaded();

  // Mode buttons
  if (modeButtons) {
    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Only allow mode switching if timer is not running
        if (!timerState.isRunning) {
          // Remove active class from all buttons
          modeButtons.forEach((btn) => btn.classList.remove("active"))

          // Add active class to clicked button
          button.classList.add("active")

          // Update timer for selected mode
          updateTimerForMode(button.dataset.mode)
        } else {
          // Show notification that timer must be stopped first
          showNotification("Timer Running", "Please pause or reset the timer before changing modes.")
        }
      })
    })
  }

  // Timer control buttons
  if (startButton) startButton.addEventListener("click", startTimer)
  if (pauseButton) pauseButton.addEventListener("click", pauseTimer)
  if (resetButton) resetButton.addEventListener("click", resetTimer)

  // Settings inputs - immediate effect on change
  if (focusDurationInput) {
    focusDurationInput.addEventListener("change", () => {
      timerSettings.focusDuration = Number.parseInt(focusDurationInput.value) || 25
      if (timerState.mode === "focus" && !timerState.isRunning) {
        updateTimerForMode("focus")
      }
    })
  }

  if (shortBreakDurationInput) {
    shortBreakDurationInput.addEventListener("change", () => {
      timerSettings.shortBreakDuration = Number.parseInt(shortBreakDurationInput.value) || 5
      if (timerState.mode === "short-break" && !timerState.isRunning) {
        updateTimerForMode("short-break")
      }
    })
  }

  if (longBreakDurationInput) {
    longBreakDurationInput.addEventListener("change", () => {
      timerSettings.longBreakDuration = Number.parseInt(longBreakDurationInput.value) || 15
      if (timerState.mode === "long-break" && !timerState.isRunning) {
        updateTimerForMode("long-break")
      }
    })
  }

  if (longBreakIntervalInput) {
    longBreakIntervalInput.addEventListener("change", () => {
      timerSettings.longBreakInterval = Number.parseInt(longBreakIntervalInput.value) || 4
    })
  }

  // Toggle settings - immediate effect
  if (autoStartBreaksInput) {
    autoStartBreaksInput.addEventListener("change", () => {
      timerSettings.autoStartBreaks = autoStartBreaksInput.checked
    })
  }

  if (autoStartFocusInput) {
    autoStartFocusInput.addEventListener("change", () => {
      timerSettings.autoStartFocus = autoStartFocusInput.checked
    })
  }

  if (soundEnabledInput) {
    soundEnabledInput.addEventListener("change", () => {
      timerSettings.soundEnabled = soundEnabledInput.checked
    })
  }

  if (saveToStatsInput) {
    saveToStatsInput.addEventListener("change", () => {
      timerSettings.saveToStats = saveToStatsInput.checked
    })
  }

  // Save Settings button
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      // Validate inputs
      const focusDuration = Number.parseInt(focusDurationInput ? focusDurationInput.value : "25")
      const shortBreakDuration = Number.parseInt(shortBreakDurationInput ? shortBreakDurationInput.value : "5")
      const longBreakDuration = Number.parseInt(longBreakDurationInput ? longBreakDurationInput.value : "15")
      const longBreakInterval = Number.parseInt(longBreakIntervalInput ? longBreakIntervalInput.value : "4")

      // Apply validated values
      timerSettings.focusDuration = focusDuration > 0 ? focusDuration : 25
      timerSettings.shortBreakDuration = shortBreakDuration > 0 ? shortBreakDuration : 5
      timerSettings.longBreakDuration = longBreakDuration > 0 ? longBreakDuration : 15
      timerSettings.longBreakInterval = longBreakInterval > 0 ? longBreakInterval : 4

      // Update UI with validated values
      if (focusDurationInput) focusDurationInput.value = timerSettings.focusDuration
      if (shortBreakDurationInput) shortBreakDurationInput.value = timerSettings.shortBreakDuration
      if (longBreakDurationInput) longBreakDurationInput.value = timerSettings.longBreakDuration
      if (longBreakIntervalInput) longBreakIntervalInput.value = timerSettings.longBreakInterval

      // Save settings
      saveData()

      // Update timer if not running
      if (!timerState.isRunning) {
        updateTimerForMode(timerState.mode)
      }

      // Show confirmation
      showNotification("Settings Saved", "Your timer settings have been saved successfully.")
    })
  }

  // Music controls
  if (musicSelection) musicSelection.addEventListener("change", handleMusicSelection)
  if (playMusicBtn) playMusicBtn.addEventListener("click", playMusic)
  if (stopMusicBtn) stopMusicBtn.addEventListener("click", stopMusic)
  if (volumeSlider) volumeSlider.addEventListener("input", handleVolumeChange)

  // New quote button
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", displayRandomQuote)

  // Add this to your event listeners section
  if (document.getElementById("export-history-btn")) {
    document.getElementById("export-history-btn").addEventListener("click", exportSessionHistory)
  }

  // Initialize timer display
  updateTimerDisplay()

  // Force update stats UI again after a short delay to ensure DOM is ready
  setTimeout(() => {
    updateStatsUI()
    updateSessionHistoryUI()
  }, 500)
})

// Export functions for testing
window.pomodoroFunctions = {
  startTimer,
  pauseTimer,
  resetTimer,
  updateStatsUI,
  timerState,
}
