// Energy System for Study Tracker
// This module handles the energy points (EP) system that simulates mental fatigue

// Constants
const MAX_ENERGY = 100
const REGEN_RATE = 20 // EP per hour
const ENERGY_DRAIN = {
  LOW: 5, // < 25 mins
  MEDIUM: 15, // 25-49 mins
  HIGH: 25, // 50-89 mins
  EXTREME: 40, // 90-150 mins
  TOOMUCH: 99, // 300+ mins
}

// Energy system state
let energySystem = {
  currentEnergy: MAX_ENERGY,
  lastActive: new Date().toISOString(),
}

// Initialize energy system
function initEnergySystem() {
  loadEnergyData()
  regenerateEnergy()
  updateEnergyUI()
}

// Load energy data from localStorage
function loadEnergyData() {
  const savedData = localStorage.getItem("energySystemData")
  if (savedData) {
    energySystem = JSON.parse(savedData)
  } else {
    // Initialize with default values
    energySystem = {
      currentEnergy: MAX_ENERGY,
      lastActive: new Date().toISOString(),
    }
    saveEnergyData()
  }
}

// Save energy data to localStorage
function saveEnergyData() {
  localStorage.setItem("energySystemData", JSON.stringify(energySystem))
}

// Calculate energy drain based on study time
function calculateEnergyDrain(studyTimeMinutes) {
  if (studyTimeMinutes < 25) {
    return ENERGY_DRAIN.LOW
  } else if (studyTimeMinutes < 50) {
    return ENERGY_DRAIN.MEDIUM
  } else if (studyTimeMinutes < 90) {
    return ENERGY_DRAIN.HIGH
  } else if (studyTimeMinutes < 180) {
    return ENERGY_DRAIN.EXTREME
  } else if (studyTimeMinutes < 300) {
    return ENERGY_DRAIN.TOOMUCH
  }
}

// Drain energy when a study session is logged
function drainEnergy(studyTimeMinutes) {
  const drainAmount = calculateEnergyDrain(studyTimeMinutes)
  energySystem.currentEnergy = Math.max(0, energySystem.currentEnergy - drainAmount)
  energySystem.lastActive = new Date().toISOString()
  saveEnergyData()
  updateEnergyUI()

  // Show warning if energy is low
  if (energySystem.currentEnergy < 20) {
    showLowEnergyWarning()
  }

  return energySystem.currentEnergy
}

// Regenerate energy based on time passed since last activity
function regenerateEnergy() {
  const now = new Date()
  const lastActive = new Date(energySystem.lastActive)
  const hoursPassed = (now - lastActive) / (1000 * 60 * 60)

  if (hoursPassed > 0) {
    const energyToRegen = Math.floor(hoursPassed * REGEN_RATE)
    energySystem.currentEnergy = Math.min(MAX_ENERGY, energySystem.currentEnergy + energyToRegen)
    energySystem.lastActive = now.toISOString()
    saveEnergyData()
  }
}

// Update the energy UI
function updateEnergyUI() {
  const energyBar = document.getElementById("energy-bar-fill")
  const energyText = document.getElementById("energy-text")

  if (energyBar && energyText) {
    energyBar.style.width = `${energySystem.currentEnergy}%`
    energyText.textContent = `${Math.round(energySystem.currentEnergy)} EP`

    if (energySystem.currentEnergy > 60) {
      energyBar.className = "energy-bar-fill high"
    } else if (energySystem.currentEnergy > 30) {
      energyBar.className = "energy-bar-fill medium"
    } else {
      energyBar.className = "energy-bar-fill low"
    }
  }
}

// Show warning when energy is low
function showLowEnergyWarning() {
  // Check if warning is already showing
  if (!document.querySelector(".energy-warning")) {
    const warning = document.createElement("div")
    warning.className = "energy-warning notification"
    warning.innerHTML = `
      <h3>Low Energy!</h3>
      <p>You're running low on energy. Try taking a break!</p>
      <p>Energy regenerates at 20 EP per hour.</p>
    `
    document.body.appendChild(warning)

    // Add show class for animation
    setTimeout(() => {
      warning.classList.add("show")
    }, 10)

    // Remove after 5 seconds
    setTimeout(() => {
      warning.classList.remove("show")
      setTimeout(() => {
        if (warning.parentNode) {
          warning.parentNode.removeChild(warning)
        }
      }, 300)
    }, 5000)
  }
}

// Check if user has enough energy for XP gain
function hasEnoughEnergy() {
  return energySystem.currentEnergy > 0
}

// Reset energy for a new day
function resetEnergyForNewDay() {
  energySystem.currentEnergy = MAX_ENERGY
  energySystem.lastActive = new Date().toISOString()
  saveEnergyData()
  updateEnergyUI()
}

// Export functions
export { initEnergySystem, drainEnergy, regenerateEnergy, updateEnergyUI, hasEnoughEnergy, resetEnergyForNewDay }
