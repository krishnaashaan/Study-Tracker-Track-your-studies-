// This script updates the navigation bar of a webpage by adding links to the profile and assignments pages if they do not already exist. It uses the DOMContentLoaded event to ensure that the DOM is fully loaded before attempting to manipulate it.
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav ul")
  
   
  
    // Add profile link if it doesn't exist
    if (nav && !document.querySelector('nav ul li a[href="profile.html"]')) {
      const profileItem = document.createElement("li")
      profileItem.innerHTML = '<a href="profile.html"><i class="fas fa-user"></i> Profile</a>'
      nav.appendChild(profileItem)
    }
  
    // Add assignments link if it doesn't exist
    if (nav && !document.querySelector('nav ul li a[href="assignments.html"]')) {
      const assignmentsItem = document.createElement("li")
      assignmentsItem.innerHTML = '<a href="assignments.html"><i class="fas fa-tasks"></i> Assignments</a>'
      nav.appendChild(assignmentsItem)
    }
    // Add galaxy link if it doesn't exist
    if (nav && !document.querySelector('nav ul li a[href="galaxy.html"]')) {
      const galaxyItem = document.createElement("li")
      galaxyItem.innerHTML = '<a href="galaxy.html"><i class="fas fa-star"></i> Galaxy</a>'
      nav.appendChild(galaxyItem)
    }
  })
  