// Statistics and Insights Module
// This module handles the calculation and display of study statistics.
// DOM Elements
const totalStudyTimeElement = document.getElementById("total-study-time")
const weeklyAverageElement = document.getElementById("weekly-average")
const monthlyAverageElement = document.getElementById("monthly-average")
const subjectStatsListElement = document.getElementById("subject-stats-list")
const themeToggle = document.querySelector(".theme-toggle")

// Add these DOM elements at the top
const calendarMonthElement = document.getElementById("calendar-month")
const calendarGridElement = document.getElementById("calendar-grid")
const prevMonthButton = document.getElementById("prev-month")
const nextMonthButton = document.getElementById("next-month")

// Add insight elements
const productiveDayInsightElement = document.getElementById("productive-day-insight")
const bestTimeInsightElement = document.getElementById("best-time-insight")
const skipDayInsightElement = document.getElementById("skip-day-insight")
const favoriteSubjectInsightElement = document.getElementById("favorite-subject-insight")

// Add new insight elements
const weeklyXpInsightElement = document.getElementById("weekly-xp-insight")
const focusDurationInsightElement = document.getElementById("focus-duration-insight")
const weeklyCompletionInsightElement = document.getElementById("weekly-completion-insight")
const longestSessionHighlightElement = document.getElementById("longest-session-highlight")
const bestStreakHighlightElement = document.getElementById("best-streak-highlight")
const missedGoalHighlightElement = document.getElementById("missed-goal-highlight")
const weeklyComparisonHighlightElement = document.getElementById("weekly-comparison-highlight")

// Add these DOM elements at the top with the other DOM element declarations
const retentionTopicListElement = document.getElementById("retention-topic-list")
const timeframeButtons = document.querySelectorAll(".timeframe-btn")

// Add these DOM elements at the top
const statsTabButtons = document.querySelectorAll(".stats-tab")
const tabContents = document.querySelectorAll(".tab-content")

// Add Study IQ DOM elements
const studyIqScoreDisplayElement = document.getElementById("study-iq-score-display")
const studyIqMiniProgressElement = document.getElementById("study-iq-mini-progress")
const studyIqScoreElement = document.getElementById("study-iq-score")
const studyIqFeedbackElement = document.getElementById("study-iq-feedback")
const consistencyScoreElement = document.getElementById("consistency-score")
const consistencyProgressElement = document.getElementById("consistency-progress")
const diversityScoreElement = document.getElementById("diversity-score")
const diversityProgressElement = document.getElementById("diversity-progress")
const sessionLengthScoreElement = document.getElementById("session-length-score")
const sessionLengthProgressElement = document.getElementById("session-length-progress")
const distributionRatingElement = document.getElementById("distribution-rating")
const subjectIqGridElement = document.getElementById("subject-iq-grid")

// Charts
let weeklyChart
let monthlyChart
let tagsChart
let streakChart

// Add these chart variables
let subjectDistributionChart
let studyIqHistoryChart

// Add these variables for calendar
const currentCalendarDate = new Date()

// Load data from localStorage
// Update the loadData function to ensure we have dailySessions and studyIqHistory
function loadData() {
  const savedData = localStorage.getItem("studyTrackerData")
  if (savedData) {
    const data = JSON.parse(savedData)

    // Ensure streak is a number
    if (typeof data.streak !== "number") {
      data.streak = 0
    }

    // Ensure we have dailySessions
    if (!data.dailySessions) {
      data.dailySessions = {}
    }

    // Ensure we have studyIqHistory
    if (!data.studyIqHistory) {
      data.studyIqHistory = {}
    }

    // Ensure we have subjectIqScores
    if (!data.subjectIqScores) {
      data.subjectIqScores = {}
    }

    return data
  }
  return {
    currentDay: new Date().toLocaleDateString(),
    sessions: [],
    dailyTotals: {},
    dailySessions: {},
    streak: 0,
    lastStudyDate: null,
    xp: 0,
    achievements: {},
    activeGoals: [],
    completedGoals: [],
    studyIqHistory: {},
    subjectIqScores: {},
  }
}

// Save data to localStorage
function saveData(data) {
  localStorage.setItem("studyTrackerData", JSON.stringify(data))
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))

  // Update chart colors
  updateCharts()
}

// Update the updateUI function to fix the double-counting issue
function updateUI(data) {
  // Calculate total study time - FIX: Only count dailyTotals for past days, not today
  const today = new Date().toLocaleDateString()

  // Get the sum of all past days (excluding today)
  const dailyTotals = data.dailyTotals || {}
  const pastDaysTotal = Object.entries(dailyTotals)
    .filter(([dateStr]) => dateStr !== today)
    .reduce((sum, [_, val]) => sum + val, 0)

  // Add today's sessions
  const todayTotal = data.sessions.reduce((sum, session) => sum + session.time, 0)

  // Total minutes is the sum of past days and today
  const totalMinutes = pastDaysTotal + todayTotal

  // Update stats
  totalStudyTimeElement.textContent = formatTime(totalMinutes)

  // Calculate weekly and monthly averages with the fixed calculation
  const { weeklyAvg, monthlyAvg } = calculateAverages(data)
  weeklyAverageElement.textContent = `${Math.round(weeklyAvg)} min/day`
  monthlyAverageElement.textContent = `${Math.round(monthlyAvg)} min/day`

  // Update subject stats
  updateSubjectStats(data)

  // Update charts
  updateCharts(data)

  // Update calendar
  if (calendarGridElement) {
    updateCalendar(data)
  }

  // Generate and update personalized insights
  updatePersonalizedInsights(data)

  // Generate and update new insights
  updateContextAnalysis(data)
  updateProgressConsistency(data)
  updateAchievementHighlights(data)

  // Update Study IQ Score
  updateStudyIqScore(data)

  // Update topic retention strength with default timeframe (7 days)
  updateTopicRetentionStrength(data, 7)
}

// Format time (minutes to hours and minutes)
function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Update the calculateAverages function to fix the double-counting issue
function calculateAverages(data) {
  const today = new Date().toLocaleDateString()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  let weeklyTotal = 0
  let weeklyDays = 0
  let monthlyTotal = 0
  let monthlyDays = 0

  // Include today's sessions
  const todayTotal = data.sessions.reduce((sum, session) => sum + session.time, 0)
  if (todayTotal > 0) {
    weeklyTotal += todayTotal
    monthlyTotal += todayTotal
    weeklyDays++
    monthlyDays++
  }

  // Process historical data (excluding today)
  Object.entries(data.dailyTotals).forEach(([dateStr, total]) => {
    // Skip today as we've already counted it
    if (dateStr === today) return

    const date = new Date(dateStr)

    if (date >= oneWeekAgo && date < new Date()) {
      weeklyTotal += total
      weeklyDays++
    }

    if (date >= oneMonthAgo && date < new Date()) {
      monthlyTotal += total
      monthlyDays++
    }
  })

  const weeklyAvg = weeklyDays > 0 ? weeklyTotal / weeklyDays : 0
  const monthlyAvg = monthlyDays > 0 ? monthlyTotal / monthlyDays : 0

  return { weeklyAvg, monthlyAvg }
}

// Update the updateSubjectStats function to fix the double-counting issue
function updateSubjectStats(data) {
  subjectStatsListElement.innerHTML = ""
  const today = new Date().toLocaleDateString()

  // Collect all subjects and their total time
  const subjects = {}

  // Add today's sessions
  data.sessions.forEach((session) => {
    if (!subjects[session.subject]) {
      subjects[session.subject] = 0
    }
    subjects[session.subject] += session.time
  })

  // Add historical sessions if available (excluding today)
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      // Skip today as we've already counted it
      if (dateStr === today) return

      sessions.forEach((session) => {
        if (!subjects[session.subject]) {
          subjects[session.subject] = 0
        }
        subjects[session.subject] += session.time
      })
    })
  }

  // Sort subjects by total time (descending)
  const sortedSubjects = Object.entries(subjects).sort((a, b) => b[1] - a[1])

  if (sortedSubjects.length === 0) {
    const emptyMessage = document.createElement("p")
    emptyMessage.textContent = "No study data available."
    emptyMessage.className = "empty-message"
    subjectStatsListElement.appendChild(emptyMessage)
    return
  }

  // Create subject stat items
  sortedSubjects.forEach(([subject, time]) => {
    const subjectItem = document.createElement("div")
    subjectItem.className = "subject-stat-item"

    const subjectName = document.createElement("div")
    subjectName.className = "subject-name"
    subjectName.textContent = subject

    const subjectTime = document.createElement("div")
    subjectTime.className = "subject-time"
    subjectTime.textContent = formatTime(time)

    subjectItem.appendChild(subjectName)
    subjectItem.appendChild(subjectTime)

    subjectStatsListElement.appendChild(subjectItem)
  })
}

// Update charts
function updateCharts(data) {
  updateWeeklyChart(data)
  updateMonthlyChart(data)
  updateTagsChart(data)
  updateStreakChart(data)
}

// Update the updateWeeklyChart function to fix the double-counting issue
function updateWeeklyChart(data) {
  const ctx = document.getElementById("weekly-chart").getContext("2d")
  const today = new Date().toLocaleDateString()

  // Prepare data for the past 7 days
  const labels = []
  const values = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString()

    labels.push(formatDate(date))

    // Get study time for this day
    let studyTime = 0
    if (i === 0) {
      // Today - use current sessions
      studyTime = data.sessions.reduce((sum, session) => sum + session.time, 0)
    } else if (data.dailyTotals[dateStr]) {
      // Past days - use daily totals
      studyTime = data.dailyTotals[dateStr]
    }

    values.push(studyTime)
  }

  // Destroy previous chart if it exists
  if (weeklyChart) {
    weeklyChart.destroy()
  }

  // Create new chart
  weeklyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Study Time (minutes)",
          data: values,
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          borderColor: "rgba(76, 175, 80, 1)",
          borderWidth: 2,
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          ticks: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
        },
      },
    },
  })
}

