import { getDailyContent, levelSystem } from "./quotes-tips.js"

// Initialize data structure
let studyData = {
  currentDay: new Date().toLocaleDateString(),
  sessions: [],
  dailyTotals: {},
  streak: 0,
  lastStudyDate: null,
  xp: 0,
  level: 1,
  achievements: {},
  timeTracking: {
    earlyBird: false,
    nightOwl: false,
  },
}

// Add this to the studyData initialization
if (!studyData.goals) {
  studyData.goals = []
}

if (!studyData.activeGoals) {
  studyData.activeGoals = []
}

if (!studyData.completedGoals) {
  studyData.completedGoals = []
}

// Add this predefined goals array after the studyData initialization
const predefinedGoals = [
  {
    id: "daily_60_min",
    title: "Daily Hour",
    description: "Study for at least 60 minutes today",
    target: 60, // minutes
    xpReward: 30,
    category: "Daily",
    icon: "fa-clock",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      return todayTotal >= 60
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      return Math.min(todayTotal, 60)
    },
  },
  {
    id: "daily_120_min",
    title: "Power Study",
    description: "Study for at least 2 hours today",
    target: 120, // minutes
    xpReward: 60,
    category: "Daily",
    icon: "fa-bolt",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      return todayTotal >= 120
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      return Math.min(todayTotal, 120)
    },
  },
  {
    id: "language_study",
    title: "Language Learning",
    description: "Study a language for at least 30 minutes",
    target: 30, // minutes
    xpReward: 25,
    category: "Subject",
    icon: "fa-language",
    subjectFilter: ["language", "english", "spanish", "french", "german", "japanese", "chinese", "korean", "italian"],
    condition: (data) => {
      const languageSessions = data.sessions.filter((session) =>
        predefinedGoals
          .find((g) => g.id === "language_study")
          .subjectFilter.some((lang) => session.subject.toLowerCase().includes(lang)),
      )
      const languageTotal = languageSessions.reduce((total, session) => total + session.time, 0)
      return languageTotal >= 30
    },
    progress: (data) => {
      const languageSessions = data.sessions.filter((session) =>
        predefinedGoals
          .find((g) => g.id === "language_study")
          .subjectFilter.some((lang) => session.subject.toLowerCase().includes(lang)),
      )
      const languageTotal = languageSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(languageTotal, 30)
    },
  },
  {
    id: "math_study",
    title: "Math Master",
    description: "Study mathematics for at least 45 minutes",
    target: 45, // minutes
    xpReward: 35,
    category: "Subject",
    icon: "fa-square-root-variable",
    subjectFilter: ["math", "mathematics", "calculus", "algebra", "geometry", "statistics"],
    condition: (data) => {
      const mathSessions = data.sessions.filter((session) =>
        predefinedGoals
          .find((g) => g.id === "math_study")
          .subjectFilter.some((math) => session.subject.toLowerCase().includes(math)),
      )
      const mathTotal = mathSessions.reduce((total, session) => total + session.time, 0)
      return mathTotal >= 45
    },
    progress: (data) => {
      const mathSessions = data.sessions.filter((session) =>
        predefinedGoals
          .find((g) => g.id === "math_study")
          .subjectFilter.some((math) => session.subject.toLowerCase().includes(math)),
      )
      const mathTotal = mathSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(mathTotal, 45)
    },
  },
  {
    id: "science_study",
    title: "Science Explorer",
    description: "Study any science subject for at least 40 minutes",
    target: 40, // minutes
    xpReward: 30,
    category: "Subject",
    icon: "fa-flask",
    subjectFilter: ["science", "physics", "chemistry", "biology", "astronomy", "geology"],
    condition: (data) => {
      const scienceSessions = data.sessions.filter((session) =>
        predefinedGoals
          .find((g) => g.id === "science_study")
          .subjectFilter.some((science) => session.subject.toLowerCase().includes(science)),
      )
      const scienceTotal = scienceSessions.reduce((total, session) => total + session.time, 0)
      return scienceTotal >= 40
    },
    progress: (data) => {
      const scienceSessions = data.sessions.filter((session) =>
        predefinedGoals
          .find((g) => g.id === "science_study")
          .subjectFilter.some((science) => session.subject.toLowerCase().includes(science)),
      )
      const scienceTotal = scienceSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(scienceTotal, 40)
    },
  },
  {
    id: "morning_study",
    title: "Early Bird",
    description: "Study for at least 20 minutes before 10 AM",
    target: 20, // minutes
    xpReward: 25,
    category: "Time",
    icon: "fa-sun",
    condition: (data) => {
      const morningSessions = data.sessions.filter((session) => {
        const sessionDate = new Date(session.timestamp)
        return sessionDate.getHours() < 10
      })
      const morningTotal = morningSessions.reduce((total, session) => total + session.time, 0)
      return morningTotal >= 20
    },
    progress: (data) => {
      const morningSessions = data.sessions.filter((session) => {
        const sessionDate = new Date(session.timestamp)
        return sessionDate.getHours() < 10
      })
      const morningTotal = morningSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(morningTotal, 20)
    },
  },
  {
    id: "evening_study",
    title: "Night Owl",
    description: "Study for at least 20 minutes after 8 PM",
    target: 20, // minutes
    xpReward: 25,
    category: "Time",
    icon: "fa-moon",
    condition: (data) => {
      const eveningSessions = data.sessions.filter((session) => {
        const sessionDate = new Date(session.timestamp)
        return sessionDate.getHours() >= 20
      })
      const eveningTotal = eveningSessions.reduce((total, session) => total + session.time, 0)
      return eveningTotal >= 20
    },
    progress: (data) => {
      const eveningSessions = data.sessions.filter((session) => {
        const sessionDate = new Date(session.timestamp)
        return sessionDate.getHours() >= 20
      })
      const eveningTotal = eveningSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(eveningTotal, 20)
    },
  },
  {
    id: "multi_subject",
    title: "Renaissance Scholar",
    description: "Study at least 3 different subjects today",
    target: 3, // subjects
    xpReward: 40,
    category: "Challenge",
    icon: "fa-brain",
    condition: (data) => {
      const uniqueSubjects = new Set(data.sessions.map((session) => session.subject))
      return uniqueSubjects.size >= 3
    },
    progress: (data) => {
      const uniqueSubjects = new Set(data.sessions.map((session) => session.subject))
      return Math.min(uniqueSubjects.size, 3)
    },
  },
  {
    id: "revision_focus",
    title: "Revision Master",
    description: "Complete at least 45 minutes of revision",
    target: 45, // minutes
    xpReward: 35,
    category: "Tag",
    icon: "fa-rotate",
    condition: (data) => {
      const revisionSessions = data.sessions.filter(
        (session) => session.tag && session.tag.toLowerCase() === "revision",
      )
      const revisionTotal = revisionSessions.reduce((total, session) => total + session.time, 0)
      return revisionTotal >= 45
    },
    progress: (data) => {
      const revisionSessions = data.sessions.filter(
        (session) => session.tag && session.tag.toLowerCase() === "revision",
      )
      const revisionTotal = revisionSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(revisionTotal, 45)
    },
  },
  {
    id: "exam_prep",
    title: "Exam Ready",
    description: "Complete at least 60 minutes of exam preparation",
    target: 60, // minutes
    xpReward: 50,
    category: "Tag",
    icon: "fa-file-pen",
    condition: (data) => {
      const examSessions = data.sessions.filter((session) => session.tag && session.tag.toLowerCase() === "exam prep")
      const examTotal = examSessions.reduce((total, session) => total + session.time, 0)
      return examTotal >= 60
    },
    progress: (data) => {
      const examSessions = data.sessions.filter((session) => session.tag && session.tag.toLowerCase() === "exam prep")
      const examTotal = examSessions.reduce((total, session) => total + session.time, 0)
      return Math.min(examTotal, 60)
    },
  },
]

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
const streakFlameContainer = document.getElementById("streak-flame-container")

