// DOM Elements
const totalStudyTimeElement = document.getElementById("total-study-time")
const weeklyAverageElement = document.getElementById("weekly-average")
const monthlyAverageElement = document.getElementById("monthly-average")
const subjectStatsListElement = document.getElementById("subject-stats-list")
const themeToggle = document.querySelector(".theme-toggle")

// Charts
let weeklyChart
let monthlyChart

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

  // Update chart colors
  updateCharts()
}

// Update UI
function updateUI(data) {
  // Calculate total study time
  const totalMinutes =
    Object.values(data.dailyTotals).reduce((sum, val) => sum + val, 0) +
    data.sessions.reduce((sum, session) => sum + session.time, 0)

  // Update stats
  totalStudyTimeElement.textContent = formatTime(totalMinutes)

  // Calculate weekly and monthly averages
  const { weeklyAvg, monthlyAvg } = calculateAverages(data)
  weeklyAverageElement.textContent = `${Math.round(weeklyAvg)} min/day`
  monthlyAverageElement.textContent = `${Math.round(monthlyAvg)} min/day`

  // Update subject stats
  updateSubjectStats(data)

  // Update charts
  updateCharts(data)
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

// Calculate weekly and monthly averages
function calculateAverages(data) {
  const today = new Date()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(today.getDate() - 7)

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(today.getMonth() - 1)

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

  // Process historical data
  Object.entries(data.dailyTotals).forEach(([dateStr, total]) => {
    const date = new Date(dateStr)

    if (date >= oneWeekAgo && date < today) {
      weeklyTotal += total
      weeklyDays++
    }

    if (date >= oneMonthAgo && date < today) {
      monthlyTotal += total
      monthlyDays++
    }
  })

  const weeklyAvg = weeklyDays > 0 ? weeklyTotal / weeklyDays : 0
  const monthlyAvg = monthlyDays > 0 ? monthlyTotal / monthlyDays : 0

  return { weeklyAvg, monthlyAvg }
}

// Update subject stats
function updateSubjectStats(data) {
  subjectStatsListElement.innerHTML = ""

  // Collect all subjects and their total time
  const subjects = {}

  // Add today's sessions
  data.sessions.forEach((session) => {
    if (!subjects[session.subject]) {
      subjects[session.subject] = 0
    }
    subjects[session.subject] += session.time
  })

  // Add historical sessions if available
  if (data.dailySessions) {
    Object.values(data.dailySessions).forEach((sessions) => {
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
}

// Update weekly chart
function updateWeeklyChart(data) {
  const ctx = document.getElementById("weekly-chart").getContext("2d")

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
      // Today
      studyTime = data.sessions.reduce((sum, session) => sum + session.time, 0)
    } else if (data.dailyTotals[dateStr]) {
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

// Update monthly chart
function updateMonthlyChart(data) {
  const ctx = document.getElementById("monthly-chart").getContext("2d")

  // Prepare data for the past 30 days
  const labels = []
  const values = []

  // Group by week for better visualization
  for (let i = 4; i >= 0; i--) {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - i * 7)
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 6)

    let weekTotal = 0

    // For each day in the week
    for (let j = 0; j < 7; j++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + j)
      const dateStr = date.toLocaleDateString()

      // Get study time for this day
      let studyTime = 0
      if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
        // Today
        studyTime = data.sessions.reduce((sum, session) => sum + session.time, 0)
      } else if (data.dailyTotals[dateStr]) {
        studyTime = data.dailyTotals[dateStr]
      }

      weekTotal += studyTime
    }

    labels.push(`Week ${5 - i}`)
    values.push(weekTotal)
  }

  // Destroy previous chart if it exists
  if (monthlyChart) {
    monthlyChart.destroy()
  }

  // Create new chart
  monthlyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
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

// Format date (e.g., "Mon 15")
function formatDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return `${days[date.getDay()]} ${date.getDate()}`
}

// Event Listeners
themeToggle.addEventListener("click", toggleDarkMode)

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}

// Initialize
const studyData = loadData()
updateUI(studyData)

