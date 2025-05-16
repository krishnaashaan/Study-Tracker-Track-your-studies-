// Theme Manager - Ensures consistent theme application across all pages

// Theme definitions
const themes = [
    {
      id: "default",
      name: "Default",
      cssClass: "theme-default",
    },
    {
      id: "sunset-mode",
      name: "Sunset Mode",
      cssClass: "theme-sunset",
    },
    {
      id: "midnight-focus",
      name: "Midnight Focus",
      cssClass: "theme-midnight",
    },
    {
      id: "neon-hacker",
      name: "Neon Hacker",
      cssClass: "theme-neon",
    },
    {
      id: "nature-calm",
      name: "Nature Calm",
      cssClass: "theme-nature",
    },
  ]
  
  // Apply theme on page load
  document.addEventListener("DOMContentLoaded", () => {
    applyCurrentTheme()
  })
  
  // Apply the current theme from profile data
  function applyCurrentTheme() {
    // First check for dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  
    // Then apply theme from profile
    const profileData = JSON.parse(localStorage.getItem("profileData") || "{}")
  
    if (profileData.selectedTheme) {
      // Remove any existing theme classes
      themes.forEach((theme) => {
        document.body.classList.remove(theme.cssClass)
      })
  
      // Add selected theme class
      const selectedTheme = themes.find((theme) => theme.id === profileData.selectedTheme)
      if (selectedTheme) {
        document.body.classList.add(selectedTheme.cssClass)
      }
    }
  }
  