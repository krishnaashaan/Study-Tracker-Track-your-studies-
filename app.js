// Initialize data structure
let studyData = {
  currentDay: new Date().toLocaleDateString(),
  sessions: [],
  dailyTotals: {},
  streak: 0,
  lastStudyDate: null,
  xp: 0,
  achievements: {},
  timeTracking: {
    earlyBird: false,
    nightOwl: false,
  },
  dailyGoals: {
    date: null,
    goals: [],
  }
}

// DOM Elements
const studyForm = document.getElementById("study-form")
const subjectInput = document.getElementById("subject")
const timeInput = document.getElementById("time")
const todayTotalElement = document.getElementById("today-total")
const streakCountElement = document.getElementById("streak-count")
const xpCountElement = document.getElementById("xp-count")
const sessionsListElement = document.getElementById("sessions-list")
const resetDataButton = document.getElementById("reset-data")
const themeToggle = document.querySelector(".theme-toggle")
const dailyGoalsContainer = document.getElementById("daily-goals-container")

// Chart
let studyChart

// Define possible daily goals
const possibleDailyGoals = [
  {
    id: "study_15_min",
    description: "Study for 15 minutes",
    target: 15,
    xp: 15,
    icon: "fa-solid fa-hourglass-start",
    progress: (data) => Math.min(calculateTodayTotal(), 15),
    isComplete: (data) => calculateTodayTotal() >= 15
  },
  {
    id: "study_30_min",
    description: "Study for 30 minutes",
    target: 30,
    xp: 30,
    icon: "fa-solid fa-hourglass-half",
    progress: (data) => Math.min(calculateTodayTotal(), 30),
    isComplete: (data) => calculateTodayTotal() >= 30
  },
  {
    id: "study_45_min",
    description: "Study for 45 minutes",
    target: 45,
    xp: 45,
    icon: "fa-solid fa-hourglass-end",
    progress: (data) => Math.min(calculateTodayTotal(), 45),
    isComplete: (data) => calculateTodayTotal() >= 45
  },
  {
    id: "study_60_min",
    description: "Study for 60 minutes",
    target: 60,
    xp: 60,
    icon: "fa-solid fa-hourglass",
    progress: (data) => Math.min(calculateTodayTotal(), 60),
    isComplete: (data) => calculateTodayTotal() >= 60
  },
  {
    id: "complete_2_sessions",
    description: "Complete 2 study sessions",
    target: 2,
    xp: 20,
    icon: "fa-solid fa-list-check",
    progress: (data) => Math.min(data.sessions.length, 2),
    isComplete: (data) => data.sessions.length >= 2
  },
  {
    id: "complete_3_sessions",
    description: "Complete 3 study sessions",
    target: 3,
    xp: 30,
    icon: "fa-solid fa-list-ol",
    progress: (data) => Math.min(data.sessions.length, 3),
    isComplete: (data) => data.sessions.length >= 3
  },
  {
    id: "study_math",
    description: "Study Mathematics",
    target: 1,
    xp: 25,
    icon: "fa-solid fa-calculator",
    progress: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("math") || 
      session.subject.toLowerCase().includes("maths") || 
      session.subject.toLowerCase().includes("mathematics")) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("math") || 
      session.subject.toLowerCase().includes("maths") || 
      session.subject.toLowerCase().includes("mathematics"))
  },
  {
    id: "study_science",
    description: "Study Science",
    target: 1,
    xp: 25,
    icon: "fa-solid fa-flask",
    progress: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("science") || 
      session.subject.toLowerCase().includes("physics") || 
      session.subject.toLowerCase().includes("chemistry") || 
      session.subject.toLowerCase().includes("biology")) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("science") || 
      session.subject.toLowerCase().includes("physics") || 
      session.subject.toLowerCase().includes("chemistry") || 
      session.subject.toLowerCase().includes("biology"))
  },
  {
    id: "study_language",
    description: "Study a Language",
    target: 1,
    xp: 25,
    icon: "fa-solid fa-language",
    progress: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("english") || 
      session.subject.toLowerCase().includes("spanish") || 
      session.subject.toLowerCase().includes("french") || 
      session.subject.toLowerCase().includes("german") ||
      session.subject.toLowerCase().includes('hindi')||
      session.subject.toLowerCase().includes('malayalam')||
      session.subject.toLowerCase().includes('latin')||
      session.subject.toLowerCase().includes("language")) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("english") || 
      session.subject.toLowerCase().includes("spanish") || 
      session.subject.toLowerCase().includes("french") || 
      session.subject.toLowerCase().includes("german") || 
      session.subject.toLowerCase().includes('hindi')||
      session.subject.toLowerCase().includes('malayalam')||
      session.subject.toLowerCase().includes('latin')||
      session.subject.toLowerCase().includes("language"))
  },
  {
    id: "study_history",
    description: "Study History",
    target: 1,
    xp: 25,
    icon: "fa-solid fa-landmark",
    progress: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("history")) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => 
      session.subject.toLowerCase().includes("history"))
  },
  {
    id: "study_morning",
    description: "Study before noon",
    target: 1,
    xp: 20,
    icon: "fa-solid fa-sun",
    progress: (data) => data.sessions.some(session => {
      const sessionTime = new Date(session.timestamp);
      return sessionTime.getHours() < 12;
    }) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => {
      const sessionTime = new Date(session.timestamp);
      return sessionTime.getHours() < 12;
    })
  },
  {
    id: "study_evening",
    description: "Study after 6 PM",
    target: 1,
    xp: 20,
    icon: "fa-solid fa-moon",
    progress: (data) => data.sessions.some(session => {
      const sessionTime = new Date(session.timestamp);
      return sessionTime.getHours() >= 18;
    }) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => {
      const sessionTime = new Date(session.timestamp);
      return sessionTime.getHours() >= 18;
    })
  },
  {
    id: "study_20_min_single",
    description: "Study a subject for 20+ minutes in one session",
    target: 1,
    xp: 25,
    icon: "fa-solid fa-stopwatch",
    progress: (data) => data.sessions.some(session => session.time >= 20) ? 1 : 0,
    isComplete: (data) => data.sessions.some(session => session.time >= 20)
  }
];

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("studyTrackerData")
  if (savedData) {
    studyData = JSON.parse(savedData)

    // Check if it's a new day
    const today = new Date().toLocaleDateString()
    if (studyData.currentDay !== today) {
      // Update streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toLocaleDateString()

      // If yesterday had study activity, increment streak
      if (studyData.lastStudyDate === yesterdayString) {
        studyData.streak++
      } else if (studyData.lastStudyDate !== today) {
        // Reset streak if there was no activity yesterday and none today yet
        studyData.streak = 0
      }

      // Reset for new day
      studyData.currentDay = today
      studyData.sessions = []

      // Generate new daily goals
      generateDailyGoals()

      // Save the updated data
      saveData()
    } else if (!studyData.dailyGoals || !studyData.dailyGoals.date || studyData.dailyGoals.date !== today) {
      // If we have no daily goals or they're from a different day, generate new ones
      generateDailyGoals()
      saveData()
    }
  }

  updateUI()
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
}

