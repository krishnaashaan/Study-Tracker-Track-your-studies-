// Shadow Achievements System
// These are hidden achievements that users can discover through their study habits

// Initialize shadow achievement data globally
window.shadowAchievementData = window.shadowAchievementData || {
  devToolsOpened: false,
  themeSwitchCount: 0,
  developerNameUsed: false,
  idleTime: 0,
  lastActivityTime: Date.now(),
  lastThemeToggleTime: 0,
}

// Dev Tools detection - multiple methods for better reliability
// Method 1: Console trick
console.log(
  '%cWe see you 👀 - Achievement Unlocked: "The Hacker"',
  "color: purple; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); padding: 10px;",
)

// Method 2: Function.toString detection
;(() => {
  function detectDevTools() {
    try {
      const isDevToolsOpen = /\{\s*\[native code\]\s*\}/.test(Function.prototype.toString.call(console.log)) === false
      if (isDevToolsOpen) {
        window.shadowAchievementData.devToolsOpened = true
        if (window.shadowAchievements) {
          window.shadowAchievements.checkAchievements()
        }
      }
    } catch (e) {
      // If there's an error, it's likely because dev tools are open
      window.shadowAchievementData.devToolsOpened = true
    }
  }

  // Check periodically
  setInterval(detectDevTools, 1000)
})()

// Method 3: Element size detection
;(() => {
  let checkCount = 0
  const originalHeight = window.innerHeight

  function detectDevToolsSize() {
    const heightDifference = window.outerHeight - window.innerHeight
    const widthDifference = window.outerWidth - window.innerWidth

    if (heightDifference > 200 || widthDifference > 200) {
      window.shadowAchievementData.devToolsOpened = true
      if (window.shadowAchievements) {
        window.shadowAchievements.checkAchievements()
      }
    }

    // Only check a limited number of times to avoid performance issues
    checkCount++
    if (checkCount > 50) {
      clearInterval(sizeCheckInterval)
    }
  }

  const sizeCheckInterval = setInterval(detectDevToolsSize, 1000)
})()

// Method 4: Debugger-based detection
;(() => {
  let counter = 0
  function devToolsDebuggerDetector() {
    counter++
    if (counter > 1) {
      window.shadowAchievementData.devToolsOpened = true
      if (window.shadowAchievements) {
        window.shadowAchievements.checkAchievements()
      }
    }
  }

  // These debugger statements will only trigger when dev tools are open
  setTimeout(() => {
    debugger
    devToolsDebuggerDetector()
    setTimeout(() => {
      debugger
      devToolsDebuggerDetector()
    }, 100)
  }, 1000)
})()

// Method 5: Console.clear detection
;(() => {
  const originalClear = console.clear
  console.clear = () => {
    window.shadowAchievementData.devToolsOpened = true
    if (window.shadowAchievements) {
      window.shadowAchievements.checkAchievements()
    }
    originalClear.apply(console, arguments)
  }
})()

// Theme toggle counter for "Darkness Within" achievement
document.addEventListener("DOMContentLoaded", () => {
  // Find the theme toggle button
  const themeToggle = document.querySelector(".theme-toggle")

  if (themeToggle) {
    // Add our own event listener to count toggles
    themeToggle.addEventListener("click", () => {
      const now = Date.now()

      // Only count rapid toggles (within 2 seconds of each other)
      if (now - window.shadowAchievementData.lastThemeToggleTime < 2000) {
        window.shadowAchievementData.themeSwitchCount = (window.shadowAchievementData.themeSwitchCount || 0) + 1
        console.log("Theme toggle count:", window.shadowAchievementData.themeSwitchCount)

        // Check for achievement
        if (window.shadowAchievements) {
          window.shadowAchievements.checkAchievements()
        }
      } else {
        // Reset counter if too slow
        window.shadowAchievementData.themeSwitchCount = 1
      }

      window.shadowAchievementData.lastThemeToggleTime = now
    })
  }
})

// Idle time tracker for "Shhh..." achievement
let idleInterval
const startIdleTracking = () => {
  // Only start tracking on profile page
  if (!window.location.href.includes("profile.html")) return

  window.shadowAchievementData.idleTime = 0
  window.shadowAchievementData.lastActivityTime = Date.now()

  // Clear any existing interval
  if (idleInterval) clearInterval(idleInterval)

  // Set up interval to check idle time
  idleInterval = setInterval(() => {
    window.shadowAchievementData.idleTime = Math.floor(
      (Date.now() - window.shadowAchievementData.lastActivityTime) / 1000,
    )

    // Check for achievement every 5 seconds
    if (window.shadowAchievements && window.shadowAchievementData.idleTime % 5 === 0) {
      window.shadowAchievements.checkAchievements()
    }
  }, 1000)
}