// Add these DOM elements at the top with the other DOM elements
const goalForm = document.getElementById("goal-form")
const goalDescriptionInput = document.getElementById("goal-description")
const goalTargetInput = document.getElementById("goal-target")
const goalSubjectInput = document.getElementById("goal-subject")
const goalDeadlineInput = document.getElementById("goal-deadline")
const goalsListElement = document.getElementById("goals-list")

// Add these DOM elements at the top with the other DOM elements
const predefinedGoalsListElement = document.getElementById("predefined-goals-list")
const activeGoalsListElement = document.getElementById("active-goals-list")

// Add sessionTagInput to the DOM Elements
const sessionTagInput = document.getElementById("session-tag")

// Level system elements
const levelBadgeElement = document.getElementById("level-badge")
const levelNameElement = document.getElementById("level-name")
const levelProgressBarElement = document.getElementById("level-progress-bar")
const currentXpElement = document.getElementById("current-xp")
const nextLevelXpElement = document.getElementById("next-level-xp")
const levelPerksListElement = document.getElementById("level-perks-list")

// Daily content element
const dailyContentElement = document.getElementById("daily-content")

// Chart
let studyChart

// Declare the missing functions
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

// Create firework animation - improved version
function createFireworks() {
  // Create container if it doesn't exist
  let fireworkContainer = document.querySelector(".firework-container")
  if (fireworkContainer) {
    fireworkContainer.remove()
  }

  fireworkContainer = document.createElement("div")
  fireworkContainer.className = "firework-container"
  document.body.appendChild(fireworkContainer)

  // Create multiple fireworks
  const colors = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
    "#EEFF41",
    "#FFFF00",
    "#FFD740",
    "#FFAB40",
    "#FF6E40",
  ]

  // Create more fireworks for better visibility
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const firework = document.createElement("div")
      firework.className = "firework"

      // Random position
      const x = (Math.random() - 0.5) * 800
      const y = (Math.random() - 0.5) * 800

      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)]

      firework.style.setProperty("--x", `${x}px`)
      firework.style.setProperty("--y", `${y}px`)
      firework.style.backgroundColor = color
      firework.style.width = `${5 + Math.random() * 10}px`
      firework.style.height = `${5 + Math.random() * 10}px`
      firework.style.left = `${Math.random() * 100}%`
      firework.style.top = `${Math.random() * 100}%`

      fireworkContainer.appendChild(firework)

      // Remove after animation completes
      setTimeout(() => {
        if (firework.parentNode === fireworkContainer) {
          firework.remove()
        }
      }, 1000)
    }, i * 20) // Stagger the fireworks
  }

  // Remove container after all animations complete
  setTimeout(() => {
    if (document.body.contains(fireworkContainer)) {
      fireworkContainer.remove()
    }
  }, 5000)
}

