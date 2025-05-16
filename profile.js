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
const themesGridElement = document.getElementById("themes-grid")
const xpBoostersElement = document.getElementById("xp-boosters")
const soundPacksElement = document.getElementById("sound-packs")
const activateBoosterBtn = document.getElementById("activate-booster")
const boosterStatusElement = document.getElementById("booster-status")
const soundPlayerElement = document.getElementById("sound-player")
const soundControlsElement = document.getElementById("sound-controls")
const streakCountElement = document.getElementById("streak-count")
const streakCalendarElement = document.getElementById("streak-calendar")
const streakFreezeCountElement = document.getElementById("streak-freeze-count")
const buyStreakFreezeBtn = document.getElementById("buy-streak-freeze")
const streakFreezeModal = document.getElementById("streak-freeze-modal")
const streakFreezeModalCloseBtn = document.querySelector(".streak-freeze-modal-close")
const streakFreezeCancelBtn = document.querySelector(".streak-freeze-modal .cancel-btn")
const streakFreezePurchaseBtn = document.querySelector(".streak-freeze-modal .purchase-btn")
const totalStudyTimeElement = document.getElementById("total-study-time")
const totalSessionsElement = document.getElementById("total-sessions")
const subjectsStudiedElement = document.getElementById("subjects-studied")
const levelBadgeElement = document.getElementById("level-badge")
const levelNameElement = document.getElementById("level-name")
const levelProgressCircleElement = document.getElementById("level-progress-circle")
const levelProgressTextElement = document.getElementById("level-progress-text")
const levelPerksListElement = document.getElementById("level-perks-list")

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
  unlockedThemes: ["default"],
  selectedTheme: "default",
  unlockedSoundPacks: ["white-noise"],
  selectedSoundPack: "white-noise",
  xpBoosters: {
    small: 0, // 1.5x multiplier
    medium: 0, // 2x multiplier
    large: 0, // 3x multiplier
  },
  activeBooster: null,
  boosterEndTime: null,
  badgeText: "★",
  badgeColor: "#4CAF50",
  // New streak freeze properties
  streakFreezes: 0,
  maxStreakFreezes: 3,
  streakFreezeHistory: [], // Array to track when streak freezes were used
  streakFreezePrice: 100, // XP cost for a streak freeze
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
  // New avatars
  {
    id: "detective",
    name: "Detective",
    icon: "fa-magnifying-glass",
    levelRequired: 17,
  },
  {
    id: "chef",
    name: "Chef",
    icon: "fa-utensils",
    levelRequired: 19,
  },
  {
    id: "musician",
    name: "Musician",
    icon: "fa-music",
    levelRequired: 21,
  },
  {
    id: "athlete",
    name: "Athlete",
    icon: "fa-person-running",
    levelRequired: 23,
  },
  {
    id: "doctor",
    name: "Doctor",
    icon: "fa-stethoscope",
    levelRequired: 25,
  },
  {
    id: "engineer",
    name: "Engineer",
    icon: "fa-screwdriver-wrench",
    levelRequired: 27,
  },
  {
    id: "architect",
    name: "Architect",
    icon: "fa-compass-drafting",
    levelRequired: 29,
  },
  {
    id: "philosopher",
    name: "Philosopher",
    icon: "fa-brain",
    levelRequired: 31,
  },
  {
    id: "explorer",
    name: "Explorer",
    icon: "fa-earth-americas",
    levelRequired: 33,
  },
  {
    id: "historian",
    name: "Historian",
    icon: "fa-book-open",
    levelRequired: 35,
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
  // New frames
  {
    id: "cosmic",
    name: "Cosmic",
    class: "cosmic",
    levelRequired: 25,
  },
  {
    id: "ethereal",
    name: "Ethereal",
    class: "ethereal",
    levelRequired: 30,
  },
  {
    id: "mythic",
    name: "Mythic",
    class: "mythic",
    levelRequired: 35,
  },
  {
    id: "divine",
    name: "Divine",
    class: "divine",
    levelRequired: 40,
  },
]

