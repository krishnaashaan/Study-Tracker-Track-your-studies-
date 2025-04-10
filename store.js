// DOM Elements
const availableXpElement = document.getElementById("available-xp")
const itemsOwnedElement = document.getElementById("items-owned")
const streakTokensElement = document.getElementById("streak-tokens")
const badgesTabContent = document.getElementById("badges-tab")
const tokensTabContent = document.getElementById("tokens-tab")
const themesTabContent = document.getElementById("themes-tab")
const badgesInventory = document.getElementById("badges-inventory")
const themesInventory = document.getElementById("themes-inventory")
const useTokenModal = document.getElementById("use-token-modal")
const currentStreakElement = document.getElementById("current-streak")
const newStreakElement = document.getElementById("new-streak")
const useTokenBtn = document.getElementById("use-token-btn")
const cancelTokenBtn = document.getElementById("cancel-token-btn")
const closeModalBtn = document.querySelector(".close-modal")
const themeToggle = document.querySelector(".theme-toggle")
const tabButtons = document.querySelectorAll(".tab-btn")
const storeTabContents = document.querySelectorAll(".store-tab-content")
const inventoryTabContents = document.querySelectorAll(".inventory-tab-content")

// Store data
const storeItems = {
  badges: [
    {
      id: "badge_master_scholar",
      name: "Master Scholar",
      description: "For the dedicated learner",
      icon: "fa-solid fa-graduation-cap",
      price: 150,
      animation: "pulse",
    },
    {
      id: "badge_time_wizard",
      name: "Time Wizard",
      description: "Master of time management",
      icon: "fa-solid fa-clock",
      price: 200,
      animation: "rotate",
    },
    {
      id: "badge_knowledge_seeker",
      name: "Knowledge Seeker",
      description: "Always curious, always learning",
      icon: "fa-solid fa-book-open",
      price: 175,
      animation: "sparkle",
    },
    {
      id: "badge_focus_master",
      name: "Focus Master",
      description: "Exceptional concentration skills",
      icon: "fa-solid fa-bullseye",
      price: 225,
      animation: "pulse",
    },
    {
      id: "badge_night_owl",
      name: "Night Owl Pro",
      description: "Premium version of Night Owl",
      icon: "fa-solid fa-moon",
      price: 180,
      animation: "sparkle",
    },
    {
      id: "badge_early_riser",
      name: "Early Riser Pro",
      description: "Premium version of Early Bird",
      icon: "fa-solid fa-sun",
      price: 180,
      animation: "rotate",
    },
  ],
  tokens: [
    {
      id: "streak_token",
      name: "Streak Revival Token",
      description: "Restore a broken streak",
      icon: "fa-solid fa-calendar-check",
      price: 100,
    },
  ],
  themes: [
    {
      id: "theme_dark_forest",
      name: "Dark Forest Theme",
      description: "Deep greens and earthy tones",
      icon: "fa-solid fa-tree",
      price: 200,
    },
    {
      id: "theme_ocean_blue",
      name: "Ocean Blue Theme",
      description: "Calming blues and aqua tones",
      icon: "fa-solid fa-water",
      price: 200,
    },
    {
      id: "theme_sunset",
      name: "Sunset Theme",
      description: "Warm oranges and reds",
      icon: "fa-solid fa-sun",
      price: 200,
    },
    // Add new themes here
    {
      id: "theme_purple_haze",
      name: "Purple Haze",
      description: "Rich purples with soft accents",
      icon: "fa-solid fa-cloud",
      price: 250,
    },
    {
      id: "theme_mint_fresh",
      name: "Mint Fresh",
      description: "Cool mint greens with crisp whites",
      icon: "fa-solid fa-leaf",
      price: 250,
    },
    {
      id: "theme_dark_mode_pro",
      name: "Dark Mode Pro",
      description: "Sleek dark theme with vibrant accents",
      icon: "fa-solid fa-circle-half-stroke",
      price: 300,
    },
    {
      id: "theme_coral_reef",
      name: "Coral Reef",
      description: "Vibrant coral tones with teal accents",
      icon: "fa-solid fa-fish",
      price: 250,
    },
    {
      id: "theme_cherry_blossom",
      name: "Cherry Blossom",
      description: "Soft pinks and whites inspired by sakura",
      icon: "fa-solid fa-seedling",
      price: 250,
    },
    {
      id: "theme_cyber_punk",
      name: "Cyber Punk",
      description: "Neon colors on dark background",
      icon: "fa-solid fa-microchip",
      price: 300,
    },
  ],
}