// Update streak flame based on streak count
function updateStreakFlame(streak) {
  if (!streakFlameContainer) return

  // Clear previous flame
  streakFlameContainer.innerHTML = ""

  // Determine size class based on streak
  let sizeClass = "size-1"
  if (streak >= 3 && streak < 7) {
    sizeClass = "size-2"
  } else if (streak >= 7 && streak < 14) {
    sizeClass = "size-3"
  } else if (streak >= 14 && streak < 30) {
    sizeClass = "size-4"
  } else if (streak >= 30 && streak < 100) {
    sizeClass = "size-5"
  } else if (streak >= 100 && streak < 365) {
    sizeClass = "size-6"
  } else if (streak >= 365) {
    sizeClass = "size-max"
  }

  // Determine milestone class
  let milestoneClass = ""
  if (streak >= 7 && streak < 30) {
    milestoneClass = "streak-milestone-7"
  } else if (streak >= 30 && streak < 100) {
    milestoneClass = "streak-milestone-30"
  } else if (streak >= 100 && streak < 365) {
    milestoneClass = "streak-milestone-100"
  } else if (streak >= 365 && streak < 500) {
    milestoneClass = "streak-milestone-365"
  } else if (streak >= 500 && streak < 1000) {
    milestoneClass = "streak-milestone-500"
  } else if (streak >= 1000) {
    milestoneClass = "streak-milestone-1000"
  }

  // Create flame element
  const flameDiv = document.createElement("div")
  flameDiv.className = `streak-flame ${sizeClass}`
  flameDiv.innerHTML = '<i class="fas fa-fire"></i>'

  // Add to container with milestone class if applicable
  streakFlameContainer.className = `streak-flame-container ${milestoneClass}`
  streakFlameContainer.appendChild(flameDiv)
}

function checkAchievements() {
  // Placeholder for achievement checking logic
  console.log("Checking achievements...")
}

function updateGoalsList() {
  // Placeholder for updating goals list
  console.log("Updating goals list...")
}

// Replace the placeholder toggleDarkMode function with this implementation:
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))

  // Update chart colors if it exists
  if (studyChart) {
    updateChart()
  }
}