// Available titles with their unlock requirements
const titles = [
  { name: "Beginner", levelRequired: 1 },
  { name: "Dedicated Learner", levelRequired: 2 },
  { name: "Knowledge Seeker", levelRequired: 4 },
  { name: "Scholar", levelRequired: 6 },
  { name: "Academic", levelRequired: 8 },
  { name: "Professor", levelRequired: 10 },
  { name: "Master Scholar", levelRequired: 12 },
  { name: "Sage", levelRequired: 14 },
  { name: "Enlightened", levelRequired: 16 },
  { name: "Genius", levelRequired: 18 },
  { name: "Legendary Scholar", levelRequired: 20 },
  { name: "Intellectual Pioneer", levelRequired: 22 },
  { name: "Wisdom Keeper", levelRequired: 24 },
  { name: "Knowledge Architect", levelRequired: 26 },
  { name: "Thought Leader", levelRequired: 28 },
  { name: "Scholarly Virtuoso", levelRequired: 30 },
  { name: "Erudite Master", levelRequired: 32 },
  { name: "Cerebral Luminary", levelRequired: 34 },
  { name: "Scholarly Paragon", levelRequired: 36 },
  { name: "Intellectual Sovereign", levelRequired: 38 },
  { name: "Grand Scholar", levelRequired: 40 },
  { name: "Scholarly Exemplar", levelRequired: 42 },
  { name: "Intellectual Luminary", levelRequired: 44 },
  { name: "Scholarly Eminence", levelRequired: 46 },
  { name: "Intellectual Paragon", levelRequired: 48 },
  { name: "Transcendent Scholar", levelRequired: 50 },
  { name: "Scholarly Virtuoso", levelRequired: 52 },
  { name: "Intellectual Sovereign", levelRequired: 54 },
  { name: "Scholarly Illuminator", levelRequired: 56 },
  { name: "Transcendent Thinker", levelRequired: 58 },
]

