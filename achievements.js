const totalXpElement = document.getElementById("total-xp")
const achievementsCountElement = document.getElementById("achievements-count")
const streakCountElement = document.getElementById("streak-count-ach")
const achievementsListElement = document.getElementById("achievements-list")
const themeToggle = document.querySelector(".theme-toggle")

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("studyTrackerData")
  if (savedData) {
    const data = JSON.parse(savedData)

    // Ensure streak is a number
    if (typeof data.streak !== "number") {
      data.streak = 0
    }

    return data
  }
  return {
    currentDay: new Date().toLocaleDateString(),
    sessions: [],
    dailyTotals: {},
    streak: 0,
    lastStudyDate: null,
    xp: 0,
    achievements: {},
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
}

// Define all achievements
const allAchievements = [
  {
    id: "first_session",
    title: "First Steps",
    description: "Complete your first study session",
    icon: "fa-solid fa-shoe-prints",
    condition: (data) => data.sessions.length > 0 || Object.keys(data.dailyTotals).length > 0,
    progress: (data) => Math.min(data.sessions.length > 0 || Object.keys(data.dailyTotals).length > 0 ? 1 : 0, 1),
    target: 1,
    xp: 10,
  },
  {
    id: "study_30_min",
    title: "Focus Beginner",
    description: "Study for 30 minutes in a day",
    icon: "fa-solid fa-hourglass-start",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total >= 30)
      return todayTotal >= 30 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 30)
    },
    target: 30,
    xp: 20,
  },
  {
    id: "study_60_min",
    title: "Focus Intermediate",
    description: "Study for 60 minutes in a day",
    icon: "fa-solid fa-hourglass-half",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total >= 60)
      return todayTotal >= 60 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 60)
    },
    target: 60,
    xp: 30,
  },
  {
    id: "study_120_min",
    title: "Focus Master",
    description: "Study for 120 minutes in a day",
    icon: "fa-solid fa-hourglass-end",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total >= 120)
      return todayTotal >= 120 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 120)
    },
    target: 120,
    xp: 50,
  },
  {
    id: "streak_3",
    title: "Consistency Beginner",
    description: "Maintain a 3-day study streak",
    icon: "fa-solid fa-calendar-check",
    condition: (data) => data.streak >= 3,
    progress: (data) => Math.min(data.streak, 3),
    target: 3,
    xp: 30,
  },
  {
    id: "streak_7",
    title: "Consistency Intermediate",
    description: "Maintain a 7-day study streak",
    icon: "fa-solid fa-calendar-week",
    condition: (data) => data.streak >= 7,
    progress: (data) => Math.min(data.streak, 7),
    target: 7,
    xp: 70,
  },
  {
    id: "streak_30",
    title: "Consistency Master",
    description: "Maintain a 30-day study streak",
    icon: "fa-solid fa-medal",
    condition: (data) => data.streak >= 30,
    progress: (data) => Math.min(data.streak, 30),
    target: 30,
    xp: 300,
  },
  {
    id: "streak_100",
    title: "Milestone:100",
    description: "Maintain a 100-day study streak",
    icon: "fa-solid fa-gem",
    condition: (data) => data.streak >= 100,
    progress: (data) => Math.min(data.streak, 100),
    target: 100,
    xp: 500,
  },
  {
    id: "total_study_1h",
    title: "Scholar Beginner",
    description: "Study for a total of 1 hour",
    icon: "fa-solid fa-book",
    condition: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return totalMinutes >= 60
    },
    progress: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalMinutes, 60)
    },
    target: 60,
    xp: 20,
  },
  {
    id: "total_study_5h",
    title: "Scholar Intermediate",
    description: "Study for a total of 5 hours",
    icon: "fa-solid fa-book-open-reader",
    condition: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return totalMinutes >= 300
    },
    progress: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalMinutes, 300)
    },
    target: 300,
    xp: 50,
  },
  {
    id: "total_study_10h",
    title: "Scholar Advanced",
    description: "Study for a total of 10 hours",
    icon: "fa-solid fa-book-open",
    condition: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return totalMinutes >= 600
    },
    progress: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalMinutes, 600)
    },
    target: 600,
    xp: 100,
  },
  {
    id: "total_study_24h",
    title: "Scholar Master",
    description: "Study for a total of 24 hours",
    icon: "fa-solid fa-graduation-cap",
    condition: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return totalMinutes >= 1440
    },
    progress: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalMinutes, 1440)
    },
    target: 1440,
    xp: 240,
  },
  {
    id: "subjects_3",
    title: "Diverse Learner Beginner",
    description: "Study 3 different subjects",
    icon: "fa-solid fa-layer-group",
    condition: (data) => {
      const subjects = new Set()
      data.sessions.forEach((session) => subjects.add(session.subject))
      Object.keys(data.dailyTotals).forEach((day) => {
        if (data.dailySessions && data.dailySessions[day]) {
          data.dailySessions[day].forEach((session) => subjects.add(session.subject))
        }
      })
      return subjects.size >= 3
    },
    progress: (data) => {
      const subjects = new Set()
      data.sessions.forEach((session) => subjects.add(session.subject))
      Object.keys(data.dailyTotals).forEach((day) => {
        if (data.dailySessions && data.dailySessions[day]) {
          data.dailySessions[day].forEach((session) => subjects.add(session.subject))
        }
      })
      return Math.min(subjects.size, 3)
    },
    target: 3,
    xp: 30,
  },
  {
    id: "subjects_5",
    title: "Diverse Learner Intermediate",
    description: "Study 5 different subjects",
    icon: "fa-solid fa-plus",
    condition: (data) => {
      const subjects = new Set()
      data.sessions.forEach((session) => subjects.add(session.subject))
      Object.keys(data.dailyTotals).forEach((day) => {
        if (data.dailySessions && data.dailySessions[day]) {
          data.dailySessions[day].forEach((session) => subjects.add(session.subject))
        }
      })
      return subjects.size >= 5
    },
    progress: (data) => {
      const subjects = new Set()
      data.sessions.forEach((session) => subjects.add(session.subject))
      Object.keys(data.dailyTotals).forEach((day) => {
        if (data.dailySessions && data.dailySessions[day]) {
          data.dailySessions[day].forEach((session) => subjects.add(session.subject))
        }
      })
      return Math.min(subjects.size, 5)
    },
    target: 5,
    xp: 50,
  },
  {
    id: "subjects_10",
    title: "Polymath",
    description: "Study 10 different subjects",
    icon: "fa-solid fa-crown",
    condition: (data) => {
      const subjects = new Set()
      data.sessions.forEach((session) => subjects.add(session.subject))
      Object.keys(data.dailyTotals).forEach((day) => {
        if (data.dailySessions && data.dailySessions[day]) {
          data.dailySessions[day].forEach((session) => subjects.add(session.subject))
        }
      })
      return subjects.size >= 10
    },
    progress: (data) => {
      const subjects = new Set()
      data.sessions.forEach((session) => subjects.add(session.subject))
      Object.keys(data.dailyTotals).forEach((day) => {
        if (data.dailySessions && data.dailySessions[day]) {
          data.dailySessions[day].forEach((session) => subjects.add(session.subject))
        }
      })
      return Math.min(subjects.size, 10)
    },
    target: 10,
    xp: 50,
  },

  {
    id: "xp_100",
    title: "XP Collector Beginner",
    description: "Earn 100 XP",
    icon: "fa-solid fa-star",
    condition: (data) => data.xp >= 100,
    progress: (data) => Math.min(data.xp, 100),
    target: 100,
    xp: 20,
  },
  {
    id: "xp_500",
    title: "XP Collector Intermediate",
    description: "Earn 500 XP",
    icon: "fa-solid fa-rocket",
    condition: (data) => data.xp >= 500,
    progress: (data) => Math.min(data.xp, 500),
    target: 500,
    xp: 50,
  },
  {
    id: "xp_1000",
    title: "XP Collector Advanced",
    description: "Earn 1000 XP",
    icon: "fa-solid fa-award",
    condition: (data) => data.xp >= 1000,
    progress: (data) => Math.min(data.xp, 1000),
    target: 1000,
    xp: 100,
  },
  {
    id: "xp_5000",
    title: "XP Collector Master",
    description: "Earn 5000 XP",
    icon: "fa-solid fa-trophy",
    condition: (data) => data.xp >= 5000,
    progress: (data) => Math.min(data.xp, 5000),
    target: 5000,
    xp: 500,
  },
  {
    id: "daily_sessions_3",
    title: "Dedicated Learner",
    description: "Complete 3 study sessions in a day",
    icon: "fa-solid fa-list-check",
    condition: (data) => data.sessions.length >= 3,
    progress: (data) => Math.min(data.sessions.length, 3),
    target: 3,
    xp: 30,
  },
  {
    id: "daily_sessions_5",
    title: "Committed Learner",
    description: "Complete 5 study sessions in a day",
    icon: "fa-solid fa-list-ol",
    condition: (data) => data.sessions.length >= 5,
    progress: (data) => Math.min(data.sessions.length, 5),
    target: 5,
    xp: 50,
  },
  {
    id: "weekend_warrior",
    title: "Weekend Warrior",
    description: "Study on both Saturday and Sunday",
    icon: "fa-solid fa-calendar-days",
    condition: (data) => {
      const days = Object.keys(data.dailyTotals).map((dateStr) => {
        const date = new Date(dateStr)
        return date.getDay() // 0 is Sunday, 6 is Saturday
      })
      return days.includes(0) && days.includes(6)
    },
    progress: (data) => {
      const days = Object.keys(data.dailyTotals).map((dateStr) => {
        const date = new Date(dateStr)
        return date.getDay() // 0 is Sunday, 6 is Saturday
      })
      return (days.includes(0) ? 1 : 0) + (days.includes(6) ? 1 : 0)
    },
    target: 2,
    xp: 40,
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Study before 8 AM",
    icon: "fa-solid fa-sun",
    condition: (data) => {
      return data.timeTracking && data.timeTracking.earlyBird
    },
    progress: (data) => {
      return data.timeTracking && data.timeTracking.earlyBird ? 1 : 0
    },
    target: 1,
    xp: 30,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Study after 10 PM",
    icon: "fa-solid fa-moon",
    condition: (data) => {
      return data.timeTracking && data.timeTracking.nightOwl
    },
    progress: (data) => {
      return data.timeTracking && data.timeTracking.nightOwl ? 1 : 0
    },
    target: 1,
    xp: 30,
  },
  {
    id: "achievement_5",
    title: "Achievement Hunter Beginner",
    description: "Unlock 5 achievements",
    icon: "fa-solid fa-medal",
    condition: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return unlockedCount >= 5
    },
    progress: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return Math.min(unlockedCount, 5)
    },
    target: 5,
    xp: 50,
  },
  {
    id: "achievement_15",
    title: "Achievement Hunter Intermediate",
    description: "Unlock 15 achievements",
    icon: "fa-solid fa-medal",
    condition: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return unlockedCount >= 15
    },
    progress: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return Math.min(unlockedCount, 15)
    },
    target: 15,
    xp: 150,
  },
  {
    id: "achievement_30",
    title: "Achievement Hunter Master",
    description: "Unlock all 30 achievements",
    icon: "fa-solid fa-medal",
    condition: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return unlockedCount >= 30
    },
    progress: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return Math.min(unlockedCount, 30)
    },
    target: 30,
    xp: 300,
  },
  {
    id: "perfect_week",
    title: "Perfect Week",
    description: "Study every day for a week",
    icon: "fa-solid fa-calendar-week",
    condition: (data) => {
      return data.streak >= 7
    },
    progress: (data) => Math.min(data.streak, 7),
    target: 7,
    xp: 70,
  },
  {
    id: "subject_master",
    title: "Subject Master",
    description: "Study the same subject for 5 hours total",
    icon: "fa-solid fa-book-bookmark",
    condition: (data) => {
      return false
    },
    progress: () => 0, 
    target: 300, // 5 hours in minutes
    xp: 100,
  },
  {
    id: "marathon_studier",
    title: "Marathon Studier",
    description: "Study for 3 hours in a single day",
    icon: "fa-solid fa-person-running",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total >= 180)
      return todayTotal >= 180 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 180)
    },
    target: 180, // 3 hours in minutes
    xp: 100,
  },
]


