// DOM Elements
const profileAvatarElement = document.getElementById("profile-avatar")
const profileFrameElement = document.getElementById("profile-frame")
const profileNameElement = document.getElementById("profile-name")
const profileTitleElement = document.getElementById("profile-title")
const profileLevelElement = document.getElementById("profile-level")
const profileXpElement = document.getElementById("profile-xp")
const profileStreakElement = document.getElementById("profile-streak")
const profileJoinedDateElement = document.getElementById("profile-joined-date")
const changeAvatarBtn = document.getElementById("change-avatar-btn")
const editNameBtn = document.getElementById("edit-name-btn")
const editNameModal = document.getElementById("edit-name-modal")
const editNameForm = document.getElementById("edit-name-form")
const displayNameInput = document.getElementById("display-name")
const closeModalBtn = document.querySelector(".close-modal")
const avatarOptionsElement = document.getElementById("avatar-options")
const frameOptionsElement = document.getElementById("frame-options")
const titleOptionsElement = document.getElementById("title-options")
const unlockablesGridElement = document.getElementById("unlockables-grid")
const themeToggle = document.querySelector(".theme-toggle")

// Profile data structure
let profileData = {
  name: "Scholar",
  joinedDate: new Date().toISOString(),
  selectedAvatar: "default",
  selectedFrame: "none",
  selectedTitle: "Beginner",
  unlockedAvatars: ["default"],
  unlockedFrames: ["none"],
  unlockedTitles: ["Beginner"],
  badgeText: "★",
  badgeColor: "#4CAF50",
}

// Available avatars with their unlock requirements
const avatars = [
  {
    id: "default",
    name: "Scholar",
    icon: "fa-user-graduate",
    levelRequired: 1,
  },
  {
    id: "scientist",
    name: "Scientist",
    icon: "fa-flask",
    levelRequired: 3,
  },
  {
    id: "astronomer",
    name: "Astronomer",
    icon: "fa-user-astronaut",
    levelRequired: 5,
  },
  {
    id: "mathematician",
    name: "Mathematician",
    icon: "fa-square-root-variable",
    levelRequired: 7,
  },
  {
    id: "artist",
    name: "Artist",
    icon: "fa-palette",
    levelRequired: 9,
  },
  {
    id: "writer",
    name: "Writer",
    icon: "fa-pen-fancy",
    levelRequired: 11,
  },
  {
    id: "programmer",
    name: "Programmer",
    icon: "fa-code",
    levelRequired: 13,
  },
  {
    id: "sage",
    name: "Sage",
    icon: "fa-hat-wizard",
    levelRequired: 15,
  },
]

// Available frames with their unlock requirements
const frames = [
  {
    id: "none",
    name: "None",
    class: "",
    levelRequired: 1,
  },
  {
    id: "bronze",
    name: "Bronze",
    class: "bronze",
    levelRequired: 3,
  },
  {
    id: "silver",
    name: "Silver",
    class: "silver",
    levelRequired: 5,
  },
  {
    id: "gold",
    name: "Gold",
    class: "gold",
    levelRequired: 7,
  },
  {
    id: "emerald",
    name: "Emerald",
    class: "emerald",
    levelRequired: 9,
  },
  {
    id: "ruby",
    name: "Ruby",
    class: "ruby",
    levelRequired: 11,
  },
  {
    id: "sapphire",
    name: "Sapphire",
    class: "sapphire",
    levelRequired: 13,
  },
  {
    id: "diamond",
    name: "Diamond",
    class: "diamond",
    levelRequired: 15,
  },
  {
    id: "legendary",
    name: "Legendary",
    class: "legendary",
    levelRequired: 20,
  },
]

// Available titles with their unlock requirements
const titles = [
  {
    id: "beginner",
    name: "Beginner",
    levelRequired: 1,
  },
  {
    id: "dedicated_learner",
    name: "Dedicated Learner",
    levelRequired: 2,
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    levelRequired: 4,
  },
  {
    id: "scholar",
    name: "Scholar",
    levelRequired: 6,
  },
  {
    id: "academic",
    name: "Academic",
    levelRequired: 8,
  },
  {
    id: "professor",
    name: "Professor",
    levelRequired: 10,
  },
  {
    id: "master_scholar",
    name: "Master Scholar",
    levelRequired: 12,
  },
  {
    id: "sage",
    name: "Sage",
    levelRequired: 14,
  },
  {
    id: "enlightened",
    name: "Enlightened",
    levelRequired: 16,
  },
  {
    id: "genius",
    name: "Genius",
    levelRequired: 18,
  },
  {
    id: "legendary_scholar",
    name: "Legendary Scholar",
    levelRequired: 20,
  },
]