// Replace the placeholder resetAllData function with this implementation:
function resetAllData() {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    studyData = {
      currentDay: new Date().toLocaleDateString(),
      sessions: [],
      dailyTotals: {},
      dailySessions: {},
      streak: 0,
      lastStudyDate: null,
      xp: 0,
      level: 1,
      achievements: {},
      timeTracking: {
        earlyBird: false,
        nightOwl: false,
      },
      goals: [],
      activeGoals: [],
      completedGoals: [],
      dailyGoalsCompleted: false,
    }

    saveData()
    updateUI()
    updateDailyContent()
    updateLevelSystem()
    updateStreakFlame(0)

    showNotification("Data Reset", "All data has been reset successfully.")
  }
}

// Modify the loadData function to fix the goal assignment issue
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

      // Save today's sessions to dailySessions before resetting
      if (studyData.sessions.length > 0) {
        if (!studyData.dailySessions) {
          studyData.dailySessions = {}
        }
        studyData.dailySessions[studyData.currentDay] = [...studyData.sessions]
      }

      // Reset for new day
      studyData.currentDay = today
      studyData.sessions = []

      // Reset dailyGoalsCompleted flag for the new day
      studyData.dailyGoalsCompleted = false

      // Assign new daily goals for the new day
      assignDailyGoals()

      // Save the updated data
      saveData()
    }

    // Initialize new properties if they don't exist
    if (!studyData.activeGoals) {
      studyData.activeGoals = []
    }

    if (!studyData.completedGoals) {
      studyData.completedGoals = []
    }

    if (studyData.dailyGoalsCompleted === undefined) {
      studyData.dailyGoalsCompleted = false
    }

    // If no daily goals are assigned yet AND we haven't completed all goals for today, assign them
    if (studyData.activeGoals.length === 0 && !studyData.dailyGoalsCompleted) {
      assignDailyGoals()
      saveData()
    }

    // Initialize level if it doesn't exist
    if (studyData.level === undefined) {
      studyData.level = levelSystem.calculateLevel(studyData.xp)
    }
  }

  updateUI()
  updateDailyContent()
  updateLevelSystem()
  updateStreakFlame(studyData.streak || 0)
}

// Add this function to update the daily content
function updateDailyContent() {
  if (!dailyContentElement) return

  const dailyContent = getDailyContent()
  let html = ""

  if (dailyContent.type === "quote") {
    html = `
      <div class="daily-content-type">Daily Quote</div>
      <div class="daily-content-text">"${dailyContent.content.text}"</div>
      <div class="daily-content-author">— ${dailyContent.content.author}</div>
    `
  } else {
    html = `
      <div class="daily-content-type">Study Tip</div>
      <div class="daily-content-title">${dailyContent.content.title}</div>
      <div class="daily-content-text">${dailyContent.content.tip}</div>
    `
  }

  dailyContentElement.innerHTML = html
}

// Add this function to update the level system UI with more levels
function updateLevelSystem() {
  if (!levelBadgeElement) return

  const currentLevel = levelSystem.calculateLevel(studyData.xp)
  const progress = levelSystem.progressToNextLevel(studyData.xp)
  const unlockedPerks = levelSystem.getUnlockedPerks(currentLevel)

  // Update level badge and name
  levelBadgeElement.textContent = currentLevel

  // Find the highest level perk unlocked
  let highestPerk = { level: 1, name: "Beginner" }
  for (const perk of unlockedPerks) {
    if (perk.level > highestPerk.level) {
      highestPerk = perk
    }
  }

  levelNameElement.textContent = highestPerk.name

  // Update progress bar
  levelProgressBarElement.style.width = `${progress}%`

  // Update XP text
  currentXpElement.textContent = `${studyData.xp} XP`

  // Calculate XP needed for next level
  const nextLevelXP = levelSystem.xpForNextLevel(studyData.xp)
  if (nextLevelXP !== null) {
    nextLevelXpElement.textContent = `${nextLevelXP - studyData.xp} XP to Level ${currentLevel + 1}`
  } else {
    nextLevelXpElement.textContent = "Max Level Reached!"
  }

  // Update perks list
  levelPerksListElement.innerHTML = ""

  unlockedPerks.forEach((perk) => {
    const perkElement = document.createElement("div")
    perkElement.className = "level-perk-item"
    perkElement.innerHTML = `
      <div class="level-perk-header">
        <div class="level-perk-level">${perk.level}</div>
        <div class="level-perk-name">${perk.name}</div>
      </div>
      <div class="level-perk-description">${perk.description}</div>
    `
    levelPerksListElement.appendChild(perkElement)
  })
}