// Generate daily goals
function generateDailyGoals() {
  const today = new Date().toLocaleDateString()
  
  // Initialize or reset daily goals
  if (!studyData.dailyGoals) {
    studyData.dailyGoals = {
      date: today,
      goals: []
    }
  }
  
  // Reset goals if it's a new day
  if (studyData.dailyGoals.date !== today) {
    studyData.dailyGoals = {
      date: today,
      goals: []
    }
  }
  
  // If we already have goals for today, don't regenerate
  if (studyData.dailyGoals.goals.length > 0) {
    return
  }
  
  // Shuffle the possible goals
  const shuffledGoals = [...possibleDailyGoals].sort(() => 0.5 - Math.random())
  
  // Select 3 random goals
  studyData.dailyGoals.goals = shuffledGoals.slice(0, 3).map(goal => ({
    id: goal.id,
    description: goal.description,
    target: goal.target,
    xp: goal.xp,
    icon: goal.icon,
    completed: false
  }))
}

// Update UI elements
function updateUI() {
  // Update stats
  const todayTotal = calculateTodayTotal()
  todayTotalElement.textContent = `${todayTotal} min`
  streakCountElement.textContent = `${studyData.streak} days`
  xpCountElement.textContent = `${studyData.xp} XP`

  // Update sessions list
  updateSessionsList()

  // Update chart
  updateChart()

  // Update daily goals
  updateDailyGoals()

  // Check achievements
  checkAchievements()
}