// Update the updateMonthlyChart function to fix the double-counting issue
function updateMonthlyChart(data) {
  const ctx = document.getElementById("monthly-chart").getContext("2d");
  const today = new Date();

  const labels = [];
  const values = [];

  for (let i = 4; i >= 0; i--) {
    const endDate = new Date();
    endDate.setDate(today.getDate() - i * 7);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    let weekTotal = 0;

    // Only process dates up to today
    for (let j = 0; j < 7; j++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + j);

      // Skip future dates
      if (date > today) break;

      const dateStr = date.toLocaleDateString();

      let studyTime = 0;
      if (dateStr === today.toLocaleDateString()) {
        studyTime = data.sessions.reduce((sum, session) => sum + session.time, 0);
      } else if (data.dailyTotals[dateStr]) {
        studyTime = data.dailyTotals[dateStr];
      }

      weekTotal += studyTime;
    }

    labels.push(`Week ${5 - i}`);
    values.push(weekTotal);
  }

  if (monthlyChart) {
    monthlyChart.destroy();
  }

  monthlyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Weekly Study Time (minutes)",
          data: values,
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          borderColor: "rgba(255, 152, 0, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Add this function to update the tags chart
function updateTagsChart(data) {
  const ctx = document.getElementById("tags-chart")
  if (!ctx) return

  const today = new Date().toLocaleDateString()

  // Initialize tag categories
  const tagCategories = {
    Learning: 0,
    Review: 0,
    Practice: 0,
    Other: 0,
  }

  // Process today's sessions
  data.sessions.forEach((session) => {
    const tag = session.tag ? session.tag.toLowerCase() : "other"

    if (tag.includes("learn") || tag.includes("new")) {
      tagCategories["Learning"] += session.time
    } else if (tag.includes("review") || tag.includes("revision")) {
      tagCategories["Review"] += session.time
    } else if (tag.includes("practice") || tag.includes("exercise")) {
      tagCategories["Practice"] += session.time
    } else {
      tagCategories["Other"] += session.time
    }
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      if (dateStr === today) return // Skip today as we've already counted it

      sessions.forEach((session) => {
        const tag = session.tag ? session.tag.toLowerCase() : "other"

        if (tag.includes("learn") || tag.includes("new")) {
          tagCategories["Learning"] += session.time
        } else if (tag.includes("review") || tag.includes("revision")) {
          tagCategories["Review"] += session.time
        } else if (tag.includes("practice") || tag.includes("exercise")) {
          tagCategories["Practice"] += session.time
        } else {
          tagCategories["Other"] += session.time
        }
      })
    })
  }

  // Prepare chart data
  const labels = Object.keys(tagCategories)
  const values = Object.values(tagCategories)

  // Define colors for each category
  const colors = [
    "rgba(33, 150, 243, 0.7)", // Learning - Blue
    "rgba(156, 39, 176, 0.7)", // Review - Purple
    "rgba(76, 175, 80, 0.7)", // Practice - Green
    "rgba(158, 158, 158, 0.7)", // Other - Gray
  ]

  // Destroy previous chart if it exists
  if (tagsChart) {
    tagsChart.destroy()
  }

  // Create new chart
  tagsChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
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
              return `${label}: ${formatTime(value)} (${percentage}%)`
            },
          },
        },
      },
    },
  })
}

// Add this function to update the streak chart
function updateStreakChart(data) {
  const ctx = document.getElementById("streak-chart")
  if (!ctx) return

  // Get streak history for the last 30 days
  const streakHistory = getStreakHistory(data)

  // Prepare chart data
  const labels = streakHistory.map((item) => item.date)
  const values = streakHistory.map((item) => item.streak)

  // Destroy previous chart if it exists
  if (streakChart) {
    streakChart.destroy()
  }

  // Create new chart
  streakChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Streak",
          data: values,
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          borderColor: "rgba(255, 152, 0, 1)",
          borderWidth: 2,
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
        },
      },
    },
  })
}

// Helper function to get streak history
function getStreakHistory(data) {
  const history = []
  const today = new Date()

  // Get the current streak
  const currentStreak = data.streak || 0

  // Create a map of dates with study activity
  const studyDates = new Set()

  // Add dates from dailyTotals
  Object.entries(data.dailyTotals).forEach(([dateStr, total]) => {
    if (total > 0) {
      studyDates.add(dateStr)
    }
  })

  // Add today if there are sessions
  if (data.sessions.length > 0) {
    studyDates.add(today.toLocaleDateString())
  }

  // Calculate streak for each day in the past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString()

    // For past days, calculate a realistic streak value
    // This is an approximation since we don't have the actual streak history
    let streakValue = 0

    if (i === 0 && currentStreak > 0) {
      // For today, use the current streak
      streakValue = currentStreak
    } else if (studyDates.has(dateStr)) {
      // If there was study activity on this day, use a value based on proximity to today
      // The closer to today, the closer to the current streak
      const proximity = 1 - i / 30
      streakValue = Math.max(1, Math.floor(currentStreak * proximity))
    }

    history.push({
      date: formatDate(date),
      streak: streakValue,
    })
  }

  return history
}

// Format date (e.g., "Mon 15")
function formatDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return `${days[date.getDay()]} ${date.getDate()}`
}

// Add this function to update the calendar
function updateCalendar(data) {
  // Set the month and year in the header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  calendarMonthElement.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`

  // Clear the grid
  calendarGridElement.innerHTML = ""

  // Get the first day of the month
  const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1)
  const startingDay = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Get the last day of the month
  const lastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0)
  const totalDays = lastDay.getDate()

  // Get the last day of the previous month
  const prevMonthLastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 0).getDate()

  // Create calendar grid
  let dayCount = 1
  let nextMonthDay = 1

  // Calculate total rows needed (6 to ensure we have enough space for all months)
  const totalCells = 42 // 6 rows * 7 days

  for (let i = 0; i < totalCells; i++) {
    const dayElement = document.createElement("div")
    dayElement.className = "calendar-day"

    // Previous month days
    if (i < startingDay) {
      const prevMonthDate = prevMonthLastDay - (startingDay - i - 1)
      dayElement.innerHTML = `<div class="calendar-day-number">${prevMonthDate}</div>`
      dayElement.classList.add("other-month")

      // Get the date for this cell
      const cellDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, prevMonthDate)
      populateDayCell(dayElement, cellDate, data)
    }
    // Current month days
    else if (i < startingDay + totalDays) {
      const isToday = isCurrentDay(dayCount)
      if (isToday) {
        dayElement.classList.add("current-day")
      }

      dayElement.innerHTML = `<div class="calendar-day-number">${dayCount}</div>`

      // Get the date for this cell
      const cellDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayCount)
      populateDayCell(dayElement, cellDate, data)

      dayCount++
    }
    // Next month days
    else {
      dayElement.innerHTML = `<div class="calendar-day-number">${nextMonthDay}</div>`
      dayElement.classList.add("other-month")

      // Get the date for this cell
      const cellDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, nextMonthDay)
      populateDayCell(dayElement, cellDate, data)

      nextMonthDay++
    }

    calendarGridElement.appendChild(dayElement)
  }
}

// Helper function to check if a day is the current day
function isCurrentDay(day) {
  const today = new Date()
  return (
    day === today.getDate() &&
    currentCalendarDate.getMonth() === today.getMonth() &&
    currentCalendarDate.getFullYear() === today.getFullYear()
  )
}

// Update the populateDayCell function to fix the double-counting issue
function populateDayCell(dayElement, date, data) {
  const dateString = date.toLocaleDateString()
  const today = new Date().toLocaleDateString()
  let totalMinutes = 0
  let sessions = []

  // For today, use current sessions
  if (dateString === today) {
    totalMinutes = data.sessions.reduce((sum, session) => sum + session.time, 0)
    sessions = [...data.sessions]
  }
  // For past days, use daily totals and sessions
  else if (data.dailyTotals[dateString]) {
    totalMinutes = data.dailyTotals[dateString]

    // If we have dailySessions data, get the sessions
    if (data.dailySessions && data.dailySessions[dateString]) {
      sessions = data.dailySessions[dateString]
    }
  }

  // Add minutes to the day cell
  if (totalMinutes > 0) {
    const minutesElement = document.createElement("div")
    minutesElement.className = "calendar-day-minutes"
    minutesElement.textContent = `${totalMinutes} min`
    dayElement.appendChild(minutesElement)

    // Color the cell based on study intensity
    if (totalMinutes < 30) {
      dayElement.style.backgroundColor = "#c8e6c9" // Light green
    } else if (totalMinutes < 60) {
      dayElement.style.backgroundColor = "#81c784" // Medium green
    } else if (totalMinutes < 120) {
      dayElement.style.backgroundColor = "#4caf50" // Regular green
    } else {
      dayElement.style.backgroundColor = "#2e7d32" // Dark green
    }

    // Add tooltip with session details
    if (sessions.length > 0) {
      const tooltip = document.createElement("div")
      tooltip.className = "calendar-tooltip"

      // Group sessions by subject
      const subjectMap = {}
      sessions.forEach((session) => {
        if (!subjectMap[session.subject]) {
          subjectMap[session.subject] = 0
        }
        subjectMap[session.subject] += session.time
      })

      // Create tooltip content
      let tooltipContent = `<div class="tooltip-date">${date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>`
      tooltipContent += `<div class="tooltip-total">Total: ${totalMinutes} minutes</div>`

      // Add subject breakdown
      Object.keys(subjectMap).forEach((subject) => {
        tooltipContent += `<div class="tooltip-subject">${subject}: ${subjectMap[subject]} min</div>`

        // Add session details for this subject
        const subjectSessions = sessions.filter((s) => s.subject === subject)
        subjectSessions.forEach((session) => {
          tooltipContent += `<div class="tooltip-session">
            <span>${session.time} min</span>
            ${session.tag ? `<span>${session.tag}</span>` : ""}
          </div>`
        })
      })

      tooltip.innerHTML = tooltipContent
      dayElement.appendChild(tooltip)
    }
  }
}