// Add this function to show level up notification
function showLevelUpNotification(newLevel) {
  // Check if there's a perk for this level
  const perk = levelSystem.levelPerks[newLevel]

  // Create notification element
  const notification = document.createElement("div")
  notification.className = "level-up-notification"

  notification.innerHTML = `
    <h2>Level Up!</h2>
    <p>You've reached</p>
    <div class="level-number">Level ${newLevel}</div>
    ${
      perk
        ? `<p class="perk-unlocked">Unlocked: ${perk.name}</p>
    <p>${perk.description}</p>`
        : ""
    }
    <button id="close-level-up">Continue</button>
  `

  // Add to document
  document.body.appendChild(notification)

  // Add event listener to close button
  document.getElementById("close-level-up").addEventListener("click", () => {
    document.body.removeChild(notification)
  })

  // Create fireworks animation
  createFireworks()

  // Auto-close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, 5000)
}

// Add this function after the showLevelUpNotification function:
function updateProfileOnLevelUp(newLevel) {
  // Load profile data
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}")

  // Check if profile data exists
  if (!profileData) return

  // Define avatars and titles here
  const avatars = [
    { id: "avatar1", name: "Beginner Avatar", levelRequired: 1 },
    { id: "avatar2", name: "Level 5 Avatar", levelRequired: 5 },
    { id: "avatar3", name: "Level 10 Avatar", levelRequired: 10 },
    { id: "avatar4", name: "Level 15 Avatar", levelRequired: 15 },
    { id: "avatar5", name: "Level 20 Avatar", levelRequired: 20 },
    { id: "avatar6", name: "Level 25 Avatar", levelRequired: 25 },
    { id: "avatar7", name: "Level 30 Avatar", levelRequired: 30 },
    { id: "avatar8", name: "Level 40 Avatar", levelRequired: 40 },
    { id: "avatar9", name: "Level 50 Avatar", levelRequired: 50 },
  ]

  const frames = [
    { id: "frame1", name: "Beginner Frame", levelRequired: 1 },
    { id: "frame2", name: "Level 5 Frame", levelRequired: 5 },
    { id: "frame3", name: "Level 10 Frame", levelRequired: 10 },
    { id: "frame4", name: "Level 15 Frame", levelRequired: 15 },
    { id: "frame5", name: "Level 20 Frame", levelRequired: 20 },
    { id: "frame6", name: "Level 25 Frame", levelRequired: 25 },
    { id: "frame7", name: "Level 30 Frame", levelRequired: 30 },
    { id: "frame8", name: "Level 40 Frame", levelRequired: 40 },
    { id: "frame9", name: "Level 50 Frame", levelRequired: 50 },
  ]

  const titles = [
    { name: "Beginner", levelRequired: 1 },
    { name: "Pro Study", levelRequired: 5 },
    { name: "Knowledge Seeker", levelRequired: 10 },
    { name: "Scholar", levelRequired: 15 },
    { name: "Academic", levelRequired: 20 },
    { name: "Professor", levelRequired: 25 },
    { name: "Master Scholar", levelRequired: 30 },
    { name: "Sage", levelRequired: 35 },
    { name: "Enlightened", levelRequired: 40 },
    { name: "Genius", levelRequired: 45 },
    { name: "Legendary Scholar", levelRequired: 50 },
    { name: "Grand Master", levelRequired: 60 },
    { name: "Omniscient", levelRequired: 70 },
    { name: "Transcendent", levelRequired: 80 },
    { name: "Cosmic Mind", levelRequired: 90 },
    { name: "Universal Scholar", levelRequired: 100 },
  ]

  // Check for newly unlocked avatars
  avatars.forEach((avatar) => {
    if (avatar.levelRequired === newLevel && !profileData.unlockedAvatars.includes(avatar.id)) {
      profileData.unlockedAvatars.push(avatar.id)
      showNotification("New Avatar Unlocked!", `You've unlocked the ${avatar.name} avatar.`)
    }
  })

  // Check for newly unlocked frames
  frames.forEach((frame) => {
    if (frame.levelRequired === newLevel && !profileData.unlockedFrames.includes(frame.id)) {
      profileData.unlockedFrames.push(frame.id)
      showNotification("New Frame Unlocked!", `You've unlocked the ${frame.name} frame.`)
    }
  })

  // Check for newly unlocked titles
  titles.forEach((title) => {
    if (title.levelRequired === newLevel && !profileData.unlockedTitles.includes(title.name)) {
      profileData.unlockedTitles.push(title.name)
      showNotification("New Title Unlocked!", `You've unlocked the ${title.name} title.`)
    }
  })

  // Save updated profile data
  localStorage.setItem("profileData", JSON.stringify(profileData))
}

