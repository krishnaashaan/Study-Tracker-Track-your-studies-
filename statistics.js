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

// Charts
let weeklyChart
let monthlyChart

// Add these variables for calendar
const currentCalendarDate = new Date()

// Load data from localStorage
// Update the loadData function to ensure we have dailySessions
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
  }
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
  const pastDaysTotal = Object.entries(data.dailyTotals)
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
}

// Format time (minutes to hours and minutes)
function formatTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `🔥${hours}h ${mins}m`
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
  const ctx = document.getElementById("monthly-chart").getContext("2d")
  const today = new Date().toLocaleDateString()

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
      if (dateStr === today) {
        // Today - use current sessions
        studyTime = data.sessions.reduce((sum, session) => sum + session.time, 0)
      } else if (data.dailyTotals[dateStr]) {
        // Past days - use daily totals
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

// Event Listeners
themeToggle.addEventListener("click", toggleDarkMode)

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode")
}
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav ul")
  if (nav && !document.querySelector('nav ul li a[href="store.html"]')) {
    const storeItem = document.createElement("li")
    storeItem.innerHTML = '<a href="store.html"><i class="fas fa-store"></i> Store</a>'
    nav.appendChild(storeItem)
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

// Add this function to apply theme
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


// Initialize
const studyData = loadData()
updateUI(studyData)