// Add this function to generate and update personalized insights
function updatePersonalizedInsights(data) {
  // Only generate insights if we have enough data
  if (Object.keys(data.dailyTotals).length === 0 && data.sessions.length === 0) {
    setInsightText("productive-day-insight", "Not enough data yet. Keep studying!")
    setInsightText("best-time-insight", "Not enough data yet. Keep studying!")
    setInsightText("skip-day-insight", "Not enough data yet. Keep studying!")
    setInsightText("favorite-subject-insight", "Not enough data yet. Keep studying!")
    return
  }

  // Generate insights
  generateMostProductiveDayInsight(data)
  generateBestStudyTimeInsight(data)
  generateSkipDayInsight(data)
  generateFavoriteSubjectInsight(data)
}

// Add this function to update context analysis insights
function updateContextAnalysis(data) {
  // Only generate insights if we have enough data
  if (Object.keys(data.dailyTotals).length === 0 && data.sessions.length === 0) {
    setInsightText("weekly-xp-insight", "Not enough data yet. Keep studying!")
    setInsightText("focus-duration-insight", "Not enough data yet. Keep studying!")
    return
  }

  // Generate insights
  generateWeeklyXpInsight(data)
  generateFocusDurationInsight(data)
}

// Add this function to update progress and consistency insights
function updateProgressConsistency(data) {
  // Only generate insights if we have enough data
  if (Object.keys(data.dailyTotals).length === 0 && data.sessions.length === 0) {
    setInsightText("weekly-completion-insight", "Not enough data yet. Keep studying!")
    return
  }

  // Generate insights
  generateWeeklyCompletionInsight(data)
}

// Add this function to update achievement highlights
function updateAchievementHighlights(data) {
  // Only generate highlights if we have enough data
  if (Object.keys(data.dailyTotals).length === 0 && data.sessions.length === 0) {
    setHighlightText("longest-session-highlight", "Not enough data yet. Keep studying!")
    setHighlightText("best-streak-highlight", "Not enough data yet. Keep studying!")
    setHighlightText("missed-goal-highlight", "Not enough data yet. Keep studying!")
    setHighlightText("weekly-comparison-highlight", "Not enough data yet. Keep studying!")
    return
  }

  // Generate highlights
  generateLongestSessionHighlight(data)
  generateBestStreakHighlight(data)
  generateMissedGoalHighlight(data)
  generateWeeklyComparisonHighlight(data)
}

// Helper function to set insight text
function setInsightText(insightId, text) {
  const insightElement = document.getElementById(insightId)
  if (insightElement) {
    const textElement = insightElement.querySelector(".insight-text")
    if (textElement) {
      textElement.textContent = text
    }
  }
}

// Helper function to set highlight text
function setHighlightText(highlightId, text) {
  const highlightElement = document.getElementById(highlightId)
  if (highlightElement) {
    const textElement = highlightElement.querySelector(".highlight-text")
    if (textElement) {
      textElement.textContent = text
    }
  }
}

// Generate insight for most productive day
function generateMostProductiveDayInsight(data) {
  const today = new Date().toLocaleDateString()
  const dayTotals = [0, 0, 0, 0, 0, 0, 0] // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  const dayCount = [0, 0, 0, 0, 0, 0, 0]

  // Process historical data
  Object.entries(data.dailyTotals).forEach(([dateStr, total]) => {
    if (dateStr === today) return // Skip today

    const date = new Date(dateStr)
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.

    dayTotals[dayOfWeek] += total
    dayCount[dayOfWeek]++
  })

  // Add today's data
  const todayDate = new Date()
  const todayDayOfWeek = todayDate.getDay()
  const todayTotal = data.sessions.reduce((sum, session) => sum + session.time, 0)

  if (todayTotal > 0) {
    dayTotals[todayDayOfWeek] += todayTotal
    dayCount[todayDayOfWeek]++
  }

  // Calculate average per day
  const dayAverages = dayTotals.map((total, index) => {
    return dayCount[index] > 0 ? total / dayCount[index] : 0
  })

  // Find the most productive day
  let maxAvg = 0
  let maxDay = 0

  dayAverages.forEach((avg, index) => {
    if (avg > maxAvg) {
      maxAvg = avg
      maxDay = index
    }
  })

  // Only show insight if we have meaningful data
  if (maxAvg > 0) {
    const days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"]
    setInsightText(
      "productive-day-insight",
      `You're most productive on ${days[maxDay]} with an average of ${Math.round(maxAvg)} minutes.`,
    )
  } else {
    setInsightText("productive-day-insight", "Not enough data yet. Keep studying!")
  }
}