// Available themes with their unlock requirements
const themes = [
  {
    id: "default",
    name: "Default",
    description: "The standard theme",
    levelRequired: 1,
    cssClass: "theme-default",
  },
  {
    id: "sunset-mode",
    name: "Sunset Mode",
    description: "Warm, orange-hued theme inspired by sunset",
    levelRequired: 10,
    cssClass: "theme-sunset",
  },
  {
    id: "midnight-focus",
    name: "Midnight Focus",
    description: "Dark blue theme for night-time studying",
    levelRequired: 15,
    cssClass: "theme-midnight",
  },
  {
    id: "neon-hacker",
    name: "Neon Hacker",
    description: "Vibrant neon colors on dark background",
    levelRequired: 20,
    cssClass: "theme-neon",
  },
  {
    id: "nature-calm",
    name: "Nature Calm",
    description: "Soothing green theme inspired by nature",
    levelRequired: 25,
    cssClass: "theme-nature",
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
    icon: "fa-solid fa-wand-magic-sparkles",
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

    // Initialize new properties if they don't exist (for backward compatibility)
    if (!profileData.unlockedThemes) {
      profileData.unlockedThemes = ["default"]
      profileData.selectedTheme = "default"
    }

    // Initialize streak freeze properties if they don't exist
    if (profileData.streakFreezes === undefined) {
      profileData.streakFreezes = 0
    }

    if (profileData.maxStreakFreezes === undefined) {
      profileData.maxStreakFreezes = 3
    }

    if (!profileData.streakFreezeHistory) {
      profileData.streakFreezeHistory = []
    }

    if (profileData.streakFreezePrice === undefined) {
      profileData.streakFreezePrice = 100
    }
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
  updateThemeOptions(studyData)
  updateStreakModule(studyData)
  updateStatsModule(studyData)
  updateLevelModule(studyData)

  // Apply selected theme
  applyTheme(profileData.selectedTheme)
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

    // Fix: use studyData instead of undefined userData
    if (isUnlocked && Array.isArray(profileData.unlockedAvatars) && !profileData.unlockedAvatars.includes(avatar.id)) {
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
    if (isUnlocked && profileData.unlockedFrames && !profileData.unlockedFrames.includes(frame.id)) {
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
    if (isUnlocked && profileData.unlockedTitles && !profileData.unlockedTitles.includes(title.name)) {
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

// Update theme options
function updateThemeOptions(studyData) {
  if (!themesGridElement) return

  themesGridElement.innerHTML = ""

  const level = studyData.level || 1

  // Check which themes should be unlocked based on level
  themes.forEach((theme) => {
    const isUnlocked = level >= theme.levelRequired
    const isSelected = profileData.selectedTheme === theme.id

    // If unlocked and not in unlockedThemes, add it
    if (isUnlocked && profileData.unlockedThemes && !profileData.unlockedThemes.includes(theme.id)) {
      profileData.unlockedThemes.push(theme.id)
      saveData()
    }

    const themeOption = document.createElement("div")
    themeOption.className = `theme-option ${isUnlocked ? "" : "locked"} ${isSelected ? "selected" : ""}`
    themeOption.dataset.id = theme.id

    themeOption.innerHTML = `
      <div class="theme-preview ${theme.cssClass}"></div>
      <div class="theme-details">
        <div class="theme-name">${theme.name}</div>
        <div class="theme-description">${theme.description}</div>
        <div class="option-level">Level ${theme.levelRequired}</div>
      </div>
      ${isUnlocked ? "" : '<div class="lock-icon"><i class="fas fa-lock"></i></div>'}
    `

    if (isUnlocked) {
      themeOption.addEventListener("click", () => selectTheme(theme.id))
    }

    themesGridElement.appendChild(themeOption)
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
        <h3>Custom Text (max 2 characters)</h3>
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

// Select theme
function selectTheme(themeId) {
  profileData.selectedTheme = themeId
  saveData()

  // Apply the theme
  applyTheme(themeId)

  // Update UI
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")
  updateThemeOptions(studyData)

  showNotification("Theme Applied", "Your theme has been updated.")
}

// Apply theme to the UI
function applyTheme(themeId) {
  // Remove all theme classes
  document.body.classList.remove(...themes.map((theme) => theme.cssClass))

  // Add the selected theme class
  const selectedTheme = themes.find((theme) => theme.id === themeId)
  if (selectedTheme) {
    document.body.classList.add(selectedTheme.cssClass)
  }
}

// Edit display name
function editDisplayName(name) {
  // Check for developer names
  const devNames = ["admin", "root", "dev", "developer", "administrator", "superuser"]
  if (devNames.includes(name.toLowerCase())) {
    // Ensure shadowAchievementData exists
    if (!window.shadowAchievementData) {
      window.shadowAchievementData = {}
    }

    window.shadowAchievementData.developerNameUsed = true

    // Easter egg message
    setTimeout(() => {
      showNotification("Developer Mode", "Nice try! But there's no special access here... or is there?")
    }, 500)

    // Check for achievement
    if (window.shadowAchievements) {
      window.shadowAchievements.checkAchievements()
    }
  }

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

// New function to update the streak module
function updateStreakModule(studyData) {
  if (!streakCountElement || !streakCalendarElement || !streakFreezeCountElement) return

  const streak = studyData.streak || 0

  // Update streak count
  streakCountElement.textContent = streak

  // Update streak calendar
  updateStreakCalendar(studyData)

  // Update streak freeze count
  updateStreakFreezeCount()
}

// Function to update the streak calendar
function updateStreakCalendar(studyData) {
  if (!streakCalendarElement) return

  streakCalendarElement.innerHTML = ""

  // Get the last 7 days
  const today = new Date()
  const days = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    days.push(date)
  }

  // Create calendar days
  days.forEach((day) => {
    const dayString = day.toLocaleDateString()
    const isToday = day.toDateString() === today.toDateString()

    // Check if there was activity on this day
    const hasActivity = studyData.dailyTotals && studyData.dailyTotals[dayString]

    // Check if a streak freeze was used on this day
    const freezeUsed =
      profileData.streakFreezeHistory &&
      profileData.streakFreezeHistory.some((freeze) => new Date(freeze.date).toLocaleDateString() === dayString)

    const dayElement = document.createElement("div")
    dayElement.className = `streak-day ${hasActivity ? "active" : ""} ${isToday ? "today" : ""} ${freezeUsed ? "freeze" : ""}`

    // Add date number to the day element
    const dateNumber = document.createElement("span")
    dateNumber.className = "streak-day-date"
    dateNumber.textContent = day.getDate()
    dayElement.appendChild(dateNumber)

    // Add tooltip with date
    const tooltip = document.createElement("div")
    tooltip.className = "tooltip"
    tooltip.textContent = day.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })

    if (freezeUsed) {
      tooltip.textContent += " (Streak Freeze Used)"
    } else if (hasActivity) {
      tooltip.textContent += " (Studied)"
    } else if (isToday) {
      tooltip.textContent += " (Today)"
    } else {
      tooltip.textContent += " (No Activity)"
    }

    dayElement.appendChild(tooltip)
    streakCalendarElement.appendChild(dayElement)
  })
}

// Function to update the stats module - Fixed to prevent duplication
function updateStatsModule(studyData) {
  if (!totalStudyTimeElement || !totalSessionsElement || !subjectsStudiedElement) return

  // Calculate total study time
  let totalTime = 0
  let totalSessions = 0
  const subjects = new Set()

  // Process daily sessions - only count each session once
  if (studyData.dailySessions) {
    Object.values(studyData.dailySessions).forEach((sessions) => {
      if (Array.isArray(sessions)) {
        totalSessions += sessions.length
        sessions.forEach((session) => {
          if (session && typeof session === "object") {
            totalTime += session.time || 0
            if (session.subject) {
              subjects.add(session.subject)
            }
          }
        })
      }
    })
  }

  // Add today's sessions - ensure we're not double-counting
  const todayString = new Date().toLocaleDateString()
  if (
    studyData.sessions &&
    Array.isArray(studyData.sessions) &&
    (!studyData.dailySessions || !studyData.dailySessions[todayString])
  ) {
    totalSessions += studyData.sessions.length
    studyData.sessions.forEach((session) => {
      if (session && typeof session === "object") {
        totalTime += session.time || 0
        if (session.subject) {
          subjects.add(session.subject)
        }
      }
    })
  }
  // Update UI with accurate values
  totalStudyTimeElement.textContent = totalTime
  totalSessionsElement.textContent = totalSessions
  subjectsStudiedElement.textContent = subjects.size
}

// Function to update the level module - Improved synchronization with dashboard
function updateLevelModule(studyData) {
  if (
    !levelBadgeElement ||
    !levelNameElement ||
    !levelProgressCircleElement ||
    !levelProgressTextElement ||
    !levelPerksListElement
  )
    return

  const level = studyData.level || 1
  const xp = studyData.xp || 0

  // Update level badge
  levelBadgeElement.textContent = level

  // Try to access the global level system
  let levelSystem

  try {
    // First try to get the level system from the window object
    levelSystem = window.levelSystem

    // If not available, create a basic level system
    if (!levelSystem) {
      levelSystem = {
        calculateLevel: (xp) => Math.floor(Math.sqrt(xp / 50)) + 1,
        progressToNextLevel: function (xp) {
          const currentLevel = this.calculateLevel(xp)
          const currentLevelXP = 50 * Math.pow(currentLevel - 1, 2)
          const nextLevelXP = 50 * Math.pow(currentLevel, 2)
          const xpForCurrentLevel = xp - currentLevelXP
          const xpRequiredForNextLevel = nextLevelXP - currentLevelXP
          return Math.min(100, Math.floor((xpForCurrentLevel / xpRequiredForNextLevel) * 100))
        },
        xpForNextLevel: function (xp) {
          const currentLevel = this.calculateLevel(xp)
          return 50 * Math.pow(currentLevel, 2)
        },
        getUnlockedPerks: function (level) {
          const perks = []
          for (const perkLevel in this.levelPerks) {
            if (Number.parseInt(perkLevel) <= level) {
              perks.push({
                level: Number.parseInt(perkLevel),
                name: this.levelPerks[perkLevel].name,
                description: this.levelPerks[perkLevel].description,
              })
            }
          }
          return perks
        },
        levelPerks: {
          1: { name: "Beginner", description: "You've started your learning journey!" },
          5: { name: "Dedicated Learner", description: "Unlock streak freezes and avatar customization" },
          10: { name: "Scholar", description: "Unlock advanced themes and sound packs" },
          15: { name: "Academic", description: "Unlock special profile effects and badges" },
          20: { name: "Professor", description: "Unlock legendary profile frames and auras" },
        },
      }
    }
  } catch (error) {
    console.error("Error accessing level system:", error)
    // Fallback to basic level system
    levelSystem = {
      calculateLevel: (xp) => Math.floor(Math.sqrt(xp / 50)) + 1,
      progressToNextLevel: (xp) => 0,
      xpForNextLevel: (xp) => 100,
      getUnlockedPerks: () => [],
      levelPerks: {},
    }
  }

  // Find the highest level perk unlocked for the level name
  const unlockedPerks = levelSystem.getUnlockedPerks ? levelSystem.getUnlockedPerks(level) : []

  // Find the highest level perk unlocked
  let highestPerk = { level: 1, name: "Beginner", description: "You've started your learning journey!" }
  for (const perk of unlockedPerks) {
    if (perk.level > highestPerk.level) {
      highestPerk = perk
    }
  }

  // Update level name
  levelNameElement.textContent = highestPerk.name

  // Update progress circle
  const progress = levelSystem.progressToNextLevel ? levelSystem.progressToNextLevel(xp) : 0
  levelProgressCircleElement.style.setProperty("--progress", `${progress}%`)

  // Calculate XP needed for next level
  const nextLevelXP = levelSystem.xpForNextLevel ? levelSystem.xpForNextLevel(xp) : null
  if (nextLevelXP !== null) {
    const xpNeeded = nextLevelXP - xp
    levelProgressTextElement.textContent = `${xp}/${nextLevelXP} XP (${xpNeeded} to Level ${level + 1})`
  } else {
    levelProgressTextElement.textContent = "Max Level Reached!"
  }

  // Update perks list
  levelPerksListElement.innerHTML = ""

  // Sort perks by level
  const sortedPerks = [...unlockedPerks].sort((a, b) => b.level - a.level)

  // Show only the 3 highest level perks to avoid clutter
  const displayPerks = sortedPerks.slice(0, 3)

  displayPerks.forEach((perk) => {
    const perkItem = document.createElement("div")
    perkItem.className = "level-perk-item"
    perkItem.innerHTML = `
      <div class="level-perk-header">
        <div class="level-perk-level">Level ${perk.level}:</div>
        <div class="level-perk-name">${perk.name}</div>
      </div>
      <div class="level-perk-description">${perk.description}</div>
    `
    levelPerksListElement.appendChild(perkItem)
  })

  // If there are more perks, add a "more" indicator
  if (unlockedPerks.length > 3) {
    const moreItem = document.createElement("div")
    moreItem.className = "level-perk-more"
    moreItem.textContent = `+ ${unlockedPerks.length - 3} more perks unlocked`
    levelPerksListElement.appendChild(moreItem)
  }
}

// Function to buy a streak freeze
function buyStreakFreeze() {
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")
  const xp = studyData.xp || 0

  // Check if user has max streak freezes
  if (profileData.streakFreezes >= profileData.maxStreakFreezes) {
    showNotification("Maximum Reached", "You already have the maximum number of streak freezes.")
    return
  }

  // Check if user has enough XP
  if (xp < profileData.streakFreezePrice) {
    showNotification("Not Enough XP", `You need ${profileData.streakFreezePrice} XP to buy a streak freeze.`)
    return
  }

  // Deduct XP
  studyData.xp -= profileData.streakFreezePrice

  // Add streak freeze
  profileData.streakFreezes++

  // Save data
  localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
  saveData()

  // Update UI
  updateStreakFreezeCount()
  updateProfileUI(studyData)

  showNotification("Streak Freeze Purchased", "You've purchased a streak freeze!")
}

// Function to use a streak freeze
function useStreakFreeze(date) {
  // Check if user has streak freezes
  if (profileData.streakFreezes <= 0) {
    return false
  }

  // Use a streak freeze
  profileData.streakFreezes--

  // Record the usage
  profileData.streakFreezeHistory.push({
    date: date.toISOString(),
    used: new Date().toISOString(),
  })

  // Save data
  saveData()

  // Update UI
  updateStreakFreezeCount()

  return true
}

// Function to check if a streak freeze should be applied automatically
function checkAndApplyStreakFreeze() {
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

  // Check if we need to apply a streak freeze
  if (!studyData.lastStudyDate) return

  const today = new Date()
  const lastStudyDate = new Date(studyData.lastStudyDate)

  // Check if the last study date was yesterday
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // If last study date was before yesterday and we have streak freezes
  if (lastStudyDate < yesterday && profileData.streakFreezes > 0) {
    // Use a streak freeze for yesterday
    const freezeDate = new Date(yesterday)
    if (useStreakFreeze(freezeDate)) {
      // Update the last study date to yesterday to maintain the streak
      studyData.lastStudyDate = yesterday.toLocaleDateString()
      localStorage.setItem("studyTrackerData", JSON.stringify(studyData))

      showNotification("Streak Freeze Applied", "A streak freeze was used to maintain your streak!")
    }
  }
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

  if (e.target === streakFreezeModal) {
    streakFreezeModal.style.display = "none"
    streakFreezeModal.classList.remove("show")
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

// Streak freeze modal event listeners
buyStreakFreezeBtn.addEventListener("click", () => {
  streakFreezeModal.style.display = "flex"
  setTimeout(() => {
    streakFreezeModal.classList.add("show")
  }, 10)
})

streakFreezeModalCloseBtn.addEventListener("click", () => {
  streakFreezeModal.classList.remove("show")
  setTimeout(() => {
    streakFreezeModal.style.display = "none"
  }, 300)
})

streakFreezeCancelBtn.addEventListener("click", () => {
  streakFreezeModal.classList.remove("show")
  setTimeout(() => {
    streakFreezeModal.style.display = "none"
  }, 300)
})

streakFreezePurchaseBtn.addEventListener("click", () => {
  buyStreakFreeze()
  streakFreezeModal.classList.remove("show")
  setTimeout(() => {
    streakFreezeModal.style.display = "none"
  }, 300)
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
  }

  // Load data
  loadData()

  // Check if we need to apply a streak freeze
  checkAndApplyStreakFreeze()
})

function updateStreakFreezeCount() {
  if (!streakFreezeCountElement) return

  streakFreezeCountElement.textContent = profileData.streakFreezes
}
