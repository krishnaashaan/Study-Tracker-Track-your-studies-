// DOM Elements
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

// Ensure all achievements are properly initialized in the data
function ensureAllAchievementsInitialized(data) {
  if (!data.achievements) {
    data.achievements = {}
  }

  allAchievements.forEach((achievement) => {
    if (!data.achievements[achievement.id]) {
      data.achievements[achievement.id] = {
        unlocked: false,
        progress: 0,
      }
    }

    // Check if the achievement should be unlocked based on its condition
    if (!data.achievements[achievement.id].unlocked && achievement.condition(data)) {
      data.achievements[achievement.id].unlocked = true
    }

    // Update progress
    data.achievements[achievement.id].progress = achievement.progress(data)
  })

  return data
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
    rarity: "🟢 Common",
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
    rarity: "🟢 Common",
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
    rarity: "🟢 Common",
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
    rarity: "🟢 Common",
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
    rarity: "🟢 Common",
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
    rarity: "🔵 Uncommon",
  },
  {
    id: "streak_30",
    title: "Consistency Master",
    description: "Maintain a 30-day study streak",
    icon: "fa-solid fa-calendar-check",
    condition: (data) => data.streak >= 30,
    progress: (data) => Math.min(data.streak, 30),
    target: 30,
    xp: 300,
    rarity: "🔵 Uncommon",
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
    rarity: "🟢 Common",
  },
  {
    id: "total_study_5h",
    title: "Scholar Intermediate",
    description: "Study for a total of 5 hours",
    icon: "fa-solid fa-book-open",
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
    rarity: "🔵 Uncommon",
  },
  {
    id: "total_study_10h",
    title: "Scholar Advanced",
    description: "Study for a total of 10 hours",
    icon: "fa-solid fa-book-open-reader",
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
    rarity: "🔵 Uncommon",
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
    rarity: "🟡 Rare",
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
    rarity: "🟢 Common",
  },
  {
    id: "subjects_5",
    title: "Diverse Learner Intermediate",
    description: "Study 5 different subjects",
    icon: "fa-solid fa-book-atlas",
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
    rarity: "🔵 Uncommon",
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
    rarity: "🟢 Common",
  },
  {
    id: "xp_500",
    title: "XP Collector Intermediate",
    description: "Earn 500 XP",
    icon: "fa-solid fa-certificate",
    condition: (data) => data.xp >= 500,
    progress: (data) => Math.min(data.xp, 500),
    target: 500,
    xp: 50,
    rarity: "🔵 Uncommon",
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
    rarity: "🟡 Rare",
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
    rarity: "🟡 Rare",
  },
  {
    id: "complete_first_goal",
    title: "Goal Setter",
    description: "Complete your first daily goal",
    icon: "fa-solid fa-bullseye",
    condition: (data) => {
      return data.completedGoals && data.completedGoals.length > 0
    },
    progress: (data) => {
      return Math.min((data.completedGoals && data.completedGoals.length) || 0, 1)
    },
    target: 1,
    xp: 20,
    rarity: "🟢 Common",
  },
  {
    id: "complete_10_goals",
    title: "Goal Crusher",
    description: "Complete 10 daily goals",
    icon: "fa-solid fa-check-double",
    condition: (data) => {
      return data.completedGoals && data.completedGoals.length >= 10
    },
    progress: (data) => {
      return Math.min((data.completedGoals && data.completedGoals.length) || 0, 10)
    },
    target: 10,
    xp: 50,
    rarity: "🟢 Common",
  },
  {
    id: "complete_50_goals",
    title: "Goal Master",
    description: "Complete 50 daily goals",
    icon: "fa-solid fa-tasks",
    condition: (data) => {
      return data.completedGoals && data.completedGoals.length >= 50
    },
    progress: (data) => {
      return Math.min((data.completedGoals && data.completedGoals.length) || 0, 50)
    },
    target: 50,
    xp: 150,
    rarity: "🔵 Uncommon",
  },
  {
    id: "complete_100_goals",
    title: "Goal Champion",
    description: "Complete 100 daily goals",
    icon: "fa-solid fa-crown",
    condition: (data) => {
      return data.completedGoals && data.completedGoals.length >= 100
    },
    progress: (data) => {
      return Math.min((data.completedGoals && data.completedGoals.length) || 0, 100)
    },
    target: 100,
    xp: 300,
    rarity: "🟡 Rare",
  },
  {
    id: "goal_streak_3",
    title: "Goal Streak Beginner",
    description: "Complete at least one daily goal for 3 consecutive days",
    icon: "fa-solid fa-fire",
    condition: (data) => {
      return data.streak >= 3 && data.completedGoals && data.completedGoals.length >= 3
    },
    progress: (data) => {
      if (!data.completedGoals) return 0
      return Math.min(data.streak, 3)
    },
    target: 3,
    xp: 40,
    rarity: "🟢 Common",
  },
  {
    id: "goal_streak_7",
    title: "Goal Streak Master",
    description: "Complete at least one daily goal for 7 consecutive days",
    icon: "fa-solid fa-fire-flame-curved",
    condition: (data) => {
      return data.streak >= 7 && data.completedGoals && data.completedGoals.length >= 7
    },
    progress: (data) => {
      if (!data.completedGoals) return 0
      return Math.min(data.streak, 7)
    },
    target: 7,
    xp: 100,
    rarity: "🔵 Uncommon",
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
    rarity: "🟢 Common",
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
    rarity: "🔵 Uncommon",
  },
  {
    id: "weekend_warrior",
    title: "Weekend Warrior",
    description: "Study on both Saturday and Sunday",
    icon: "fa-solid fa-calendar-week",
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
    rarity: "🟢 Common",
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
    rarity: "🟢 Common",
  },
  {
    id: "early_bird_pro",
    title: "Early Bird Pro",
    description: "Study for 2 hours before 8 AM.",
    icon: "fa-solid fa-sun",
    condition: (data) => {
      return data.sessions.some((session) => {
        const startTime = new Date(session.startTime)
        return startTime.getHours() < 8 && session.time >= 120
      })
    },
    progress: (data) => {
      const earlySessions = data.sessions.filter((session) => {
        const startTime = new Date(session.startTime)
        return startTime.getHours() < 8
      })
      const totalTime = earlySessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalTime, 120)
    },
    target: 120,
    xp: 150,
    rarity: "🟠 Epic",
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
    rarity: "🟢 Common",
  },
  {
    id: "night_owl_pro",
    title: "Night Owl Pro",
    description: "Study for 3 hours after 10 PM.",
    icon: "fa-solid fa-moon",
    condition: (data) => {
      return data.sessions.some((session) => {
        const startTime = new Date(session.startTime)
        return startTime.getHours() >= 22 && session.time >= 180
      })
    },
    progress: (data) => {
      const nightSessions = data.sessions.filter((session) => {
        const startTime = new Date(session.startTime)
        return startTime.getHours() >= 22
      })
      const totalTime = nightSessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalTime, 180)
    },
    target: 180,
    xp: 150,
    rarity: "🟠 Epic",
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
    rarity: "🟢 Common",
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
    rarity: "🔵 Uncommon",
  },
  {
    id: "achievement_30",
    title: "Achievement Hunter Advanced",
    description: "Unlock 30 achievements",
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
    rarity: "🟡 Rare",
  },
  {
    id: "achievement_50",
    title: "Achievement Hunter Master",
    description: "Unlock all 50 achievements",
    icon: "fa-solid fa-ranking-star",
    condition: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return unlockedCount >= 50
    },
    progress: (data) => {
      const unlockedCount = Object.values(data.achievements).filter((a) => a.unlocked).length
      return Math.min(unlockedCount, 50)
    },
    target: 50,
    xp: 500,
    rarity: "🟠 Epic",
  },
  {
    id: "perfect_week",
    title: "Perfect Week",
    description: "Study every day for a week",
    icon: "fa-solid fa-calendar-week",
    condition: (data) => {
      // This is simplified since we don't track consecutive days perfectly
      return data.streak >= 7
    },
    progress: (data) => Math.min(data.streak, 7),
    target: 7,
    xp: 70,
    rarity: "🔵 Uncommon",
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
    rarity: "🟠 Epic",
  },
  {
    id: "streak_100",
    title: "Consistency Legend",
    description: "Maintain a 100-day study streak",
    icon: "fa-solid fa-fire-flame-curved",
    condition: (data) => data.streak >= 100,
    progress: (data) => Math.min(data.streak, 100),
    target: 100,
    xp: 1000,
    rarity: "🟠 Epic",
  },
  {
    id: "streak_365",
    title: "Year-Long Scholar",
    description: "Maintain a 365-day study streak",
    icon: "fa-solid fa-medal",
    condition: (data) => data.streak >= 365,
    progress: (data) => Math.min(data.streak, 365),
    target: 365,
    xp: 3650,
    rarity: "🟣 Legendary",
  },
  {
    id: "streak_500",
    title: "Unstoppable Scholar",
    description: "Maintain a 500-day study streak",
    icon: "fa-solid fa-fire-flame-curved",
    condition: (data) => data.streak >= 500,
    progress: (data) => Math.min(data.streak, 500),
    target: 500,
    xp: 5000,
    isHardcore: true,
    rarity: "🟣 Legendary",
  },
  {
    id: "streak_1000",
    title: "Infinite Scholar",
    description: "Maintain a 1000-day study streak",
    icon: "fa-solid fa-infinity",
    condition: (data) => data.streak >= 1000,
    progress: (data) => Math.min(data.streak, 1000),
    target: 1000,
    xp: 9999,
    rarity: "🟣 Legendary",
  },
  {
    id: "total_study_100h",
    title: "Scholar Legend",
    description: "Study for a total of 100 hours",
    icon: "fa-solid fa-meteor",
    condition: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return totalMinutes >= 6000
    },
    progress: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalMinutes, 6000)
    },
    target: 6000,
    xp: 1000,
    rarity: "🟣 Legendary",
  },
  {
    id: "subjects_10",
    title: "Diverse Learner Master",
    description: "Study 10 different subjects",
    icon: "fa-solid fa-layer-group",
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
    xp: 100,
    rarity: "🟡 Rare",
  },

  {
    id: "xp_collector_pro",
    title: "XP Collector Pro",
    description: "Earn 2,000 XP.",
    icon: "fa-solid fa-award",
    condition: (data) => data.xp >= 2000,
    progress: (data) => Math.min(data.xp, 2000),
    target: 2000,
    xp: 200,
    rarity: "🟡 Rare",
  },
  {
    id: "xp_10000",
    title: "XP Collector Legend",
    description: "Earn 10,000 XP",
    icon: "fa-solid fa-crown",
    condition: (data) => data.xp >= 10000,
    progress: (data) => Math.min(data.xp, 10000),
    target: 10000,
    xp: 1000,
    rarity: "🟣 Legendary",
  },
  {
    id: "daily_sessions_10",
    title: "Study Machine",
    description: "Complete 10 study sessions in a day",
    icon: "fa-solid fa-robot",
    condition: (data) => data.sessions.length >= 10,
    progress: (data) => Math.min(data.sessions.length, 10),
    target: 10,
    xp: 100,
    rarity: "🟡 Rare",
  },
  {
    id: "perfect_month",
    title: "Perfect Month",
    description: "Study every day for a month",
    icon: "fa-solid fa-calendar-check",
    condition: (data) => data.streak >= 30,
    progress: (data) => Math.min(data.streak, 30),
    target: 30,
    xp: 300,
    rarity: "🟡 Rare",
  },
  {
    id: "study_streak_pro",
    title: "Study Streak Pro",
    description: "Maintain a 50-day study streak.",
    icon: "fa-solid fa-fire",
    condition: (data) => data.streak >= 50,
    progress: (data) => Math.min(data.streak, 50),
    target: 50,
    xp: 500,
    rarity: "🟡 Rare",
  },
  {
    id: "perfect_quarter",
    title: "Perfect Quarter",
    description: "Study every day for 90 days.",
    icon: "fa-solid fa-calendar-days",
    condition: (data) => data.streak >= 90,
    progress: (data) => Math.min(data.streak, 90),
    target: 90,
    xp: 900,
    rarity: "🟣 Legendary",
  },
  {
    id: "level_10",
    title: "Level 10 Scholar",
    description: "Reach level 10",
    icon: "fa-solid fa-ranking-star",
    condition: (data) => {
      return data.level && data.level >= 10
    },
    progress: (data) => {
      return Math.min(data.level || 0, 10)
    },
    target: 10,
    xp: 100,
    rarity: "🟢 Common",
  },
  {
    id: "level_25",
    title: "Level 25 Scholar",
    description: "Reach level 25",
    icon: "fa-solid fa-user-graduate",
    condition: (data) => {
      return data.level && data.level >= 25
    },
    progress: (data) => {
      return Math.min(data.level || 0, 25)
    },
    target: 25,
    xp: 250,
    rarity: "🔵 Uncommon",
  },
  {
    id: "level_50",
    title: "Level 50 Scholar",
    description: "Reach level 50",
    icon: "fa-solid fa-hat-wizard",
    condition: (data) => {
      return data.level && data.level >= 50
    },
    progress: (data) => {
      return Math.min(data.level || 0, 50)
    },
    target: 50,
    xp: 500,
    rarity: "🟡 Rare",
  },
  {
    id: "study_marathon",
    title: "Study Marathon",
    description: "Study for 5 hours in a single day",
    icon: "fa-solid fa-person-running",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total >= 300)
      return todayTotal >= 300 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 300)
    },
    target: 300, // 5 hours in minutes
    xp: 300,
    rarity: "🟡 Rare",
  },
  {
    id: "study_ultra_marathon",
    title: "Study Ultra Marathon",
    description: "Study for 8 hours in a single day",
    icon: "fa-solid fa-person-circle-check",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total >= 480)
      return todayTotal >= 480 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 480)
    },
    target: 480, // 8 hours in minutes
    xp: 480,
    rarity: "🟠 Epic",
  },
  {
    id: "palindrome_time",
    title: "Time Palindrome",
    description: "Study for exactly a palindrome number of minutes (e.g., 101, 343)",
    icon: "fa-solid fa-arrows-left-right",
    condition: (data) => {
      return data.sessions.some((session) => {
        const timeStr = session.time.toString()
        const reversedTimeStr = timeStr.split("").reverse().join("")
        return timeStr === reversedTimeStr && timeStr.length > 1
      })
    },
    progress: (data) => {
      const palindromeSession = data.sessions.some((session) => {
        const timeStr = session.time.toString()
        const reversedTimeStr = timeStr.split("").reverse().join("")
        return timeStr === reversedTimeStr && timeStr.length > 1
      })
      return palindromeSession ? 1 : 0
    },
    target: 1,
    xp: 121,
    isSecret: true,
    rarity: "🟣 Legendary",
  },
  {
    id: "fibonacci_study",
    title: "Fibonacci Scholar",
    description: "Study for a Fibonacci number of minutes (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144)",
    icon: "fa-solid fa-calculator",
    condition: (data) => {
      const fibonacciNumbers = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
      return data.sessions.some((session) => fibonacciNumbers.includes(session.time))
    },
    progress: (data) => {
      const fibonacciNumbers = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
      const fibSession = data.sessions.some((session) => fibonacciNumbers.includes(session.time))
      return fibSession ? 1 : 0
    },
    target: 1,
    xp: 89,
    isSecret: true,
    rarity: "🟣 Legendary",
  },
  {
    id: "pi_time",
    title: "Pi Time",
    description: "Study for 314 minutes in a single day",
    icon: "fa-solid fa-circle",
    condition: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const anyDayTotal = Object.values(data.dailyTotals).some((total) => total === 314)
      return todayTotal === 314 || anyDayTotal
    },
    progress: (data) => {
      const todayTotal = data.sessions.reduce((total, session) => total + session.time, 0)
      const maxDayTotal = Math.max(todayTotal, ...Object.values(data.dailyTotals).map((v) => v || 0))
      return Math.min(maxDayTotal, 314)
    },
    target: 314,
    xp: 314,
    isSecret: true,
    rarity: "🟣 Legendary",
  },

  {
    id: "study_all_subjects",
    title: "Jack of All Trades",
    description: "Study 7 different subjects in a single day",
    icon: "fa-solid fa-hat-wizard",
    condition: (data) => {
      const uniqueSubjectsToday = new Set(data.sessions.map((session) => session.subject))
      return uniqueSubjectsToday.size >= 7
    },
    progress: (data) => {
      const uniqueSubjectsToday = new Set(data.sessions.map((session) => session.subject))
      return Math.min(uniqueSubjectsToday.size, 7)
    },
    target: 7,
    xp: 77,
    isWeird: true,
    rarity: "🟣 Legendary",
  },
  {
    id: "prime_time",
    title: "Prime Time",
    description: "Study for a prime number of minutes 5 times",
    icon: "fa-solid fa-superscript",
    condition: (data) => {
      const isPrime = (num) => {
        if (num <= 1) return false
        if (num <= 3) return true
        if (num % 2 === 0 || num % 3 === 0) return false
        let i = 5
        while (i * i <= num) {
          if (num % i === 0 || num % (i + 2) === 0) return false
          i += 6
        }
        return true
      }

      const primeSessionsCount = data.sessions.filter((session) => isPrime(session.time)).length
      return primeSessionsCount >= 5
    },
    progress: (data) => {
      const isPrime = (num) => {
        if (num <= 1) return false
        if (num <= 3) return true
        if (num % 2 === 0 || num % 3 === 0) return false
        let i = 5
        while (i * i <= num) {
          if (num % i === 0 || num % (i + 2) === 0) return false
          i += 6
        }
        return true
      }

      const primeSessionsCount = data.sessions.filter((session) => isPrime(session.time)).length
      return Math.min(primeSessionsCount, 5)
    },
    target: 5,
    xp: 113,
    isWeird: true,
    rarity: "🟣 Legendary",
  },

 
  {
    id: "study_10000_hours",
    title: "Mastery",
    description: "Study for a total of 10,000 hours",
    icon: "fa-solid fa-crown",
    condition: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return totalMinutes >= 600000 // 10,000 hours = 600,000 minutes
    },
    progress: (data) => {
      const totalMinutes =
        Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
        data.sessions.reduce((sum, session) => sum + session.time, 0)
      return Math.min(totalMinutes, 600000)
    },
    target: 600000,
    xp: 10000,
    isHardcore: true,
    rarity: "🟣 Legendary",
  },
  {
    id: "explore_10_stars",
    title: "Star Explorer",
    description: "Explore 10 stars in the galaxy.",
    icon: "fa-solid fa-star",
    condition: (data) => data.galaxyExplored && data.galaxyExplored.length >= 10,
    progress: (data) => (data.galaxyExplored ? Math.min(data.galaxyExplored.length, 10) : 0),
    target: 10,
    xp: 50,
    rarity: "🟢 Common",
  },
  {
    id: "discover_5_constellations",
    title: "Constellation Discoverer",
    description: "Discover 5 constellations in the galaxy.",
    icon: "fa-solid fa-satellite",
    condition: (data) => data.constellationsDiscovered >= 5,
    progress: (data) => Math.min(data.constellationsDiscovered, 5),
    target: 5,
    xp: 100,
    rarity: "🔵 Uncommon",
  },
  {
    id: "collect_all_spectral_types",
    title: "Spectral Collector",
    description: "Collect all 7 spectral types (O, B, A, F, G, K, M).",
    icon: "fa-solid fa-circle-half-stroke",
    condition: (data) =>
      data.spectralTypesCollected &&
      ["O", "B", "A", "F", "G", "K", "M"].every((type) => data.spectralTypesCollected.includes(type)),
    progress: (data) => (data.spectralTypesCollected ? Math.min(data.spectralTypesCollected.length, 7) : 0),
    target: 7,
    xp: 200,
    rarity: "🟡 Rare",
  },
  {
    id: "explore_50_stars",
    title: "Galaxy Pioneer",
    description: "Explore 50 stars in the galaxy.",
    icon: "fa-solid fa-star-and-crescent",
    condition: (data) => data.galaxyExplored && data.galaxyExplored.length >= 50,
    progress: (data) => (data.galaxyExplored ? Math.min(data.galaxyExplored.length, 50) : 0),
    target: 50,
    xp: 500,
    rarity: "🟠 Epic",
  },
  {
    id: "discover_20_constellations",
    title: "Constellation Master",
    description: "Discover 20 constellations in the galaxy.",
    icon: "fa-solid fa-satellite-dish",
    condition: (data) => data.constellationsDiscovered >= 20,
    progress: (data) => Math.min(data.constellationsDiscovered, 20),
    target: 20,
    xp: 1000,
    rarity: "🟣 Legendary",
  },
  {
    id: "explore_100_stars",
    title: "Galaxy Voyager",
    description: "Explore 100 stars in the galaxy.",
    icon: "fa-solid fa-star-and-crescent",
    condition: (data) => data.galaxyExplored && data.galaxyExplored.length >= 100,
    progress: (data) => (data.galaxyExplored ? Math.min(data.galaxyExplored.length, 100) : 0),
    target: 100,
    xp: 1000,
    rarity: "🟠 Epic",
  },

  {
    id: "explore_25_stars",
    title: "Galactic Explorer",
    description: "Explore 25 stars in the galaxy.",
    icon: "fa-solid fa-star",
    condition: (data) => data.galaxyExplored && data.galaxyExplored.length >= 25,
    progress: (data) => (data.galaxyExplored ? Math.min(data.galaxyExplored.length, 25) : 0),
    target: 25,
    xp: 150,
    rarity: "🔵 Uncommon",
  },
]