// Generate insight for best study time
function generateBestStudyTimeInsight(data) {
  const hourlyData = Array(24)
    .fill(0)
    .map(() => ({ total: 0, count: 0 }))
  const today = new Date().toLocaleDateString()

  // Process today's sessions
  data.sessions.forEach((session) => {
    if (session.startTime) {
      const hour = new Date(session.startTime).getHours()
      hourlyData[hour].total += session.time
      hourlyData[hour].count++
    }
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      if (dateStr === today) return // Skip today as we've already counted it

      sessions.forEach((session) => {
        if (session.startTime) {
          const hour = new Date(session.startTime).getHours()
          hourlyData[hour].total += session.time
          hourlyData[hour].count++
        }
      })
    })
  }

  // Calculate average duration per hour
  const hourlyAverages = hourlyData.map((data, hour) => {
    return {
      hour,
      avg: data.count > 0 ? data.total / data.count : 0,
    }
  })

  // Find the best hour
  let bestHour = 0
  let bestAvg = 0

  hourlyAverages.forEach(({ hour, avg }) => {
    if (avg > bestAvg) {
      bestAvg = avg
      bestHour = hour
    }
  })

  // Find if there's a best time range (consecutive hours with high averages)
  const threshold = bestAvg * 0.8 // 80% of the best average
  let bestStartHour = bestHour
  let bestEndHour = bestHour

  // Check for consecutive hours before the best hour
  let currentHour = bestHour - 1
  while (currentHour >= 0 && hourlyAverages[currentHour].avg >= threshold) {
    bestStartHour = currentHour
    currentHour--
  }

  // Check for consecutive hours after the best hour
  currentHour = bestHour + 1
  while (currentHour < 24 && hourlyAverages[currentHour].avg >= threshold) {
    bestEndHour = currentHour
    currentHour++
  }

  // Format the time range
  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${displayHour} ${period}`
  }

  // Only show insight if we have meaningful data
  if (bestAvg > 0) {
    if (bestStartHour === bestEndHour) {
      setInsightText(
        "best-time-insight",
        `You study best at ${formatHour(bestHour)} with an average of ${Math.round(bestAvg)} minutes per session.`,
      )
    } else {
      setInsightText(
        "best-time-insight",
        `You study best between ${formatHour(bestStartHour)} – ${formatHour(bestEndHour)} with an average of ${Math.round(bestAvg)} minutes per session.`,
      )
    }
  } else {
    setInsightText("best-time-insight", "Not enough data yet. Keep studying!")
  }
}

// Generate insight for days most likely to skip studying
function generateSkipDayInsight(data) {
  const dayStudied = [0, 0, 0, 0, 0, 0, 0] // Count of days studied
  const dayTotal = [0, 0, 0, 0, 0, 0, 0] // Total days observed

  // Get the earliest date in the data
  let earliestDate = new Date()
  Object.keys(data.dailyTotals).forEach((dateStr) => {
    const date = new Date(dateStr)
    if (date < earliestDate) {
      earliestDate = date
    }
  })

  // If we have less than a week of data, use a week as the minimum
  const minDate = new Date()
  minDate.setDate(minDate.getDate() - 7)
  if (earliestDate > minDate) {
    earliestDate = minDate
  }

  // Count days from earliest date to today
  const today = new Date()
  const currentDate = new Date(earliestDate)

  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay()
    const dateStr = currentDate.toLocaleDateString()

    dayTotal[dayOfWeek]++

    // Check if studied on this day
    if (data.dailyTotals[dateStr] && data.dailyTotals[dateStr] > 0) {
      dayStudied[dayOfWeek]++
    } else if (dateStr === today.toLocaleDateString() && data.sessions.length > 0) {
      // Check today's sessions
      dayStudied[dayOfWeek]++
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Calculate percentage of days studied for each day of the week
  const dayPercentages = dayTotal.map((total, index) => {
    return total > 0 ? (dayStudied[index] / total) * 100 : 0
  })

  // Find the day with the lowest percentage
  let minPercentage = 100
  let minDay = 0

  dayPercentages.forEach((percentage, index) => {
    if (dayTotal[index] >= 2 && percentage < minPercentage) {
      minPercentage = percentage
      minDay = index
    }
  })

  // Only show insight if we have meaningful data
  if (Math.min(...dayTotal) >= 2) {
    const days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"]
    setInsightText(
      "skip-day-insight",
      `You tend to skip studying on ${days[minDay]} (${Math.round(minPercentage)}% study rate vs. ${Math.round(average(dayPercentages))}% average).`,
    )
  } else {
    setInsightText("skip-day-insight", "Not enough data yet. Keep studying!")
  }
}

// Helper function to calculate average
function average(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length
}

// Generate insight for favorite subject
function generateFavoriteSubjectInsight(data) {
  const today = new Date().toLocaleDateString()
  const subjects = {}
  const subjectSessions = {}

  // Process today's sessions
  data.sessions.forEach((session) => {
    if (!subjects[session.subject]) {
      subjects[session.subject] = 0
      subjectSessions[session.subject] = 0
    }
    subjects[session.subject] += session.time
    subjectSessions[session.subject]++
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      if (dateStr === today) return // Skip today

      sessions.forEach((session) => {
        if (!subjects[session.subject]) {
          subjects[session.subject] = 0
          subjectSessions[session.subject] = 0
        }
        subjects[session.subject] += session.time
        subjectSessions[session.subject]++
      })
    })
  }

  // Find the subject with the most time
  let favoriteSubject = ""
  let maxTime = 0

  Object.entries(subjects).forEach(([subject, time]) => {
    if (time > maxTime) {
      maxTime = time
      favoriteSubject = subject
    }
  })

  // Only show insight if we have meaningful data
  if (favoriteSubject) {
    const sessionCount = subjectSessions[favoriteSubject]
    const avgTime = Math.round(maxTime / sessionCount)

    setInsightText(
      "favorite-subject-insight",
      `Your favorite subject is ${favoriteSubject} with ${formatTime(maxTime)} total (${sessionCount} sessions, avg ${avgTime} min each).`,
    )
  } else {
    setInsightText("favorite-subject-insight", "Not enough data yet. Keep studying!")
  }
}

// Generate weekly XP insight
function generateWeeklyXpInsight(data) {
  // Get the start of the current week (Sunday)
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // Get the end of the week (Saturday)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  // Track XP by subject for the current week
  const subjectXP = {}
  let totalXP = 0

  // Process this week's XP
  // Note: In a real app, you would need to track XP earned per session and per subject
  // For this example, we'll estimate XP based on study time (1 XP per minute)

  // Process today's sessions
  data.sessions.forEach((session) => {
    if (!subjectXP[session.subject]) {
      subjectXP[session.subject] = 0
    }

    // Assume 1 XP per minute
    const sessionXP = session.time
    subjectXP[session.subject] += sessionXP
    totalXP += sessionXP
  })

  // Process other days this week
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      const sessionDate = new Date(dateStr)

      // Skip if not in current week
      if (sessionDate < startOfWeek || sessionDate > endOfWeek) return
      // Skip today as we've already counted it
      if (dateStr === today.toLocaleDateString()) return

      sessions.forEach((session) => {
        if (!subjectXP[session.subject]) {
          subjectXP[session.subject] = 0
        }

        // Assume 1 XP per minute
        const sessionXP = session.time
        subjectXP[session.subject] += sessionXP
        totalXP += sessionXP
      })
    })
  }

  // Sort subjects by XP earned
  const sortedSubjects = Object.entries(subjectXP)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3) // Get top 3 subjects

  // Generate insight text
  if (sortedSubjects.length > 0) {
    let insightText = `This week you earned ${totalXP} XP total: `

    const subjectTexts = sortedSubjects.map(([subject, xp]) => {
      return `${xp} XP from ${subject}`
    })

    insightText += subjectTexts.join(", ")

    setInsightText("weekly-xp-insight", insightText)
  } else {
    setInsightText("weekly-xp-insight", "No XP earned this week yet. Start studying!")
  }
}

// Generate focus duration trend insight
function generateFocusDurationInsight(data) {
  const today = new Date()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)

  const twoWeeksAgo = new Date(oneWeekAgo)
  twoWeeksAgo.setDate(oneWeekAgo.getDate() - 7)

  // Track session durations for current week and previous week
  const currentWeekSessions = []
  const previousWeekSessions = []

  // Process today's sessions
  data.sessions.forEach((session) => {
    currentWeekSessions.push(session.time)
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      const sessionDate = new Date(dateStr)

      // Skip today as we've already counted it
      if (dateStr === today.toLocaleDateString()) return

      sessions.forEach((session) => {
        if (sessionDate >= oneWeekAgo && sessionDate <= today) {
          currentWeekSessions.push(session.time)
        } else if (sessionDate >= twoWeeksAgo && sessionDate < oneWeekAgo) {
          previousWeekSessions.push(session.time)
        }
      })
    })
  }

  // Calculate average session durations
  const currentWeekAvg =
    currentWeekSessions.length > 0
      ? currentWeekSessions.reduce((sum, duration) => sum + duration, 0) / currentWeekSessions.length
      : 0

  const previousWeekAvg =
    previousWeekSessions.length > 0
      ? previousWeekSessions.reduce((sum, duration) => sum + duration, 0) / previousWeekSessions.length
      : 0

  // Generate insight text
  if (currentWeekSessions.length > 0) {
    let insightText = `Your average session duration is ${Math.round(currentWeekAvg)} minutes`

    if (previousWeekSessions.length > 0) {
      const percentChange = ((currentWeekAvg - previousWeekAvg) / previousWeekAvg) * 100

      if (Math.abs(percentChange) >= 5) {
        if (percentChange > 0) {
          insightText += ` (↑ ${Math.round(percentChange)}% from last week)`
        } else {
          insightText += ` (↓ ${Math.round(Math.abs(percentChange))}% from last week)`
        }
      } else {
        insightText += " (similar to last week)"
      }
    }

    setInsightText("focus-duration-insight", insightText)
  } else {
    setInsightText("focus-duration-insight", "Not enough data yet. Keep studying!")
  }
}

// Generate weekly completion insight
function generateWeeklyCompletionInsight(data) {
  // In a real app, you would track goal completions in your data model
  // For this example, we'll generate a plausible completion rate

  // Get the start of the current week (Sunday)
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // Count days with study activity this week
  let daysWithActivity = 0
  const daysInWeek = Math.min(today.getDay() + 1, 7) // Count up to today

  // Check today
  if (data.sessions.length > 0) {
    daysWithActivity++
  }

  // Check previous days this week
  for (let i = 1; i < daysInWeek; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toLocaleDateString()

    if (data.dailyTotals[dateStr] && data.dailyTotals[dateStr] > 0) {
      daysWithActivity++
    }
  }

  // Calculate completion rate
  const completionRate = (daysWithActivity / daysInWeek) * 100

  // Generate insight text
  if (daysInWeek > 1) {
    setInsightText(
      "weekly-completion-insight",
      `You've studied on ${daysWithActivity} out of ${daysInWeek} days this week (${Math.round(completionRate)}% completion rate).`,
    )
  } else {
    setInsightText("weekly-completion-insight", "Week just started. Keep up your study streak!")
  }
}

// Generate longest session highlight
function generateLongestSessionHighlight(data) {
  let longestSession = 0
  let longestSessionDate = null
  let longestSessionSubject = ""

  // Check today's sessions
  data.sessions.forEach((session) => {
    if (session.time > longestSession) {
      longestSession = session.time
      longestSessionDate = new Date()
      longestSessionSubject = session.subject
    }
  })

  // Check historical sessions
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      sessions.forEach((session) => {
        if (session.time > longestSession) {
          longestSession = session.time
          longestSessionDate = new Date(dateStr)
          longestSessionSubject = session.subject
        }
      })
    })
  }

  // Generate highlight text
  if (longestSession > 0 && longestSessionDate) {
    const formattedDate = longestSessionDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    setHighlightText(
      "longest-session-highlight",
      `🔥 Longest session ever: ${longestSession} mins on ${formattedDate} (${longestSessionSubject})`,
    )
  } else {
    setHighlightText("longest-session-highlight", "No study sessions recorded yet.")
  }
}

// Generate best streak highlight
function generateBestStreakHighlight(data) {
  // Get the current streak
  const currentStreak = data.streak || 0

  // Get completed goals count
  let completedGoalsCount = 0

  // Count completed goals from activeGoals
  if (data.activeGoals) {
    completedGoalsCount = data.activeGoals.filter((goal) => goal.completed).length
  }

  // Add completed goals from completedGoals array if it exists
  if (data.completedGoals) {
    completedGoalsCount += data.completedGoals.length
  }

  // Generate highlight text
  if (currentStreak > 0) {
    setHighlightText(
      "best-streak-highlight",
      `🎯 Current streak: ${currentStreak} days with ${completedGoalsCount} goals completed`,
    )
  } else if (completedGoalsCount > 0) {
    setHighlightText("best-streak-highlight", `🎯 You've completed ${completedGoalsCount} goals so far`)
  } else {
    setHighlightText("best-streak-highlight", "No goal streaks recorded yet.")
  }
}

// Generate missed goal highlight
function generateMissedGoalHighlight(data) {
  // Check if we have any active goals that are not completed
  let missedGoals = []

  if (data.activeGoals) {
    missedGoals = data.activeGoals.filter((goal) => !goal.completed)
  }

  if (missedGoals.length > 0) {
    // Use actual missed goals data
    const missedGoal = missedGoals[0] // Take the first missed goal
    setHighlightText("missed-goal-highlight", `⚠️ Goal to focus on: ${missedGoal.title || "Current goal"} (in progress)`)
  } else {
    // No missed goals, show a motivational message
    setHighlightText("missed-goal-highlight", `✅ Great job! You're on track with your current goals.`)
  }
}