// Reset idle time on user activity
const resetIdleTime = () => {
  window.shadowAchievementData.lastActivityTime = Date.now()
}

// Set up event listeners for idle detection
document.addEventListener("mousemove", resetIdleTime)
document.addEventListener("keypress", resetIdleTime)
document.addEventListener("click", resetIdleTime)
document.addEventListener("scroll", resetIdleTime)

// Start idle tracking when on profile page
document.addEventListener("DOMContentLoaded", startIdleTracking)

// Check for page changes to start/stop idle tracking
window.addEventListener("hashchange", startIdleTracking)
window.addEventListener("popstate", startIdleTracking)

// Main shadow achievements object
const shadowAchievements = {
  achievements: [
    {
      id: "early_bird_extreme",
      title: "Dawn Scholar",
      description: "Study before 5 AM",
      icon: "fa-solid fa-sun",
      rarity: "🟣 Legendary",
      xpReward: 150,
      hint: "The early bird catches the knowledge...",
      condition: (data) => {
        const sessions = data.sessions || [] // Ensure sessions is an array
        return sessions.some((session) => {
          const sessionTime = new Date(session.timestamp)
          const hour = sessionTime.getHours()
          return hour >= 3 && hour < 5
        })
      },
      progress: (data) => {
        const sessions = data.sessions || [] // Ensure sessions is an array
        const earlySession = sessions.some((session) => {
          const sessionTime = new Date(session.timestamp)
          const hour = sessionTime.getHours()
          return hour >= 3 && hour < 5
        })
        return earlySession ? 1 : 0
      },
      target: 1,
      isSecret: true,
    },
    {
      id: "perfect_balance",
      title: "Perfectly Balanced",
      description: "Study exactly the same amount of time for 3 different subjects in a day",
      icon: "fa-solid fa-scale-balanced",
      rarity: "🟣 Legendary",
      xpReward: 150,
      hint: "Balance in all things...",
      condition: (data) => {
        const sessions = data.sessions || [] // Ensure sessions is an array
        const subjectTimes = {}
        sessions.forEach((session) => {
          if (!subjectTimes[session.subject]) {
            subjectTimes[session.subject] = 0
          }
          subjectTimes[session.subject] += session.time
        })

        const times = Object.values(subjectTimes)
        if (times.length < 3) return false

        const timeCounts = {}
        times.forEach((time) => {
          timeCounts[time] = (timeCounts[time] || 0) + 1
        })

        return Object.values(timeCounts).some((count) => count >= 3)
      },
      progress: (data) => {
        const sessions = data.sessions || [] // Ensure sessions is an array
        const subjectTimes = {}
        sessions.forEach((session) => {
          if (!subjectTimes[session.subject]) {
            subjectTimes[session.subject] = 0
          }
          subjectTimes[session.subject] += session.time
        })

        const times = Object.values(subjectTimes)
        if (times.length < 3) return 0

        const timeCounts = {}
        times.forEach((time) => {
          timeCounts[time] = (timeCounts[time] || 0) + 1
        })

        const maxCount = Math.max(...Object.values(timeCounts))
        return Math.min(maxCount, 3)
      },
      target: 3,
      isSecret: true,
    },
    {
      id: "lucky_seven",
      title: "Lucky Seven",
      description: "Complete 7 study sessions of 7 minutes each",
      icon: "fa-solid fa-dice",
      rarity: "🟣 Legendary",
      xpReward: 77,
      hint: "Some numbers are considered luckier than others...",
      condition: (data) => {
        const sessions = data.sessions || [] // Ensure sessions is an array
        const sevenMinuteSessions = sessions.filter((session) => session.time === 7)
        return sevenMinuteSessions.length >= 7
      },
      progress: (data) => {
        const sessions = data.sessions || [] // Ensure sessions is an array
        const sevenMinuteSessions = sessions.filter((session) => session.time === 7)
        return Math.min(sevenMinuteSessions.length, 7)
      },
      target: 7,
      isSecret: true,
    },
    {
      id: "weekend_warrior_extreme",
      title: "Weekend Scholar",
      description: "Study for at least 4 hours on both Saturday and Sunday of the same weekend",
      icon: "fa-solid fa-calendar-weekend",
      rarity: "🟣 Legendary",
      xpReward: 200,
      hint: "Weekends can be productive too...",
      condition: (data) => {
        const dailyTotals = data.dailyTotals || {} // Ensure dailyTotals is an object
        const today = new Date()
        const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday

        const saturdayDate = new Date(today)
        saturdayDate.setDate(today.getDate() - ((currentDay + 1) % 7))

        const sundayDate = new Date(today)
        sundayDate.setDate(today.getDate() - currentDay)

        const saturdayString = saturdayDate.toLocaleDateString()
        const sundayString = sundayDate.toLocaleDateString()

        const saturdayMinutes = dailyTotals[saturdayString] || 0
        const sundayMinutes = dailyTotals[sundayString] || 0

        return saturdayMinutes >= 240 && sundayMinutes >= 240
      },
      progress: (data) => {
        const dailyTotals = data.dailyTotals || {} // Ensure dailyTotals is an object
        const today = new Date()
        const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday

        const saturdayDate = new Date(today)
        saturdayDate.setDate(today.getDate() - ((currentDay + 1) % 7))

        const sundayDate = new Date(today)
        sundayDate.setDate(today.getDate() - currentDay)

        const saturdayString = saturdayDate.toLocaleDateString()
        const sundayString = sundayDate.toLocaleDateString()

        const saturdayMinutes = dailyTotals[saturdayString] || 0
        const sundayMinutes = dailyTotals[sundayString] || 0

        let daysCompleted = 0
        if (saturdayMinutes >= 240) daysCompleted++
        if (sundayMinutes >= 240) daysCompleted++

        return daysCompleted
      },
      target: 2,
      isSecret: true,
    },

    {
      id: "binary_scholar",
      title: "Binary Scholar",
      description: "Study for exactly 32, 64, or 128 minutes in a session",
      icon: "fa-solid fa-computer",
      rarity: "🔵 Rare",
      xpReward: 128,
      hint: "Powers of 2 are fundamental to computing...",
      condition: (data) => {
        const sessions = data.sessions || []
        const binaryTimes = [32, 64, 128]
        return sessions.some((session) => binaryTimes.includes(session.time))
      },
      progress: (data) => {
        const sessions = data.sessions || []
        const binaryTimes = [32, 64, 128]
        const binarySession = sessions.some((session) => binaryTimes.includes(session.time))
        return binarySession ? 1 : 0
      },
      target: 1,
      isSecret: true,
    },
    {
      id: "all_nighter",
      title: "All-Nighter",
      description: "Study at least once in each 4-hour period of a day (24 hours)",
      icon: "fa-solid fa-clock-rotate-left",
      rarity: "🟣 Legendary",
      xpReward: 240,
      hint: "Around the clock we go...",
      condition: (data) => {
        const sessions = data.sessions || []
        const dailySessions = data.dailySessions || {}

        // Get all sessions from today and yesterday
        const today = new Date().toLocaleDateString()
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()

        const allSessions = [...(sessions || []), ...(dailySessions[yesterday] || [])]

        // Check if we have sessions in each 4-hour block
        const timeBlocks = [0, 0, 0, 0, 0, 0] // 0-4, 4-8, 8-12, 12-16, 16-20, 20-24

        const last24Hours = Date.now() - 86400000

        allSessions.forEach((session) => {
          const sessionTime = new Date(session.timestamp)

          // Only count sessions in the last 24 hours
          if (sessionTime.getTime() < last24Hours) return

          const hour = sessionTime.getHours()
          const blockIndex = Math.floor(hour / 4)
          timeBlocks[blockIndex] = 1
        })

        // Check if all blocks have at least one session
        return timeBlocks.every((block) => block === 1)
      },
      progress: (data) => {
        const sessions = data.sessions || []
        const dailySessions = data.dailySessions || {}

        // Get all sessions from today and yesterday
        const today = new Date().toLocaleDateString()
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()

        const allSessions = [...(sessions || []), ...(dailySessions[yesterday] || [])]

        // Check if we have sessions in each 4-hour block
        const timeBlocks = [0, 0, 0, 0, 0, 0] // 0-4, 4-8, 8-12, 12-16, 16-20, 20-24

        const last24Hours = Date.now() - 86400000

        allSessions.forEach((session) => {
          const sessionTime = new Date(session.timestamp)

          // Only count sessions in the last 24 hours
          if (sessionTime.getTime() < last24Hours) return

          const hour = sessionTime.getHours()
          const blockIndex = Math.floor(hour / 4)
          timeBlocks[blockIndex] = 1
        })

        // Count how many blocks have at least one session
        return timeBlocks.reduce((sum, block) => sum + block, 0)
      },
      target: 6,
      isSecret: true,
    },
    {
      id: "speed_learner",
      title: "Speed Learner",
      description: "Complete 10 study sessions in a single day",
      icon: "fa-solid fa-bolt-lightning",
      rarity: "🔵 Rare",
      xpReward: 100,
      hint: "Quantity has a quality all its own...",
      condition: (data) => {
        const sessions = data.sessions || []
        return sessions.length >= 10
      },
      progress: (data) => {
        const sessions = data.sessions || []
        return Math.min(sessions.length, 10)
      },
      target: 10,
      isSecret: true,
    },
    {
      id: "tag_master",
      title: "Tag Master",
      description: "Use 5 different tags in your study sessions",
      icon: "fa-solid fa-tags",
      rarity: "🔵 Rare",
      xpReward: 75,
      hint: "Organization leads to optimization...",
      condition: (data) => {
        const sessions = data.sessions || []
        const uniqueTags = new Set(sessions.filter((s) => s.tag).map((s) => s.tag))
        return uniqueTags.size >= 5
      },
      progress: (data) => {
        const sessions = data.sessions || []
        const uniqueTags = new Set(sessions.filter((s) => s.tag).map((s) => s.tag))
        return Math.min(uniqueTags.size, 5)
      },
      target: 5,
      isSecret: true,
    },

    {
      id: "subject_explorer",
      title: "Subject Explorer",
      description: "Study 15 different subjects across all your sessions",
      icon: "fa-solid fa-compass",
      rarity: "🟣 Legendary",
      xpReward: 150,
      hint: "The world of knowledge is vast...",
      condition: (data) => {
        const sessions = data.sessions || []
        const dailySessions = data.dailySessions || {}

        // Collect all subjects from all sessions
        const allSubjects = new Set()

        // Add subjects from today's sessions
        sessions.forEach((session) => {
          allSubjects.add(session.subject)
        })

        // Add subjects from historical sessions
        Object.values(dailySessions).forEach((daySessions) => {
          daySessions.forEach((session) => {
            allSubjects.add(session.subject)
          })
        })

        return allSubjects.size >= 15
      },
      progress: (data) => {
        const sessions = data.sessions || []
        const dailySessions = data.dailySessions || {}

        // Collect all subjects from all sessions
        const allSubjects = new Set()

        // Add subjects from today's sessions
        sessions.forEach((session) => {
          allSubjects.add(session.subject)
        })

        // Add subjects from historical sessions
        Object.values(dailySessions).forEach((daySessions) => {
          daySessions.forEach((session) => {
            allSubjects.add(session.subject)
          })
        })

        return Math.min(allSubjects.size, 15)
      },
      target: 15,
      isSecret: true,
    },
    // Add these new shadow achievements to the shadowAchievements array after the existing achievements

    // "The Accidental Genius" - Open the app at 4:04 PM
    {
      id: "accidental_genius",
      title: "The Accidental Genius",
      description: "Open the app exactly at 4:04 PM (bonus if on April 4th)",
      icon: "fa-solid fa-clock",
      rarity: "🟣 Legendary",
      condition: () => {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const month = now.getMonth() // 0-based, so 3 = April
        const day = now.getDate()

        // Check if it's 4:04 PM (16:04)
        const is404Time = hours === 16 && minutes === 4

        // Extra special if it's April 4th
        const isApril4 = month === 3 && day === 4

        // If it's both April 4th and 4:04 PM, give double XP
        if (is404Time && isApril4) {
          window.shadowAchievementData.accidental_genius_xp_multiplier = 2
        }

        return is404Time
      },
      progress: () => 1,
      target: 1,
      xp: 404,
      rarity: "🟣 Legendary",
      isSecret: true,
    },

    // "The Hacker" - Open browser dev tools
    {
      id: "the_hacker",
      title: "The Hacker",
      description: "We see you looking under the hood 👀",
      icon: "fa-solid fa-terminal",
      hint: "Curious developers might find secrets in unexpected places...",
      condition: () => {
        // This will be set to true by the dev tools detection logic
        return window.shadowAchievementData.devToolsOpened === true
      },
      progress: () => (window.shadowAchievementData.devToolsOpened ? 1 : 0),
      target: 1,
      xpReward: 133,
      rarity: "🟡 Rare",
      isSecret: true,
      visible: true, // Make this achievement always visible in the shadow achievements list
    },

    // "Darkness Within" - Switch between light and dark mode rapidly
    {
      id: "darkness_within",
      title: "Darkness Within",
      description: "Switch between Light and Dark mode rapidly 10 times",
      icon: "fa-solid fa-circle-half-stroke",
      hint: "Light and dark, dark and light, switch between them with all your might...",
      condition: () => {
        return (window.shadowAchievementData.themeSwitchCount || 0) >= 10
      },
      progress: () => Math.min(window.shadowAchievementData.themeSwitchCount || 0, 10),
      target: 10,
      xpReward: 150,
      rarity: "🔵 Uncommon",
      isSecret: true,
      visible: true, // Make this achievement visible in the shadow achievements list
    },

    // "Developer Detected" - Enter specific name in profile settings
    {
      id: "developer_detected",
      title: "Developer Detected",
      description: "Nice try with that username...",
      icon: "fa-solid fa-code",
      condition: () => {
        return shadowAchievementData.developerNameUsed === true
      },
      progress: () => (shadowAchievementData.developerNameUsed ? 1 : 0),
      target: 1,
      xp: 100,
      rarity: "🟡 Rare",
      isSecret: true,
    },

    // "Shhh..." - Stay idle on profile page for 10 minutes
    {
      id: "idle_master",
      title: "Shhh...",
      description: "Stayed perfectly still for 10 minutes. Are you meditating?",
      icon: "fa-solid fa-ghost",
      condition: () => {
        return shadowAchievementData.idleTime >= 600 // 600 seconds = 10 minutes
      },
      progress: () => Math.min(shadowAchievementData.idleTime || 0, 600),
      target: 600,
      xp: 200,
      rarity: "🟠 Epic",
      isSecret: true,
    },
  ],

  // Initialize the shadow achievements system
  init: function () {
    // Load shadow achievements data from localStorage
    this.loadShadowAchievements()

    // Add shadow achievements tab to the achievements page if it doesn't exist
    this.addShadowAchievementsTab()

    // Check for new achievements
    this.checkAchievements()

    // Make the shadow achievements system available globally
    window.shadowAchievements = this

    // Set up event listeners for specific achievements
    this.setupAchievementListeners()

    console.log("Shadow Achievements System initialized")
  },

  // Add a new function to set up event listeners for specific achievements
  setupAchievementListeners: function () {
    // Listen for theme toggle clicks for the "Darkness Within" achievement
    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const now = Date.now()

        // Only count rapid toggles (within 2 seconds of each other)
        if (now - window.shadowAchievementData.lastThemeToggleTime < 2000) {
          window.shadowAchievementData.themeSwitchCount = (window.shadowAchievementData.themeSwitchCount || 0) + 1
          console.log("Theme toggle count:", window.shadowAchievementData.themeSwitchCount)

          // Check for achievement
          this.checkAchievements()
        } else {
          // Reset counter if too slow
          window.shadowAchievementData.themeSwitchCount = 1
        }

        window.shadowAchievementData.lastThemeToggleTime = now
      })
    }

    // Listen for profile name changes for the "Developer Detected" achievement
    const profileNameInput = document.getElementById("profile-name")
    if (profileNameInput) {
      profileNameInput.addEventListener("change", () => {
        const name = profileNameInput.value.toLowerCase()
        const developerNames = ["developer", "admin", "administrator", "root", "superuser", "debug"]

        if (developerNames.some((devName) => name.includes(devName))) {
          window.shadowAchievementData.developerNameUsed = true
          this.checkAchievements()
        }
      })
    }
  },

  // Load shadow achievements data from localStorage
  loadShadowAchievements: function () {
    const savedData = localStorage.getItem("shadowAchievementsData")

    if (savedData) {
      this.data = JSON.parse(savedData)
    } else {
      // Initialize with default values
      this.data = {
        unlockedAchievements: [],
        progress: {},
        hints: {},
        lastCheck: new Date().toISOString(),
      }

      // Save initial data
      this.saveShadowAchievements()
    }
  },

  // Save shadow achievements data to localStorage
  saveShadowAchievements: function () {
    localStorage.setItem("shadowAchievementsData", JSON.stringify(this.data))
  },

  // Add shadow achievements tab to the achievements page
  addShadowAchievementsTab: function () {
    // Check if we're on the achievements page
    const achievementsContainer = document.querySelector(".achievements-container")
    if (!achievementsContainer) return

    // Check if the tab already exists
    if (document.getElementById("shadow-achievements-tab")) return

    // Get the tabs container
    const tabsContainer = document.querySelector(".tabs-container")
    if (!tabsContainer) {
      // Create tabs container if it doesn't exist
      const newTabsContainer = document.createElement("div")
      newTabsContainer.className = "tabs-container"
      achievementsContainer.prepend(newTabsContainer)

      // Add regular achievements tab
      const regularTab = document.createElement("button")
      regularTab.className = "tab-button active"
      regularTab.textContent = "Achievements"
      regularTab.dataset.tab = "regular-achievements"
      newTabsContainer.appendChild(regularTab)

      // Add shadow achievements tab
      const shadowTab = document.createElement("button")
      shadowTab.className = "tab-button"
      shadowTab.id = "shadow-achievements-tab"
      shadowTab.textContent = "Shadow Achievements"
      shadowTab.dataset.tab = "shadow-achievements"
      newTabsContainer.appendChild(shadowTab)

      // Create tab content containers
      const regularContent = document.createElement("div")
      regularContent.className = "tab-content active"
      regularContent.id = "regular-achievements"

      // Move existing achievements to the regular tab
      const achievementsList = document.getElementById("achievements-list")
      if (achievementsList) {
        regularContent.appendChild(achievementsList)
      }

      // Create shadow achievements content
      const shadowContent = document.createElement("div")
      shadowContent.className = "tab-content"
      shadowContent.id = "shadow-achievements"
      shadowContent.innerHTML = `
          <div class="shadow-achievements-header">
            <h3>Shadow Achievements</h3>
            <p>These are special hidden achievements that you can discover through your study habits.</p>
          </div>
          <div id="shadow-achievements-list" class="shadow-achievements-list"></div>
        `

      // Add tab contents to the page
      achievementsContainer.appendChild(regularContent)
      achievementsContainer.appendChild(shadowContent)

      // Add tab switching functionality
      const tabButtons = document.querySelectorAll(".tab-button")
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Remove active class from all tabs
          tabButtons.forEach((btn) => btn.classList.remove("active"))
          document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

          // Add active class to clicked tab
          button.classList.add("active")
          document.getElementById(button.dataset.tab).classList.add("active")
        })
      })
    } else {
      // Add shadow achievements tab to existing tabs container
      const shadowTab = document.createElement("button")
      shadowTab.className = "tab-button"
      shadowTab.id = "shadow-achievements-tab"
      shadowTab.textContent = "Shadow Achievements"
      shadowTab.dataset.tab = "shadow-achievements"
      tabsContainer.appendChild(shadowTab)

      // Create shadow achievements content
      const shadowContent = document.createElement("div")
      shadowContent.className = "tab-content"
      shadowContent.id = "shadow-achievements"
      shadowContent.innerHTML = `
          <div class="shadow-achievements-header">
            <h3>Shadow Achievements</h3>
            <p>These are special hidden achievements that you can discover through your study habits.</p>
          </div>
          <div id="shadow-achievements-list" class="shadow-achievements-list"></div>
        `

      // Add shadow achievements content to the page
      achievementsContainer.appendChild(shadowContent)

      // Update tab switching functionality
      const tabButtons = document.querySelectorAll(".tab-button")
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Remove active class from all tabs
          tabButtons.forEach((btn) => btn.classList.remove("active"))
          document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

          // Add active class to clicked tab
          button.classList.add("active")
          document.getElementById(button.dataset.tab).classList.add("active")
        })
      })
    }

    // Update shadow achievements list
    this.updateShadowAchievementsList()
  },

  // Update shadow achievements list in the UI
  updateShadowAchievementsList: function () {
    const shadowAchievementsList = document.getElementById("shadow-achievements-list")
    if (!shadowAchievementsList) return

    // Clear existing content
    shadowAchievementsList.innerHTML = ""

    // Get study data
    const studyData = JSON.parse(localStorage.getItem("studyTrackerData")) || {}

    // Add unlocked achievements
    this.data.unlockedAchievements.forEach((achievementId) => {
      const achievement = this.achievements.find((a) => a.id === achievementId)
      if (!achievement) return

      const achievementItem = document.createElement("div")
      achievementItem.className = "achievement-item achievement-unlocked shadow-achievement"

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
      achievementRarity.textContent = achievement.rarity

      achievementHeader.appendChild(achievementIcon)
      achievementHeader.appendChild(achievementTitle)
      achievementHeader.appendChild(achievementRarity)

      const achievementDescription = document.createElement("div")
      achievementDescription.className = "achievement-description"
      achievementDescription.textContent = achievement.description

      const achievementReward = document.createElement("div")
      achievementReward.className = "achievement-reward"
      achievementReward.textContent = `+${achievement.xpReward} XP`

      achievementItem.appendChild(achievementHeader)
      achievementItem.appendChild(achievementDescription)
      achievementItem.appendChild(achievementReward)

      shadowAchievementsList.appendChild(achievementItem)
    })

    // Add locked achievements with hints if close to unlocking or if they should be visible
    this.achievements.forEach((achievement) => {
      if (this.data.unlockedAchievements.includes(achievement.id)) return

      // Check if we should show a hint
      const progress = this.getAchievementProgress(achievement.id, studyData)
      const showHint = progress > 0 || this.data.hints[achievement.id] || achievement.visible === true

      if (showHint) {
        const achievementItem = document.createElement("div")
        achievementItem.className = "achievement-item shadow-achievement-hint"

        const achievementHeader = document.createElement("div")
        achievementHeader.className = "achievement-header"

        const achievementIcon = document.createElement("div")
        achievementIcon.className = "achievement-icon"
        achievementIcon.innerHTML = `<i class="fa-solid fa-question"></i>`

        const achievementTitle = document.createElement("div")
        achievementTitle.className = "achievement-title"
        achievementTitle.textContent = achievement.visible ? achievement.title : "???"

        const achievementRarity = document.createElement("div")
        achievementRarity.className = "achievement-rarity"
        achievementRarity.textContent = achievement.rarity

        achievementHeader.appendChild(achievementIcon)
        achievementHeader.appendChild(achievementTitle)
        achievementHeader.appendChild(achievementRarity)

        const achievementHint = document.createElement("div")
        achievementHint.className = "achievement-hint"
        achievementHint.textContent = achievement.hint

        // Add progress bar if there's progress
        if (progress > 0 && achievement.target > 1) {
          const progressBar = document.createElement("div")
          progressBar.className = "achievement-progress"

          const progressFill = document.createElement("div")
          progressFill.className = "achievement-progress-bar"
          progressFill.style.width = `${(progress / achievement.target) * 100}%`

          progressBar.appendChild(progressFill)

          const progressText = document.createElement("div")
          progressText.className = "achievement-progress-text"
          progressText.textContent = `${progress}/${achievement.target}`

          achievementItem.appendChild(achievementHeader)
          achievementItem.appendChild(achievementHint)
          achievementItem.appendChild(progressBar)
          achievementItem.appendChild(progressText)
        } else {
          achievementItem.appendChild(achievementHeader)
          achievementItem.appendChild(achievementHint)
        }

        shadowAchievementsList.appendChild(achievementItem)
      }
    })

    // If no achievements are shown, display a message
    if (shadowAchievementsList.children.length === 0) {
      const emptyMessage = document.createElement("div")
      emptyMessage.className = "empty-message"
      emptyMessage.textContent =
        "Shadow achievements are hidden until you discover them. Keep studying and you might unlock some surprises!"
      shadowAchievementsList.appendChild(emptyMessage)
    }
  },

  // Check for new achievements
  checkAchievements: function () {
    // Load data
    const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

    // Check each achievement
    this.achievements.forEach((achievement) => {
      // Skip if already unlocked
      if (this.data.unlockedAchievements.includes(achievement.id)) return

      // Check if achievement is unlocked
      if (achievement.condition(studyData)) {
        // Unlock achievement
        this.unlockAchievement(achievement.id, studyData)
      } else {
        // Update progress
        const progress = achievement.progress(studyData)
        this.data.progress[achievement.id] = progress

        // Show hint if close to unlocking
        if (progress > 0 && !this.data.hints[achievement.id]) {
          // For achievements with a target of 1, show hint at random with 10% chance
          if (achievement.target === 1 || progress / achievement.target >= 0.5) {
            if (Math.random() < 0.1) {
              this.showHint(achievement.id)
            }
          }
        }
      }
    })

    // Save data
    this.saveShadowAchievements()

    // Update UI
    this.updateShadowAchievementsList()
  },

  // Add this function after the checkAchievements function
  showAchievementNotification: function (achievement, xpReward) {
    // Create a custom notification if showNotification function doesn't exist
    if (typeof showNotification !== "function") {
      // Use our own notification system
      this.showUnlockNotification(achievement)
      return
    }

    // Create a special notification for shadow achievements
    const title = `🕵️ Secret Achievement Unlocked!`
    const message = `"${achievement.title}" - ${achievement.description} (+${xpReward} XP)`

    showNotification(title, message)

    // Play achievement sound if available
    try {
      const audio = new Audio("./sounds/achievement.mp3")
      audio.play()
    } catch (e) {
      console.error("Could not play achievement sound", e)
    }

    // Log to console with fancy styling
    const styles = [
      "color: purple",
      "background: #f0f0f0",
      "font-size: 14px",
      "padding: 5px 10px",
      "border-radius: 5px",
      "border-left: 3px solid #9c27b0",
      "font-weight: bold",
    ].join(";")

    console.log(`%c🕵️ Secret Achievement Unlocked: ${achievement.title}`, styles)
  },

  // Unlock an achievement
  unlockAchievement: function (achievementId, studyData) {
    // Find the achievement
    const achievement = this.achievements.find((a) => a.id === achievementId)
    if (!achievement) return

    // Add to unlocked achievements
    this.data.unlockedAchievements.push(achievementId)

    // Remove from hints
    delete this.data.hints[achievementId]

    // Save data
    this.saveShadowAchievements()

    // Add XP reward
    if (studyData && achievement.xpReward) {
      studyData.xp = (studyData.xp || 0) + achievement.xpReward
      localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
    }

    // Show notification
    this.showUnlockNotification(achievement)
    this.showAchievementNotification(achievement, achievement.xpReward)

    // Update UI
    this.updateShadowAchievementsList()
  },

  // Show a hint for an achievement
  showHint: function (achievementId) {
    // Find the achievement
    const achievement = this.achievements.find((a) => a.id === achievementId)
    if (!achievement) return

    // Add to hints
    this.data.hints[achievementId] = true

    // Save data
    this.saveShadowAchievements()

    // Show hint notification
    this.showHintNotification(achievement)
  },

  // Show unlock notification
  showUnlockNotification: function (achievement) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "shadow-achievement-notification"

    notification.innerHTML = `
        <div class="notification-icon">
          <i class="${achievement.icon}"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">Shadow Achievement Unlocked!</div>
          <div class="notification-achievement">${achievement.title}</div>
          <div class="notification-description">${achievement.description}</div>
          <div class="notification-reward">+${achievement.xpReward} XP</div>
        </div>
      `

    // Add to document
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Create fireworks effect
    this.createFireworks()

    // Hide notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show")

      // Remove notification after animation
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 5000)
  },

  // Show hint notification
  showHintNotification: (achievement) => {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "shadow-hint-notification"

    notification.innerHTML = `
        <div class="notification-icon">
          <i class="fa-solid fa-lightbulb"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">Shadow Achievement Hint</div>
          <div class="notification-hint">${achievement.hint}</div>
        </div>
      `

    // Add to document
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Hide notification after 4 seconds
    setTimeout(() => {
      notification.classList.remove("show")

      // Remove notification after animation
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 4000)
  },

  // Create fireworks effect
  createFireworks: () => {
    // Create container
    const fireworksContainer = document.createElement("div")
    fireworksContainer.className = "fireworks-container"
    document.body.appendChild(fireworksContainer)

    // Create fireworks
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const firework = document.createElement("div")
        firework.className = "firework"

        // Random position
        const x = Math.random() * window.innerWidth
        const y = Math.random() * window.innerHeight

        // Random color
        const hue = Math.floor(Math.random() * 360)
        const color = `hsl(${hue}, 100%, 60%)`

        firework.style.left = `${x}px`
        firework.style.top = `${y}px`
        firework.style.backgroundColor = color

        fireworksContainer.appendChild(firework)

        // Remove after animation
        setTimeout(() => {
          firework.remove()
        }, 1000)
      }, i * 20)
    }

    // Remove container after all fireworks
    setTimeout(() => {
      fireworksContainer.remove()
    }, 2000)
  },

  // Get achievement progress
  getAchievementProgress: function (achievementId, studyData) {
    // Find the achievement
    const achievement = this.achievements.find((a) => a.id === achievementId)
    if (!achievement) return 0

    // Return cached progress if available
    if (this.data.progress[achievementId] !== undefined) {
      return this.data.progress[achievementId]
    }

    // Calculate progress
    return achievement.progress(studyData)
  },
}

// Initialize shadow achievements system when the page loads
document.addEventListener("DOMContentLoaded", () => {
  shadowAchievements.init()
})

// Check for new achievements when study data changes
document.addEventListener("studyDataUpdated", () => {
  shadowAchievements.checkAchievements()
})

// Export for use in other files
window.shadowAchievements = shadowAchievements