// Update daily goals
function updateDailyGoals() {
  if (!dailyGoalsContainer) return;
  
  dailyGoalsContainer.innerHTML = "";
  
  const dailyGoalsTitle = document.createElement("h2");
  dailyGoalsTitle.textContent = "Daily Goals";
  dailyGoalsContainer.appendChild(dailyGoalsTitle);
  
  if (!studyData.dailyGoals || !studyData.dailyGoals.goals || studyData.dailyGoals.goals.length === 0) {
    generateDailyGoals();
  }
  
  studyData.dailyGoals.goals.forEach((goal, index) => {
    // Find the goal definition
    const goalDef = possibleDailyGoals.find(g => g.id === goal.id);
    if (!goalDef) return;
    
    // Calculate progress
    const progress = goalDef.progress(studyData);
    const isComplete = goalDef.isComplete(studyData);
    
    // If goal is complete but not marked as completed, award XP
    if (isComplete && !goal.completed) {
      goal.completed = true;
      studyData.xp += goal.xp;
      showNotification("Goal Completed!", `+${goal.xp} XP`);
      saveData();
    }
    
    // Create goal element
    const goalElement = document.createElement("div");
    goalElement.className = `daily-goal ${goal.completed ? "goal-completed" : ""}`;
    
    const goalHeader = document.createElement("div");
    goalHeader.className = "goal-header";
    
    const goalIcon = document.createElement("div");
    goalIcon.className = "goal-icon";
    goalIcon.innerHTML = `<i class="${goal.icon}"></i>`;
    
    const goalTitle = document.createElement("div");
    goalTitle.className = "goal-title";
    goalTitle.textContent = goal.description;
    
    const goalReward = document.createElement("div");
    goalReward.className = "goal-reward";
    goalReward.textContent = `+${goal.xp} XP`;
    
    goalHeader.appendChild(goalIcon);
    goalHeader.appendChild(goalTitle);
    goalHeader.appendChild(goalReward);
    
    const goalProgress = document.createElement("div");
    goalProgress.className = "goal-progress";
    
    const progressBar = document.createElement("div");
    progressBar.className = "goal-progress-bar";
    progressBar.style.width = `${(progress / goal.target) * 100}%`;
    
    goalProgress.appendChild(progressBar);
    
    const progressText = document.createElement("div");
    progressText.className = "goal-progress-text";
    progressText.textContent = `${progress}/${goal.target}`;
    
    goalElement.appendChild(goalHeader);
    goalElement.appendChild(goalProgress);
    goalElement.appendChild(progressText);
    
    dailyGoalsContainer.appendChild(goalElement);
  });
}

// Calculate today's total study time
function calculateTodayTotal() {
  return studyData.sessions.reduce((total, session) => total + session.time, 0)
}

// Update sessions list
function updateSessionsList() {
  sessionsListElement.innerHTML = ""

  if (studyData.sessions.length === 0) {
    const emptyMessage = document.createElement("p")
    emptyMessage.textContent = "No study sessions recorded today."
    emptyMessage.className = "empty-message"
    sessionsListElement.appendChild(emptyMessage)
    return
  }

  studyData.sessions.forEach((session, index) => {
    const sessionItem = document.createElement("div")
    sessionItem.className = "session-item"

    const subjectElement = document.createElement("span")
    subjectElement.className = "session-subject"
    subjectElement.textContent = session.subject

    const timeElement = document.createElement("span")
    timeElement.className = "session-time"
    timeElement.textContent = `${session.time} min`

    sessionItem.appendChild(subjectElement)
    sessionItem.appendChild(timeElement)
    sessionsListElement.appendChild(sessionItem)
  })
}