// Generate weekly comparison highlight
function generateWeeklyComparisonHighlight(data) {
  const today = new Date()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)

  const twoWeeksAgo = new Date(oneWeekAgo)
  twoWeeksAgo.setDate(oneWeekAgo.getDate() - 7)

  // Calculate total study time for current week
  let currentWeekTotal = 0

  // Add today's sessions
  currentWeekTotal += data.sessions.reduce((sum, session) => sum + session.time, 0)

  // Add other days in current week
  for (let i = 1; i <= today.getDay(); i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toLocaleDateString()

    if (data.dailyTotals[dateStr]) {
      currentWeekTotal += data.dailyTotals[dateStr]
    }
  }

  // Calculate total study time for previous week
  let previousWeekTotal = 0

  // Add days from previous week
  for (let i = 0; i < 7; i++) {
    const date = new Date(oneWeekAgo)
    date.setDate(oneWeekAgo.getDate() - i)
    const dateStr = date.toLocaleDateString()

    if (data.dailyTotals[dateStr]) {
      previousWeekTotal += data.dailyTotals[dateStr]
    }
  }

  // Generate highlight text
  if (previousWeekTotal > 0) {
    const percentChange = ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100

    if (percentChange >= 10) {
      setHighlightText(
        "weekly-comparison-highlight",
        `📈 You've studied ${Math.round(percentChange)}% more this week than last week!`,
      )
    } else if (percentChange <= -10) {
      setHighlightText(
        "weekly-comparison-highlight",
        `📉 You've studied ${Math.round(Math.abs(percentChange))}% less this week than last week.`,
      )
    } else {
      setHighlightText(
        "weekly-comparison-highlight",
        `📊 Your study time is similar to last week (${Math.round(percentChange)}% change).`,
      )
    }
  } else {
    setHighlightText("weekly-comparison-highlight", `📊 No data from last week to compare with.`)
  }
}

// Add event listeners for calendar navigation
if (prevMonthButton) {
  prevMonthButton.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1)
    updateCalendar(studyData)
  })
}

if (nextMonthButton) {
  nextMonthButton.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1)
    updateCalendar(studyData)
  })
}

// Add this function to calculate and update the Study IQ Score
function updateStudyIqScore(data) {
  // Get data for the past 7 days
  const today = new Date()
  const todayStr = today.toLocaleDateString()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)

  // 1. Calculate Consistency Score (% of days studied in past 7 days)
  const daysStudied = calculateDaysStudied(data, oneWeekAgo, today)
  const consistencyScore = Math.round((daysStudied / 7) * 100)

  // 2. Calculate Study Diversity Score (number of unique subjects in last 7 sessions)
  const uniqueSubjects = calculateUniqueSubjects(data)
  // Score out of 100, with 3+ subjects being optimal (100 points)
  const diversityScore = Math.min(100, Math.round((uniqueSubjects / 3) * 100))

  // 3. Calculate Session Length Score (average session length, ideal: 25-60 min)
  const avgSessionLength = calculateAverageSessionLength(data)
  let sessionLengthScore = 0

  if (avgSessionLength >= 25 && avgSessionLength <= 60) {
    // Ideal range: 25-60 minutes
    sessionLengthScore = 100
  } else if (avgSessionLength < 25) {
    // Too short: score decreases as it gets shorter
    sessionLengthScore = Math.round((avgSessionLength / 25) * 100)
  } else {
    // Too long: score decreases as it gets longer
    const overageRatio = Math.max(0, 1 - (avgSessionLength - 60) / 60)
    sessionLengthScore = Math.round(overageRatio * 100)
  }

  // 4. Calculate Energy Management Score (how well the user manages their energy)
  const energyManagementScore = calculateEnergyManagementScore(data)

  // Calculate overall Study IQ Score (weighted average)
  const studyIqScore = Math.round(
    consistencyScore * 0.35 + // 35% weight for consistency
      diversityScore * 0.25 + // 25% weight for diversity
      sessionLengthScore * 0.25 + // 25% weight for session length
      energyManagementScore * 0.15, // 15% weight for energy management
  )

  // Store today's Study IQ score in history
  if (!data.studyIqHistory) {
    data.studyIqHistory = {}
  }
  data.studyIqHistory[todayStr] = studyIqScore

  // Store subject IQ scores
  updateSubjectIqScoresData(data)

  // Save the updated data
  saveData(data)

  // Update the UI with the scores
  updateStudyIqUI(
    studyIqScore,
    consistencyScore,
    diversityScore,
    sessionLengthScore,
    uniqueSubjects,
    avgSessionLength,
    energyManagementScore,
  )

  // Update the subject distribution chart
  updateSubjectDistributionChart(data)

  // Update the Study IQ history chart
  updateStudyIqHistoryChart(data, studyIqScore)

  // Update the Subject IQ scores
  updateSubjectIqScores(data)
}

// Add this function to calculate energy management score
function calculateEnergyManagementScore(data) {
  // Load energy data
  const energyData = JSON.parse(localStorage.getItem("energySystemData") || '{"currentEnergy": 100}')
  const currentEnergy = energyData.currentEnergy || 100

  // Get recent sessions (last 10)
  const recentSessions = [...data.sessions]

  // Add historical sessions if needed to reach 10
  if (data.dailySessions) {
    const sortedDates = Object.keys(data.dailySessions).sort((a, b) => new Date(b) - new Date(a))

    for (const dateStr of sortedDates) {
      if (recentSessions.length >= 10) break
      recentSessions.push(...data.dailySessions[dateStr])
    }
  }

  // Limit to 10 most recent sessions
  const sessions = recentSessions.slice(0, 10)

  // Calculate average session length
  const avgLength = sessions.length > 0 ? sessions.reduce((sum, session) => sum + session.time, 0) / sessions.length : 0

  // Calculate score based on:
  // 1. Current energy level (40%)
  // 2. Average session length (optimal is 25-45 mins) (60%)

  const energyLevelScore = currentEnergy

  let sessionLengthScore = 0
  if (avgLength >= 25 && avgLength <= 45) {
    // Optimal range
    sessionLengthScore = 100
  } else if (avgLength < 25) {
    // Too short
    sessionLengthScore = Math.round((avgLength / 25) * 100)
  } else {
    // Too long
    sessionLengthScore = Math.max(0, 100 - ((avgLength - 45) / 45) * 100)
  }

  return Math.round(energyLevelScore * 0.4 + sessionLengthScore * 0.6)
}

// Update the updateStudyIqUI function to include energy management
function updateStudyIqUI(
  studyIqScore,
  consistencyScore,
  diversityScore,
  sessionLengthScore,
  uniqueSubjects,
  avgSessionLength,
  energyManagementScore,
) {
  // Update the mini score in the stats overview
  if (studyIqScoreDisplayElement) {
    studyIqScoreDisplayElement.textContent = studyIqScore
    studyIqMiniProgressElement.style.width = `${studyIqScore}%`
  }

  // Update overall Study IQ score
  if (studyIqScoreElement) {
    const scoreValueElement = studyIqScoreElement.querySelector(".score-value")
    if (scoreValueElement) {
      scoreValueElement.textContent = studyIqScore
    }

    // Update the score gradient based on the score
    let gradient
    if (studyIqScore >= 90) {
      gradient = "conic-gradient(#4caf50 0%, #8bc34a 100%)"
    } else if (studyIqScore >= 70) {
      gradient = "conic-gradient(#8bc34a 0%, #ffc107 100%)"
    } else if (studyIqScore >= 50) {
      gradient = "conic-gradient(#ffc107 0%, #ff9800 100%)"
    } else {
      gradient = "conic-gradient(#ff9800 0%, #f44336 100%)"
    }
    studyIqScoreElement.style.background = gradient
  }

  // Update feedback based on score
  if (studyIqFeedbackElement) {
    let feedback
    if (studyIqScore >= 90) {
      feedback = "You're killing it! Keep this momentum going!"
    } else if (studyIqScore >= 70) {
      feedback = "Great job. Try adding one more subject to your routine."
    } else if (studyIqScore >= 50) {
      feedback = "Good effort. Focus on consistency and variety."
    } else {
      feedback = "Let's focus on consistency this week."
    }
    studyIqFeedbackElement.textContent = feedback
  }

  // Update consistency score
  if (consistencyScoreElement) {
    consistencyScoreElement.textContent = `${consistencyScore}%`
    consistencyProgressElement.style.width = `${consistencyScore}%`
  }

  // Update diversity score
  if (diversityScoreElement) {
    diversityScoreElement.textContent = `${uniqueSubjects}/3+ subjects`
    diversityProgressElement.style.width = `${diversityScore}%`
  }

  // Update session length score
  if (sessionLengthScoreElement) {
    sessionLengthScoreElement.textContent = `${avgSessionLength} min avg`
    sessionLengthProgressElement.style.width = `${sessionLengthScore}%`
  }

  // Add energy management score if the element exists
  const energyManagementScoreElement = document.getElementById("energy-management-score")
  const energyManagementProgressElement = document.getElementById("energy-management-progress")

  if (energyManagementScoreElement && energyManagementProgressElement) {
    energyManagementScoreElement.textContent = `${energyManagementScore}%`
    energyManagementProgressElement.style.width = `${energyManagementScore}%`
  }
}

