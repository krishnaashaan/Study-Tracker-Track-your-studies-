// Galaxy Visualization
const themeToggle = document.querySelector(".theme-toggle")
class StudyGalaxy {
  constructor(canvasId) {
    // Core properties
    this.canvas = document.getElementById(canvasId)
    if (!this.canvas) {
      console.error("Canvas element not found:", canvasId)
      return
    }

    this.ctx = this.canvas.getContext("2d")
    this.stars = [] // Subjects as stars
    this.constellations = [] // Related subjects
    this.nebulae = [] // Unexplored areas
    this.shootingStars = [] // Milestone animations
    this.particles = [] // Background particles
    this.subjectData = {} // Persistent subject data

    // View properties
    this.scale = 1
    this.offsetX = 0
    this.offsetY = 0
    this.isDragging = false
    this.lastMouseX = 0
    this.lastMouseY = 0
    this.targetOffsetX = 0
    this.targetOffsetY = 0
    this.targetScale = 1

    // Mobile touch properties
    this.lastTouchDistance = 0
    this.isMobile = this.detectMobile()
    this.touchStartTime = 0
    this.touchMoved = false
    this.lastTapTime = 0
    this.doubleTapDelay = 300 // ms
    this.longPressDelay = 500 // ms
    this.longPressTimer = null
    this.touchIndicators = []

    // Star being viewed
    this.selectedStar = null

    // Create tooltip
    this.createTooltip()

    // Subject info panel
    this.subjectInfo = document.getElementById("subject-info")
    if (!this.subjectInfo) {
      console.warn("Subject info panel not found")
    }

    // Galaxy achievements
    this.exploredStars = new Set()
    this.constellationsDiscovered = 0
    this.spectralTypesCollected = new Set()

    // Initialize
    this.init()

    // Will store persistent subject data
    // this.subjectData = {} // Will store persistent subject data
  }

