// Mobile Galaxy Enhancements
document.addEventListener("DOMContentLoaded", () => {
    // Only initialize if we're on the galaxy page
    if (!document.querySelector(".galaxy-container")) return
  
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768
    if (!isMobile) return
  
    // Elements
    const galaxyContainer = document.querySelector(".galaxy-container")
    const canvas = document.querySelector("#galaxy-canvas")
    const subjectInfo = document.querySelector(".subject-info")
  
    // Create mobile controls
    createMobileControls()
  
    // Add mobile-specific stylesheet
    const mobileStylesheet = document.createElement("link")
    mobileStylesheet.rel = "stylesheet"
    mobileStylesheet.href = "mobile-galaxy.css"
    document.head.appendChild(mobileStylesheet)
  
    // Show gesture hint on first load
    if (!localStorage.getItem("galaxyGestureHintShown")) {
      showGestureHint("Pinch to zoom • Tap to select stars")
      localStorage.setItem("galaxyGestureHintShown", "true")
    }
  
    // Touch event handling
    let lastTouchDistance = 0
    let isDragging = false
    let startX, startY
  
    galaxyContainer.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        isDragging = true
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        // Store the initial distance between two fingers for pinch zoom
        lastTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
      }
    })
  
    galaxyContainer.addEventListener("touchmove", (e) => {
      if (isDragging && e.touches.length === 1) {
        // Pan the galaxy
        const deltaX = e.touches[0].clientX - startX
        const deltaY = e.touches[0].clientY - startY
  
        // Use the existing pan function from galaxy.js
        if (typeof panGalaxy === "function") {
          panGalaxy(deltaX, deltaY)
        }
  
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        // Handle pinch zoom
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
  
        const delta = currentDistance - lastTouchDistance
        lastTouchDistance = currentDistance
  
        // Use the existing zoom function from galaxy.js
        if (typeof zoomGalaxy === "function") {
          zoomGalaxy(delta > 0 ? 0.1 : -0.1)
        }
      }
  
      e.preventDefault()
    })
  
    galaxyContainer.addEventListener("touchend", () => {
      isDragging = false
    })
  
    // Double tap to zoom in
    let lastTap = 0
    galaxyContainer.addEventListener("touchend", (e) => {
      const currentTime = new Date().getTime()
      const tapLength = currentTime - lastTap
  
      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected
        if (typeof zoomGalaxy === "function") {
          zoomGalaxy(0.2) // Zoom in
        }
        e.preventDefault()
      }
  
      lastTap = currentTime
    })
  
    // Override star selection for mobile
    document.addEventListener(
      "click",
      (e) => {
        if (e.target.classList.contains("star")) {
          e.preventDefault()
  
          // Get star data
          const starId = e.target.dataset.id
          const starData = getStarData(starId)
  
          if (starData) {
            showMobileInfoPanel(starData)
          }
        }
      },
      true,
    )
  
    // Functions
    function createMobileControls() {
      // Create toggle button
      const toggleBtn = document.createElement("div")
      toggleBtn.className = "mobile-controls-toggle"
      toggleBtn.innerHTML = "⋮"
      document.body.appendChild(toggleBtn)
  
      // Create controls panel
      const controls = document.createElement("div")
      controls.className = "mobile-controls hidden"
  
      // Create star list container
      const starList = document.createElement("div")
      starList.className = "mobile-star-list"
  
      // Create zoom controls
      const zoomControls = document.createElement("div")
      zoomControls.className = "mobile-zoom-controls"
      zoomControls.innerHTML = `
        <button class="mobile-zoom-btn zoom-out">−</button>
        <button class="mobile-zoom-btn reset-view">⟲</button>
        <button class="mobile-zoom-btn zoom-in">+</button>
      `
  
      controls.appendChild(starList)
      controls.appendChild(zoomControls)
      document.body.appendChild(controls)
  
      // Create mobile info panel
      const infoPanel = document.createElement("div")
      infoPanel.className = "mobile-info-panel"
      infoPanel.innerHTML = `
        <button class="mobile-info-close">×</button>
        <div class="mobile-info-content"></div>
      `
      document.body.appendChild(infoPanel)
  
      // Event listeners
      toggleBtn.addEventListener("click", () => {
        controls.classList.toggle("hidden")
        updateStarList()
      })
  
      document.querySelector(".mobile-info-close").addEventListener("click", () => {
        infoPanel.classList.remove("visible")
      })
  
      // Zoom controls
      document.querySelector(".zoom-in").addEventListener("click", () => {
        if (typeof zoomGalaxy === "function") zoomGalaxy(0.1)
      })
  
      document.querySelector(".zoom-out").addEventListener("click", () => {
        if (typeof zoomGalaxy === "function") zoomGalaxy(-0.1)
      })
  
      document.querySelector(".reset-view").addEventListener("click", () => {
        if (typeof resetGalaxyView === "function") resetGalaxyView()
      })
    }
  
    function updateStarList() {
      const starList = document.querySelector(".mobile-star-list")
      starList.innerHTML = ""
  
      // Get all stars from the galaxy
      const stars = getAllStars()
  
      if (stars.length === 0) {
        starList.innerHTML = '<div class="mobile-star-item">No stars yet. Start studying!</div>'
        return
      }
  
      // Sort stars by date (newest first)
      stars.sort((a, b) => new Date(b.date) - new Date(a.date))
  
      // Create list items
      stars.forEach((star) => {
        const item = document.createElement("div")
        item.className = "mobile-star-item"
        item.dataset.id = star.id
  
        const formattedDate = new Date(star.date).toLocaleDateString()
        const formattedTime = formatMinutes(star.minutes)
  
        item.innerHTML = `
          <div class="mobile-star-color" style="background-color: ${star.color || "#ffffff"}"></div>
          <div class="mobile-star-name">${star.subject}</div>
          <div class="mobile-star-time">${formattedTime}</div>
        `
  
        item.addEventListener("click", () => {
          showMobileInfoPanel(star)
          focusOnStar(star.id)
        })
  
        starList.appendChild(item)
      })
    }
  
    function showMobileInfoPanel(starData) {
      const infoPanel = document.querySelector(".mobile-info-panel")
      const content = infoPanel.querySelector(".mobile-info-content")
  
      // Format date
      const date = new Date(starData.date)
      const formattedDate = date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  
      // Format time
      const formattedTime = formatMinutes(starData.minutes)
  
      content.innerHTML = `
        <h3>${starData.subject}</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Study Time:</strong> ${formattedTime}</p>
        <p><strong>Notes:</strong> ${starData.notes || "No notes"}</p>
      `
  
      infoPanel.classList.add("visible")
    }
  
    function showGestureHint(message) {
      // Create hint element if it doesn't exist
      let hint = document.querySelector(".mobile-gesture-hint")
      if (!hint) {
        hint = document.createElement("div")
        hint.className = "mobile-gesture-hint"
        document.body.appendChild(hint)
      }
  
      hint.textContent = message
      hint.classList.add("visible")
  
      setTimeout(() => {
        hint.classList.remove("visible")
      }, 3000)
    }
  
    // Helper functions
    function formatMinutes(minutes) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
  
      if (hours > 0) {
        return `${hours}h ${mins}m`
      } else {
        return `${mins}m`
      }
    }
  
    function getAllStars() {
      // This function should get all stars from localStorage
      // Assuming the data structure from the existing app
      const userData = JSON.parse(localStorage.getItem("studyData")) || {}
      const sessions = userData.sessions || []
  
      return sessions.map((session) => ({
        id: session.id || generateId(),
        subject: session.subject,
        minutes: session.minutes,
        date: session.date,
        notes: session.notes,
        color: getSubjectColor(session.subject),
      }))
    }
  
    function getStarData(starId) {
      const stars = getAllStars()
      return stars.find((star) => star.id === starId)
    }
  
    function getSubjectColor(subject) {
      // This should match the color assignment logic in the main app
      const userData = JSON.parse(localStorage.getItem("studyData")) || {}
      const subjects = userData.subjects || {}
  
      return subjects[subject]?.color || "#ffffff"
    }
  
    function generateId() {
      return Math.random().toString(36).substr(2, 9)
    }
  
    function focusOnStar(starId) {
      // Find the star element
      const starElement = document.querySelector(`.star[data-id="${starId}"]`)
      if (!starElement) return
  
      // Get star position
      const rect = starElement.getBoundingClientRect()
      const starX = rect.left + rect.width / 2
      const starY = rect.top + rect.height / 2
  
      // Center the view on this star
      if (typeof centerGalaxyView === "function") {
        centerGalaxyView(starX, starY)
      } else {
        // Fallback if centerGalaxyView doesn't exist
        const containerRect = galaxyContainer.getBoundingClientRect()
        const centerX = containerRect.width / 2
        const centerY = containerRect.height / 2
  
        // Calculate the difference
        const deltaX = centerX - starX
        const deltaY = centerY - starY
  
        // Use the existing pan function
        if (typeof panGalaxy === "function") {
          panGalaxy(deltaX, deltaY)
        }
      }
  
      // Highlight the star
      starElement.classList.add("highlight")
      setTimeout(() => {
        starElement.classList.remove("highlight")
      }, 2000)
  
      // Hide the controls panel
      document.querySelector(".mobile-controls").classList.add("hidden")
    }
  
    // Function stubs for compatibility with the main galaxy.js
    // These will be overridden if the functions exist in galaxy.js
    if (typeof panGalaxy !== "function") {
      window.panGalaxy = (deltaX, deltaY) => {
        console.warn("panGalaxy function not found in galaxy.js")
      }
    }
  
    if (typeof zoomGalaxy !== "function") {
      window.zoomGalaxy = (delta) => {
        console.warn("zoomGalaxy function not found in galaxy.js")
      }
    }
  
    if (typeof resetGalaxyView !== "function") {
      window.resetGalaxyView = () => {
        console.warn("resetGalaxyView function not found in galaxy.js")
      }
    }
  
    if (typeof centerGalaxyView !== "function") {
      window.centerGalaxyView = (x, y) => {
        console.warn("centerGalaxyView function not found in galaxy.js")
      }
    }
  })
  