// Special unlockable items
const unlockables = [
  {
    id: "animated_avatar",
    name: "Animated Avatar",
    description: "Your avatar will pulse with a gentle glow",
    icon: "fa-star",
    levelRequired: 5,
  },
  {
    id: "custom_background",
    name: "Custom Background",
    description: "Unlock the ability to set a custom profile background",
    icon: "fa-image",
    levelRequired: 8,
  },
  {
    id: "rainbow_text",
    name: "Rainbow Text",
    description: "Your name will display with a rainbow color effect",
    icon: "fa-palette",
    levelRequired: 10,
  },
  {
    id: "particle_effects",
    name: "Particle Effects",
    description: "Add subtle particle effects to your profile",
    icon: "fa-sparkles",
    levelRequired: 12,
  },
  {
    id: "custom_badge",
    name: "Custom Badge",
    description: "Create and display a custom badge on your profile",
    icon: "fa-certificate",
    levelRequired: 15,
  },
  {
    id: "animated_background",
    name: "Animated Background",
    description: "Your profile background will have subtle animations",
    icon: "fa-film",
    levelRequired: 18,
  },
  {
    id: "legendary_aura",
    name: "Legendary Aura",
    description: "A legendary aura effect surrounds your avatar",
    icon: "fa-fire",
    levelRequired: 20,
  },
]

// Load data from localStorage
function loadData() {
  // Load profile data
  const savedProfileData = localStorage.getItem("profileData")
  if (savedProfileData) {
    profileData = JSON.parse(savedProfileData)
  } else {
    // Initialize with default values and save
    saveData()
  }

  // Load study tracker data to get level, XP, and streak
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

  // Update UI
  updateProfileUI(studyData)
  updateAvatarOptions(studyData)
  updateFrameOptions(studyData)
  updateTitleOptions(studyData)
  updateUnlockables(studyData)
}

// Save profile data to localStorage
function saveData() {
  localStorage.setItem("profileData", JSON.stringify(profileData))
}

// Update the updateProfileUI function to include the streak badge
function updateProfileUI(studyData) {
  // Set name and title
  profileNameElement.textContent = profileData.name
  profileTitleElement.textContent = profileData.selectedTitle

  // Set avatar
  const selectedAvatar = avatars.find((avatar) => avatar.id === profileData.selectedAvatar)
  if (selectedAvatar) {
    profileAvatarElement.innerHTML = `<i class="fas ${selectedAvatar.icon}"></i>`
  }

  // Set frame
  const selectedFrame = frames.find((frame) => frame.id === profileData.selectedFrame)
  if (selectedFrame) {
    profileFrameElement.className = `profile-frame ${selectedFrame.class}`
  }

  // Set level, XP, and streak
  const level = studyData.level || 1
  const xp = studyData.xp || 0
  const streak = studyData.streak || 0

  profileLevelElement.textContent = level
  profileXpElement.textContent = xp
  profileStreakElement.textContent = streak

  // Update streak badge
  const streakBadge = document.getElementById("streak-badge")
  if (streakBadge) {
    streakBadge.innerHTML = `<i class="fas fa-fire"></i> ${streak}`

    // Add milestone classes
    streakBadge.className = "streak-badge"
    if (streak >= 7 && streak < 30) {
      streakBadge.classList.add("milestone-7")
    } else if (streak >= 30 && streak < 100) {
      streakBadge.classList.add("milestone-30")
    } else if (streak >= 100 && streak < 365) {
      streakBadge.classList.add("milestone-100")
    } else if (streak >= 365 && streak < 500) {
      streakBadge.classList.add("milestone-365")
    } else if (streak >= 500 && streak < 1000) {
      streakBadge.classList.add("milestone-500")
    } else if (streak >= 1000) {
      streakBadge.classList.add("milestone-1000")
    }
  }

  // Format and set joined date
  const joinedDate = new Date(profileData.joinedDate)
  const formattedDate = joinedDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
  profileJoinedDateElement.textContent = formattedDate

  // Apply special effects based on unlockables
  applyUnlockableEffects(studyData)
}