// Update UI
function updateUI(data) {
  totalXpElement.textContent = `${data.xp} XP`

  // Fix achievement counting by checking all achievements
  let unlockedCount = 0
  allAchievements.forEach((achievement) => {
    if (data.achievements[achievement.id] && data.achievements[achievement.id].unlocked) {
      unlockedCount++
    }
  })
  achievementsCountElement.textContent = `${unlockedCount}/${allAchievements.length}`

  streakCountElement.textContent = `${data.streak} days`

  // Update achievements list
  updateAchievementsList(data)
}
// Update achievements list
function updateAchievementsList(data) {
  achievementsListElement.innerHTML = ""

  allAchievements.forEach((achievement) => {
    // Get achievement data or initialize it
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

    // Create achievement element
    const achievementItem = document.createElement("div")
    achievementItem.className = `achievement-item ${achievementData.unlocked ? "achievement-unlocked" : ""}`

    // Add data-rarity attribute for CSS targeting
    if (achievementData.unlocked) {
      // Extract rarity level from the emoji text
      let rarityLevel = "common"
      if (achievement.rarity.includes("🔵")) rarityLevel = "uncommon"
      if (achievement.rarity.includes("🟡")) rarityLevel = "rare"
      if (achievement.rarity.includes("🟠")) rarityLevel = "epic"
      if (achievement.rarity.includes("🟣")) rarityLevel = "legendary"

      achievementItem.setAttribute("data-rarity", rarityLevel)
    }

    const achievementHeader = document.createElement("div")
    achievementHeader.className = "achievement-header"

    const achievementIcon = document.createElement("div")
    achievementIcon.className = "achievement-icon"
    achievementIcon.innerHTML = `<i class="${achievement.icon}"></i>`

    const achievementTitle = document.createElement("div")
    achievementTitle.className = "achievement-title"
    achievementTitle.textContent = achievement.title

    const achievementRarity = document.createElement("div")
    achievementRarity.className = "achievement-rarity"
    achievementRarity.textContent = achievement.rarity // Display rarity

    achievementHeader.appendChild(achievementIcon)
    achievementHeader.appendChild(achievementTitle)
    achievementHeader.appendChild(achievementRarity) // Add rarity to the header

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
    progressText.textContent = `${achievementData.progress}/${achievement.target} ${
      achievementData.unlocked ? "(+" + achievement.xp + " XP)" : ""
    }`

    achievementItem.appendChild(achievementHeader)
    achievementItem.appendChild(achievementDescription)
    achievementItem.appendChild(achievementProgress)
    achievementItem.appendChild(progressText)

    achievementsListElement.appendChild(achievementItem)
  })
}