// Update the subject distribution chart
function updateSubjectDistributionChart(data) {
  const ctx = document.getElementById("subject-distribution-chart")
  if (!ctx) return

  const today = new Date().toLocaleDateString()
  const subjects = {}
  let totalTime = 0

  // Process today's sessions
  data.sessions.forEach((session) => {
    if (!subjects[session.subject]) {
      subjects[session.subject] = 0
    }
    subjects[session.subject] += session.time
    totalTime += session.time
  })

  // Process past 7 days
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      // Skip today as we've already counted it
      if (dateStr === today) return

      // Only include sessions from the past 7 days
      const sessionDate = new Date(dateStr)
      if (sessionDate >= oneWeekAgo) {
        sessions.forEach((session) => {
          if (!subjects[session.subject]) {
            subjects[session.subject] = 0
          }
          subjects[session.subject] += session.time
          totalTime += session.time
        })
      }
    })
  }

  // Sort subjects by time spent
  const sortedSubjects = Object.entries(subjects).sort((a, b) => b[1] - a[1])

  // Prepare chart data
  const labels = sortedSubjects.map(([subject]) => subject)
  const values = sortedSubjects.map(([_, time]) => time)

  // Generate colors for each subject
  const colors = generateSubjectColors(labels.length)

  // Destroy previous chart if it exists
  if (subjectDistributionChart) {
    subjectDistributionChart.destroy()
  }

  // Create new chart
  subjectDistributionChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
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
              const percentage = Math.round((value / totalTime) * 100)
              return `${label}: ${formatTime(value)} (${percentage}%)`
            },
          },
        },
      },
    },
  })

  // Update distribution rating
  if (distributionRatingElement) {
    // Calculate distribution rating based on subject balance
    let rating
    const subjectCount = sortedSubjects.length

    if (subjectCount <= 1) {
      rating = {
        text: "🔴 Too focused on one subject",
        class: "distribution-focused",
      }
    } else if (subjectCount >= 3) {
      // Check if the distribution is balanced
      const primarySubjectPercentage = (sortedSubjects[0][1] / totalTime) * 100

      if (primarySubjectPercentage > 70) {
        rating = {
          text: "🟡 Slightly skewed distribution",
          class: "distribution-skewed",
        }
      } else {
        rating = {
          text: "🟢 Balanced subject distribution",
          class: "distribution-balanced",
        }
      }
    } else {
      // 2 subjects
      const primarySubjectPercentage = (sortedSubjects[0][1] / totalTime) * 100

      if (primarySubjectPercentage > 80) {
        rating = {
          text: "🟡 Slightly skewed distribution",
          class: "distribution-skewed",
        }
      } else {
        rating = {
          text: "🟢 Balanced subject distribution",
          class: "distribution-balanced",
        }
      }
    }

    distributionRatingElement.textContent = rating.text
    distributionRatingElement.className = "distribution-rating " + rating.class
  }
}

// Generate colors for subjects
function generateSubjectColors(count) {
  const baseColors = [
    "rgba(76, 175, 80, 0.7)", // Green
    "rgba(33, 150, 243, 0.7)", // Blue
    "rgba(156, 39, 176, 0.7)", // Purple
    "rgba(255, 152, 0, 0.7)", // Orange
    "rgba(233, 30, 99, 0.7)", // Pink
    "rgba(0, 188, 212, 0.7)", // Cyan
    "rgba(255, 87, 34, 0.7)", // Deep Orange
  ]

  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length])
  }

  return colors
}

// Update the Study IQ history chart with real historical data
function updateStudyIqHistoryChart(data, currentScore) {
  const ctx = document.getElementById("study-iq-history-chart")
  if (!ctx) return

  const today = new Date()
  const labels = []
  const values = []

  // Generate data for the past 14 days using real historical data
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString()

    labels.push(formatDate(date))

    // For the current day, use the calculated score
    if (i === 0) {
      values.push(currentScore)
    } else {
      // Use historical data if available, otherwise estimate
      if (data.studyIqHistory && data.studyIqHistory[dateStr]) {
        values.push(data.studyIqHistory[dateStr])
      } else {
        // If no historical data, estimate based on study activity
        const hadStudyActivity = data.dailyTotals[dateStr] && data.dailyTotals[dateStr] > 0

        if (hadStudyActivity) {
          // If there was study activity, generate a score between 60-80
          // This is more realistic than random values
          const baseScore = 60
          const activityScore = Math.min(20, Math.floor(data.dailyTotals[dateStr] / 10))
          values.push(baseScore + activityScore)
        } else {
          // If no study activity, use a lower score
          values.push(40)
        }
      }
    }
  }

  // Destroy previous chart if it exists
  if (studyIqHistoryChart) {
    studyIqHistoryChart.destroy()
  }

  // Create new chart
  studyIqHistoryChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Study IQ Score",
          data: values,
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          borderColor: "rgba(76, 175, 80, 1)",
          borderWidth: 2,
          tension: 0.1,
          fill: true,
          pointBackgroundColor: (context) => {
            const value = context.dataset.data[context.dataIndex]
            if (value >= 90) return "#4caf50"
            if (value >= 70) return "#8bc34a"
            if (value >= 50) return "#ffc107"
            return "#f44336"
          },
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          ticks: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
        },
      },
    },
  })
}

// Update Subject IQ scores data
function updateSubjectIqScoresData(data) {
  const today = new Date().toLocaleDateString()
  const subjects = {}

  // Process today's sessions
  data.sessions.forEach((session) => {
    if (!subjects[session.subject]) {
      subjects[session.subject] = {
        totalTime: 0,
        sessionCount: 0,
        daysStudied: new Set(),
      }
    }
    subjects[session.subject].totalTime += session.time
    subjects[session.subject].sessionCount++
    subjects[session.subject].daysStudied.add(today)
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      sessions.forEach((session) => {
        if (!subjects[session.subject]) {
          subjects[session.subject] = {
            totalTime: 0,
            sessionCount: 0,
            daysStudied: new Set(),
          }
        }
        subjects[session.subject].totalTime += session.time
        subjects[session.subject].sessionCount++
        subjects[session.subject].daysStudied.add(dateStr)
      })
    })
  }

  // Calculate and store Subject IQ scores
  if (!data.subjectIqScores) {
    data.subjectIqScores = {}
  }

  Object.entries(subjects).forEach(([subject, stats]) => {
    // Calculate Subject IQ score components
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    let recentDaysStudied = 0
    stats.daysStudied.forEach((dateStr) => {
      const date = new Date(dateStr)
      if (date >= twoWeeksAgo) {
        recentDaysStudied++
      }
    })

    const consistencyScore = Math.min(100, Math.round((recentDaysStudied / 7) * 100))

    // Session quality (average session length, ideal: 25-60 min)
    const avgSessionLength = stats.sessionCount > 0 ? Math.round(stats.totalTime / stats.sessionCount) : 0
    let sessionQualityScore = 0

    if (avgSessionLength >= 25 && avgSessionLength <= 60) {
      sessionQualityScore = 100
    } else if (avgSessionLength < 25) {
      sessionQualityScore = Math.round((avgSessionLength / 25) * 100)
    } else {
      const overageRatio = Math.max(0, 1 - (avgSessionLength - 60) / 60)
      sessionQualityScore = Math.round(overageRatio * 100)
    }

    // Calculate overall Subject IQ score
    const subjectIqScore = Math.round(
      consistencyScore * 0.6 + // 60% weight for consistency
        sessionQualityScore * 0.4, // 40% weight for session quality
    )

    // Store the score
    if (!data.subjectIqScores[subject]) {
      data.subjectIqScores[subject] = {}
    }
    data.subjectIqScores[subject][today] = {
      score: subjectIqScore,
      consistencyScore,
      sessionQualityScore,
      recentDaysStudied,
      avgSessionLength,
    }
  })
}

// Update Subject IQ scores UI
function updateSubjectIqScores(data) {
  if (!subjectIqGridElement) return

  // Clear existing content
  subjectIqGridElement.innerHTML = ""

  // Get all subjects with their scores
  const subjects = {}
  const today = new Date().toLocaleDateString()

  // Use stored subject IQ scores if available
  if (data.subjectIqScores) {
    Object.entries(data.subjectIqScores).forEach(([subject, scores]) => {
      if (scores[today]) {
        subjects[subject] = scores[today]
      }
    })
  }

  // If no stored scores, calculate them on the fly
  if (Object.keys(subjects).length === 0) {
    // Process today's sessions
    data.sessions.forEach((session) => {
      if (!subjects[session.subject]) {
        subjects[session.subject] = {
          totalTime: 0,
          sessionCount: 0,
          daysStudied: new Set(),
        }
      }
      subjects[session.subject].totalTime += session.time
      subjects[session.subject].sessionCount++
      subjects[session.subject].daysStudied.add(today)
    })

    // Process historical sessions
    if (data.dailySessions) {
      Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
        sessions.forEach((session) => {
          if (!subjects[session.subject]) {
            subjects[session.subject] = {
              totalTime: 0,
              sessionCount: 0,
              daysStudied: new Set(),
            }
          }
          subjects[session.subject].totalTime += session.time
          subjects[session.subject].sessionCount++
          subjects[session.subject].daysStudied.add(dateStr)
        })
      })
    }
  }

  // Create Subject IQ cards
  Object.entries(subjects).forEach(([subject, stats]) => {
    // Get stored scores if available
    let subjectIqScore, recentDaysStudied, avgSessionLength

    if (stats.score !== undefined) {
      // Use stored scores
      subjectIqScore = stats.score
      recentDaysStudied = stats.recentDaysStudied
      avgSessionLength = stats.avgSessionLength
    } else {
      // Calculate scores on the fly
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      recentDaysStudied = 0
      stats.daysStudied.forEach((dateStr) => {
        const date = new Date(dateStr)
        if (date >= twoWeeksAgo) {
          recentDaysStudied++
        }
      })

      const consistencyScore = Math.min(100, Math.round((recentDaysStudied / 7) * 100))
      avgSessionLength = stats.sessionCount > 0 ? Math.round(stats.totalTime / stats.sessionCount) : 0

      let sessionQualityScore = 0
      if (avgSessionLength >= 25 && avgSessionLength <= 60) {
        sessionQualityScore = 100
      } else if (avgSessionLength < 25) {
        sessionQualityScore = Math.round((avgSessionLength / 25) * 100)
      } else {
        const overageRatio = Math.max(0, 1 - (avgSessionLength - 60) / 60)
        sessionQualityScore = Math.round(overageRatio * 100)
      }

      subjectIqScore = Math.round(
        consistencyScore * 0.6 + // 60% weight for consistency
          sessionQualityScore * 0.4, // 40% weight for session quality
      )
    }

    // Create Subject IQ card
    const card = document.createElement("div")
    card.className = "subject-iq-card"

    // Determine color based on score
    let color
    if (subjectIqScore >= 90) {
      color = "#4caf50" // Green
    } else if (subjectIqScore >= 70) {
      color = "#8bc34a" // Light Green
    } else if (subjectIqScore >= 50) {
      color = "#ffc107" // Amber
    } else {
      color = "#f44336" // Red
    }

    card.innerHTML = `
      <div class="subject-iq-header">
        <div class="subject-iq-name">${subject}</div>
        <div class="subject-iq-value">${subjectIqScore}</div>
      </div>
      <div class="subject-iq-progress">
        <div class="subject-iq-progress-bar" style="width: ${subjectIqScore}%; background-color: ${color}"></div>
      </div>
      <div class="subject-iq-details">
        <span>${recentDaysStudied} days in 2 weeks</span>
        <span>${avgSessionLength} min avg</span>
      </div>
    `

    subjectIqGridElement.appendChild(card)
  })

  // If no subjects, show a message
  if (Object.keys(subjects).length === 0) {
    const emptyMessage = document.createElement("p")
    emptyMessage.className = "empty-message"
    emptyMessage.textContent = "No study data available yet."
    subjectIqGridElement.appendChild(emptyMessage)
  }
}