// Update avatar options
function updateAvatarOptions(studyData) {
  if (!avatarOptionsElement) return

  avatarOptionsElement.innerHTML = ""

  const level = studyData.level || 1

  // Check which avatars should be unlocked based on level
  avatars.forEach((avatar) => {
    const isUnlocked = level >= avatar.levelRequired
    const isSelected = profileData.selectedAvatar === avatar.id

    // If unlocked and not in unlockedAvatars, add it
    if (isUnlocked && !profileData.unlockedAvatars.includes(avatar.id)) {
      profileData.unlockedAvatars.push(avatar.id)
      saveData()
    }

    const avatarOption = document.createElement("div")
    avatarOption.className = `avatar-option ${isUnlocked ? "" : "locked"} ${isSelected ? "selected" : ""}`
    avatarOption.dataset.id = avatar.id

    avatarOption.innerHTML = `
      <div class="avatar-preview">
        <i class="fas ${avatar.icon}"></i>
      </div>
      <div class="option-name">${avatar.name}</div>
      <div class="option-level">Level ${avatar.levelRequired}</div>
      ${isUnlocked ? "" : '<div class="lock-icon"><i class="fas fa-lock"></i></div>'}
    `

    if (isUnlocked) {
      avatarOption.addEventListener("click", () => selectAvatar(avatar.id))
    }

    avatarOptionsElement.appendChild(avatarOption)
  })
}

// Update frame options
function updateFrameOptions(studyData) {
  if (!frameOptionsElement) return

  frameOptionsElement.innerHTML = ""

  const level = studyData.level || 1

  // Check which frames should be unlocked based on level
  frames.forEach((frame) => {
    const isUnlocked = level >= frame.levelRequired
    const isSelected = profileData.selectedFrame === frame.id

    // If unlocked and not in unlockedFrames, add it
    if (isUnlocked && !profileData.unlockedFrames.includes(frame.id)) {
      profileData.unlockedFrames.push(frame.id)
      saveData()
    }

    const frameOption = document.createElement("div")
    frameOption.className = `frame-option ${isUnlocked ? "" : "locked"} ${isSelected ? "selected" : ""}`
    frameOption.dataset.id = frame.id

    frameOption.innerHTML = `
      <div class="frame-preview">
        <div class="frame-preview-inner">
          <i class="fas fa-user-graduate"></i>
        </div>
        <div class="frame-preview-border ${frame.class}"></div>
      </div>
      <div class="option-name">${frame.name}</div>
      <div class="option-level">Level ${frame.levelRequired}</div>
      ${isUnlocked ? "" : '<div class="lock-icon"><i class="fas fa-lock"></i></div>'}
    `

    if (isUnlocked) {
      frameOption.addEventListener("click", () => selectFrame(frame.id))
    }

    frameOptionsElement.appendChild(frameOption)
  })
}

// Update title options
function updateTitleOptions(studyData) {
  if (!titleOptionsElement) return

  titleOptionsElement.innerHTML = ""

  const level = studyData.level || 1

  // Check which titles should be unlocked based on level
  titles.forEach((title) => {
    const isUnlocked = level >= title.levelRequired
    const isSelected = profileData.selectedTitle === title.name

    // If unlocked and not in unlockedTitles, add it
    if (isUnlocked && !profileData.unlockedTitles.includes(title.name)) {
      profileData.unlockedTitles.push(title.name)
      saveData()
    }

    const titleOption = document.createElement("div")
    titleOption.className = `title-option ${isUnlocked ? "" : "locked"} ${isSelected ? "selected" : ""}`
    titleOption.dataset.id = title.id

    titleOption.innerHTML = `
      <div class="option-name">${title.name}</div>
      <div class="option-level">Level ${title.levelRequired}</div>
      ${isUnlocked ? "" : '<div class="lock-icon"><i class="fas fa-lock"></i></div>'}
    `

    if (isUnlocked) {
      titleOption.addEventListener("click", () => selectTitle(title.name))
    }

    titleOptionsElement.appendChild(titleOption)
  })
}