  // Detect if device is mobile
  detectMobile() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
    )
  }

  // Create tooltip element
  createTooltip() {
    this.tooltip = document.createElement("div")
    this.tooltip.className = "star-tooltip"
    const container = document.querySelector(".galaxy-container")
    if (container) {
      container.appendChild(this.tooltip)
    } else {
      document.body.appendChild(this.tooltip)
      console.warn("Galaxy container not found, appending tooltip to body")
    }
  }

  // Initialize the galaxy
  init() {
    try {
      // Set canvas size
      this.resizeCanvas()
      window.addEventListener("resize", () => this.resizeCanvas())

      // Load data
      this.loadData()

      // Ensure data integrity
      this.ensureSubjectDataIntegrity()

      // Set up event listeners
      this.setupEventListeners()

      // Generate background particles
      this.generateParticles()

      // Generate legend
      this.generateLegend()

      // Create mobile UI elements if on mobile
      if (this.isMobile) {
        this.createMobileUI()
      }

      // Set up refresh interval (refresh every 5 minutes)
      setInterval(() => this.refreshGalaxyData(), 5 * 60 * 1000)

      // Start animation loop
      this.animate()

      console.log("Galaxy initialized successfully")
    } catch (error) {
      console.error("Error initializing galaxy:", error)
    }
  }

  // Create mobile UI elements
  createMobileUI() {
    try {
      // Create mobile star selector
      this.createMobileStarSelector()

      // Create mobile FAB
      this.createMobileFAB()

      // Create mobile zoom controls
      this.createMobileZoomControls()

      // Create mobile gesture guide
      this.createMobileGestureGuide()

      // Show gesture guide on first visit
      this.showGestureGuideIfFirstVisit()

      console.log("Mobile UI created successfully")
    } catch (error) {
      console.error("Error creating mobile UI:", error)
    }
  }

  // Create mobile star selector
  createMobileStarSelector() {
    try {
      // Create the selector container
      const selector = document.createElement("div")
      selector.className = "mobile-star-selector"
      selector.id = "mobile-star-selector"

      // Create header
      const header = document.createElement("div")
      header.className = "mobile-star-selector-header"

      const title = document.createElement("h3")
      title.textContent = "Select a Star"

      const closeBtn = document.createElement("button")
      closeBtn.className = "mobile-star-selector-close"
      closeBtn.innerHTML = '<i class="fas fa-times"></i>'
      closeBtn.setAttribute("aria-label", "Close star selector")

      header.appendChild(title)
      header.appendChild(closeBtn)

      // Create content
      const content = document.createElement("div")
      content.className = "mobile-star-selector-content"

      const starList = document.createElement("ul")
      starList.className = "mobile-star-list"
      starList.id = "mobile-star-list"

      content.appendChild(starList)

      // Assemble selector
      selector.appendChild(header)
      selector.appendChild(content)

      // Add to document
      document.body.appendChild(selector)

      // Add event listeners
      closeBtn.addEventListener("click", () => {
        selector.classList.remove("visible")
      })

      // Store reference
      this.mobileStarSelector = selector
      this.mobileStarList = starList

      console.log("Mobile star selector created")
    } catch (error) {
      console.error("Error creating mobile star selector:", error)
    }
  }

  // Create mobile FAB
  createMobileFAB() {
    try {
      const fab = document.createElement("button")
      fab.className = "mobile-fab"
      fab.innerHTML = '<i class="fas fa-star"></i>'
      fab.setAttribute("aria-label", "Show star selector")

      // Add to document
      document.body.appendChild(fab)

      // Add event listener
      fab.addEventListener("click", () => {
        this.showMobileStarSelector()
      })

      // Store reference
      this.mobileFAB = fab

      console.log("Mobile FAB created")
    } catch (error) {
      console.error("Error creating mobile FAB:", error)
    }
  }

  // Create mobile zoom controls
  createMobileZoomControls() {
    try {
      const controls = document.createElement("div")
      controls.className = "mobile-zoom-controls"

      const zoomIn = document.createElement("button")
      zoomIn.innerHTML = '<i class="fas fa-plus"></i>'
      zoomIn.setAttribute("aria-label", "Zoom in")

      const zoomOut = document.createElement("button")
      zoomOut.innerHTML = '<i class="fas fa-minus"></i>'
      zoomOut.setAttribute("aria-label", "Zoom out")

      const reset = document.createElement("button")
      reset.innerHTML = '<i class="fas fa-home"></i>'
      reset.setAttribute("aria-label", "Reset view")

      controls.appendChild(zoomIn)
      controls.appendChild(zoomOut)
      controls.appendChild(reset)

      // Add to document
      const container = document.querySelector(".galaxy-container")
      if (container) {
        container.appendChild(controls)
      }

      // Add event listeners
      zoomIn.addEventListener("click", () => this.zoomIn())
      zoomOut.addEventListener("click", () => this.zoomOut())
      reset.addEventListener("click", () => this.resetView())

      // Store reference
      this.mobileZoomControls = controls

      console.log("Mobile zoom controls created")
    } catch (error) {
      console.error("Error creating mobile zoom controls:", error)
    }
  }

  // Create mobile gesture guide
  createMobileGestureGuide() {
    try {
      const guide = document.createElement("div")
      guide.className = "mobile-gesture-guide"

      const title = document.createElement("h3")
      title.textContent = "Galaxy Navigation"

      const list = document.createElement("ul")
      list.className = "gesture-list"

      // Gesture items
      const gestures = [
        { icon: "fa-arrows-alt", text: "Drag to move around the galaxy" },
        { icon: "fa-expand-alt", text: "Pinch to zoom in and out" },
        { icon: "fa-hand-pointer", text: "Tap a star to select it" },
        { icon: "fa-star", text: "Use the star button to see all stars" },
      ]

      gestures.forEach((gesture) => {
        const item = document.createElement("li")
        item.className = "gesture-item"

        const icon = document.createElement("div")
        icon.className = "gesture-icon"
        icon.innerHTML = `<i class="fas ${gesture.icon}"></i>`

        const text = document.createElement("div")
        text.className = "gesture-text"
        text.textContent = gesture.text

        item.appendChild(icon)
        item.appendChild(text)
        list.appendChild(item)
      })

      const closeBtn = document.createElement("button")
      closeBtn.className = "gesture-guide-close"
      closeBtn.textContent = "Got it"

      guide.appendChild(title)
      guide.appendChild(list)
      guide.appendChild(closeBtn)

      // Add to document
      document.body.appendChild(guide)

      // Add event listener
      closeBtn.addEventListener("click", () => {
        guide.classList.remove("visible")
        localStorage.setItem("galaxyGestureGuideShown", "true")
      })

      // Store reference
      this.mobileGestureGuide = guide

      console.log("Mobile gesture guide created")
    } catch (error) {
      console.error("Error creating mobile gesture guide:", error)
    }
  }

  // Show gesture guide if first visit
  showGestureGuideIfFirstVisit() {
    try {
      const shown = localStorage.getItem("galaxyGestureGuideShown")
      if (!shown && this.mobileGestureGuide) {
        setTimeout(() => {
          this.mobileGestureGuide.classList.add("visible")
        }, 1000)
      }
    } catch (error) {
      console.error("Error showing gesture guide:", error)
    }
  }

  // Show mobile star selector
  showMobileStarSelector() {
    try {
      if (!this.mobileStarSelector || !this.mobileStarList) return

      // Clear existing list
      this.mobileStarList.innerHTML = ""

      // Sort stars by name
      const sortedStars = [...this.stars].sort((a, b) => a.name.localeCompare(b.name))

      // Populate list with stars
      sortedStars.forEach((star) => {
        const item = document.createElement("li")
        item.className = "mobile-star-item"
        item.setAttribute("data-star-id", star.id)

        const colorDot = document.createElement("div")
        colorDot.className = "mobile-star-color"
        colorDot.style.backgroundColor = star.spectralColor
        colorDot.style.boxShadow = `0 0 10px ${star.spectralColor}`

        const info = document.createElement("div")
        info.className = "mobile-star-info"

        const name = document.createElement("div")
        name.className = "mobile-star-name"
        name.textContent = star.name

        const details = document.createElement("div")
        details.className = "mobile-star-details"

        const time = document.createElement("div")
        time.className = "mobile-star-time"
        time.innerHTML = `<i class="fas fa-clock"></i> ${Math.floor(star.totalTime / 60)}h ${star.totalTime % 60}m`

        const streak = document.createElement("div")
        streak.className = "mobile-star-streak"
        streak.innerHTML = `<i class="fas fa-fire"></i> ${star.streak || 0} day streak`

        details.appendChild(time)
        details.appendChild(streak)

        info.appendChild(name)
        info.appendChild(details)

        const type = document.createElement("div")
        type.className = "mobile-star-type"
        type.textContent = `${star.spectralType}: ${this.getSpectralTypeDescription(star.spectralType)}`

        item.appendChild(colorDot)
        item.appendChild(info)
        item.appendChild(type)

        this.mobileStarList.appendChild(item)

        // Add event listener
        item.addEventListener("click", () => {
          this.selectStarFromMobileList(star)
        })
      })

      // Show the selector
      this.mobileStarSelector.classList.add("visible")

      console.log("Mobile star selector shown")
    } catch (error) {
      console.error("Error showing mobile star selector:", error)
    }
  }

  // Select star from mobile list
  selectStarFromMobileList(star) {
    try {
      if (!star) return

      // Hide the selector
      if (this.mobileStarSelector) {
        this.mobileStarSelector.classList.remove("visible")
      }

      // Select the star
      this.selectedStar = star

      // Center view on the star
      this.centerOnStar(star)

      // Show subject info
      this.showSubjectInfo(star)

      // Track for achievements
      this.exploredStars.add(star.name)
      this.spectralTypesCollected.add(star.spectralType)
      this.updateGalaxyAchievements()

      console.log("Star selected from mobile list:", star.name)
    } catch (error) {
      console.error("Error selecting star from mobile list:", error)
    }
  }

  // Center view on a specific star
  centerOnStar(star) {
    try {
      if (!star) return

      // Calculate target offset to center on star
      this.targetOffsetX = this.canvas.width / 2 - star.x * this.scale
      this.targetOffsetY = this.canvas.height / 2 - star.y * this.scale

      // Add visual feedback
      this.addTouchIndicator(star.x * this.scale + this.offsetX, star.y * this.scale + this.offsetY)

      console.log("Centered view on star:", star.name)
    } catch (error) {
      console.error("Error centering on star:", error)
    }
  }

  // Add touch indicator at position
  addTouchIndicator(x, y) {
    try {
      const indicator = document.createElement("div")
      indicator.className = "touch-indicator"
      indicator.style.left = `${x}px`
      indicator.style.top = `${y}px`

      const container = document.querySelector(".galaxy-container")
      if (container) {
        container.appendChild(indicator)

        // Activate animation
        setTimeout(() => {
          indicator.classList.add("active")
        }, 10)

        // Remove after animation
        setTimeout(() => {
          container.removeChild(indicator)
        }, 600)

        // Store reference
        this.touchIndicators.push(indicator)
      }
    } catch (error) {
      console.error("Error adding touch indicator:", error)
    }
  }

  // Resize canvas to fit container
  resizeCanvas() {
    try {
      const container = this.canvas.parentElement
      if (!container) return

      this.canvas.width = container.clientWidth
      this.canvas.height = container.clientHeight

      // Center the view
      if (this.stars.length > 0) {
        this.centerView()
      }

      // Update mobile detection on resize
      this.isMobile = this.detectMobile()

      // Create mobile UI if needed
      if (this.isMobile && !this.mobileStarSelector) {
        this.createMobileUI()
      }
    } catch (error) {
      console.error("Error resizing canvas:", error)
    }
  }

  // SPECTRAL CLASSIFICATION SYSTEM

  // Get spectral type based on study metrics
  getSpectralType(subject) {
    try {
      const minutes = subject.totalTime || 0
      const sessions = (subject.sessions || []).length
      const streak = subject.streak || 0

      // O-type: Blue Giants (most study time and longest streaks)
      if (minutes > 1200 && streak >= 20) return "O"

      // B-type: Blue Main Sequence (very high study time)
      if (minutes > 900 || (minutes > 600 && streak >= 15)) return "B"

      // A-type: White Main Sequence (high study time)
      if (minutes > 600 || (minutes > 400 && streak >= 10)) return "A"

      // F-type: Yellow-White Main Sequence (moderate-high study time)
      if (minutes > 400 || (minutes > 300 && streak >= 7)) return "F"

      // G-type: Yellow Main Sequence (moderate study time)
      if (minutes > 200 || (minutes > 150 && streak >= 5)) return "G"

      // K-type: Orange Main Sequence (low-moderate study time)
      if (minutes > 100 || (minutes > 50 && streak >= 3)) return "K"

      // M-type: Red Dwarfs (low study time)
      return "M"
    } catch (error) {
      console.error("Error determining spectral type:", error)
      return "M" // Default to M type
    }
  }

  // Get color for spectral type
  getSpectralTypeColor(type) {
    try {
      // Colors based on real stellar spectral types
      switch (type) {
        case "O":
          return "#5d8bf4" // Blue Giant
        case "B":
          return "#6d9bf8" // Blue Main Sequence
        case "A":
          return "#f8f7ff" // White Main Sequence
        case "F":
          return "#fff4e8" // Yellow-White Main Sequence
        case "G":
          return "#fff1a8" // Yellow Main Sequence
        case "K":
          return "#ffb347" // Orange Main Sequence
        case "M":
          return "#ff6b6b" // Red Dwarf
        default:
          return "#ff6b6b" // Default to red dwarf
      }
    } catch (error) {
      console.error("Error getting spectral type color:", error)
      return "#ff6b6b" // Default to red
    }
  }

  // Get description for spectral type
  getSpectralTypeDescription(type) {
    try {
      switch (type) {
        case "O":
          return "Blue Giant"
        case "B":
          return "Blue Main Sequence"
        case "A":
          return "White Main Sequence"
        case "F":
          return "Yellow-White Main Sequence"
        case "G":
          return "Yellow Main Sequence"
        case "K":
          return "Orange Main Sequence"
        case "M":
          return "Red Dwarf"
        default:
          return "Unknown"
      }
    } catch (error) {
      console.error("Error getting spectral type description:", error)
      return "Unknown"
    }
  }

  // Get star type based on study metrics
  getStarType(subject) {
    try {
      const minutes = subject.totalTime || 0
      const sessions = (subject.sessions || []).length
      const streak = subject.streak || 0

      if (minutes > 900 && streak >= 15) return "supergiant"
      if (minutes > 600 && streak >= 5) return "giant"
      if (minutes > 300 && sessions > 10) return "pulsar"
      if (minutes < 100) return "red dwarf"
      return "main-sequence"
    } catch (error) {
      console.error("Error determining star type:", error)
      return "main-sequence" // Default type
    }
  }

  // LEGEND GENERATION

  // Generate category legend
  generateLegend() {
    try {
      const categories = [
        { name: "Science", color: "#4fc3f7" },
        { name: "Math", color: "#7cb342" },
        { name: "Languages", color: "#ffb74d" },
        { name: "Arts", color: "#e57373" },
        { name: "Computer", color: "#ba68c8" },
        { name: "Business & Economics", color: "#2ec4b6" },
        { name: "Social Science", color: "#006989" },
        { name: "Other", color: "#ea2b1f" },
      ]

      const legendContainer = document.querySelector(".legend")
      if (!legendContainer) return

      legendContainer.innerHTML = ""

      categories.forEach(({ name, color }) => {
        const item = document.createElement("div")
        item.className = "legend-item"

        const colorDot = document.createElement("span")
        colorDot.className = "legend-color"
        colorDot.style.backgroundColor = color

        const label = document.createElement("span")
        label.textContent = name

        item.appendChild(colorDot)
        item.appendChild(label)
        legendContainer.appendChild(item)
      })

      // Generate spectral type legend
      this.generateSpectralTypeLegend()
    } catch (error) {
      console.error("Error generating legend:", error)
    }
  }

  // Generate spectral type legend
  generateSpectralTypeLegend() {
    try {
      const spectralTypes = [
        { type: "O", name: "Blue Giant" },
        { type: "B", name: "Blue Main Sequence" },
        { type: "A", name: "White Main Sequence" },
        { type: "F", name: "Yellow-White" },
        { type: "G", name: "Yellow" },
        { type: "K", name: "Orange" },
        { type: "M", name: "Red Dwarf" },
      ]

      const legendContainer = document.querySelector(".spectral-type-legend")
      if (!legendContainer) return

      legendContainer.innerHTML = ""

      spectralTypes.forEach(({ type, name }) => {
        const item = document.createElement("div")
        item.className = "spectral-type-item"

        const colorDot = document.createElement("span")
        colorDot.className = "spectral-type-color"
        colorDot.style.backgroundColor = this.getSpectralTypeColor(type)
        colorDot.style.boxShadow = `0 0 5px ${this.getSpectralTypeColor(type)}`

        const label = document.createElement("span")
        label.textContent = `${type}: ${name}`

        item.appendChild(colorDot)
        item.appendChild(label)
        legendContainer.appendChild(item)
      })
    } catch (error) {
      console.error("Error generating spectral type legend:", error)
    }
  }

  // DATA LOADING AND PROCESSING

  // Load data from localStorage
  loadData() {
    try {
      // Load study data from localStorage
      const savedData = localStorage.getItem("studyTrackerData")
      if (!savedData) {
        this.generateDemoData()
        return
      }

      const studyData = JSON.parse(savedData)

      // Load saved star positions and constellations
      const savedPositions = JSON.parse(localStorage.getItem("galaxyStarPositions") || "{}")
      const savedConstellations = JSON.parse(localStorage.getItem("galaxyConstellations") || "[]")

      // Load persistent subject data if it exists
      const savedSubjectData = localStorage.getItem("galaxySubjectData")
      this.subjectData = savedSubjectData ? JSON.parse(savedSubjectData) : {}

      // Track all known subject names across all sessions
      const subjectNames = new Set()

      // Add subjects from today's sessions
      if (studyData.sessions) {
        studyData.sessions.forEach((session) => {
          if (session && session.subject) {
            subjectNames.add(session.subject)
          }
        })
      }

      // Add subjects from historical daily sessions
      if (studyData.dailySessions) {
        Object.values(studyData.dailySessions).forEach((daySessions) => {
          if (Array.isArray(daySessions)) {
            daySessions.forEach((session) => {
              if (session && session.subject) {
                subjectNames.add(session.subject)
              }
            })
          }
        })
      }

      // Add subjects from our persistent tracking
      Object.keys(this.subjectData).forEach((subject) => {
        subjectNames.add(subject)
      })

      // Reset subjects to start fresh (keep structure but reset counts)
      const subjects = {}

      // Initialize or update subjects from all sources
      subjectNames.forEach((name) => {
        if (this.subjectData[name]) {
          // Keep existing subject data structure but reset totalTime
          subjects[name] = {
            ...this.subjectData[name],
            totalTime: 0, // Reset totalTime to recalculate from sessions
            sessions: [], // Reset sessions to avoid duplicates
          }
        } else {
          // Create new subject
          subjects[name] = {
            name: name,
            totalTime: 0,
            sessions: [],
            topics: {},
            lastStudied: null,
            streak: 0,
            dailyProgress: {}, // Track daily study progress for streak calculation
          }
        }
      })

      // Process today's sessions
      if (studyData.sessions) {
        this.processSessionsIntoSubjects(studyData.sessions, subjects)
      }

      // Process historical sessions
      if (studyData.dailySessions) {
        Object.entries(studyData.dailySessions).forEach(([date, daySessions]) => {
          if (Array.isArray(daySessions)) {
            this.processSessionsIntoSubjects(daySessions, subjects)
          }
        })
      }

      // Calculate streaks for each subject
      this.calculateSubjectStreaks(subjects)

      // Save the updated subject data for persistence
      this.subjectData = subjects
      localStorage.setItem("galaxySubjectData", JSON.stringify(this.subjectData))

      // Visualization
      if (Object.keys(savedPositions).length > 0 && savedConstellations.length > 0) {
        // Use saved positions for existing stars
        this.createStarsFromSubjectsWithPositions(subjects, savedPositions)
      } else {
        // Generate new positions
        this.createStarsFromSubjects(subjects)
      }

      this.createConstellations(subjects)
      this.createNebulae()
      this.centerView()

      // Validate and repair any issues
      this.validateAndRepairStarData()

      // Dispatch event to notify of data update
      document.dispatchEvent(new CustomEvent("galaxyDataUpdated"))

      console.log("Galaxy data loaded successfully")
    } catch (error) {
      console.error("Error loading data:", error)
      this.generateDemoData() // Fallback to demo data
    }
  }

  // Process sessions into subjects
  processSessionsIntoSubjects(sessions, subjects) {
    try {
      if (!Array.isArray(sessions)) return

      sessions.forEach((session) => {
        if (!session || !session.subject) return

        const subject = subjects[session.subject]
        if (!subject) return // Skip if subject doesn't exist

        // Check if session is already processed by timestamp
        const sessionExists = subject.sessions.some(
          (existingSession) => existingSession.timestamp === session.timestamp,
        )

        if (!sessionExists) {
          // Only add time if this is a new session
          subject.totalTime += session.time || 0

          // Add the new session to the sessions array
          subject.sessions.push(session)

          // Update last studied
          const sessionDate = new Date(session.timestamp)
          if (!subject.lastStudied || sessionDate > new Date(subject.lastStudied)) {
            subject.lastStudied = session.timestamp
          }

          // Track topics
          if (session.topic) {
            if (!subject.topics[session.topic]) {
              subject.topics[session.topic] = {
                name: session.topic,
                totalTime: 0,
              }
            }
            subject.topics[session.topic].totalTime += session.time || 0
          }
        }
      })
    } catch (error) {
      console.error("Error processing sessions:", error)
    }
  }

  // Calculate subject streaks
  calculateSubjectStreaks(subjects) {
    try {
      Object.values(subjects).forEach((subject) => {
        if (!subject.sessions || subject.sessions.length === 0) return

        // Sort sessions by date
        subject.sessions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        // Create a map of study days (yyyy-mm-dd format)
        const studyDays = new Set()
        subject.sessions.forEach((session) => {
          if (session && session.timestamp) {
            const date = new Date(session.timestamp)
            const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            studyDays.add(dateStr)
          }
        })

        // Convert to sorted array
        const sortedDays = Array.from(studyDays).sort()

        if (sortedDays.length === 0) {
          subject.streak = 0
          return
        }

        // Calculate streak
        let currentStreak = 1
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`

        // Latest study day
        const lastStudyDay = sortedDays[sortedDays.length - 1]

        // If last study was before yesterday, streak is broken
        if (lastStudyDay !== todayStr && lastStudyDay !== yesterdayStr) {
          subject.streak = 0
          return
        }

        // Calculate continuous streak by checking consecutive days
        for (let i = sortedDays.length - 2; i >= 0; i--) {
          const currentDay = new Date(
            sortedDays[i].split("-")[0],
            sortedDays[i].split("-")[1] - 1,
            sortedDays[i].split("-")[2],
          )
          const nextDay = new Date(
            sortedDays[i + 1].split("-")[0],
            sortedDays[i + 1].split("-")[1] - 1,
            sortedDays[i + 1].split("-")[2],
          )

          // Calculate difference in days
          const timeDiff = nextDay.getTime() - currentDay.getTime()
          const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24))

          if (dayDiff === 1) {
            // Consecutive day
            currentStreak++
          } else {
            // Streak broken
            break
          }
        }

        subject.streak = currentStreak
      })
    } catch (error) {
      console.error("Error calculating streaks:", error)
    }
  }

  // Update with new session
  updateWithNewSession(session) {
    try {
      if (!session || !session.subject) return

      // Load current subject data
      if (!this.subjectData[session.subject]) {
        this.subjectData[session.subject] = {
          name: session.subject,
          totalTime: 0,
          sessions: [],
          topics: {},
          lastStudied: null,
          streak: 0,
          dailyProgress: {},
        }
      }

      const subject = this.subjectData[session.subject]

      // Check if session already exists
      const sessionExists = subject.sessions.some((existingSession) => existingSession.timestamp === session.timestamp)

      if (!sessionExists) {
        // Update subject data
        subject.totalTime += session.time || 0
        subject.sessions.push(session)
        subject.lastStudied = session.timestamp

        // Update topic if provided
        if (session.topic) {
          if (!subject.topics[session.topic]) {
            subject.topics[session.topic] = {
              name: session.topic,
              totalTime: 0,
            }
          }
          subject.topics[session.topic].totalTime += session.time || 0
        }

        // Update daily progress for streak tracking
        const sessionDate = new Date(session.timestamp)
        const dateStr = `${sessionDate.getFullYear()}-${sessionDate.getMonth() + 1}-${sessionDate.getDate()}`
        if (!subject.dailyProgress) subject.dailyProgress = {}
        subject.dailyProgress[dateStr] = true
      }

      // Recalculate streak
      this.calculateSubjectStreaks({ [session.subject]: subject })

      // Save updated subject data
      localStorage.setItem("galaxySubjectData", JSON.stringify(this.subjectData))

      // Check if we need to add a new star or update existing
      const existingStar = this.stars.find((star) => star.name === session.subject)

      if (existingStar) {
        // Update existing star
        existingStar.totalTime = subject.totalTime
        existingStar.streak = subject.streak
        existingStar.lastStudied = subject.lastStudied
        existingStar.sessions = subject.sessions
        existingStar.topics = Object.values(subject.topics)

        // Update spectral type and color
        existingStar.spectralType = this.getSpectralType(subject)
        existingStar.spectralColor = this.getSpectralTypeColor(existingStar.spectralType)

        // Update size based on total time
        existingStar.size = Math.max(6, Math.min(30, 6 + subject.totalTime / 60))

        // Update planets
        existingStar.planets = this.createPlanetsForStar(existingStar)
      } else {
        // Create a new star
        const subjects = { [session.subject]: subject }
        this.createStarsFromSubjects(subjects)
        this.createConstellations(subjects)
      }

      // Update galaxy achievements
      this.updateGalaxyAchievements()

      console.log("Session added successfully:", session.subject)
    } catch (error) {
      console.error("Error updating with new session:", error)
    }
  }

  // Refresh galaxy data
  refreshGalaxyData() {
    try {
      this.loadData()
      console.log("Galaxy data refreshed")
    } catch (error) {
      console.error("Error refreshing galaxy data:", error)
    }
  }

  // STAR AND CONSTELLATION CREATION

  // Create stars from subjects
  createStarsFromSubjects(subjects) {
    try {
      // Keep existing stars if any
      const existingStars = [...this.stars]
      this.stars = []

      const subjectEntries = Object.entries(subjects)
      const centerX = this.canvas.width / 2
      const centerY = this.canvas.height / 2

      const arms = 4
      const a = 0.2
      const spiralB = 0.3

      // Load saved star positions
      const savedPositions = JSON.parse(localStorage.getItem("galaxyStarPositions") || "{}")
      let updated = false // Track if new stars were added

      subjectEntries.forEach((entry, index) => {
        const [name, subject] = entry
        const key = name.toLowerCase()

        // Check if this star already exists
        const existingStar = existingStars.find((s) => s.name === name)
        if (existingStar) {
          // Update existing star data but keep position
          this.updateExistingStar(existingStar, subject)
          this.stars.push(existingStar)
          return
        }

        const type = this.getStarType(subject)
        const spectralType = this.getSpectralType(subject)

        let x, y
        let attempts = 0
        const maxAttempts = 100
        const minDistance = 100

        if (savedPositions[key]) {
          // Use saved position
          x = savedPositions[key].x
          y = savedPositions[key].y
        } else {
          // Generate and retry for spacing
          do {
            const armIndex = index % arms
            const theta = spiralB * index + armIndex * ((Math.PI * 2) / arms) + attempts * 0.05
            const r = a * theta * 100 + 50 + Math.random() * 30

            x = centerX + r * Math.cos(theta) + (Math.random() - 0.5) * 20
            y = centerY + r * Math.sin(theta) + (Math.random() - 0.5) * 20

            attempts++
            if (attempts > maxAttempts) {
              // If we can't find a good position, place it randomly
              x = centerX + (Math.random() - 0.5) * this.canvas.width * 0.8
              y = centerY + (Math.random() - 0.5) * this.canvas.height * 0.8
              break
            }
          } while (
            this.stars.some((s) => {
              const dx = s.x - x
              const dy = s.y - y
              return Math.sqrt(dx * dx + dy * dy) < minDistance
            })
          )

          // Save new position
          savedPositions[key] = { x, y }
          updated = true
        }

        // Validate coordinates
        if (!isFinite(x) || !isFinite(y)) {
          console.warn(`Invalid coordinates for star ${name}, using default position`)
          x = centerX + (Math.random() - 0.5) * 200
          y = centerY + (Math.random() - 0.5) * 200
        }

        const size = Math.max(6, Math.min(30, 6 + subject.totalTime / 60))
        const color = this.getSubjectColor(name)
        const spectralColor = this.getSpectralTypeColor(spectralType)

        const star = {
          id: this.stars.length,
          name,
          x,
          y,
          type,
          spectralType,
          spectralColor,
          size,
          color,
          glow: 0.8 + Math.min(1, subject.totalTime / 1000),
          pulse: 0,
          pulseSpeed: 0.0001 + Math.random() * 0.006,
          totalTime: subject.totalTime,
          topics: Object.values(subject.topics),
          lastStudied: subject.lastStudied,
          streak: subject.streak,
          sessions: subject.sessions,
          isNew: false,
        }

        star.planets = this.createPlanetsForStar(star)
        this.stars.push(star)
        this.spectralTypesCollected.add(spectralType)
      })

      // Save only if there were changes
      if (updated) {
        localStorage.setItem("galaxyStarPositions", JSON.stringify(savedPositions))
      }

      this.updateGalaxyAchievements()
    } catch (error) {
      console.error("Error creating stars from subjects:", error)
    }
  }

  // Create stars from subjects with saved positions
  createStarsFromSubjectsWithPositions(subjects, savedPositions) {
    try {
      this.stars = []
      const subjectEntries = Object.entries(subjects)

      subjectEntries.forEach((entry, index) => {
        const [name, subject] = entry
        const key = name.toLowerCase()

        // Skip if no saved position
        if (!savedPositions[key]) return

        const { x, y } = savedPositions[key]

        // Validate coordinates
        if (!isFinite(x) || !isFinite(y)) {
          console.warn(`Invalid saved coordinates for star ${name}, skipping`)
          return
        }

        const type = this.getStarType(subject)
        const spectralType = this.getSpectralType(subject)
        const size = Math.max(6, Math.min(30, 6 + subject.totalTime / 60))
        const color = this.getSubjectColor(name)
        const spectralColor = this.getSpectralTypeColor(spectralType)

        const star = {
          id: this.stars.length,
          name,
          x,
          y,
          type,
          spectralType,
          spectralColor,
          size,
          color,
          glow: 0.8 + Math.min(1, subject.totalTime / 1000),
          pulse: 0,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          totalTime: subject.totalTime,
          topics: Object.values(subject.topics),
          lastStudied: subject.lastStudied,
          streak: subject.streak,
          sessions: subject.sessions,
          isNew: false,
        }

        star.planets = this.createPlanetsForStar(star)
        this.stars.push(star)
        this.spectralTypesCollected.add(spectralType)
      })

      this.updateGalaxyAchievements()
    } catch (error) {
      console.error("Error creating stars with saved positions:", error)
    }
  }

  // Update existing star with new data
  updateExistingStar(star, subject) {
    try {
      star.totalTime = subject.totalTime
      star.streak = subject.streak
      star.lastStudied = subject.lastStudied
      star.sessions = subject.sessions
      star.topics = Object.values(subject.topics)
      star.type = this.getStarType(subject)
      star.spectralType = this.getSpectralType(subject)
      star.spectralColor = this.getSpectralTypeColor(star.spectralType)
      star.size = Math.max(6, Math.min(30, 6 + subject.totalTime / 60))
      star.glow = 0.8 + Math.min(1, subject.totalTime / 1000)
      star.planets = this.createPlanetsForStar(star)
    } catch (error) {
      console.error("Error updating existing star:", error)
    }
  }

  // Create planets for a star
  createPlanetsForStar(star) {
    try {
      const planets = []
      const topics = Array.isArray(star.topics) ? star.topics : Object.values(star.topics)

      topics.forEach((topic, index) => {
        if (!topic || !topic.name) return

        // Calculate orbit radius based on star size
        const orbitRadius = star.size * 1.5 + index * 10

        // Reduce planet size (min 1, max 3)
        const size = Math.max(1, Math.min(3, 1 + (topic.totalTime || 0) / 520))

        // Random starting angle
        const startAngle = Math.random() * Math.PI * 2

        // Orbit speed (smaller = faster)
        const orbitSpeed = 0.006 + Math.random() * 0.002

        // Create planet
        const planet = {
          name: topic.name,
          orbitRadius: orbitRadius,
          angle: startAngle,
          orbitSpeed: orbitSpeed,
          size: size,
          color: this.getTopicColor(topic.name, star.color),
          totalTime: topic.totalTime || 0,
        }

        planets.push(planet)
      })

      return planets
    } catch (error) {
      console.error("Error creating planets for star:", error)
      return []
    }
  }
  // Create constellations between related subjects
  createConstellations(subjects) {
    try {
      this.constellations = []
      const subjectNames = Object.keys(subjects)

      for (let i = 0; i < subjectNames.length; i++) {
        const subjectA = subjectNames[i]

        for (let j = 0; j < subjectNames.length; j++) {
          if (i === j) continue

          const subjectB = subjectNames[j]
          if (this.areSubjectsRelated(subjectA, subjectB)) {
            const starA = this.stars.find((star) => star.name === subjectA)
            const starB = this.stars.find((star) => star.name === subjectB)

            if (starA && starB) {
              // Prevent duplicate or circular connections
              const alreadyExists = this.constellations.some(
                (c) => (c.starA === starA && c.starB === starB) || (c.starA === starB && c.starB === starA),
              )

              if (!alreadyExists) {
                this.constellations.push({
                  starA,
                  starB,
                  opacity: 0.3 + Math.random() * 0.5,
                })
              }
            }
          }
        }
      }

      // Save constellations to localStorage
      localStorage.setItem("galaxyConstellations", JSON.stringify(this.constellations))

      // Update constellations discovered count
      this.constellationsDiscovered = this.constellations.length
    } catch (error) {
      console.error("Error creating constellations:", error)
    }
  }

  // Check if two subjects are related
  areSubjectsRelated(subjectA, subjectB) {
    try {
      const normalize = (s) => s.toLowerCase().trim()

      subjectA = normalize(subjectA)
      subjectB = normalize(subjectB)

      const categories = {
        science: ["physics", "chemistry", "biology", "astronomy", "science"],
        math: ["mathematics", "algebra", "calculus", "geometry", "statistics", "maths"],
        language: ["english", "spanish", "french", "german", "latin", "language", "hindi", "portuguese", "italian"],
        art: ["art", "music", "drawing", "painting", "design", "sculpture"],
        computer: [
          "computer science",
          "programming",
          "web development",
          "coding",
          "data science",
          "machine learning",
          "ai",
        ],
        history: ["history", "geography", "politics", "civics", "archaeology"],
        business: ["economics", "business", "finance", "accounting", "marketing", "management"],
        socialscience: ["psychology", "sociology", "philosophy", "ethics", "anthropology", "political science"],
      }

      // Check if subjects are in the same category
      for (const subjects of Object.values(categories)) {
        if (subjects.some((s) => subjectA.includes(s)) && subjects.some((s) => subjectB.includes(s))) {
          return true
        }
      }

      // Special connections between different categories
      const specialConnections = [
        // Core STEM
        ["mathematics", "physics"],
        ["maths", "physics"],
        ["mathematics", "engineering"],
        ["maths", "engineering"],
        ["physics", "astronomy"],
        ["biology", "chemistry"],
        ["chemistry", "physics"],
        ["biology", "environmental science"],
        ["engineering", "computer science"],
        ["computer science", "mathematics"],
        ["computer science", "maths"],

        // Technology & AI
        ["computer science", "data science"],
        ["computer science", "ai"],
        ["computer science", "web development"],
        ["programming", "machine learning"],
        ["data science", "statistics"],

        // Humanities & Social Sciences
        ["history", "political science"],
        ["history", "archaeology"],
        ["political science", "civics"],
        ["philosophy", "ethics"],
        ["psychology", "sociology"],
        ["psychology", "neuroscience"],
        ["sociology", "anthropology"],

        // Business & Economics
        ["economics", "business"],
        ["economics", "finance"],
        ["business", "marketing"],
        ["business", "management"],
        ["accounting", "finance"],

        // Arts & Languages
        ["art", "design"],
        ["art", "music"],
        ["art", "photography"],
        ["english", "literature"],
        ["language", "literature"],
        ["french", "literature"],
        ["language", "culture"],

        // Geography & Environment
        ["geography", "environmental science"],
        ["geography", "history"],

        // Education & Philosophy
        ["philosophy", "education"],
        ["psychology", "education"],

        // Bonus cross-disciplinary links
        ["statistics", "economics"],
        ["maths", "finance"],
        ["art", "technology"],
        ["engineering", "environmental science"],
      ]

      for (const [a, b] of specialConnections) {
        if ((subjectA.includes(a) && subjectB.includes(b)) || (subjectA.includes(b) && subjectB.includes(a))) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error checking subject relation:", error)
      return false
    }
  }

  // Create nebulae in empty areas
  createNebulae() {
    try {
      this.nebulae = []
      const nebulaCount = 5 + Math.floor(Math.random() * 5)

      for (let i = 0; i < nebulaCount; i++) {
        const x = this.canvas.width * 0.2 + Math.random() * this.canvas.width * 0.6
        const y = this.canvas.height * 0.2 + Math.random() * this.canvas.height * 0.6

        // Check if too close to any star
        const tooClose = this.stars.some((star) => {
          const dx = star.x - x
          const dy = star.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)
          return distance < 100
        })

        if (!tooClose) {
          this.nebulae.push({
            x: x,
            y: y,
            size: 100 + Math.random() * 150,
            color: this.getNebulaColor(),
            opacity: 0.1 + Math.random() * 0.1,
            seed: Math.random(),
          })
        }
      }
    } catch (error) {
      console.error("Error creating nebulae:", error)
    }
  }

  // Generate background particles
  generateParticles() {
    try {
      this.particles = []
      const particleCount = 100

      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: 0.5 + Math.random() * 1,
          opacity: 0.1 + Math.random() * 0.5,
          speed: 0.05 + Math.random() * 0.1,
        })
      }

      this.generateDustClouds()
    } catch (error) {
      console.error("Error generating particles:", error)
    }
  }

  // Generate dust clouds
  generateDustClouds(count = 600) {
    try {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * this.canvas.width
        const y = Math.random() * this.canvas.height
        const size = 1 + Math.random() * 2
        const opacity = 0.02 + Math.random() * 0.05

        this.particles.push({
          x,
          y,
          size,
          opacity,
          isDust: true,
        })
      }
    } catch (error) {
      console.error("Error generating dust clouds:", error)
    }
  }

  // DEMO DATA GENERATION

  // Generate demo data if no real data exists
  generateDemoData() {
    try {
      // Create demo stars if no data exists
      const demoSubjects = {
        Mathematics: {
          name: "Mathematics",
          totalTime: 420,
          sessions: [],
          topics: {
            Algebra: { name: "Algebra", totalTime: 180 },
            Calculus: { name: "Calculus", totalTime: 120 },
            Geometry: { name: "Geometry", totalTime: 120 },
          },
          lastStudied: new Date().toISOString(),
          streak: 3,
        },
        Physics: {
          name: "Physics",
          totalTime: 300,
          sessions: [],
          topics: {
            Mechanics: { name: "Mechanics", totalTime: 150 },
            Electricity: { name: "Electricity", totalTime: 150 },
          },
          lastStudied: new Date().toISOString(),
          streak: 2,
        },
        "Computer Science": {
          name: "Computer Science",
          totalTime: 500,
          sessions: [],
          topics: {
            Programming: { name: "Programming", totalTime: 250 },
            Algorithms: { name: "Algorithms", totalTime: 150 },
            "Data Structures": { name: "Data Structures", totalTime: 100 },
          },
          lastStudied: new Date().toISOString(),
          streak: 5,
        },
        English: {
          name: "English",
          totalTime: 200,
          sessions: [],
          topics: {
            Grammar: { name: "Grammar", totalTime: 100 },
            Literature: { name: "Literature", totalTime: 100 },
          },
          lastStudied: new Date().toISOString(),
          streak: 1,
        },
        Art: {
          name: "Art",
          totalTime: 150,
          sessions: [],
          topics: {
            Drawing: { name: "Drawing", totalTime: 90 },
            Painting: { name: "Painting", totalTime: 60 },
          },
          lastStudied: new Date().toISOString(),
          streak: 1,
        },
        Astronomy: {
          name: "Astronomy",
          totalTime: 950,
          sessions: [],
          topics: {
            Planets: { name: "Planets", totalTime: 350 },
            Stars: { name: "Stars", totalTime: 400 },
            Galaxies: { name: "Galaxies", totalTime: 200 },
          },
          lastStudied: new Date().toISOString(),
          streak: 18,
        },
        Chemistry: {
          name: "Chemistry",
          totalTime: 700,
          sessions: [],
          topics: {
            "Organic Chemistry": { name: "Organic Chemistry", totalTime: 400 },
            "Inorganic Chemistry": { name: "Inorganic Chemistry", totalTime: 300 },
          },
          lastStudied: new Date().toISOString(),
          streak: 12,
        },
      }

      // Create stars from demo subjects
      this.createStarsFromSubjects(demoSubjects)

      // Create demo constellations
      this.createConstellations(demoSubjects)

      // Create nebulae
      this.createNebulae()

      // Center the view
      this.centerView()

      console.log("Demo data generated")
    } catch (error) {
      console.error("Error generating demo data:", error)
    }
  }

  // UTILITY METHODS

  // Get color based on subject category
  getSubjectColor(subject) {
    try {
      subject = subject.toLowerCase()

      if (this.isInCategory(subject, ["physics", "chemistry", "biology", "science", "astronomy"])) {
        return "#4fc3f7" // Blue for science
      } else if (this.isInCategory(subject, ["math", "mathematics", "algebra", "calculus", "geometry", "statistics"])) {
        return "#7cb342" // Green for math
      } else if (
        this.isInCategory(subject, [
          "english",
          "spanish",
          "french",
          "german",
          "language",
          "literature",
          "hindi",
          "portuguese",
          "italian",
        ])
      ) {
        return "#ffb74d" // Orange for languages
      } else if (this.isInCategory(subject, ["art", "music", "drawing", "painting", "design"])) {
        return "#e57373" // Red for arts
      } else if (
        this.isInCategory(subject, [
          "computer",
          "programming",
          "web development",
          "coding",
          "data science",
          "machine learning",
        ])
      ) {
        return "#ba68c8" // Purple for computer-related subject
      } else if (this.isInCategory(subject, ["economics", "business", "finance", "accounting", "marketing"])) {
        return "#2ec4b6" // Coral for business and economics
      } else if (
        this.isInCategory(subject, ["psychology", "sociology", "politics", "social science", "history", "geography"])
      ) {
        return "#006989" // Light blue for social sciences
      } else {
        return "#ea2b1f" // Default color for other subjects
      }
    } catch (error) {
      console.error("Error getting subject color:", error)
      return "#ea2b1f" // Default color
    }
  }

  // Check if subject is in a category
  isInCategory(subject, categories) {
    try {
      return categories.some((category) => subject.includes(category))
    } catch (error) {
      console.error("Error checking category:", error)
      return false
    }
  }

  // Get color for a topic based on star color
  getTopicColor(topic, starColor) {
    try {
      // Slightly vary the star color for topics
      const color = this.hexToRgb(starColor)

      // Randomly adjust RGB values slightly
      const r = Math.max(0, Math.min(255, color.r + (Math.random() * 40 - 20)))
      const g = Math.max(0, Math.min(255, color.g + (Math.random() * 40 - 20)))
      const b = Math.max(0, Math.min(255, color.b + (Math.random() * 40 - 20)))

      return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`
    } catch (error) {
      console.error("Error getting topic color:", error)
      return starColor // Fallback to star color
    }
  }

  // Get random nebula color
  getNebulaColor() {
    try {
      // Random nebula colors
      const colors = [
        "rgba(76, 195, 247, 0.1)", // Blue
        "rgba(124, 179, 66, 0.1)", // Green
        "rgba(255, 183, 77, 0.1)", // Orange
        "rgba(229, 115, 115, 0.1)", // Red
        "rgba(186, 104, 200, 0.1)", // Purple
      ]

      return colors[Math.floor(Math.random() * colors.length)]
    } catch (error) {
      console.error("Error getting nebula color:", error)
      return "rgba(76, 195, 247, 0.1)" // Default blue
    }
  }

  // Convert hex color to RGB
  hexToRgb(hex) {
    try {
      // Handle invalid hex
      if (!hex || typeof hex !== "string") {
        return { r: 0, g: 0, b: 0 }
      }

      // Convert hex color to RGB
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 }
    } catch (error) {
      console.error("Error converting hex to RGB:", error)
      return { r: 0, g: 0, b: 0 }
    }
  }

  // Adjust color opacity
  adjustColorOpacity(color, opacity) {
    try {
      if (!color) return `rgba(0, 0, 0, ${opacity})`

      // Handle hex colors
      if (color.startsWith("#")) {
        const rgb = this.hexToRgb(color)
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
      }

      // Handle rgb/rgba colors
      if (color.startsWith("rgb")) {
        // Extract RGB values
        const match = color.match(/rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?$$/)
        if (match) {
          return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`
        }
      }

      return color
    } catch (error) {
      console.error("Error adjusting color opacity:", error)
      return `rgba(0, 0, 0, ${opacity})`
    }
  }

  // Validate and repair star data
  validateAndRepairStarData() {
    try {
      // Check for stars with invalid coordinates
      this.stars = this.stars.filter((star) => {
        if (!star || !isFinite(star.x) || !isFinite(star.y) || !isFinite(star.size)) {
          console.warn(`Removing invalid star:`, star ? star.name : "unnamed")
          return false
        }
        return true
      })

      // Check for stars with invalid spectral colors
      this.stars.forEach((star) => {
        if (!star.spectralColor || star.spectralColor === "undefined") {
          console.warn(`Repairing invalid spectral color for star:`, star.name)
          star.spectralType = this.getSpectralType({
            totalTime: star.totalTime || 0,
            sessions: star.sessions || [],
            streak: star.streak || 0,
          })
          star.spectralColor = this.getSpectralTypeColor(star.spectralType)
        }

        // Ensure planets are valid
        if (!Array.isArray(star.planets)) {
          star.planets = []
        }
      })

      // Check for constellations with invalid star references
      this.constellations = this.constellations.filter((constellation) => {
        if (!constellation || !constellation.starA || !constellation.starB) return false

        const starAExists = this.stars.some((s) => s === constellation.starA)
        const starBExists = this.stars.some((s) => s === constellation.starB)
        return starAExists && starBExists
      })

      console.log("Star data validated and repaired")
    } catch (error) {
      console.error("Error validating star data:", error)
    }
  }

  // EVENT HANDLING

  // Set up event listeners
  setupEventListeners() {
    try {
      // Mouse events for dragging
      this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e))
      this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e))
      this.canvas.addEventListener("mouseup", () => this.onMouseUp())
      this.canvas.addEventListener("mouseleave", () => this.onMouseUp())

      // Touch events for mobile
      this.canvas.addEventListener("touchstart", (e) => this.onTouchStart(e), { passive: false })
      this.canvas.addEventListener("touchmove", (e) => this.onTouchMove(e), { passive: false })
      this.canvas.addEventListener("touchend", (e) => this.onTouchEnd(e))

      // Wheel event for zooming
      this.canvas.addEventListener("wheel", (e) => this.onWheel(e))

      // Click event for selecting stars
      this.canvas.addEventListener("click", (e) => this.onCanvasClick(e))

      // Close button for subject info
      const closeButton = document.getElementById("close-info")
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          if (this.subjectInfo) {
            this.subjectInfo.classList.remove("visible")
          }
          this.selectedStar = null
        })
      }

      // Control buttons
      const zoomIn = document.getElementById("zoom-in")
      const zoomOut = document.getElementById("zoom-out")
      const resetView = document.getElementById("reset-view")

      if (zoomIn) zoomIn.addEventListener("click", () => this.zoomIn())
      if (zoomOut) zoomOut.addEventListener("click", () => this.zoomOut())
      if (resetView) resetView.addEventListener("click", () => this.resetView())

      // Add listener for new study sessions
      document.addEventListener("newStudySession", (event) => {
        if (event.detail) {
          this.updateWithNewSession(event.detail)
        }
      })

      // Add listener for study data updates
      document.addEventListener("studyDataUpdated", () => {
        this.loadData()
      })

      console.log("Event listeners set up")
    } catch (error) {
      console.error("Error setting up event listeners:", error)
    }
  }

  // Mouse down event handler
  onMouseDown(e) {
    try {
      this.isDragging = true
      this.lastMouseX = e.clientX
      this.lastMouseY = e.clientY
      this.canvas.style.cursor = "grabbing"
    } catch (error) {
      console.error("Error in mouse down handler:", error)
    }
  }

  // Mouse move event handler
  onMouseMove(e) {
    try {
      // Update tooltip
      const rect = this.canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Check if mouse is over a star
      const hoveredStar = this.getStarAtPosition(mouseX, mouseY)

      if (hoveredStar) {
        // Create enhanced tooltip with spectral type
        this.tooltip.innerHTML = `
          <div class="tooltip-title">${hoveredStar.name}</div>
          <div class="tooltip-time">${Math.floor(hoveredStar.totalTime / 60)} hrs ${hoveredStar.totalTime % 60} min</div>
          <div class="tooltip-type">Type: ${hoveredStar.spectralType} (${this.getSpectralTypeDescription(hoveredStar.spectralType)})</div>
          <div class="tooltip-streak">${hoveredStar.streak} day streak</div>
        `

        this.tooltip.style.left = `${e.clientX}px`
        this.tooltip.style.top = `${e.clientY}px`
        this.tooltip.classList.add("visible")
      } else {
        this.tooltip.classList.remove("visible")
      }

      if (!this.isDragging) return

      const deltaX = e.clientX - this.lastMouseX
      const deltaY = e.clientY - this.lastMouseY

      this.targetOffsetX += deltaX
      this.targetOffsetY += deltaY

      this.lastMouseX = e.clientX
      this.lastMouseY = e.clientY
    } catch (error) {
      console.error("Error in mouse move handler:", error)
    }
  }

  // Mouse up event handler
  onMouseUp() {
    try {
      this.isDragging = false
      this.canvas.style.cursor = "grab"
    } catch (error) {
      console.error("Error in mouse up handler:", error)
    }
  }

  // Touch start event handler
  onTouchStart(e) {
    try {
      // Record touch start time for detecting long press
      this.touchStartTime = Date.now()
      this.touchMoved = false

      // Clear any existing long press timer
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer)
      }

      // Set up long press timer
      this.longPressTimer = setTimeout(() => {
        if (!this.touchMoved) {
          // Handle long press - show star selector
          this.showMobileStarSelector()

          // Add haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(50)
          }
        }
      }, this.longPressDelay)

      if (e.touches.length === 1) {
        // Single touch - dragging
        e.preventDefault()
        this.isDragging = true
        this.lastMouseX = e.touches[0].clientX
        this.lastMouseY = e.touches[0].clientY

        // Check for double tap
        const now = Date.now()
        if (now - this.lastTapTime < this.doubleTapDelay) {
          // Double tap detected
          const rect = this.canvas.getBoundingClientRect()
          const touchX = e.touches[0].clientX - rect.left
          const touchY = e.touches[0].clientY - rect.top

          // Check if a star was tapped
          const tappedStar = this.getStarAtPosition(touchX, touchY)

          if (tappedStar) {
            // Double tap on star - zoom in on it
            this.targetScale = Math.min(3, this.scale * 1.5)
            this.centerOnStar(tappedStar)
          } else {
            // Double tap on empty space - reset view
            this.resetView()
          }

          // Add haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate([20, 30, 20])
          }
        }

        this.lastTapTime = now
      } else if (e.touches.length === 2) {
        // Two finger touch - pinch to zoom
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        this.lastTouchDistance = Math.sqrt(dx * dx + dy * dy)
      }
    } catch (error) {
      console.error("Error in touch start handler:", error)
    }
  }

  // Touch move event handler
  onTouchMove(e) {
    try {
      // Mark that touch has moved (to prevent long press)
      this.touchMoved = true

      // Clear long press timer
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer)
        this.longPressTimer = null
      }

      if (e.touches.length === 1 && this.isDragging) {
        // Single touch - dragging
        e.preventDefault()
        const deltaX = e.touches[0].clientX - this.lastMouseX
        const deltaY = e.touches[0].clientY - this.lastMouseY

        this.targetOffsetX += deltaX
        this.targetOffsetY += deltaY

        this.lastMouseX = e.touches[0].clientX
        this.lastMouseY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        // Two finger touch - pinch to zoom
        e.preventDefault()

        // Calculate new distance
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Calculate zoom factor
        const zoomFactor = distance / this.lastTouchDistance

        if (zoomFactor > 0.01) {
          // Calculate center point of the two touches
          const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2
          const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2

          // Get canvas-relative coordinates
          const rect = this.canvas.getBoundingClientRect()
          const canvasCenterX = centerX - rect.left
          const canvasCenterY = centerY - rect.top

          // Calculate world position before zoom
          const worldX = (canvasCenterX - this.offsetX) / this.scale
          const worldY = (canvasCenterY - this.offsetY) / this.scale

          // Calculate new scale
          const newScale = Math.max(0.5, Math.min(3, this.scale * zoomFactor))

          // Calculate new offset to zoom toward center point
          this.targetOffsetX = canvasCenterX - worldX * newScale
          this.targetOffsetY = canvasCenterY - worldY * newScale

          // Set new scale
          this.targetScale = newScale
        }

        this.lastTouchDistance = distance
      }
    } catch (error) {
      console.error("Error in touch move handler:", error)
    }
  }

  // Touch end event handler
  onTouchEnd(e) {
    try {
      this.isDragging = false

      // Clear long press timer
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer)
        this.longPressTimer = null
      }

      // If touch didn't move much, treat as a tap
      if (!this.touchMoved && Date.now() - this.touchStartTime < 300) {
        // Handle tap - select star
        const rect = this.canvas.getBoundingClientRect()
        let touchX, touchY

        // Get the touch coordinates
        if (e.changedTouches && e.changedTouches.length > 0) {
          touchX = e.changedTouches[0].clientX - rect.left
          touchY = e.changedTouches[0].clientY - rect.top
        } else {
          // Fallback if changedTouches not available
          return
        }

        // Check if a star was tapped
        const tappedStar = this.getStarAtPosition(touchX, touchY)

        if (tappedStar) {
          // Star tapped - select it
          this.selectedStar = tappedStar
          this.showSubjectInfo(tappedStar)

          // Track for achievements
          this.exploredStars.add(tappedStar.name)
          this.spectralTypesCollected.add(tappedStar.spectralType)
          this.updateGalaxyAchievements()

          // Add visual feedback
          this.addTouchIndicator(touchX, touchY)

          // Add haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(30)
          }
        }
      }
    } catch (error) {
      console.error("Error in touch end handler:", error)
    }
  }

  // Wheel event handler for zooming
  onWheel(e) {
    try {
      e.preventDefault()

      // Determine zoom direction
      const zoomAmount = -e.deltaY * 0.001

      // Calculate new scale
      const newScale = Math.max(0.5, Math.min(3, this.targetScale + zoomAmount))

      // Get mouse position relative to canvas
      const rect = this.canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate mouse position in world space before zoom
      const worldX = (mouseX - this.offsetX) / this.scale
      const worldY = (mouseY - this.offsetY) / this.scale

      // Calculate new offset to zoom toward mouse position
      this.targetOffsetX = mouseX - worldX * newScale
      this.targetOffsetY = mouseY - worldY * newScale

      // Set new scale
      this.targetScale = newScale
    } catch (error) {
      console.error("Error in wheel handler:", error)
    }
  }

  // Canvas click event handler
  onCanvasClick(e) {
    try {
      const rect = this.canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      // Check if a star was clicked
      const clickedStar = this.getStarAtPosition(clickX, clickY)

      if (clickedStar) {
        this.selectedStar = clickedStar
        this.showSubjectInfo(clickedStar)

        // Track for achievements
        this.exploredStars.add(clickedStar.name)
        this.spectralTypesCollected.add(clickedStar.spectralType)

        // Update localStorage for achievements
        this.updateGalaxyAchievements()
      } else {
        this.selectedStar = null
        if (this.subjectInfo) {
          this.subjectInfo.classList.remove("visible")
        }
      }
    } catch (error) {
      console.error("Error in canvas click handler:", error)
    }
  }

  // Get star at position
  getStarAtPosition(x, y) {
    try {
      // Convert screen coordinates to world coordinates
      const worldX = (x - this.offsetX) / this.scale
      const worldY = (y - this.offsetY) / this.scale

      // Check each star
      for (const star of this.stars) {
        if (!star || !isFinite(star.x) || !isFinite(star.y) || !isFinite(star.size)) continue

        const dx = star.x - worldX
        const dy = star.y - worldY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Check if click is within star radius (including glow)
        if (distance < star.size * (1 + (star.glow || 0) * 0.5)) {
          return star
        }
      }

      return null
    } catch (error) {
      console.error("Error getting star at position:", error)
      return null
    }
  }

  // Show subject info panel
  showSubjectInfo(star) {
    try {
      if (!this.subjectInfo || !star) return

      // Update subject info panel
      const nameElement = document.getElementById("subject-name")
      const hoursElement = document.getElementById("subject-hours")
      const sessionsElement = document.getElementById("subject-sessions")
      const streakElement = document.getElementById("subject-streak")
      const topicList = document.getElementById("topic-list")
      const sessionList = document.getElementById("session-list")

      if (nameElement) {
        nameElement.textContent = `${star.name} (${star.spectralType}: ${this.getSpectralTypeDescription(star.spectralType)})`
      }

      if (hoursElement) {
        hoursElement.textContent = `${Math.floor(star.totalTime / 60)} hrs ${star.totalTime % 60} min`
      }

      if (sessionsElement) {
        sessionsElement.textContent = `${star.sessions ? star.sessions.length : 0} sessions`
      }

      if (streakElement) {
        streakElement.textContent = `${star.streak || 0} day streak`
      }

      // Update topics list
      if (topicList) {
        topicList.innerHTML = ""
        const topics = Array.isArray(star.topics) ? star.topics : []

        if (topics.length === 0) {
          const li = document.createElement("li")
          li.textContent = "No topics recorded yet"
          topicList.appendChild(li)
        } else {
          topics.forEach((topic) => {
            if (!topic || !topic.name) return

            const li = document.createElement("li")
            const topicName = document.createElement("span")
            topicName.textContent = topic.name

            const topicTime = document.createElement("span")
            topicTime.textContent = `${Math.floor((topic.totalTime || 0) / 60)} hrs ${(topic.totalTime || 0) % 60} min`

            li.appendChild(topicName)
            li.appendChild(topicTime)
            topicList.appendChild(li)
          })
        }
      }

      // Update recent sessions
      if (sessionList) {
        sessionList.innerHTML = ""
        const sessions = Array.isArray(star.sessions) ? star.sessions : []

        if (sessions.length === 0) {
          const li = document.createElement("li")
          li.textContent = "No sessions recorded yet"
          sessionList.appendChild(li)
        } else {
          // Sort sessions by date (most recent first)
          const recentSessions = [...sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5) // Show only 5 most recent

          recentSessions.forEach((session) => {
            const li = document.createElement("li")

            const sessionDate = document.createElement("span")
            sessionDate.textContent = new Date(session.timestamp).toLocaleDateString()

            const sessionTime = document.createElement("span")
            sessionTime.textContent = `${session.time || 0} min`

            li.appendChild(sessionDate)
            li.appendChild(sessionTime)
            sessionList.appendChild(li)
          })
        }
      }

      // Show the panel
      this.subjectInfo.classList.add("visible")
    } catch (error) {
      console.error("Error showing subject info:", error)
    }
  }

  // VIEW CONTROLS

  // Zoom in
  zoomIn() {
    try {
      this.targetScale = Math.min(3, this.targetScale + 0.2)
    } catch (error) {
      console.error("Error zooming in:", error)
    }
  }

  // Zoom out
  zoomOut() {
    try {
      this.targetScale = Math.max(0.5, this.targetScale - 0.2)
    } catch (error) {
      console.error("Error zooming out:", error)
    }
  }

  // Reset view
  resetView() {
    try {
      this.targetScale = 1
      this.centerView()
    } catch (error) {
      console.error("Error resetting view:", error)
    }
  }

  // Center view
  centerView() {
    try {
      this.targetOffsetX = this.canvas.width / 2
      this.targetOffsetY = this.canvas.height / 2
    } catch (error) {
      console.error("Error centering view:", error)
    }
  }

  // ANIMATION AND RENDERING

  // Animation loop
  animate() {
    try {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // Smooth camera movement
      this.scale += (this.targetScale - this.scale) * 0.1
      this.offsetX += (this.targetOffsetX - this.offsetX) * 0.1
      this.offsetY += (this.targetOffsetY - this.offsetY) * 0.1

      // Draw background
      this.drawBackground()

      // Draw nebulae
      this.drawNebulae()

      // Draw constellations
      this.drawConstellations()

      // Draw stars and planets
      this.drawStarsAndPlanets()

      // Draw particles
      this.drawParticles()

      // Draw shooting stars
      this.drawShootingStars()
    } catch (error) {
      console.error("Error in animation loop:", error)
    }

    // Request next frame (outside try-catch to ensure loop continues)
    requestAnimationFrame(() => this.animate())
  }

  // Draw background
  drawBackground() {
    try {
      const width = this.canvas.width
      const height = this.canvas.height

      // Ensure all values are finite
      if (!isFinite(width) || !isFinite(height)) return

      const gradient = this.ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.2, // reduced from 0.5
      )

      gradient.addColorStop(0, "#111122")
      gradient.addColorStop(0.5, "#0a0a2a")
      gradient.addColorStop(1, "#000000")

      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, width, height)
    } catch (error) {
      console.error("Error drawing background:", error)

      // Fallback to solid color if gradient fails
      this.ctx.fillStyle = "#0a0a2a"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  // Draw nebulae
  drawNebulae() {
    try {
      this.nebulae.forEach((nebula) => {
        if (!nebula || !isFinite(nebula.x) || !isFinite(nebula.y) || !isFinite(nebula.size)) return

        // Apply camera transformation
        const screenX = nebula.x * this.scale + this.offsetX
        const screenY = nebula.y * this.scale + this.offsetY
        const screenSize = nebula.size * this.scale

        // Skip if off screen or values are invalid
        if (
          !isFinite(screenX) ||
          !isFinite(screenY) ||
          !isFinite(screenSize) ||
          screenX + screenSize < 0 ||
          screenX - screenSize > this.canvas.width ||
          screenY + screenSize < 0 ||
          screenY - screenSize > this.canvas.height
        ) {
          return
        }

        // Draw nebula
        try {
          const gradient = this.ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, screenSize)
          gradient.addColorStop(0, nebula.color.replace("0.1", "0.3"))
          gradient.addColorStop(1, nebula.color.replace("0.1", "0"))

          this.ctx.fillStyle = gradient
        } catch (gradientError) {
          // Fallback if gradient creation fails
          this.ctx.fillStyle = nebula.color
          console.warn("Using fallback nebula color due to gradient error")
        }

        this.ctx.beginPath()

        // Create a cloud-like shape using bezier curves
        const points = 8
        const angleStep = (Math.PI * 2) / points

        for (let i = 0; i < points; i++) {
          const angle = i * angleStep
          const nextAngle = ((i + 1) % points) * angleStep

          const radius1 = screenSize * (0.7 + Math.sin(angle * 3 + nebula.seed) * 0.3)
          const radius2 = screenSize * (0.7 + Math.sin(nextAngle * 3 + nebula.seed) * 0.3)

          const x1 = screenX + Math.cos(angle) * radius1
          const y1 = screenY + Math.sin(angle) * radius1

          const x2 = screenX + Math.cos(nextAngle) * radius2
          const y2 = screenY + Math.sin(nextAngle) * radius2

          const cpX1 = screenX + Math.cos(angle + angleStep * 0.3) * radius1 * 1.2
          const cpY1 = screenY + Math.sin(angle + angleStep * 0.3) * radius1 * 1.2

          const cpX2 = screenX + Math.cos(nextAngle - angleStep * 0.3) * radius2 * 1.2
          const cpY2 = screenY + Math.sin(nextAngle - angleStep * 0.3) * radius2 * 1.2

          if (i === 0) {
            this.ctx.moveTo(x1, y1)
          }

          this.ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x2, y2)
        }

        this.ctx.closePath()
        this.ctx.fill()
      })
    } catch (error) {
      console.error("Error drawing nebulae:", error)
    }
  }

  // Draw constellations
  drawConstellations() {
    try {
      this.constellations.forEach((constellation) => {
        if (!constellation || !constellation.starA || !constellation.starB) return

        // Apply camera transformation
        const x1 = constellation.starA.x * this.scale + this.offsetX
        const y1 = constellation.starA.y * this.scale + this.offsetY
        const x2 = constellation.starB.x * this.scale + this.offsetX
        const y2 = constellation.starB.y * this.scale + this.offsetY

        // Skip if any value is non-finite
        if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) return

        // Skip if off screen
        if (
          (x1 < 0 && x2 < 0) ||
          (x1 > this.canvas.width && x2 > this.canvas.width) ||
          (y1 < 0 && y2 < 0) ||
          (y1 > this.canvas.height && y2 > this.canvas.height)
        ) {
          return
        }

        // Draw line
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)

        // Create gradient along the line
        try {
          const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2)
          const opacity = constellation.opacity || 0.3
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`)
          gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`)
          this.ctx.strokeStyle = gradient
        } catch (gradientError) {
          // Fallback if gradient creation fails
          this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        }

        this.ctx.lineWidth = 1 * this.scale
        this.ctx.stroke()
      })
    } catch (error) {
      console.error("Error drawing constellations:", error)
    }
  }

  // Draw stars and planets
  drawStarsAndPlanets() {
    try {
      // Sort stars by size (smaller ones on top)
      const sortedStars = [...this.stars].sort((a, b) => b.size - a.size)

      sortedStars.forEach((star) => {
        if (!star || !isFinite(star.x) || !isFinite(star.y) || !isFinite(star.size)) return

        // Update star pulse
        star.pulse += star.pulseSpeed || 0.01
        if (star.pulse > Math.PI * 2) {
          star.pulse -= Math.PI * 2
        }

        // Calculate pulse effect
        const pulseEffect = Math.sin(star.pulse) * 0.2 + 0.8

        // Apply camera transformation
        const screenX = star.x * this.scale + this.offsetX
        const screenY = star.y * this.scale + this.offsetY
        const screenSize = star.size * this.scale * pulseEffect

        // Skip if any value is non-finite
        if (!isFinite(screenX) || !isFinite(screenY) || !isFinite(screenSize)) return

        // Skip if off screen
        if (
          screenX + screenSize * 2 < 0 ||
          screenX - screenSize * 2 > this.canvas.width ||
          screenY + screenSize * 2 < 0 ||
          screenY - screenSize * 2 > this.canvas.height
        ) {
          return
        }

        // Draw star based on spectral type
        const starColor = star.spectralColor || "#ffffff"

        // Draw star glow
        const glowSize = screenSize * (1 + (star.glow || 0.8))

        try {
          // Validate all gradient parameters
          if (isFinite(screenX) && isFinite(screenY) && isFinite(screenSize * 0.5) && isFinite(glowSize)) {
            const gradient = this.ctx.createRadialGradient(
              screenX,
              screenY,
              screenSize * 0.5,
              screenX,
              screenY,
              glowSize,
            )

            gradient.addColorStop(0, starColor)
            gradient.addColorStop(0.5, this.adjustColorOpacity(starColor, 0.5))
            gradient.addColorStop(1, this.adjustColorOpacity(starColor, 0))

            this.ctx.fillStyle = gradient
          } else {
            // Fallback if parameters are invalid
            this.ctx.fillStyle = starColor
          }
        } catch (gradientError) {
          // Fallback if gradient creation fails
          this.ctx.fillStyle = starColor
        }

        this.ctx.beginPath()
        this.ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2)
        this.ctx.fill()

        // Draw star core
        this.ctx.fillStyle = starColor
        this.ctx.beginPath()
        this.ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2)
        this.ctx.fill()

        // Draw highlight
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        this.ctx.beginPath()
        this.ctx.arc(screenX - screenSize * 0.2, screenY - screenSize * 0.2, screenSize * 0.3, 0, Math.PI * 2)
        this.ctx.fill()
        // Draw planets (orbiting topics)
        this.drawPlanets(star, screenX, screenY)

        // Draw selection indicator if this star is selected
        if (this.selectedStar === star) {
          this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
          this.ctx.lineWidth = 2 * this.scale
          this.ctx.setLineDash([5 * this.scale, 5 * this.scale])
          this.ctx.beginPath()
          this.ctx.arc(screenX, screenY, glowSize * 1.2, 0, Math.PI * 2)
          this.ctx.stroke()
          this.ctx.setLineDash([])
        }
      })
    } catch (error) {
      console.error("Error drawing stars and planets:", error)
    }
  }

  // Draw planets orbiting a star
  drawPlanets(star, starX, starY) {
    try {
      if (!star || !star.planets || !Array.isArray(star.planets) || star.planets.length === 0) return

      // Validate star position
      if (!isFinite(starX) || !isFinite(starY)) return

      star.planets.forEach((planet) => {
        if (!planet) return

        // Update planet position
        planet.angle = (planet.angle + (planet.orbitSpeed || 0.01)) % (Math.PI * 2)

        // Calculate planet position
        const orbitRadius = (planet.orbitRadius || 20) * this.scale
        const planetX = starX + Math.cos(planet.angle) * orbitRadius
        const planetY = starY + Math.sin(planet.angle) * orbitRadius
        const planetSize = (planet.size || 1) * this.scale

        // Skip if any value is non-finite
        if (!isFinite(planetX) || !isFinite(planetY) || !isFinite(planetSize) || !isFinite(orbitRadius)) return

        // Draw orbit path (faint)
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        this.ctx.lineWidth = 1 * this.scale
        this.ctx.beginPath()
        this.ctx.arc(starX, starY, orbitRadius, 0, Math.PI * 2)
        this.ctx.stroke()

        // Draw planet
        this.ctx.fillStyle = planet.color || "#ffffff"
        this.ctx.beginPath()
        this.ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2)
        this.ctx.fill()

        // Draw planet glow
        const glowSize = planetSize * 0.9999

        try {
          // Validate gradient parameters
          if (isFinite(planetX) && isFinite(planetY) && isFinite(planetSize * 0.5) && isFinite(glowSize)) {
            const gradient = this.ctx.createRadialGradient(
              planetX,
              planetY,
              planetSize * 0.5,
              planetX,
              planetY,
              glowSize,
            )

            gradient.addColorStop(0, this.adjustColorOpacity(planet.color, 0.5))
            gradient.addColorStop(1, this.adjustColorOpacity(planet.color, 0))

            this.ctx.fillStyle = gradient
            this.ctx.beginPath()
            this.ctx.arc(planetX, planetY, glowSize, 0, Math.PI * 2)
            this.ctx.fill()
          }
        } catch (gradientError) {
          // Skip glow if gradient fails
        }
      })
    } catch (error) {
      console.error("Error drawing planets:", error)
    }
  }

  // Draw background particles
  drawParticles() {
    try {
      this.particles.forEach((particle) => {
        if (!particle || !isFinite(particle.x) || !isFinite(particle.y) || !isFinite(particle.size)) return

        if (particle.isDust) {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity || 0.05})`
          this.ctx.beginPath()
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          this.ctx.fill()
        } else {
          particle.y += particle.speed || 0.1
          if (particle.y > this.canvas.height) {
            particle.y = 0
            particle.x = Math.random() * this.canvas.width
          }

          this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity || 0.3})`
          this.ctx.beginPath()
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          this.ctx.fill()
        }
      })
    } catch (error) {
      console.error("Error drawing particles:", error)
    }
  }

  // Draw shooting stars
  drawShootingStars() {
    try {
      // Occasionally add a new shooting star
      if (Math.random() < 0.005 && this.shootingStars.length < 3) {
        this.addShootingStar()
      }

      // Draw and update shooting stars
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const star = this.shootingStars[i]
        if (!star || !isFinite(star.x) || !isFinite(star.y)) {
          this.shootingStars.splice(i, 1)
          continue
        }

        // Update position
        star.x += star.speedX || 0
        star.y += star.speedY || 0

        // Remove if off screen
        if (star.x > this.canvas.width + 100 || star.y > this.canvas.height + 100) {
          this.shootingStars.splice(i, 1)
          continue
        }

        // Draw shooting star
        this.ctx.save()
        this.ctx.translate(star.x, star.y)
        this.ctx.rotate(star.angle || 0)

        // Draw trail
        try {
          const gradient = this.ctx.createLinearGradient(0, 0, -star.length || -50, 0)
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
          this.ctx.fillStyle = gradient
        } catch (gradientError) {
          this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        }

        this.ctx.beginPath()
        this.ctx.moveTo(0, 0)
        this.ctx.lineTo(-star.length || -50, (star.width || 2) / 2)
        this.ctx.lineTo(-star.length || -50, -(star.width || 2) / 2)
        this.ctx.closePath()
        this.ctx.fill()

        // Draw head
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        this.ctx.beginPath()
        this.ctx.arc(0, 0, (star.width || 2) / 2, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.restore()
      }
    } catch (error) {
      console.error("Error drawing shooting stars:", error)
    }
  }

  // Add a new shooting star
  addShootingStar() {
    try {
      const angle = Math.PI / 4 + (Math.random() * Math.PI) / 4 // 45-90 degrees
      const speed = 5 + Math.random() * 10

      this.shootingStars.push({
        x: -50 + Math.random() * -50,
        y: -50 + Math.random() * -50,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        angle: angle,
        length: 50 + Math.random() * 100,
        width: 2 + Math.random() * 3,
        opacity: 0.7 + Math.random() * 0.3,
      })
    } catch (error) {
      console.error("Error adding shooting star:", error)
    }
  }

  // Add a new star (subject) to the galaxy
  addStar(subject, totalTime, topics = []) {
    try {
      // Find a position that's not too close to existing stars
      let x, y, tooClose
      const centerX = this.canvas.width / 2
      const centerY = this.canvas.height / 2
      const minDistance = 80

      do {
        const angle = Math.random() * Math.PI * 2
        const distance = 100 + Math.random() * 200
        x = centerX + Math.cos(angle) * distance
        y = centerY + Math.sin(angle) * distance

        tooClose = this.stars.some((star) => {
          const dx = star.x - x
          const dy = star.y - y
          return Math.sqrt(dx * dx + dy * dy) < minDistance
        })
      } while (tooClose)

      // Determine star size based on total time (min 5, max 30)
      const size = Math.max(5, Math.min(30, 5 + totalTime / 60))

      // Create mock subject for spectral type determination
      const mockSubject = {
        name: subject,
        totalTime: totalTime,
        sessions: [],
        topics: topics,
        lastStudied: new Date().toISOString(),
        streak: 1,
      }

      // Determine star type and spectral type
      const type = this.getStarType(mockSubject)
      const spectralType = this.getSpectralType(mockSubject)
      const spectralColor = this.getSpectralTypeColor(spectralType)

      // Create star
      const star = {
        id: this.stars.length,
        name: subject,
        x: x,
        y: y,
        type: type,
        spectralType: spectralType,
        spectralColor: spectralColor,
        size: size,
        color: this.getSubjectColor(subject),
        glow: 0.5 + Math.min(1, totalTime / 1000),
        pulse: 0,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        totalTime: totalTime,
        topics: topics,
        lastStudied: new Date().toISOString(),
        streak: 1,
        sessions: [],
        isNew: true,
      }

      // Add planets (topics)
      star.planets = this.createPlanetsForStar(star)

      // Add to stars array
      this.stars.push(star)

      // Create new constellations with existing stars
      this.stars.forEach((existingStar) => {
        if (existingStar !== star && this.areSubjectsRelated(existingStar.name, star.name)) {
          this.constellations.push({
            starA: existingStar,
            starB: star,
            opacity: 0.3 + Math.random() * 0.2,
          })
        }
      })

      // Trigger star burst animation
      this.triggerStarBurst(star)

      // Track for achievements
      this.spectralTypesCollected.add(spectralType)
      this.updateGalaxyAchievements()

      return star
    } catch (error) {
      console.error("Error adding star:", error)
      return null
    }
  }

  // Trigger star burst animation
  triggerStarBurst(star) {
    try {
      if (!star) return

      // Create a burst animation for new stars
      star.isBursting = true
      star.burstProgress = 0

      // After animation completes, set to normal
      setTimeout(() => {
        if (star) star.isBursting = false
      }, 1000)
    } catch (error) {
      console.error("Error triggering star burst:", error)
    }
  }

  // Update galaxy achievements
  updateGalaxyAchievements() {
    try {
      const data = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

      // Ensure galaxyExplored is initialized
      if (!data.galaxyExplored) {
        data.galaxyExplored = []
      }

      // Add the currently selected star to the explored list if not already present
      if (this.selectedStar && !data.galaxyExplored.includes(this.selectedStar.id)) {
        data.galaxyExplored.push(this.selectedStar.id)
      }

      // Update spectral types collected
      data.spectralTypesCollected = Array.from(this.spectralTypesCollected || [])

      // Update constellations discovered
      data.constellationsDiscovered = this.constellations.length

      // Save back to localStorage
      localStorage.setItem("studyTrackerData", JSON.stringify(data))

      // Dispatch event to notify achievements.js
      document.dispatchEvent(new CustomEvent("galaxyDataUpdated"))
    } catch (error) {
      console.error("Error updating galaxy achievements:", error)
    }
  }

  // Ensure subject data integrity
  ensureSubjectDataIntegrity() {
    try {
      // Check all subjects
      Object.values(this.subjectData).forEach((subject) => {
        // Ensure no duplicate sessions by timestamp
        const uniqueSessions = []
        const seenTimestamps = new Set()

        if (subject.sessions) {
          subject.sessions.forEach((session) => {
            if (session && session.timestamp && !seenTimestamps.has(session.timestamp)) {
              seenTimestamps.add(session.timestamp)
              uniqueSessions.push(session)
            }
          })

          // Replace with deduplicated sessions
          subject.totalTime = 0
          subject.sessions = uniqueSessions

          // Recalculate total time
          subject.sessions.forEach((session) => {
            subject.totalTime += session.time || 0
          })

          // Ensure topics are consistent
          const topics = {}
          subject.sessions.forEach((session) => {
            if (session.topic) {
              if (!topics[session.topic]) {
                topics[session.topic] = {
                  name: session.topic,
                  totalTime: 0,
                }
              }
              topics[session.topic].totalTime += session.time || 0
            }
          })

          subject.topics = topics
        }

        // Ensure streak data structure
        if (!subject.dailyProgress) {
          subject.dailyProgress = {}
        }
      })

      // Save cleaned data
      localStorage.setItem("galaxySubjectData", JSON.stringify(this.subjectData))
      console.log("Subject data integrity ensured")
    } catch (error) {
      console.error("Error ensuring subject data integrity:", error)
    }
  }
}

// Initialize the galaxy when the page loads
document.addEventListener("DOMContentLoaded", () => {
  try {
    const galaxy = new StudyGalaxy("galaxy-canvas")

    // Make galaxy accessible globally for debugging
    window.studyGalaxy = galaxy
  } catch (error) {
    console.error("Error initializing galaxy:", error)
  }
})

// Update navigation to include galaxy link
function updateNavigation() {
  try {
    // Get all navigation menus
    const navs = document.querySelectorAll("nav ul")

    navs.forEach((nav) => {
      // Check if galaxy link already exists
      const existingLink = Array.from(nav.querySelectorAll("li a")).find(
        (a) => a.textContent.includes("Galaxy") || a.href.includes("galaxy.html"),
      )

      if (!existingLink) {
        // Create new list item
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.href = "galaxy.html"
        a.innerHTML = '<i class="fas fa-star"></i> Galaxy'
        li.appendChild(a)

        // Add to navigation
        nav.appendChild(li)
      }
    })
  } catch (error) {
    console.error("Error updating navigation:", error)
  }
}

// Call update navigation
updateNavigation()
