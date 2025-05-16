// Galaxy Mobile Integration
document.addEventListener("DOMContentLoaded", () => {
    // Only run on the galaxy page
    if (!document.querySelector(".galaxy-container")) return
  
    // Load the mobile enhancements script
    const mobileScript = document.createElement("script")
    mobileScript.src = "mobile-galaxy.js"
    document.body.appendChild(mobileScript)
  
    // Add functions to the main galaxy.js scope for mobile integration
  
    // Function to center the galaxy view on a specific point
    window.centerGalaxyView = (x, y) => {
      const galaxyContainer = document.querySelector(".galaxy-container")
      const containerRect = galaxyContainer.getBoundingClientRect()
  
      const centerX = containerRect.width / 2
      const centerY = containerRect.height / 2
  
      // Calculate the difference
      const deltaX = centerX - x
      const deltaY = centerY - y
  
      // Use the existing pan function
      if (typeof panGalaxy === "function") {
        panGalaxy(deltaX, deltaY)
      }
    }
  
    // Function to make stars more visible on mobile
    function enhanceStarsForMobile() {
      if (window.innerWidth <= 768) {
        const stars = document.querySelectorAll(".star")
        stars.forEach((star) => {
          star.classList.add("selectable")
        })
      }
    }
  
    // Call this function when stars are created or updated
    const originalCreateStar = window.createStar
    if (originalCreateStar) {
      window.createStar = function (...args) {
        const result = originalCreateStar.apply(this, args)
        enhanceStarsForMobile()
        return result
      }
    }
  
    // Initial enhancement
    enhanceStarsForMobile()
  
    // Re-enhance when window is resized
    window.addEventListener("resize", enhanceStarsForMobile)
  
    // Declare panGalaxy if it's not already defined (e.g., by galaxy.js)
    if (typeof panGalaxy === "undefined") {
      window.panGalaxy = (dx, dy) => {
        console.warn("panGalaxy function is not defined. Panning will not work.")
      }
    }
  })
  