// Update unlockables
function updateUnlockables(studyData) {
  if (!unlockablesGridElement) return

  unlockablesGridElement.innerHTML = ""

  const level = studyData.level || 1

  unlockables.forEach((item) => {
    const isUnlocked = level >= item.levelRequired

    const unlockableItem = document.createElement("div")
    unlockableItem.className = `unlockable-item ${isUnlocked ? "" : "locked"}`

    unlockableItem.innerHTML = `
      <div class="unlockable-icon">
        <i class="fas ${item.icon}"></i>
      </div>
      <div class="unlockable-name">${item.name}</div>
      <div class="unlockable-description">${item.description}</div>
      <div class="unlockable-level">Unlocks at Level ${item.levelRequired}</div>
      ${isUnlocked ? "" : '<div class="lock-icon"><i class="fas fa-lock"></i></div>'}
    `

    unlockablesGridElement.appendChild(unlockableItem)
  })
}

// Update the applyUnlockableEffects function to implement all the special effects
function applyUnlockableEffects(studyData) {
  const level = studyData.level || 1
  const profileHeader = document.querySelector(".profile-header")

  // Animated avatar effect (Level 5)
  if (level >= 5) {
    profileAvatarElement.classList.add("animated-avatar")
  } else {
    profileAvatarElement.classList.remove("animated-avatar")
  }

  // Custom background (Level 8)
  if (level >= 8) {
    profileHeader.classList.add("custom-background")
  } else {
    profileHeader.classList.remove("custom-background")
  }

  // Rainbow text effect (Level 10)
  if (level >= 10) {
    profileNameElement.classList.add("rainbow-text")
  } else {
    profileNameElement.classList.remove("rainbow-text")
  }

  // Particle effects (Level 12)
  if (level >= 12) {
    // Remove existing particle container if it exists
    const existingContainer = document.querySelector(".particle-container")
    if (existingContainer) {
      existingContainer.remove()
    }

    // Create new particle container
    const particleContainer = document.createElement("div")
    particleContainer.className = "particle-container"

    // Add particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 3}s`
      particleContainer.appendChild(particle)
    }

    profileHeader.appendChild(particleContainer)
  } else {
    // Remove particle container if level is below 12
    const particleContainer = document.querySelector(".particle-container")
    if (particleContainer) {
      particleContainer.remove()
    }
  }

  // Custom badge (Level 15)
  if (level >= 15) {
    // Check if custom badge already exists
    let customBadge = document.querySelector(".custom-badge")
    if (!customBadge) {
      customBadge = document.createElement("div")
      customBadge.className = "custom-badge"
      customBadge.textContent = profileData.badgeText || "★"
      customBadge.style.backgroundColor = profileData.badgeColor || "var(--primary-color)"

      // Add click event to edit badge
      customBadge.addEventListener("click", showBadgeEditor)

      profileAvatarElement.parentNode.appendChild(customBadge)
    }
  } else {
    // Remove custom badge if level is below 15
    const customBadge = document.querySelector(".custom-badge")
    if (customBadge) {
      customBadge.remove()
    }
  }

  // Animated background (Level 18)
  if (level >= 18) {
    profileHeader.classList.add("animated-background")
  } else {
    profileHeader.classList.remove("animated-background")
  }

  // Legendary aura (Level 20)
  if (level >= 20) {
    profileAvatarElement.classList.add("legendary-aura")
  } else {
    profileAvatarElement.classList.remove("legendary-aura")
  }
}