// Update chart
function updateChart() {
  const ctx = document.getElementById("study-chart").getContext("2d")

  // Prepare data for chart
  const subjects = {}
  studyData.sessions.forEach((session) => {
    if (subjects[session.subject]) {
      subjects[session.subject] += session.time
    } else {
      subjects[session.subject] = session.time
    }
  })

  const labels = Object.keys(subjects)
  const data = Object.values(subjects)

  // Generate colors
  const colors = generateColors(labels.length)

  // Destroy previous chart if it exists
  if (studyChart) {
    studyChart.destroy()
  }

  // Create new chart
  studyChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ""
              const value = context.raw || 0
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} min (${percentage}%)`
            },
          },
        },
      },
    },
  })
}

// Generate colors for chart
function generateColors(count) {
  const colors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#F44336",
    "#9C27B0",
    "#3F51B5",
    "#009688",
    "#FF5722",
    "#795548",
    "#607D8B",
  ]

  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137) % 360 
      colors.push(`hsl(${hue}, 70%, 60%)`)
    }
  }

  return colors.slice(0, count)
}

// Add new study session
function addStudySession(subject, time) {
  // Get current date and time
  const now = new Date()
  const currentHour = now.getHours()

  // Add session with hour information
  studyData.sessions.push({
    subject: subject,
    time: time,
    timestamp: now.toISOString(),
    hour: currentHour,
  })

  // Update daily totals
  const today = now.toLocaleDateString()
  if (!studyData.dailyTotals[today]) {
    studyData.dailyTotals[today] = 0
  }
  studyData.dailyTotals[today] += time

  // Track early bird and night owl sessions
  if (!studyData.timeTracking) {
    studyData.timeTracking = {
      earlyBird: false,
      nightOwl: false,
    }
  }

  // Check if this is an early bird session (before 8 AM)
  if (currentHour < 8) {
    studyData.timeTracking.earlyBird = true
  }

  // Check if this is a night owl session (after 10 PM)
  if (currentHour >= 22) {
    studyData.timeTracking.nightOwl = true
  }

  // Update last study date and handle streak
  if (studyData.lastStudyDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toLocaleDateString()

    // If this is the first study session today and yesterday had no activity, increment streak
    if (studyData.lastStudyDate === yesterdayString) {
      // Streak continues
    } else if (studyData.lastStudyDate !== today) {
      // New streak starts at 1
      studyData.streak = 1
    }

    studyData.lastStudyDate = today
  }

  // Add XP (1 XP per minute)
  studyData.xp += time

  // Save and update UI
  saveData()
  updateUI()
}

// Check and update achievements
function checkAchievements() {
  const achievements = [
    {
      id: "first_session",
      title: "First Steps",
      description: "Complete your first study session",
      condition: () => studyData.sessions.length > 0,
      progress: () => Math.min(studyData.sessions.length, 1),
      target: 1,
      xp: 10,
    },
    {
      id: "study_30_min",
      title: "Focus Beginner",
      description: "Study for 30 minutes in a day",
      condition: () => calculateTodayTotal() >= 30,
      progress: () => Math.min(calculateTodayTotal(), 30),
      target: 30,
      xp: 20,
    },
    {
      id: "study_60_min",
      title: "Focus Intermediate",
      description: "Study for 60 minutes in a day",
      condition: () => calculateTodayTotal() >= 60,
      progress: () => Math.min(calculateTodayTotal(), 60),
      target: 60,
      xp: 30,
    },
    {
      id: "study_120_min",
      title: "Focus Master",
      description: "Study for 120 minutes in a day",
      condition: () => calculateTodayTotal() >= 120,
      progress: () => Math.min(calculateTodayTotal(), 120),
      target: 120,
      xp: 50,
    },
    {
      id: "streak_3",
      title: "Consistency Beginner",
      description: "Maintain a 3-day study streak",
      condition: () => studyData.streak >= 3,
      progress: () => Math.min(studyData.streak, 3),
      target: 3,
      xp: 30,
    },
    {
      id: "streak_7",
      title: "Consistency Intermediate",
      description: "Maintain a 7-day study streak",
      condition: () => studyData.streak >= 7,
      progress: () => Math.min(studyData.streak, 7),
      target: 7,
      xp: 70,
    },
    {
      id: "streak_30",
      title: "Consistency Master",
      description: "Maintain a 30-day study streak",
      condition: () => studyData.streak >= 30,
      progress: () => Math.min(studyData.streak, 30),
      target: 30,
      xp: 300,
    },
    // More achievements will be added in the achievements.js file
  ]

  achievements.forEach((achievement) => {
    // Initialize achievement if it doesn't exist
    if (!studyData.achievements[achievement.id]) {
      studyData.achievements[achievement.id] = {
        unlocked: false,
        progress: 0,
      }
    }

    // Update progress
    studyData.achievements[achievement.id].progress = achievement.progress()

    // Check if achievement is unlocked
    if (!studyData.achievements[achievement.id].unlocked && achievement.condition()) {
      studyData.achievements[achievement.id].unlocked = true
      studyData.xp += achievement.xp

      // Show notification
      showNotification(`Achievement Unlocked: ${achievement.title}`, `+${achievement.xp} XP`)
    }
  })

  saveData()
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

// Reset all data
function resetAllData() {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    studyData = {
      currentDay: new Date().toLocaleDateString(),
      sessions: [],
      dailyTotals: {},
      streak: 0,
      lastStudyDate: null,
      xp: 0,
      achievements: {},
      timeTracking: {
        earlyBird: false,
        nightOwl: false,
      },
      dailyGoals: {
        date: null,
        goals: []
      }
    }

    saveData()
    updateUI()

    showNotification("Data Reset", "All data has been reset successfully.")
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")

  // Save preference
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))

  // Update chart colors if it exists
  if (studyChart) {
    updateChart()
  }
}

// Event Listeners
studyForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const subject = subjectInput.value.trim()
  const time = Number.parseInt(timeInput.value)

  if (subject && time > 0) {
    addStudySession(subject, time)

    // Reset form
    subjectInput.value = ""
    timeInput.value = ""
  }
})

resetDataButton.addEventListener("click", resetAllData)

themeToggle.addEventListener("click", toggleDarkMode)

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}



// Add this function after the debugUpdateStreak function:
function debugSetTimeAchievement(type) {
  if (!studyData.timeTracking) {
    studyData.timeTracking = {
      earlyBird: false,
      nightOwl: false,
    }
  }

  if (type === "early") {
    studyData.timeTracking.earlyBird = true
    console.log("Early Bird achievement unlocked for testing")
  } else if (type === "night") {
    studyData.timeTracking.nightOwl = true
    console.log("Night Owl achievement unlocked for testing")
  }

  saveData()
  updateUI()
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}

// Initialize
loadData()