function updateUI(data) {

  totalXpElement.textContent = `${data.xp} XP`

 
  let unlockedCount = 0


  for (const achievement of allAchievements) {

    if (data.achievements[achievement.id] && data.achievements[achievement.id].unlocked === true) {
      unlockedCount++
    }
  }

  achievementsCountElement.textContent = `${unlockedCount}/${allAchievements.length}`

  streakCountElement.textContent = `${data.streak} days`

  updateAchievementsList(data)


  console.log(`Found ${unlockedCount} unlocked achievements out of ${allAchievements.length}`)
}


function updateAchievementsList(data) {
  achievementsListElement.innerHTML = ""

  allAchievements.forEach((achievement) => {
    if (!data.achievements[achievement.id]) {
      data.achievements[achievement.id] = {
        unlocked: false,
        progress: 0,
      }
    }

    const achievementData = data.achievements[achievement.id]

    // Update progress
    achievementData.progress = achievement.progress(data)

    // Check if achievement is unlocked
    if (!achievementData.unlocked && achievement.condition(data)) {
      achievementData.unlocked = true
    }

    const achievementItem = document.createElement("div")
    achievementItem.className = `achievement-item ${achievementData.unlocked ? "achievement-unlocked" : ""}`

    const achievementHeader = document.createElement("div")
    achievementHeader.className = "achievement-header"

    const achievementIcon = document.createElement("div")
    achievementIcon.className = "achievement-icon"
    achievementIcon.innerHTML = `<i class="${achievement.icon}"></i>`

    const achievementTitle = document.createElement("div")
    achievementTitle.className = "achievement-title"
    achievementTitle.textContent = achievement.title

    achievementHeader.appendChild(achievementIcon)
    achievementHeader.appendChild(achievementTitle)

    const achievementDescription = document.createElement("div")
    achievementDescription.className = "achievement-description"
    achievementDescription.textContent = achievement.description

    const achievementProgress = document.createElement("div")
    achievementProgress.className = "achievement-progress"

    const progressBar = document.createElement("div")
    progressBar.className = "achievement-progress-bar"
    progressBar.style.width = `${(achievementData.progress / achievement.target) * 100}%`

    achievementProgress.appendChild(progressBar)

    const progressText = document.createElement("div")
    progressText.className = "achievement-progress-text"
    progressText.textContent = `${achievementData.progress}/${achievement.target} ${achievementData.unlocked ? "(+" + achievement.xp + " XP)" : ""}`

    achievementItem.appendChild(achievementHeader)
    achievementItem.appendChild(achievementDescription)
    achievementItem.appendChild(achievementProgress)
    achievementItem.appendChild(progressText)

    achievementsListElement.appendChild(achievementItem)
  })

  localStorage.setItem("studyTrackerData", JSON.stringify(data))
}

themeToggle.addEventListener("click", toggleDarkMode)

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}

const studyData = loadData()
updateUI(studyData)