// Load data from localStorage
function loadData() {
  // Load study tracker data
  const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

  // Load store data
  const storeData = JSON.parse(localStorage.getItem("storeData") || '{"inventory":[],"streakTokens":0}')

  // Initialize store data if it doesn't exist
  if (!storeData.inventory) {
    storeData.inventory = []
  }

  if (!storeData.streakTokens) {
    storeData.streakTokens = 0
  }

  return { studyData, storeData }
}

// Save store data to localStorage
function saveStoreData(storeData) {
  localStorage.setItem("storeData", JSON.stringify(storeData))
}

// Save study data to localStorage
function saveStudyData(studyData) {
  localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
}

// Update UI
function updateUI() {
  const { studyData, storeData } = loadData()

  // Update stats
  availableXpElement.textContent = `⚡${studyData.xp || 0} XP`
  itemsOwnedElement.textContent = storeData.inventory.length
  streakTokensElement.textContent = storeData.streakTokens

  // Update store items
  updateStoreItems(studyData.xp || 0, storeData.inventory)

  // Update inventory
  updateInventory(storeData.inventory)
}

// Update store items
function updateStoreItems(availableXp, inventory) {
  // Clear existing badge items
  const badgesGrid = badgesTabContent.querySelector(".store-items-grid")
  badgesGrid.innerHTML = ""

  // Add badge items
  storeItems.badges.forEach((badge) => {
    const isOwned = inventory.some((item) => item.id === badge.id)
    const canAfford = availableXp >= badge.price

    const badgeItem = document.createElement("div")
    badgeItem.className = "store-item"
    badgeItem.dataset.id = badge.id

    badgeItem.innerHTML = `
      <div class="item-icon">
        <i class="${badge.icon}"></i>
      </div>
      <div class="item-details">
        <h3>${badge.name}</h3>
        <p>${badge.description}</p>
        <div class="item-price">${badge.price} XP</div>
      </div>
      ${
        isOwned
          ? '<button class="btn secondary" disabled>Owned</button>'
          : `<button class="btn primary buy-btn ${!canAfford ? "disabled" : ""}" 
            data-id="${badge.id}" 
            data-price="${badge.price}" 
            ${!canAfford ? "disabled" : ""}>
            Buy
          </button>`
      }
    `

    badgesGrid.appendChild(badgeItem)
  })

  // Update token buy button state
  const tokenBuyBtn = tokensTabContent.querySelector(".buy-btn")
  if (tokenBuyBtn) {
    const canAfford = availableXp >= Number.parseInt(tokenBuyBtn.dataset.price)
    tokenBuyBtn.classList.toggle("disabled", !canAfford)
    tokenBuyBtn.disabled = !canAfford
  }

  // Clear existing theme items
  const themesGrid = themesTabContent.querySelector(".store-items-grid")
  themesGrid.innerHTML = ""

  // Add theme items
  storeItems.themes.forEach((theme) => {
    const isOwned = inventory.some((item) => item.id === theme.id)
    const canAfford = availableXp >= theme.price

    const themeItem = document.createElement("div")
    themeItem.className = "store-item"
    themeItem.dataset.id = theme.id

    // Create a theme preview class based on the theme ID
    const themeClass = theme.id.replace("theme_", "")

    themeItem.innerHTML = `
      <div class="item-icon theme-preview ${themeClass}">
        <i class="${theme.icon}"></i>
      </div>
      <div class="item-details">
        <h3>${theme.name}</h3>
        <p>${theme.description}</p>
        <div class="item-price">${theme.price} XP</div>
      </div>
      ${
        isOwned
          ? '<button class="btn secondary" disabled>Owned</button>'
          : `<button class="btn primary buy-btn ${!canAfford ? "disabled" : ""}" 
            data-id="${theme.id}" 
            data-price="${theme.price}" 
            ${!canAfford ? "disabled" : ""}>
            Buy
          </button>`
      }
    `

    themesGrid.appendChild(themeItem)
  })
}

