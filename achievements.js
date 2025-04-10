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
      // Don't add XP here to avoid duplicating XP
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
    icon: "fa-solid fa-calendar-check",
    condition: (data) => data.streak >= 30,
    progress: (data) => Math.min(data.streak, 30),
    target: 30,
    xp: 300,
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
    icon: "fa-solid fa-scroll",
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
    description: "polymath",
    icon: "fa-solid fa-brain",
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
    icon: "fa-solid fa-medal",
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
  },
  {
    id: "subject_master",
    title: "Subject Master",
    description: "Study the same subject for 5 hours total",
    icon: "fa-solid fa-book-bookmark",
    condition: (data) => {
      // This is simplified since we don't track subject totals perfectly
      // In a real app, you would aggregate by subject
      return false // Placeholder
    },
    progress: () => 0, // Placeholder
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
  {
    id: "streak_100",
    title: "Consistency Legend",
    description: "Maintain a 100-day study streak",
    icon: "fa-solid fa-fire-flame-curved",
    condition: (data) => data.streak >= 100,
    progress: (data) => Math.min(data.streak, 100),
    target: 100,
    xp: 1000,
  },
  {
    id: "streak_365",
    title: "Year-Long Scholar",
    description: "Maintain a 365-day study streak",
    icon: "fa-solid fa-calendar-xmark",
    condition: (data) => data.streak >= 365,
    progress: (data) => Math.min(data.streak, 365),
    target: 365,
    xp: 3650,
  },
  {
    id: "total_study_100h",
    title: "Scholar Legend",
    description: "Study for a total of 100 hours",
    icon: "fa-solid fa-wand-sparkles",
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
  },
  {
    id: "pomodoro_master",
    title: "Pomodoro Master",
    description: "Complete 50 pomodoro sessions",
    icon: "fa-solid fa-stopwatch",
    condition: (data) => {
      return data.pomodoroCount && data.pomodoroCount >= 50
    },
    progress: (data) => {
      return Math.min(data.pomodoroCount || 0, 50)
    },
    target: 50,
    xp: 250,
  },
  {
    id: "pomodoro_legend",
    title: "Pomodoro Legend",
    description: "Complete 100 pomodoro sessions",
    icon: "fa-solid fa-stopwatch-20",
    condition: (data) => {
      return data.pomodoroCount && data.pomodoroCount >= 100
    },
    progress: (data) => {
      return Math.min(data.pomodoroCount || 0, 100)
    },
    target: 100,
    xp: 500,
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
  },
  
]

// Add this function to display equipped badges
function displayEquippedBadges() {
  const equippedBadgesElement = document.getElementById("equipped-badges")
  if (!equippedBadgesElement) return

  // Load store data
  const storeData = JSON.parse(localStorage.getItem("storeData") || '{"inventory":[]}')

  // Filter equipped badges
  const equippedBadges = storeData.inventory.filter((item) => item.id.startsWith("badge_") && item.equipped)

  // Clear existing badges
  equippedBadgesElement.innerHTML = ""

  if (equippedBadges.length === 0) {
    equippedBadgesElement.innerHTML =
      '<p class="empty-inventory">You haven\'t equipped any badges yet. Visit the store to purchase and equip badges!</p>'
    return
  }

  // Define badge data (same as in store.js)
  const badgeData = {
    badge_master_scholar: {
      name: "Master Scholar",
      description: "For the dedicated learner",
      icon: "fa-solid fa-graduation-cap",
      animation: "pulse",
    },
    badge_time_wizard: {
      name: "Time Wizard",
      description: "Master of time management",
      icon: "fa-solid fa-clock",
      animation: "rotate",
    },
    badge_knowledge_seeker: {
      name: "Knowledge Seeker",
      description: "Always curious, always learning",
      icon: "fa-solid fa-book-open",
      animation: "sparkle",
    },
    badge_focus_master: {
      name: "Focus Master",
      description: "Exceptional concentration skills",
      icon: "fa-solid fa-bullseye",
      animation: "pulse",
    },
    badge_night_owl: {
      name: "Night Owl Pro",
      description: "Premium version of Night Owl",
      icon: "fa-solid fa-moon",
      animation: "sparkle",
    },
    badge_early_riser: {
      name: "Early Riser Pro",
      description: "Premium version of Early Bird",
      icon: "fa-solid fa-sun",
      animation: "rotate",
    },
  }

  // Add badges to the grid with the new compact style
  equippedBadges.forEach((badge) => {
    const badgeInfo = badgeData[badge.id]
    if (!badgeInfo) return

    const badgeElement = document.createElement("div")
    badgeElement.className = `badge-item badge-animated ${badgeInfo.animation}`

    badgeElement.innerHTML = `
      <div class="badge-icon">
        <i class="${badgeInfo.icon}"></i>
      </div>
      <div class="badge-details">
        <p class="badge-name">${badgeInfo.name}</p>
        <p class="badge-description">${badgeInfo.description}</p>
      </div>
    `

    equippedBadgesElement.appendChild(badgeElement)
  })
}

// Update UI
function updateUI(data) {
  // Existing code...

  // Update stats
  totalXpElement.textContent = `${data.xp} XP`

  // Fix achievement counting by checking all achievements
  let unlockedCount = 0
  allAchievements.forEach((achievement) => {
    if (data.achievements[achievement.id] && data.achievements[achievement.id].unlocked) {
      unlockedCount++
    }
  })
  achievementsCountElement.textContent = `${unlockedCount}/48`

  streakCountElement.textContent = `${data.streak} days`

  // Update achievements list
  updateAchievementsList(data)

  // Display equipped badges
  displayEquippedBadges()

  // Load theme if saved
  const savedThemeId = localStorage.getItem("themeId")
  if (savedThemeId) {
    const storeData = JSON.parse(localStorage.getItem("storeData") || '{"inventory":[]}')
    const theme = storeData.inventory.find((item) => item.id === savedThemeId)
    if (theme) {
      applyThemeToUI(savedThemeId)
    }
  }
}

// Add this function to apply theme
function applyThemeToUI(themeId) {
  // Remove existing theme classes
  document.body.classList.remove("theme-dark-forest", "theme-ocean-blue", "theme-sunset")

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
  }
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
      // We don't add XP here to avoid duplicating XP when viewing the page
    }

    // Create achievement element
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
}

// Event Listeners
themeToggle.addEventListener("click", toggleDarkMode)

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}
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

// Initialize
let studyData = loadData()
studyData = ensureAllAchievementsInitialized(studyData)
updateUI(studyData)