// Add this new function to assign daily goals
function assignDailyGoals() {
  // Don't assign new goals if all goals for today are already completed
  if (studyData.dailyGoalsCompleted) {
    return
  }

  // Clear existing active goals
  studyData.activeGoals = []

  // Get all available goals
  const availableGoals = predefinedGoals.filter((goal) => !studyData.completedGoals.includes(goal.id))

  // Prioritize daily goals
  const dailyGoals = availableGoals.filter((goal) => goal.category === "Daily")
  const otherGoals = availableGoals.filter((goal) => goal.category !== "Daily")

  // Shuffle the arrays
  const shuffledDaily = shuffleArray([...dailyGoals])
  const shuffledOther = shuffleArray([...otherGoals])

  // Combine and take the first 3 goals
  const selectedGoals = [...shuffledDaily, ...shuffledOther].slice(0, 3)

  // Add to active goals
  selectedGoals.forEach((goal) => {
    studyData.activeGoals.push({
      id: goal.id,
      startedAt: new Date().toISOString(),
      completed: false,
    })
  })
}

// Add a shuffle array utility function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
}

// Update the updatePredefinedGoalsList function to hide it since we're auto-assigning goals
function updatePredefinedGoalsList() {
  if (!predefinedGoalsListElement) return

  // Hide the predefined goals section since we're auto-assigning goals
  const container = predefinedGoalsListElement.closest(".predefined-goals-container")
  if (container) {
    container.style.display = "none"
  }
}

// Update the updateActiveGoalsList function to remove the accept button
function updateActiveGoalsList() {
  if (!activeGoalsListElement) return

  activeGoalsListElement.innerHTML = ""

  if (studyData.activeGoals.length === 0) {
    let emptyMessage

    if (studyData.dailyGoalsCompleted) {
      emptyMessage = document.createElement("p")
      emptyMessage.textContent =
        "You've completed all your daily goals. Great job! New goals will be available tomorrow."
      emptyMessage.className = "empty-message success-message"
    } else {
      emptyMessage = document.createElement("p")
      emptyMessage.textContent = "No active goals for today. Complete your study sessions to make progress!"
      emptyMessage.className = "empty-message"
    }

    activeGoalsListElement.appendChild(emptyMessage)
    return
  }

  studyData.activeGoals.forEach((activeGoal, index) => {
    const goalData = predefinedGoals.find((g) => g.id === activeGoal.id)
    if (!goalData) return

    const progress = goalData.progress(studyData)
    const isCompleted = goalData.condition(studyData)

    // Update goal completion status
    if (isCompleted && !activeGoal.completed) {
      activeGoal.completed = true
      studyData.xp += goalData.xpReward
      showNotification("Goal Completed!", `+${goalData.xpReward} XP`)
      saveData()
    }

    const goalCard = document.createElement("div")
    goalCard.className = `active-goal-card ${isCompleted ? "completed" : ""}`

    const title = document.createElement("div")
    title.className = "active-goal-title"
    title.innerHTML = `<i class="fas ${goalData.icon}"></i> ${goalData.title}`

    const description = document.createElement("div")
    description.className = "active-goal-description"
    description.textContent = goalData.description

    const progressBar = document.createElement("div")
    progressBar.className = "active-goal-progress"

    const progressFill = document.createElement("div")
    progressFill.className = "active-goal-progress-bar"
    progressFill.style.width = `${(progress / goalData.target) * 100}%`

    progressBar.appendChild(progressFill)

    const details = document.createElement("div")
    details.className = "active-goal-details"

    const progressText = document.createElement("span")
    progressText.textContent = `Progress: ${progress}/${goalData.target}`

    const reward = document.createElement("span")
    reward.textContent = `Reward: ${goalData.xpReward} XP`

    details.appendChild(progressText)
    details.appendChild(reward)

    const actions = document.createElement("div")
    actions.className = "active-goal-actions"

    if (isCompleted) {
      const claimBtn = document.createElement("button")
      claimBtn.className = "btn success"
      claimBtn.textContent = "Claim Reward"
      claimBtn.addEventListener("click", () => claimGoalReward(index))
      actions.appendChild(claimBtn)
    }

    goalCard.appendChild(title)
    goalCard.appendChild(description)
    goalCard.appendChild(progressBar)
    goalCard.appendChild(details)
    goalCard.appendChild(actions)

    activeGoalsListElement.appendChild(goalCard)
  })

  // Check if all active goals are completed but not yet claimed
  const allCompleted = studyData.activeGoals.length > 0 && studyData.activeGoals.every((goal) => goal.completed)

  if (allCompleted) {
    const reminderMessage = document.createElement("div")
    reminderMessage.className = "goal-reminder"
    reminderMessage.innerHTML = "<p>All goals are completed! Don't forget to claim your rewards.</p>"
    activeGoalsListElement.appendChild(reminderMessage)
  }
}

