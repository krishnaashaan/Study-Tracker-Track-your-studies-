// Handle tab switching for profile page
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".profile-tab")
    const tabContents = document.querySelectorAll(".profile-tab-content")
  
    // Add click event to each tab
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and contents
        tabs.forEach((t) => t.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked tab
        tab.classList.add("active")
  
        // Show corresponding content
        const tabId = `${tab.dataset.tab}-tab`
        document.getElementById(tabId).classList.add("active")
      })
    })
  
    // Fix for the edit name modal to prevent scrolling
    const editNameBtn = document.getElementById("edit-name-btn")
    const editNameModal = document.getElementById("edit-name-modal")
    const closeModalBtn = document.querySelector(".close-modal")
  
    if (editNameBtn && editNameModal) {
      // Position the modal in the center of the viewport
      editNameBtn.addEventListener("click", () => {
        editNameModal.style.display = "flex"
        document.body.style.overflow = "hidden" // Prevent scrolling
      })
  
      // Close modal when clicking the close button
      if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
          editNameModal.style.display = "none"
          document.body.style.overflow = "" // Re-enable scrolling
        })
      }
  
      // Close modal when clicking outside
      window.addEventListener("click", (e) => {
        if (e.target === editNameModal) {
          editNameModal.style.display = "none"
          document.body.style.overflow = "" // Re-enable scrolling
        }
      })
    }
  })
  