// Add this function to show the badge editor
function showBadgeEditor() {
  // Create modal
  const modal = document.createElement("div")
  modal.className = "badge-editor-modal"

  // Badge icons
  const badgeIcons = ["★", "♥", "♦", "♣", "♠", "✓", "✗", "!", "?", "#"]

  // Badge colors
  const badgeColors = [
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#FF9800", // Orange
    "#F44336", // Red
    "#9C27B0", // Purple
    "#3F51B5", // Indigo
    "#009688", // Teal
    "#FF5722", // Deep Orange
    "#795548", // Brown
    "#607D8B", // Blue Grey
  ]

  // Create modal content
  modal.innerHTML = `
    <div class="badge-editor-content">
      <div class="badge-editor-header">
        <h2>Customize Badge</h2>
        <button class="badge-editor-close">&times;</button>
      </div>
      <div class="badge-preview" style="background-color: ${profileData.badgeColor || badgeColors[0]}">
        <span>${profileData.badgeText || badgeIcons[0]}</span>
      </div>
      <h3>Badge Icon</h3>
      <div class="badge-options">
        ${badgeIcons
          .map(
            (icon) => `
          <div class="badge-option ${profileData.badgeText === icon ? "selected" : ""}" data-icon="${icon}">
            ${icon}
          </div>
        `,
          )
          .join("")}
      </div>
      <h3>Badge Color</h3>
      <div class="badge-color-options">
        ${badgeColors
          .map(
            (color) => `
          <div class="badge-color ${profileData.badgeColor === color ? "selected" : ""}" 
               style="background-color: ${color};" 
               data-color="${color}">
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="badge-text-input">
        <h3>Custom Text (max 1characters)</h3>
        <input type="text" maxlength="2" value="${profileData.badgeText || ""}" placeholder="★">
      </div>
      <div class="badge-actions">
        <button class="btn secondary" id="cancel-badge">Cancel</button>
        <button class="btn primary" id="save-badge">Save</button>
      </div>
    </div>
  `

  // Add to document
  document.body.appendChild(modal)

  // Add event listeners
  const closeBtn = modal.querySelector(".badge-editor-close")
  const cancelBtn = modal.querySelector("#cancel-badge")
  const saveBtn = modal.querySelector("#save-badge")
  const badgeOptions = modal.querySelectorAll(".badge-option")
  const badgeColorOptions = modal.querySelectorAll(".badge-color")
  const badgeTextInput = modal.querySelector("input")
  const badgePreview = modal.querySelector(".badge-preview")

  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal)
  })

  cancelBtn.addEventListener("click", () => {
    document.body.removeChild(modal)
  })

  saveBtn.addEventListener("click", () => {
    // Save badge settings
    profileData.badgeText = badgeTextInput.value || badgeIcons[0]
    profileData.badgeColor = badgePreview.style.backgroundColor

    // Update badge
    const customBadge = document.querySelector(".custom-badge")
    if (customBadge) {
      customBadge.textContent = profileData.badgeText
      customBadge.style.backgroundColor = profileData.badgeColor
    }

    // Save to localStorage
    saveData()

    // Close modal
    document.body.removeChild(modal)

    // Show notification
    showNotification("Badge Updated", "Your custom badge has been updated.")
  })

  // Badge icon selection
  badgeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove selected class from all options
      badgeOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to clicked option
      option.classList.add("selected")

      // Update preview
      badgePreview.querySelector("span").textContent = option.dataset.icon

      // Update input
      badgeTextInput.value = option.dataset.icon
    })
  })

  // Badge color selection
  badgeColorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove selected class from all options
      badgeColorOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to clicked option
      option.classList.add("selected")

      // Update preview
      badgePreview.style.backgroundColor = option.dataset.color
    })
  })

  // Text input
  badgeTextInput.addEventListener("input", () => {
    badgePreview.querySelector("span").textContent = badgeTextInput.value || badgeIcons[0]
  })
}

// Select avatar
function selectAvatar(avatarId) {
  profileData.selectedAvatar = avatarId
  saveData()

  // Update UI
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")
  updateProfileUI(studyData)
  updateAvatarOptions(studyData)
}

// Select frame
function selectFrame(frameId) {
  profileData.selectedFrame = frameId
  saveData()

  // Update UI
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")
  updateProfileUI(studyData)
  updateFrameOptions(studyData)
}

// Select title
function selectTitle(titleName) {
  profileData.selectedTitle = titleName
  saveData()

  // Update UI
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")
  updateProfileUI(studyData)
  updateTitleOptions(studyData)
}

// Edit display name
function editDisplayName(name) {
  profileData.name = name
  saveData()

  // Update UI
  profileNameElement.textContent = name
}

// Show notification
function showNotification(title, message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"

  const notificationTitle = document.createElement("h3")
  notificationTitle.textContent = title

  const notificationMessage = document.createElement("p")
  notificationMessage.textContent = message

  notification.appendChild(notificationTitle)
  notification.appendChild(notificationMessage)

  // Add to document
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
}

// Event Listeners
editNameBtn.addEventListener("click", () => {
  displayNameInput.value = profileData.name
  editNameModal.style.display = "block"
})

closeModalBtn.addEventListener("click", () => {
  editNameModal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === editNameModal) {
    editNameModal.style.display = "none"
  }
})

editNameForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const newName = displayNameInput.value.trim()
  if (newName) {
    editDisplayName(newName)
    editNameModal.style.display = "none"
    showNotification("Name Updated", "Your display name has been updated successfully.")
  }
})

themeToggle.addEventListener("click", toggleDarkMode)

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
document.addEventListener("DOMContentLoaded", () => {
  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
  }

  // Load data
  loadData()
})