// Event Listeners
themeToggle.addEventListener("click", toggleDarkMode)

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}
// Apply theme from profile
function applyThemeFromProfile() {
  const profileData = JSON.parse(localStorage.getItem("profileData") || "{}")

  if (profileData.selectedTheme) {
    // Remove any existing theme classes
    const themeClasses = ["theme-default", "theme-sunset", "theme-midnight", "theme-neon", "theme-nature"]
    document.body.classList.remove(...themeClasses)

    // Add selected theme class
    document.body.classList.add(getThemeClass(profileData.selectedTheme))
  }
}

// Get theme class from theme ID
function getThemeClass(themeId) {
  const themeMap = {
    default: "theme-default",
    "sunset-mode": "theme-sunset",
    "midnight-focus": "theme-midnight",
    "neon-hacker": "theme-neon",
    "nature-calm": "theme-nature",
  }

  return themeMap[themeId] || "theme-default"
}

// Listen for galaxy data updates
document.addEventListener("galaxyDataUpdated", () => {
  // Reload data and update UI
  let studyData = loadData()
  studyData = ensureAllAchievementsInitialized(studyData)
  updateUI(studyData)
})

// Initialize
let studyData = loadData()
studyData = ensureAllAchievementsInitialized(studyData)
updateUI(studyData)