// Add this function to accept a goal
function acceptGoal(goalId) {
  const goalData = predefinedGoals.find((g) => g.id === goalId)
  if (!goalData) return

  // Check if already active or completed
  if (studyData.activeGoals.some((g) => g.id === goalId) || studyData.completedGoals.includes(goalId)) {
    showNotification("Goal Unavailable", "This goal is already active or completed.")
    return
  }

  // Limit active goals to 3
  if (studyData.activeGoals.length >= 3) {
    showNotification("Too Many Goals", "You can only have 3 active goals at a time. Complete or abandon a goal first.")
    return
  }

  // Add to active goals
  studyData.activeGoals.push({
    id: goalId,
    startedAt: new Date().toISOString(),
    completed: false,
  })

  saveData()
  updatePredefinedGoalsList()
  updateActiveGoalsList()
  showNotification("Goal Accepted", `You've accepted the "${goalData.title}" goal!`)
}

// Modify the claimGoalReward function to track when all goals are completed
function claimGoalReward(index) {
  if (index < 0 || index >= studyData.activeGoals.length) return

  const activeGoal = studyData.activeGoals[index]
  const goalData = predefinedGoals.find((g) => g.id === activeGoal.id)

  if (!goalData || !activeGoal.completed) return

  // Add to completed goals
  studyData.completedGoals.push(activeGoal.id)

  // Remove from active goals
  studyData.activeGoals.splice(index, 1)

  // Check if all daily goals are now completed
  if (studyData.activeGoals.length === 0) {
    studyData.dailyGoalsCompleted = true
    showNotification("All Goals Completed!", "You've completed all your daily goals. Great job!")
  }

  saveData()
  updatePredefinedGoalsList()
  updateActiveGoalsList()
  updateUI()
  showNotification("Reward Claimed", `You've completed the "${goalData.title}" goal!`)
}

// Add this function to abandon a goal
function abandonGoal(index) {
  if (index < 0 || index >= studyData.activeGoals.length) return

  if (confirm("Are you sure you want to abandon this goal? Your progress will be lost.")) {
    const activeGoal = studyData.activeGoals[index]
    const goalData = predefinedGoals.find((g) => g.id === activeGoal.id)

    // Remove from active goals
    studyData.activeGoals.splice(index, 1)

    saveData()
    updatePredefinedGoalsList()
    updateActiveGoalsList()
    showNotification("Goal Abandoned", `You've abandoned the "${goalData.title}" goal.`)
  }
}

// Update UI elements
function updateUI() {
  // Update stats
  const todayTotal = calculateTodayTotal()
  todayTotalElement.textContent = `${todayTotal} min`
  streakCountElement.textContent = `${studyData.streak} days`
  xpCountElement.textContent = `${studyData.xp} XP`

  // Update streak flame
  updateStreakFlame(studyData.streak || 0)

  // Update sessions list
  updateSessionsList()

  // Update chart
  updateChart()

  // Check achievements
  checkAchievements()

  // Update goals lists
  updatePredefinedGoalsList()
  updateActiveGoalsList()

  // Update the regular goals list if it exists
  updateGoalsList()

  // Update level system
  updateLevelSystem()
}

// Calculate today's total study time
function calculateTodayTotal() {
  return studyData.sessions.reduce((total, session) => total + session.time, 0)
}