// Update inventory
function updateInventory(inventory) {
  // Clear existing inventory
  badgesInventory.innerHTML = ""
  themesInventory.innerHTML = ""

  // Filter badges and themes
  const badges = inventory.filter((item) => item.id.startsWith("badge_"))
  const themes = inventory.filter((item) => item.id.startsWith("theme_"))

  // Add badges to inventory
  if (badges.length > 0) {
    badges.forEach((badge) => {
      const badgeData = storeItems.badges.find((item) => item.id === badge.id)
      if (!badgeData) return

      const badgeItem = document.createElement("div")
      badgeItem.className = `inventory-item badge-animated ${badgeData.animation}`

      badgeItem.innerHTML = `
        <div class="inventory-icon">
          <i class="${badgeData.icon}"></i>
        </div>
        <h3>${badgeData.name}</h3>
        <p>${badgeData.description}</p>
        <div class="inventory-actions">
          <button class="btn secondary equip-badge-btn" data-id="${badge.id}">
            ${badge.equipped ? "Unequip" : "Equip"}
          </button>
        </div>
      `

      badgesInventory.appendChild(badgeItem)
    })
  } else {
    badgesInventory.innerHTML =
      '<p class="empty-inventory">You don\'t own any badges yet. Purchase some from the store!</p>'
  }

  // Add themes to inventory
  if (themes.length > 0) {
    themes.forEach((theme) => {
      const themeData = storeItems.themes.find((item) => item.id === theme.id)
      if (!themeData) return

      const themeItem = document.createElement("div")
      themeItem.className = "inventory-item"

      // Create a theme preview class based on the theme ID
      const themeClass = theme.id.replace("theme_", "")

      themeItem.innerHTML = `
        <div class="inventory-icon theme-preview ${themeClass}">
          <i class="${themeData.icon}"></i>
        </div>
        <h3>${themeData.name}</h3>
        <p>${themeData.description}</p>
        <div class="inventory-actions">
          <button class="btn ${theme.equipped ? "primary" : "secondary"} apply-theme-btn" data-id="${theme.id}">
            ${theme.equipped ? "Applied" : "Apply Theme"}
          </button>
        </div>
      `

      themesInventory.appendChild(themeItem)
    })
  } else {
    themesInventory.innerHTML =
      '<p class="empty-inventory">You don\'t own any themes yet. Purchase some from the store!</p>'
  }
}

// Buy item
function buyItem(itemId, price) {
  const { studyData, storeData } = loadData()

  // Check if user has enough XP
  if ((studyData.xp || 0) < price) {
    showNotification("Not enough XP", "You don't have enough XP to purchase this item.")
    return false
  }

  // Check if item is already owned
  if (storeData.inventory.some((item) => item.id === itemId)) {
    showNotification("Already Owned", "You already own this item.")
    return false
  }

  // Find item data
  let itemData
  if (itemId.startsWith("badge_")) {
    itemData = storeItems.badges.find((item) => item.id === itemId)
  } else if (itemId === "streak_token") {
    // For streak tokens, just increment the count
    storeData.streakTokens++
    studyData.xp -= price

    saveStoreData(storeData)
    saveStudyData(studyData)

    showNotification("Purchase Successful", "You purchased a Streak Revival Token.")
    updateUI()
    return true
  } else if (itemId.startsWith("theme_")) {
    itemData = storeItems.themes.find((item) => item.id === itemId)
  }

  if (!itemData) {
    showNotification("Error", "Item not found.")
    return false
  }

  // Add item to inventory
  storeData.inventory.push({
    id: itemId,
    purchasedAt: new Date().toISOString(),
    equipped: false,
  })

  // Deduct XP
  studyData.xp -= price

  // Save data
  saveStoreData(storeData)
  saveStudyData(studyData)

  // Show notification
  showNotification("Purchase Successful", `You purchased ${itemData.name}.`)

  // Update UI
  updateUI()

  return true
}

// Use streak token
function useStreakToken() {
  const { studyData, storeData } = loadData()

  // Check if user has streak tokens
  if (storeData.streakTokens <= 0) {
    showNotification("No Tokens", "You don't have any Streak Revival Tokens.")
    return false
  }

  // Increment streak
  studyData.streak = (studyData.streak || 0) + 1

  // Decrement token count
  storeData.streakTokens--

  // Save data
  saveStoreData(storeData)
  saveStudyData(studyData)

  // Show notification
  showNotification("Streak Restored", "Your streak has been restored successfully.")

  // Update UI
  updateUI()

  return true
}