// Add tab switching functionality
statsTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all tabs
    statsTabButtons.forEach((btn) => btn.classList.remove("active"))
    tabContents.forEach((content) => content.classList.remove("active"))

    // Add active class to clicked tab
    button.classList.add("active")

    // Show corresponding content
    const tabId = button.getAttribute("data-tab")
    document.getElementById(tabId).classList.add("active")

    // Update charts if switching to Study IQ tab
    if (tabId === "study-iq") {
      updateStudyIqScore(studyData)
    }
  })
})

// Add this to the existing event listeners
// Event Listeners
themeToggle.addEventListener("click", () => {
  toggleDarkMode()

  // Update Study IQ charts if they exist
  if (subjectDistributionChart) {
    updateSubjectDistributionChart(studyData)
  }

  if (studyIqHistoryChart) {
    updateStudyIqHistoryChart(studyData, calculateStudyIqScore(studyData))
  }
})

// Helper function to calculate the overall Study IQ score
function calculateStudyIqScore(data) {
  // Get data for the past 7 days
  const today = new Date()
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(today.getDate() - 7)

  // 1. Calculate Consistency Score
  const daysStudied = calculateDaysStudied(data, oneWeekAgo, today)
  const consistencyScore = Math.round((daysStudied / 7) * 100)

  // 2. Calculate Study Diversity Score
  const uniqueSubjects = calculateUniqueSubjects(data)
  const diversityScore = Math.min(100, Math.round((uniqueSubjects / 3) * 100))

  // 3. Calculate Session Length Score
  const avgSessionLength = calculateAverageSessionLength(data)
  let sessionLengthScore = 0

  if (avgSessionLength >= 25 && avgSessionLength <= 60) {
    sessionLengthScore = 100
  } else if (avgSessionLength < 25) {
    sessionLengthScore = Math.round((avgSessionLength / 25) * 100)
  } else {
    const overageRatio = Math.max(0, 1 - (avgSessionLength - 60) / 60)
    sessionLengthScore = Math.round(overageRatio * 100)
  }

  // Calculate overall Study IQ Score (weighted average)
  return Math.round(
    consistencyScore * 0.4 + // 40% weight for consistency
      diversityScore * 0.3 + // 30% weight for diversity
      sessionLengthScore * 0.3, // 30% weight for session length
  )
}