// Update the updateSessionsList function to display tags
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

    // Create tag element if tag exists
    if (session.tag) {
      const tagElement = document.createElement("span")
      tagElement.className = "session-tag"
      tagElement.textContent = session.tag
      subjectElement.appendChild(tagElement)
    }

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

  // If we need more colors than in our predefined array, generate them
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137) % 360 // Use golden angle approximation for even distribution
      colors.push(`hsl(${hue}, 70%, 60%)`)
    }
  }

  return colors.slice(0, count)
}

// Update the addStudySession function to include streak flame updates and fireworks
function addStudySession(subject, time, tag) {
  // Get current date and time
  const now = new Date()
  const currentHour = now.getHours()
  const today = now.toLocaleDateString()

  // Create session object
  const session = {
    subject: subject,
    time: time,
    timestamp: now.toISOString(),
    hour: currentHour,
    tag: tag,
  }

  // Add session to today's sessions
  studyData.sessions.push(session)

  // Update daily totals - only needed for persistence, not for today's calculations
  if (!studyData.dailyTotals[today]) {
    studyData.dailyTotals[today] = 0
  }
  studyData.dailyTotals[today] += time

  // Store daily sessions for historical tracking
  if (!studyData.dailySessions) {
    studyData.dailySessions = {}
  }
  if (!studyData.dailySessions[today]) {
    studyData.dailySessions[today] = []
  }
  studyData.dailySessions[today].push(session)

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

  // Store old XP for level up check
  const oldXP = studyData.xp

  // Add XP (1 XP per minute)
  studyData.xp += time

  // Check for level up
  const newLevel = levelSystem.checkLevelUp(oldXP, studyData.xp)
  if (newLevel) {
    studyData.level = newLevel
    showLevelUpNotification(newLevel)
    updateProfileOnLevelUp(newLevel)
    createFireworks() // Add fireworks for level up
  }

  // Check active goals for completion
  studyData.activeGoals.forEach((activeGoal) => {
    if (activeGoal.completed) return

    const goalData = predefinedGoals.find((g) => g.id === activeGoal.id)
    if (!goalData) return

    if (goalData.condition(studyData) && !activeGoal.completed) {
      activeGoal.completed = true
      showNotification("Goal Completed!", `You've completed the "${goalData.title}" goal!`)
    }
  })

  // Update goal progress
  function updateGoalProgress(subject, time) {
    if (!studyData.goals) return

    let xpEarned = 0

    studyData.goals.forEach((goal) => {
      if (goal.completed || goal.expired) return

      // If the goal has a subject, only count sessions for that subject
      if (goal.subject && goal.subject.toLowerCase() !== subject.toLowerCase()) return

      // Update progress
      goal.current += time

      // Check if goal is completed
      if (goal.current >= goal.target && !goal.completed) {
        goal.completed = true
        // Add XP for completing a goal (10 XP per hour of the goal)
        const goalXp = Math.ceil(goal.target / 60) * 10
        xpEarned += goalXp
        showNotification("Goal Completed!", `+${goalXp} XP`)
      }
    })

    // Add earned XP
    if (xpEarned > 0) {
      studyData.xp += xpEarned
    }
  }

  updateGoalProgress(subject, time)

  // Save and update UI
  saveData()
  updateUI()
}

// Event Listeners
studyForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const subject = subjectInput.value.trim()
  const time = Number.parseInt(timeInput.value)
  const tag = sessionTagInput.value

  if (subject && time > 0) {
    addStudySession(subject, time, tag)

    // Reset form
    subjectInput.value = ""
    timeInput.value = ""
    // Don't reset tag, keep the last selected option
  }
})

resetDataButton.addEventListener("click", resetAllData)

themeToggle.addEventListener("click", toggleDarkMode)

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
resetDataButton.addEventListener("click", resetAllData)

themeToggle.addEventListener("click", toggleDarkMode)
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav ul")

  // Add store link if it doesn't exist
  if (nav && !document.querySelector('nav ul li a[href="store.html"]')) {
    const storeItem = document.createElement("li")
    storeItem.innerHTML = '<a href="store.html"><i class="fas fa-store"></i> Store</a>'
    nav.appendChild(storeItem)
  }

  // Add profile link if it doesn't exist
  if (nav && !document.querySelector('nav ul li a[href="profile.html"]')) {
    const profileItem = document.createElement("li")
    profileItem.innerHTML = '<a href="profile.html"><i class="fas fa-user"></i> Profile</a>'
    nav.appendChild(profileItem)
  }
})

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
  }

  // Load data
  loadData()
})