// Toggle badge equipped status
function toggleBadgeEquipped(badgeId) {
  const { storeData } = loadData()

  // Find badge in inventory
  const badge = storeData.inventory.find((item) => item.id === badgeId)
  if (!badge) return

  // Toggle equipped status
  badge.equipped = !badge.equipped

  // Save data
  saveStoreData(storeData)

  // Update UI
  updateUI()

  // Show notification
  showNotification(
    badge.equipped ? "Badge Equipped" : "Badge Unequipped",
    `Badge has been ${badge.equipped ? "equipped" : "unequipped"}.`,
  )
}

// Apply theme
function applyTheme(themeId) {
  const { storeData } = loadData()

  // Unequip all themes
  storeData.inventory.forEach((item) => {
    if (item.id.startsWith("theme_")) {
      item.equipped = false
    }
  })

  // Equip the selected theme
  const theme = storeData.inventory.find((item) => item.id === themeId)
  if (!theme) return

  theme.equipped = true

  // Save data
  saveStoreData(storeData)

  // Apply theme to UI
  applyThemeToUI(themeId)

  // Update UI
  updateUI()

  // Show notification
  showNotification("Theme Applied", "The theme has been applied successfully.")
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

// Switch tabs
function switchTab(tabType, tabName) {
  const tabButtons = document.querySelectorAll(`.${tabType}-tabs .tab-btn`)
  const tabContents = document.querySelectorAll(`.${tabType}-tab-content`)

  tabButtons.forEach((button) => {
    if (button.dataset.tab === tabName) {
      button.classList.add("active")
    } else {
      button.classList.remove("active")
    }
  })

  tabContents.forEach((content) => {
    if (content.id === `${tabName}-tab`) {
      content.classList.add("active")
    } else {
      content.classList.remove("active")
    }
  })
}

// Show use token modal
function showUseTokenModal() {
  const { studyData, storeData } = loadData()

  // Check if user has streak tokens
  if (storeData.streakTokens <= 0) {
    showNotification("No Tokens", "You don't have any Streak Revival Tokens.")
    return
  }

  // Update modal content
  currentStreakElement.textContent = studyData.streak || 0
  newStreakElement.textContent = (studyData.streak || 0) + 1

  // Show modal
  useTokenModal.style.display = "block"
}

// Close modal
function closeModal() {
  useTokenModal.style.display = "none"
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load theme if saved
  const savedThemeId = localStorage.getItem("themeId")
  if (savedThemeId) {
    const { storeData } = loadData()
    const theme = storeData.inventory.find((item) => item.id === savedThemeId)
    if (theme) {
      applyThemeToUI(savedThemeId)
    }
  }

  // Store tab switching
  document.querySelectorAll(".store-tabs .tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      switchTab("store", button.dataset.tab)
    })
  })

  // Inventory tab switching
  document.querySelectorAll(".inventory-tabs .tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      switchTab("inventory", button.dataset.tab)
    })
  })

  // Buy buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("buy-btn") && !e.target.classList.contains("disabled")) {
      const itemId = e.target.dataset.id
      const price = Number.parseInt(e.target.dataset.price)
      buyItem(itemId, price)
    }
  })

  // Equip badge buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("equip-badge-btn")) {
      const badgeId = e.target.dataset.id
      toggleBadgeEquipped(badgeId)
    }
  })

  // Apply theme buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("apply-theme-btn")) {
      const themeId = e.target.dataset.id
      applyTheme(themeId)
    }
  })

  // Use token button in stats
  streakTokensElement.parentElement.addEventListener("click", () => {
    if (Number.parseInt(streakTokensElement.textContent) > 0) {
      showUseTokenModal()
    }
  })

  // Use token button in modal
  useTokenBtn.addEventListener("click", () => {
    if (useStreakToken()) {
      closeModal()
    }
  })

  // Cancel token button
  cancelTokenBtn.addEventListener("click", closeModal)

  // Close modal button
  closeModalBtn.addEventListener("click", closeModal)

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === useTokenModal) {
      closeModal()
    }
  })

  // Theme toggle
  themeToggle.addEventListener("click", toggleDarkMode)

  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
  }

  // Initialize
  updateUI()
})