// Helper function to calculate the number of days studied in the last 7 days
function calculateDaysStudied(data, startDate, endDate) {
  let daysStudied = 0
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = currentDate.toLocaleDateString()
    if (data.dailyTotals[dateStr] && data.dailyTotals[dateStr] > 0) {
      daysStudied++
    } else if (dateStr === endDate.toLocaleDateString() && data.sessions.length > 0) {
      // Check today's sessions
      daysStudied++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return daysStudied
}

// Helper function to calculate the number of unique subjects studied
function calculateUniqueSubjects(data) {
  const uniqueSubjects = new Set()

  // Process today's sessions
  data.sessions.forEach((session) => {
    uniqueSubjects.add(session.subject)
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.values(data.dailySessions).forEach((sessions) => {
      sessions.forEach((session) => {
        uniqueSubjects.add(session.subject)
      })
    })
  }

  return uniqueSubjects.size
}

// Helper function to calculate the average session length
function calculateAverageSessionLength(data) {
  let totalTime = 0
  let sessionCount = 0

  // Process today's sessions
  data.sessions.forEach((session) => {
    totalTime += session.time
    sessionCount++
  })

  // Process historical sessions
  if (data.dailySessions) {
    Object.values(data.dailySessions).forEach((sessions) => {
      sessions.forEach((session) => {
        totalTime += session.time
        sessionCount++
      })
    })
  }

  return sessionCount > 0 ? Math.round(totalTime / sessionCount) : 0
}

// Calculate retention based on forgetting curve model
function calculateForgettingCurveRetention(sessions, reviewCount) {
  const now = new Date()

  // Track the retention contribution from each session
  const sessionRetentions = []

  // Sort sessions by date (oldest first) to properly model the spacing effect
  sessions.sort((a, b) => a.date - b.date)

  // Calculate initial retention parameters
  let stabilityFactor = 1.0 // Base stability (increases with each review)

  // Process each session chronologically to model memory strengthening
  sessions.forEach((session, index) => {
    // Time elapsed in days since the session
    const timeElapsed = (now - session.date) / (1000 * 60 * 60 * 24)

    // Calculate session quality factor (0.5-1.5) based on duration
    // Sessions between 25-45 minutes are considered optimal
    let qualityFactor = 1.0
    if (session.time >= 25 && session.time <= 45) {
      qualityFactor = 1.5 // Optimal duration
    } else if (session.time < 25) {
      qualityFactor = 0.5 + session.time / 25 // Shorter sessions have lower quality
    } else {
      qualityFactor = 1.5 - Math.min(0.5, (session.time - 45) / 90) // Diminishing returns for longer sessions
    }

    // Apply spacing effect if this isn't the first session
    if (index > 0) {
      const prevSession = sessions[index - 1]
      const daysSinceLastSession = (session.date - prevSession.date) / (1000 * 60 * 60 * 24)

      // Optimal spacing is around 1-7 days for new material
      // Too short (massed practice) or too long (forgetting) is less effective
      let spacingMultiplier = 1.0

      if (daysSinceLastSession < 1) {
        // Massed practice (diminishing returns)
        spacingMultiplier = 0.7 + 0.3 * daysSinceLastSession
      } else if (daysSinceLastSession <= 7) {
        // Optimal spacing window
        spacingMultiplier = 1.0 + 0.2 * (daysSinceLastSession / 7)
      } else {
        // Too much spacing (some forgetting occurred)
        spacingMultiplier = 1.2 * Math.exp(-0.05 * (daysSinceLastSession - 7))
      }

      // Increase stability based on spacing effect
      stabilityFactor += 0.3 * spacingMultiplier
    }

    // Review sessions have stronger effect on memory
    if (session.isReview) {
      stabilityFactor += 0.5 * qualityFactor
    } else {
      // Learning new material
      stabilityFactor += 0.2 * qualityFactor
    }

    // Calculate retention for this session using Ebbinghaus forgetting curve
    // R = e^(-t/S) where:
    // R is retention percentage
    // t is time elapsed in days
    // S is stability factor (higher means slower forgetting)
    const sessionRetention = 100 * Math.exp(-timeElapsed / (stabilityFactor * 2))

    // Weight by session quality and recency
    const recencyWeight = Math.exp(-0.1 * (sessions.length - 1 - index)) // More recent sessions have higher weight
    sessionRetentions.push({
      retention: sessionRetention,
      weight: qualityFactor * recencyWeight,
      date: session.date,
      stability: stabilityFactor,
    })
  })

  // If no sessions, return 0
  if (sessionRetentions.length === 0) return 0

  // Calculate weighted average retention
  const totalWeight = sessionRetentions.reduce((sum, sr) => sum + sr.weight, 0)
  const weightedRetention = sessionRetentions.reduce((sum, sr) => sum + sr.retention * sr.weight, 0) / totalWeight

  // Apply a bonus for consistent review (multiple sessions)
  const consistencyBonus = Math.min(15, sessions.length * 2)

  // Final retention score (capped at 100)
  return Math.min(100, Math.max(0, weightedRetention + consistencyBonus))
}

// Calculate estimated days until forgetting (retention drops below 50%)
function calculateDaysUntilForgetting(currentRetention, reviewCount, sessions) {
  // If no sessions or retention is already below threshold, return 0
  if (!sessions || sessions.length === 0 || currentRetention < 50) return 0

  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => b.date - a.date)
  const lastSession = sortedSessions[0]

  // Calculate stability factor based on review history
  // More reviews and more recent reviews increase stability
  let stabilityFactor = 1.0 + reviewCount * 0.5

  // Calculate days since last session
  const now = new Date()
  const daysSinceLastSession = (now - lastSession.date) / (1000 * 60 * 60 * 24)

  // Adjust stability based on recency of last session
  if (daysSinceLastSession < 3) {
    stabilityFactor += 0.5 // Recent study boosts stability
  }

  // Calculate optimal review interval based on current retention
  const optimalInterval = (stabilityFactor * Math.log(0.9)) / Math.log(currentRetention / 100)

  // Calculate days until retention drops below 50%
  // Using the inverse of the forgetting curve formula: t = -S * ln(R/100)
  const daysUntilForgetting = Math.round(stabilityFactor * Math.log(50 / currentRetention) * -1)

  // Calculate recommended review date (before significant forgetting occurs)
  const recommendedReviewDays = Math.min(
    daysUntilForgetting - 1, // One day before significant forgetting
    Math.max(1, Math.round(optimalInterval)), // At least 1 day, but following optimal interval
  )

  return {
    daysUntilForgetting: Math.max(0, daysUntilForgetting),
    recommendedReviewDays: Math.max(0, recommendedReviewDays),
  }
}

// Update the updateTopicRetentionStrength function to use the enhanced calculations
function updateTopicRetentionStrength(data, timeframeDays = 7) {
  if (!retentionTopicListElement) return

  retentionTopicListElement.innerHTML = ""

  const today = new Date()
  const timeframeStart = new Date(today)
  timeframeStart.setDate(today.getDate() - timeframeDays)

  // Get all subjects and their study sessions within the timeframe
  const subjects = {}

  // Process today's sessions
  data.sessions.forEach((session) => {
    if (!subjects[session.subject]) {
      subjects[session.subject] = {
        sessions: [],
        lastStudied: new Date(),
        totalTime: 0,
        reviewCount: 0,
      }
    }

    // Check if this is a review session
    const isReview =
      session.tag && (session.tag.toLowerCase().includes("review") || session.tag.toLowerCase().includes("revision"))

    if (isReview) {
      subjects[session.subject].reviewCount++
    }

    subjects[session.subject].sessions.push({
      date: new Date(),
      time: session.time,
      isReview: isReview,
    })

    subjects[session.subject].totalTime += session.time
  })

  // Process historical sessions within the timeframe
  if (data.dailySessions) {
    Object.entries(data.dailySessions).forEach(([dateStr, sessions]) => {
      const sessionDate = new Date(dateStr)

      // Skip if not within timeframe
      if (sessionDate < timeframeStart) return

      sessions.forEach((session) => {
        if (!subjects[session.subject]) {
          subjects[session.subject] = {
            sessions: [],
            lastStudied: sessionDate,
            totalTime: 0,
            reviewCount: 0,
          }
        } else if (sessionDate > subjects[session.subject].lastStudied) {
          subjects[session.subject].lastStudied = sessionDate
        }

        // Check if this is a review session
        const isReview =
          session.tag &&
          (session.tag.toLowerCase().includes("review") || session.tag.toLowerCase().includes("revision"))

        if (isReview) {
          subjects[session.subject].reviewCount++
        }

        subjects[session.subject].sessions.push({
          date: sessionDate,
          time: session.time,
          isReview: isReview,
        })

        subjects[session.subject].totalTime += session.time
      })
    })
  }

  // Calculate retention strength for each subject using enhanced forgetting curve
  const subjectRetention = {}

  Object.entries(subjects).forEach(([subject, data]) => {
    // Calculate retention based on enhanced forgetting curve
    const retentionScore = calculateForgettingCurveRetention(data.sessions, data.reviewCount)

    // Calculate forgetting prediction
    const forgettingPrediction = calculateDaysUntilForgetting(retentionScore, data.reviewCount, data.sessions)

    // Store retention data
    subjectRetention[subject] = {
      strength: retentionScore,
      lastStudied: data.lastStudied,
      studyDays: new Set(data.sessions.map((s) => s.date.toLocaleDateString())).size,
      totalTime: data.totalTime,
      reviewCount: data.reviewCount,
      sessionCount: data.sessions.length,
      forgettingPrediction: forgettingPrediction,
      sessions: data.sessions,
    }
  })

  // Sort subjects by retention strength (descending)
  const sortedSubjects = Object.entries(subjectRetention).sort((a, b) => b[1].strength - a[1].strength)

  if (sortedSubjects.length === 0) {
    const emptyMessage = document.createElement("p")
    emptyMessage.textContent = "No study data available for the selected timeframe."
    emptyMessage.className = "empty-message"
    retentionTopicListElement.appendChild(emptyMessage)
    return
  }

  // Create retention strength items
  sortedSubjects.forEach(([subject, data]) => {
    const retentionItem = document.createElement("div")
    retentionItem.className = "retention-item"

    // Determine strength class
    let strengthClass = "weak"
    if (data.strength >= 71) {
      strengthClass = "strong"
    } else if (data.strength >= 41) {
      strengthClass = "moderate"
    }

    // Format last studied date
    const lastStudiedStr = formatRelativeTime(data.lastStudied)

    // Get forgetting prediction data
    const daysUntilForgetting = data.forgettingPrediction.daysUntilForgetting
    const recommendedReviewDays = data.forgettingPrediction.recommendedReviewDays

    // Create retention decay visualization data
    const retentionDecayData = generateRetentionDecayData(data.strength, data.sessions, data.reviewCount)
    const decayChartId = `decay-chart-${subject.replace(/\s+/g, "-").toLowerCase()}`

    retentionItem.innerHTML = `
      <div class="retention-subject">
        <div class="subject-name">${subject}</div>
        <div class="retention-details">
          <span class="last-studied">Last studied: ${lastStudiedStr}</span>
          <span class="study-frequency">${data.studyDays} days in timeframe</span>
          <span class="review-count">${data.reviewCount} reviews</span>
        </div>
      </div>
      <div class="retention-metrics">
        <div class="retention-strength">
          <div class="strength-value">${Math.round(data.strength)}%</div>
          <div class="strength-label">Retention</div>
        </div>
        <div class="retention-progress">
          <div class="retention-bar ${strengthClass}" style="width: ${data.strength}%"></div>
        </div>
      </div>
      <div class="forgetting-prediction">
        <i class="fas fa-brain"></i>
        <span>${
          daysUntilForgetting > 0
            ? `Estimated ${daysUntilForgetting} days until significant forgetting`
            : "Review recommended soon"
        }</span>
      </div>
      <div class="review-recommendation">
        <i class="fas fa-calendar-check"></i>
        <span>${
          recommendedReviewDays === 0
            ? "Review recommended today for optimal retention"
            : `Optimal review in ${recommendedReviewDays} day${recommendedReviewDays !== 1 ? "s" : ""}`
        }</span>
      </div>
      <div class="retention-decay-chart">
        <canvas id="${decayChartId}" width="300" height="100"></canvas>
      </div>
    `

    retentionTopicListElement.appendChild(retentionItem)

    // Create retention decay chart
    setTimeout(() => {
      createRetentionDecayChart(decayChartId, retentionDecayData)
    }, 0)
  })
}

// Add this function to generate retention decay data
function generateRetentionDecayData(currentRetention, sessions, reviewCount) {
  const days = 14 // Show projection for next 14 days
  const data = []

  // Calculate stability factor based on sessions and reviews
  let stabilityFactor = 1.0
  if (sessions && sessions.length > 0) {
    // Sort sessions by date (newest first)
    const sortedSessions = [...sessions].sort((a, b) => b.date - a.date)

    // More recent sessions and reviews increase stability
    stabilityFactor = 1.0 + reviewCount * 0.5

    // Recent sessions boost stability more
    const lastSession = sortedSessions[0]
    const now = new Date()
    const daysSinceLastSession = (now - lastSession.date) / (1000 * 60 * 60 * 24)

    if (daysSinceLastSession < 3) {
      stabilityFactor += 0.5
    }
  }

  // Generate decay curve data points
  for (let i = 0; i <= days; i++) {
    // Apply forgetting curve formula: R = R0 * e^(-t/S)
    const retention = currentRetention * Math.exp(-i / (stabilityFactor * 2))
    data.push({
      day: i,
      retention: Math.max(0, Math.min(100, retention)),
    })
  }

  return data
}

// Add this function to create retention decay chart
function createRetentionDecayChart(chartId, decayData) {
  const ctx = document.getElementById(chartId)
  if (!ctx) return

  const labels = decayData.map((d) => `Day ${d.day}`)
  const values = decayData.map((d) => d.retention)

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Retention %",
          data: values,
          borderColor: "rgba(76, 175, 80, 1)",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => value + "%",
            color: document.body.classList.contains("dark-mode") ? "#f5f5f5" : "#333",
          },
          grid: {
            color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const dayIndex = tooltipItems[0].dataIndex
              return dayIndex === 0 ? "Today" : `Day ${dayIndex}`
            },
            label: (context) => `Estimated retention: ${Math.round(context.raw)}%`,
          },
        },
        annotation: {
          annotations: {
            line1: {
              type: "line",
              yMin: 50,
              yMax: 50,
              borderColor: "rgba(255, 99, 132, 0.5)",
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                content: "50% retention",
                enabled: true,
                position: "left",
              },
            },
          },
        },
      },
    },
  })
}

// Helper function to format relative time
function formatRelativeTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }
}

// Add event listeners for timeframe buttons
timeframeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    timeframeButtons.forEach((btn) => btn.classList.remove("active"))

    // Add active class to clicked button
    button.classList.add("active")

    // Get timeframe days
    const days = Number.parseInt(button.getAttribute("data-days"))

    // Update retention strength with selected timeframe
    updateTopicRetentionStrength(studyData, days)
  })
})

// Event Listeners
themeToggle.addEventListener("click", toggleDarkMode)

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}

// Load data and initialize UI
const studyData = loadData()
updateUI(studyData)
