// DOM Elements
const totalAssignmentsElement = document.getElementById("total-assignments")
const completedAssignmentsElement = document.getElementById("completed-assignments")
const dueSoonAssignmentsElement = document.getElementById("due-soon-assignments")
const overdueAssignmentsElement = document.getElementById("overdue-assignments")

const viewButtons = document.querySelectorAll(".view-btn")
const viewSections = document.querySelectorAll(".assignment-view")

const statusFilterElement = document.getElementById("status-filter")
const subjectFilterElement = document.getElementById("subject-filter")
const sortByElement = document.getElementById("sort-by")

const addAssignmentBtn = document.getElementById("add-assignment-btn")
const assignmentModal = document.getElementById("assignment-modal")
const assignmentForm = document.getElementById("assignment-form")
const modalTitle = document.getElementById("modal-title")
const assignmentIdInput = document.getElementById("assignment-id")
const assignmentTitleInput = document.getElementById("assignment-title")
const assignmentSubjectInput = document.getElementById("assignment-subject")
const assignmentDueDateInput = document.getElementById("assignment-due-date")
const assignmentPriorityInput = document.getElementById("assignment-priority")
const assignmentStatusInput = document.getElementById("assignment-status")
const assignmentDescriptionInput = document.getElementById("assignment-description")
const checklistContainer = document.getElementById("checklist-container")
const addChecklistItemBtn = document.getElementById("add-checklist-item")
const reminderDayBefore = document.getElementById("reminder-day-before")
const reminderHourBefore = document.getElementById("reminder-hour-before")
const reminderCustom = document.getElementById("reminder-custom")
const customReminderContainer = document.getElementById("custom-reminder-container")
const customReminderTimeInput = document.getElementById("custom-reminder-time")
const assignmentTagsInput = document.getElementById("assignment-tags")
const assignmentColorInput = document.getElementById("assignment-color")
const attachmentsContainer = document.getElementById("attachments-container")
const addFileAttachmentBtn = document.getElementById("add-file-attachment")
const addLinkAttachmentBtn = document.getElementById("add-link-attachment")
const cancelAssignmentBtn = document.getElementById("cancel-assignment")

const detailsModal = document.getElementById("details-modal")
const detailsTitle = document.getElementById("details-title")
const detailsStatus = document.getElementById("details-status")
const detailsDueDate = document.getElementById("details-due-date")
const detailsSubject = document.getElementById("details-subject")
const detailsPriority = document.getElementById("details-priority")
const detailsDescription = document.getElementById("details-description")
const detailsChecklist = document.getElementById("details-checklist")
const detailsStudyTime = document.getElementById("details-study-time")
const detailsStudySessions = document.getElementById("details-study-sessions")
const detailsAttachments = document.getElementById("details-attachments")
const detailsTags = document.getElementById("details-tags")
const editAssignmentBtn = document.getElementById("edit-assignment")
const deleteAssignmentBtn = document.getElementById("delete-assignment")

const linkSessionModal = document.getElementById("link-session-modal")
const linkSessionForm = document.getElementById("link-session-form")
const sessionAssignmentSelect = document.getElementById("session-assignment")
const sessionSubjectInput = document.getElementById("session-subject")
const sessionTimeInput = document.getElementById("session-time")
const sessionNotesInput = document.getElementById("session-notes")
const cancelLinkSessionBtn = document.getElementById("cancel-link-session")

const fileAttachmentModal = document.getElementById("file-attachment-modal")
const fileAttachmentForm = document.getElementById("file-attachment-form")
const attachmentNameInput = document.getElementById("attachment-name")
const attachmentFileInput = document.getElementById("attachment-file")
const cancelFileAttachmentBtn = document.getElementById("cancel-file-attachment")

const linkAttachmentModal = document.getElementById("link-attachment-modal")
const linkAttachmentForm = document.getElementById("link-name")
const linkNameInput = document.getElementById("link-name")
const linkUrlInput = document.getElementById("link-url")
const cancelLinkAttachmentBtn = document.getElementById("cancel-link-attachment")

const assignmentsListElement = document.getElementById("assignments-list")
const calendarMonthElement = document.getElementById("calendar-month")
const calendarGridElement = document.getElementById("calendar-grid")
const prevMonthBtn = document.getElementById("prev-month")
const nextMonthBtn = document.getElementById("next-month")
const timelineRangeElement = document.getElementById("timeline-range")
const timelineHeaderElement = document.getElementById("timeline-header")
const timelineGridElement = document.getElementById("timeline-grid")
const prevWeekBtn = document.getElementById("prev-week")
const nextWeekBtn = document.getElementById("next-week")
const themeToggle = document.querySelector(".theme-toggle")

// Initialize data structure
let assignmentData = {
  assignments: [],
  studySessions: [],
  attachments: [],
  lastId: 0,
}

// Current view state
let currentView = "list"
const currentCalendarDate = new Date()
const currentTimelineDate = new Date()
let currentAssignmentId = null
let temporaryAttachments = []

// Initialize Flatpickr for date inputs
let dueDatePicker
let customReminderPicker

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem("assignmentTrackerData")
  if (savedData) {
    assignmentData = JSON.parse(savedData)
  }

  // Initialize lastId if not present
  if (!assignmentData.lastId) {
    assignmentData.lastId = 0
  }

  // Initialize arrays if not present
  if (!assignmentData.assignments) {
    assignmentData.assignments = []
  }

  if (!assignmentData.studySessions) {
    assignmentData.studySessions = []
  }

  if (!assignmentData.attachments) {
    assignmentData.attachments = []
  }

  // Update UI
  updateUI()
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("assignmentTrackerData", JSON.stringify(assignmentData))
}

// Update UI
function updateUI() {
  updateStats()
  updateSubjectFilter()
  updateAssignmentsList()
  updateCalendarView()
  updateTimelineView()
  updateSessionAssignmentSelect()
}

// Update statistics
function updateStats() {
  const now = new Date()
  const dueSoonThreshold = new Date()
  dueSoonThreshold.setDate(dueSoonThreshold.getDate() + 3) // 3 days from now

  const totalCount = assignmentData.assignments.length
  let completedCount = 0
  let dueSoonCount = 0
  let overdueCount = 0

  assignmentData.assignments.forEach((assignment) => {
    const dueDate = new Date(assignment.dueDate)

    if (assignment.status === "completed") {
      completedCount++
    } else if (dueDate < now && assignment.status !== "completed") {
      overdueCount++

      // Auto-update status to overdue
      if (assignment.status !== "overdue") {
        assignment.status = "overdue"
      }
    } else if (dueDate <= dueSoonThreshold && assignment.status !== "completed") {
      dueSoonCount++
    }
  })

  totalAssignmentsElement.textContent = totalCount
  completedAssignmentsElement.textContent = completedCount
  dueSoonAssignmentsElement.textContent = dueSoonCount
  overdueAssignmentsElement.textContent = overdueCount
}

// Update subject filter
function updateSubjectFilter() {
  // Clear existing options except "All Subjects"
  while (subjectFilterElement.options.length > 1) {
    subjectFilterElement.remove(1)
  }

  // Get unique subjects
  const subjects = new Set()
  assignmentData.assignments.forEach((assignment) => {
    subjects.add(assignment.subject)
  })

  // Add subject options
  subjects.forEach((subject) => {
    const option = document.createElement("option")
    option.value = subject
    option.textContent = subject
    subjectFilterElement.appendChild(option)
  })
}

// Update assignments list
function updateAssignmentsList() {
  assignmentsListElement.innerHTML = ""

  // Get filtered and sorted assignments
  const filteredAssignments = getFilteredAssignments()

  if (filteredAssignments.length === 0) {
    const emptyMessage = document.createElement("p")
    emptyMessage.className = "empty-message"
    emptyMessage.textContent = "No assignments found. Add your first assignment to get started!"
    assignmentsListElement.appendChild(emptyMessage)
    return
  }

  // Create assignment cards
  filteredAssignments.forEach((assignment) => {
    const assignmentCard = createAssignmentCard(assignment)
    assignmentsListElement.appendChild(assignmentCard)
  })
}

// Get filtered and sorted assignments
function getFilteredAssignments() {
  const statusFilter = statusFilterElement.value
  const subjectFilter = subjectFilterElement.value
  const sortBy = sortByElement.value

  // Filter assignments
  const filteredAssignments = assignmentData.assignments.filter((assignment) => {
    // Status filter
    if (statusFilter !== "all" && assignment.status !== statusFilter) {
      return false
    }

    // Subject filter
    if (subjectFilter !== "all" && assignment.subject !== subjectFilter) {
      return false
    }

    return true
  })

  // Sort assignments
  filteredAssignments.sort((a, b) => {
    switch (sortBy) {
      case "due-date":
        return new Date(a.dueDate) - new Date(b.dueDate)
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case "subject":
        return a.subject.localeCompare(b.subject)
      case "status":
        const statusOrder = { overdue: 0, "to-do": 1, "in-progress": 2, completed: 3 }
        return statusOrder[a.status] - statusOrder[b.status]
      default:
        return 0
    }
  })

  return filteredAssignments
}

// Create assignment card
function createAssignmentCard(assignment) {
  const card = document.createElement("div")
  card.className = "assignment-card"
  card.style.borderLeftColor = assignment.color || "#4caf50"

  // Calculate progress
  const progress = calculateProgress(assignment)

  // Format due date
  const dueDate = new Date(assignment.dueDate)
  const formattedDueDate = formatDate(dueDate)
  const isOverdue = dueDate < new Date() && assignment.status !== "completed"

  card.innerHTML = `
    <div class="assignment-header">
      <h3 class="assignment-title">${assignment.title}</h3>
      <div class="assignment-status status-${assignment.status}">${formatStatus(assignment.status)}</div>
    </div>
    <div class="assignment-info">
      <div class="assignment-subject">${assignment.subject}</div>
      <div class="assignment-due-date ${isOverdue ? "overdue" : ""}">Due: ${formattedDueDate}</div>
    </div>
    <div class="assignment-progress">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="progress-text">${progress}% complete</div>
    </div>
    ${
      assignment.tags && assignment.tags.length > 0
        ? `
      <div class="assignment-tags">
        ${assignment.tags.map((tag) => `<div class="assignment-tag">${tag}</div>`).join("")}
      </div>
    `
        : ""
    }
    <div class="assignment-actions">
      <button class="action-btn view-btn" data-id="${assignment.id}" title="View Details">
        <i class="fas fa-eye"></i>
      </button>
      <button class="action-btn edit-btn" data-id="${assignment.id}" title="Edit">
        <i class="fas fa-edit"></i>
      </button>
      <button class="action-btn link-session-btn" data-id="${assignment.id}" title="Link Study Session">
        <i class="fas fa-link"></i>
      </button>
      <button class="action-btn delete-btn" data-id="${assignment.id}" title="Delete">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `

  // Add event listeners
  const viewBtn = card.querySelector(".view-btn")
  const editBtn = card.querySelector(".edit-btn")
  const linkSessionBtn = card.querySelector(".link-session-btn")
  const deleteBtn = card.querySelector(".delete-btn")

  viewBtn.addEventListener("click", () => showAssignmentDetails(assignment.id))
  editBtn.addEventListener("click", () => editAssignment(assignment.id))
  linkSessionBtn.addEventListener("click", () => showLinkSessionModal(assignment.id))
  deleteBtn.addEventListener("click", () => deleteAssignment(assignment.id))

  return card
}

// Calculate assignment progress
function calculateProgress(assignment) {
  if (assignment.status === "completed") {
    return 100
  }

  if (!assignment.checklist || assignment.checklist.length === 0) {
    // If no checklist, use status as progress indicator
    switch (assignment.status) {
      case "to-do":
        return 0
      case "in-progress":
        return 50
      case "overdue":
        return 25
      default:
        return 0
    }
  }

  // Calculate progress based on checklist
  const totalItems = assignment.checklist.length
  const completedItems = assignment.checklist.filter((item) => item.completed).length
  return Math.round((completedItems / totalItems) * 100)
}

// Format status for display
function formatStatus(status) {
  switch (status) {
    case "to-do":
      return "To Do"
    case "in-progress":
      return "In Progress"
    case "completed":
      return "Completed"
    case "overdue":
      return "Overdue"
    default:
      return status
  }
}

// Format date for display
function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return date.toLocaleDateString(undefined, options)
}

// Update calendar view
function updateCalendarView() {
  // Set the month and year in the header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  calendarMonthElement.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`

  // Clear the grid
  calendarGridElement.innerHTML = ""

  // Get the first day of the month
  const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1)
  const startingDay = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Get the last day of the month
  const lastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0)
  const totalDays = lastDay.getDate()

  // Get the last day of the previous month
  const prevMonthLastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 0).getDate()

  // Create calendar grid
  let dayCount = 1
  let nextMonthDay = 1

  // Calculate total rows needed (6 to ensure we have enough space for all months)
  const totalCells = 42 // 6 rows * 7 days

  for (let i = 0; i < totalCells; i++) {
    const dayElement = document.createElement("div")
    dayElement.className = "calendar-day"

    // Previous month days
    if (i < startingDay) {
      const prevMonthDate = prevMonthLastDay - (startingDay - i - 1)
      dayElement.innerHTML = `<div class="calendar-day-number">${prevMonthDate}</div>`
      dayElement.classList.add("other-month")

      // Get the date for this cell
      const cellDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, prevMonthDate)
      populateCalendarDay(dayElement, cellDate)
    }
    // Current month days
    else if (i < startingDay + totalDays) {
      const isToday = isCurrentDay(dayCount)
      if (isToday) {
        dayElement.classList.add("current-day")
      }

      dayElement.innerHTML = `<div class="calendar-day-number">${dayCount}</div>`

      // Get the date for this cell
      const cellDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayCount)
      populateCalendarDay(dayElement, cellDate)

      dayCount++
    }
    // Next month days
    else {
      dayElement.innerHTML = `<div class="calendar-day-number">${nextMonthDay}</div>`
      dayElement.classList.add("other-month")

      // Get the date for this cell
      const cellDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, nextMonthDay)
      populateCalendarDay(dayElement, cellDate)

      nextMonthDay++
    }

    calendarGridElement.appendChild(dayElement)
  }
}

// Helper function to check if a day is the current day
function isCurrentDay(day) {
  const today = new Date()
  return (
    day === today.getDate() &&
    currentCalendarDate.getMonth() === today.getMonth() &&
    currentCalendarDate.getFullYear() === today.getFullYear()
  )
}

// Populate calendar day with assignments
function populateCalendarDay(dayElement, date) {
  const assignmentsContainer = document.createElement("div")
  assignmentsContainer.className = "calendar-assignments"

  // Find assignments due on this date
  const dateString = date.toDateString()
  const dayAssignments = assignmentData.assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    return dueDate.toDateString() === dateString
  })

  // Add assignments to the day
  dayAssignments.forEach((assignment) => {
    const assignmentElement = document.createElement("div")
    assignmentElement.className = `calendar-assignment status-${assignment.status}`
    assignmentElement.style.backgroundColor = assignment.color || "#4caf50"
    assignmentElement.style.color = getContrastColor(assignment.color || "#4caf50")
    assignmentElement.textContent = assignment.title
    assignmentElement.dataset.id = assignment.id
    assignmentElement.addEventListener("click", () => showAssignmentDetails(assignment.id))
    assignmentsContainer.appendChild(assignmentElement)
  })

  dayElement.appendChild(assignmentsContainer)
}

// Get contrasting text color (black or white) based on background color
function getContrastColor(hexColor) {
  // Default to white if no color provided
  if (!hexColor) return "#ffffff"

  // Convert hex to RGB
  let r = 0,
    g = 0,
    b = 0

  // 3 digits
  if (hexColor.length === 4) {
    r = Number.parseInt(hexColor[1] + hexColor[1], 16)
    g = Number.parseInt(hexColor[2] + hexColor[2], 16)
    b = Number.parseInt(hexColor[3] + hexColor[3], 16)
  }
  // 6 digits
  else if (hexColor.length === 7) {
    r = Number.parseInt(hexColor.substring(1, 3), 16)
    g = Number.parseInt(hexColor.substring(3, 5), 16)
    b = Number.parseInt(hexColor.substring(5, 7), 16)
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? "#000000" : "#ffffff"
}

// Update timeline view
function updateTimelineView() {
  // Set the date range in the header
  const startDate = new Date(currentTimelineDate)
  const endDate = new Date(currentTimelineDate)
  endDate.setDate(endDate.getDate() + 13) // 2 weeks

  timelineRangeElement.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`

  // Clear the header and grid
  timelineHeaderElement.innerHTML = ""
  timelineGridElement.innerHTML = ""

  // Create timeline header (dates)
  for (let i = 0; i < 14; i++) {
    const date = new Date(currentTimelineDate)
    date.setDate(date.getDate() + i)

    const dateElement = document.createElement("div")
    dateElement.className = "timeline-date"
    dateElement.textContent = formatDate(date)

    // Highlight today
    if (date.toDateString() === new Date().toDateString()) {
      dateElement.style.fontWeight = "bold"
      dateElement.style.color = "var(--primary-color)"
    }

    timelineHeaderElement.appendChild(dateElement)
  }

  // Get assignments that fall within the timeline range
  const timelineAssignments = assignmentData.assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    return dueDate >= startDate && dueDate <= endDate
  })

  // Sort assignments by due date
  timelineAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  // Create timeline assignments
  const rowHeight = 50 // Height of each row in pixels
  const colWidth = 100 // Width of each column (day) in pixels
  let currentRow = 0

  // Track occupied rows
  const occupiedUntil = []

  timelineAssignments.forEach((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    const dayIndex = Math.floor((dueDate - startDate) / (24 * 60 * 60 * 1000))

    // Find an available row
    let row = 0
    while (occupiedUntil[row] && occupiedUntil[row] > dayIndex) {
      row++
    }

    // Mark this row as occupied until this assignment's due date
    occupiedUntil[row] = dayIndex + 1

    // Create assignment element
    const assignmentElement = document.createElement("div")
    assignmentElement.className = `timeline-assignment status-${assignment.status}`
    assignmentElement.style.backgroundColor = assignment.color || "#4caf50"
    assignmentElement.style.color = getContrastColor(assignment.color || "#4caf50")
    assignmentElement.textContent = assignment.title
    assignmentElement.dataset.id = assignment.id

    // Position the assignment
    assignmentElement.style.left = `${dayIndex * colWidth}px`
    assignmentElement.style.top = `${row * rowHeight}px`
    assignmentElement.style.width = `${colWidth}px`

    // Add event listener
    assignmentElement.addEventListener("click", () => showAssignmentDetails(assignment.id))

    timelineGridElement.appendChild(assignmentElement)

    // Update current row if needed
    if (row > currentRow) {
      currentRow = row
    }
  })

  // Set the height of the timeline grid
  timelineGridElement.style.height = `${(currentRow + 1) * rowHeight + 20}px`
}

// Update session assignment select
function updateSessionAssignmentSelect() {
  // Clear existing options
  sessionAssignmentSelect.innerHTML = ""

  // Add assignment options
  assignmentData.assignments.forEach((assignment) => {
    const option = document.createElement("option")
    option.value = assignment.id
    option.textContent = assignment.title
    sessionAssignmentSelect.appendChild(option)
  })
}

// Show assignment modal for adding a new assignment
function showAddAssignmentModal() {
  // Reset form
  assignmentForm.reset()
  assignmentIdInput.value = ""
  modalTitle.textContent = "Add Assignment"

  // Clear checklist and attachments
  checklistContainer.innerHTML = ""
  attachmentsContainer.innerHTML = ""
  temporaryAttachments = []

  // Reset custom reminder
  customReminderContainer.classList.add("hidden")

  // Show modal
  assignmentModal.style.display = "block"
}

// Show assignment modal for editing an existing assignment
function editAssignment(id) {
  const assignment = assignmentData.assignments.find((a) => a.id === id)
  if (!assignment) return

  // Set form values
  assignmentIdInput.value = assignment.id
  assignmentTitleInput.value = assignment.title
  assignmentSubjectInput.value = assignment.subject
  assignmentDueDateInput.value = assignment.dueDate
  assignmentPriorityInput.value = assignment.priority
  assignmentStatusInput.value = assignment.status
  assignmentDescriptionInput.value = assignment.description || ""
  assignmentTagsInput.value = assignment.tags ? assignment.tags.join(", ") : ""
  assignmentColorInput.value = assignment.color || "#4caf50"

  // Set checklist items
  checklistContainer.innerHTML = ""
  if (assignment.checklist && assignment.checklist.length > 0) {
    assignment.checklist.forEach((item) => {
      addChecklistItem(item.text, item.completed)
    })
  }

  // Set reminders
  reminderDayBefore.checked = assignment.reminders && assignment.reminders.includes("day-before")
  reminderHourBefore.checked = assignment.reminders && assignment.reminders.includes("hour-before")

  if (assignment.reminders && assignment.reminders.includes("custom")) {
    reminderCustom.checked = true
    customReminderContainer.classList.remove("hidden")
    customReminderTimeInput.value = assignment.customReminderTime || ""
  } else {
    reminderCustom.checked = false
    customReminderContainer.classList.add("hidden")
  }

  // Set attachments
  attachmentsContainer.innerHTML = ""
  temporaryAttachments = []

  if (assignment.attachments && assignment.attachments.length > 0) {
    assignment.attachments.forEach((attachmentId) => {
      const attachment = assignmentData.attachments.find((a) => a.id === attachmentId)
      if (attachment) {
        addAttachmentToForm(attachment)
      }
    })
  }

  // Update modal title
  modalTitle.textContent = "Edit Assignment"

  // Show modal
  assignmentModal.style.display = "block"
}

// Add checklist item to form
function addChecklistItem(text = "", completed = false) {
  const itemContainer = document.createElement("div")
  itemContainer.className = "checklist-item"

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.checked = completed

  const textInput = document.createElement("input")
  textInput.type = "text"
  textInput.value = text
  textInput.placeholder = "Checklist item"

  const removeButton = document.createElement("button")
  removeButton.type = "button"
  removeButton.className = "remove-item"
  removeButton.innerHTML = '<i class="fas fa-times"></i>'
  removeButton.addEventListener("click", () => {
    itemContainer.remove()
  })

  itemContainer.appendChild(checkbox)
  itemContainer.appendChild(textInput)
  itemContainer.appendChild(removeButton)

  checklistContainer.appendChild(itemContainer)
}

// Add attachment to form
function addAttachmentToForm(attachment) {
  const attachmentItem = document.createElement("div")
  attachmentItem.className = "attachment-item"
  attachmentItem.dataset.id = attachment.id

  const icon = attachment.type === "file" ? "fa-file" : "fa-link"

  attachmentItem.innerHTML = `
    <div class="attachment-icon"><i class="fas ${icon}"></i></div>
    <div class="attachment-name">${attachment.name}</div>
    <button type="button" class="attachment-remove"><i class="fas fa-times"></i></button>
  `

  const removeButton = attachmentItem.querySelector(".attachment-remove")
  removeButton.addEventListener("click", () => {
    attachmentItem.remove()

    // Remove from temporary attachments if it's there
    const tempIndex = temporaryAttachments.findIndex((a) => a.id === attachment.id)
    if (tempIndex !== -1) {
      temporaryAttachments.splice(tempIndex, 1)
    }
  })

  attachmentsContainer.appendChild(attachmentItem)
}

// Show file attachment modal
function showFileAttachmentModal() {
  // Reset form
  fileAttachmentForm.reset()

  // Show modal
  fileAttachmentModal.style.display = "block"
}

// Show link attachment modal
function showLinkAttachmentModal() {
  // Reset form
  linkAttachmentForm.reset()

  // Show modal
  linkAttachmentModal.style.display = "block"
}

// Show link session modal
function showLinkSessionModal(assignmentId) {
  // Reset form
  linkSessionForm.reset()

  // Set assignment
  sessionAssignmentSelect.value = assignmentId

  // Show modal
  linkSessionModal.style.display = "block"
}

// Show assignment details
function showAssignmentDetails(id) {
  const assignment = assignmentData.assignments.find((a) => a.id === id)
  if (!assignment) return

  // Set current assignment ID
  currentAssignmentId = id

  // Set details
  detailsTitle.textContent = assignment.title

  // Set status with appropriate class
  detailsStatus.textContent = formatStatus(assignment.status)
  detailsStatus.className = `details-status status-${assignment.status}`

  // Set due date
  const dueDate = new Date(assignment.dueDate)
  const formattedDueDate = formatDate(dueDate)
  const isOverdue = dueDate < new Date() && assignment.status !== "completed"
  detailsDueDate.textContent = `Due: ${formattedDueDate}`
  detailsDueDate.className = isOverdue ? "details-due-date overdue" : "details-due-date"

  // Set subject and priority
  detailsSubject.textContent = assignment.subject
  detailsPriority.textContent = `Priority: ${assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}`

  // Set description
  detailsDescription.textContent = assignment.description || "No description provided."

  // Set checklist
  detailsChecklist.innerHTML = ""
  if (assignment.checklist && assignment.checklist.length > 0) {
    assignment.checklist.forEach((item) => {
      const checklistItem = document.createElement("div")
      checklistItem.className = "details-checklist-item"

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.checked = item.completed
      checkbox.disabled = true

      const text = document.createElement("span")
      text.textContent = item.text
      if (item.completed) {
        text.style.textDecoration = "line-through"
      }

      checklistItem.appendChild(checkbox)
      checklistItem.appendChild(text)

      detailsChecklist.appendChild(checklistItem)
    })
  } else {
    detailsChecklist.innerHTML = "<p>No checklist items.</p>"
  }

  // Set study time
  const studySessions = assignmentData.studySessions.filter((session) => session.assignmentId === id)
  const totalTime = studySessions.reduce((total, session) => total + session.time, 0)

  detailsStudyTime.textContent = `Total time spent: ${totalTime} minutes`

  // Set study sessions
  detailsStudySessions.innerHTML = ""
  if (studySessions.length > 0) {
    studySessions.forEach((session) => {
      const sessionItem = document.createElement("div")
      sessionItem.className = "details-session-item"

      const sessionInfo = document.createElement("div")
      sessionInfo.className = "details-session-info"

      const subject = document.createElement("span")
      subject.textContent = session.subject

      const time = document.createElement("span")
      time.textContent = `${session.time} minutes`

      sessionInfo.appendChild(subject)
      sessionInfo.appendChild(time)

      const sessionNotes = document.createElement("div")
      sessionNotes.className = "details-session-notes"
      sessionNotes.textContent = session.notes || "No notes"

      sessionItem.appendChild(sessionInfo)
      sessionItem.appendChild(sessionNotes)

      detailsStudySessions.appendChild(sessionItem)
    })
  } else {
    detailsStudySessions.innerHTML = "<p>No study sessions linked to this assignment.</p>"
  }

  // Set attachments
  detailsAttachments.innerHTML = ""
  if (assignment.attachments && assignment.attachments.length > 0) {
    assignment.attachments.forEach((attachmentId) => {
      const attachment = assignmentData.attachments.find((a) => a.id === attachmentId)
      if (attachment) {
        const attachmentElement = document.createElement("div")
        attachmentElement.className = "details-attachment"

        const icon = attachment.type === "file" ? "fa-file" : "fa-link"

        attachmentElement.innerHTML = `
          <div class="attachment-icon"><i class="fas ${icon}"></i></div>
          <div class="attachment-name">${attachment.name}</div>
        `

        // Add click handler for links
        if (attachment.type === "link") {
          attachmentElement.addEventListener("click", () => {
            window.open(attachment.url, "_blank")
          })
        }

        detailsAttachments.appendChild(attachmentElement)
      }
    })
  } else {
    detailsAttachments.innerHTML = "<p>No attachments.</p>"
  }

  // Set tags
  detailsTags.innerHTML = ""
  if (assignment.tags && assignment.tags.length > 0) {
    assignment.tags.forEach((tag) => {
      const tagElement = document.createElement("div")
      tagElement.className = "details-tag"
      tagElement.textContent = tag
      detailsTags.appendChild(tagElement)
    })
  } else {
    detailsTags.innerHTML = "<p>No tags.</p>"
  }

  // Show modal
  detailsModal.style.display = "block"
}

// Delete assignment
function deleteAssignment(id) {
  if (!confirm("Are you sure you want to delete this assignment?")) return

  // Remove assignment
  assignmentData.assignments = assignmentData.assignments.filter((a) => a.id !== id)

  // Remove associated study sessions
  assignmentData.studySessions = assignmentData.studySessions.filter((s) => s.assignmentId !== id)

  // Save data
  saveData()

  // Update UI
  updateUI()

  // Close details modal if open
  if (currentAssignmentId === id) {
    detailsModal.style.display = "none"
  }

  // Show notification
  showNotification("Assignment Deleted", "The assignment has been deleted successfully.")
}

// Save assignment
function saveAssignment(e) {
  e.preventDefault()

  // Get form values
  const id = assignmentIdInput.value || `assignment_${Date.now()}_${assignmentData.lastId++}`
  const title = assignmentTitleInput.value
  const subject = assignmentSubjectInput.subject
  const dueDate = assignmentDueDateInput.value
  const priority = assignmentPriorityInput.value
  const status = assignmentStatusInput.value
  const description = assignmentDescriptionInput.value

  // Get checklist items
  const checklist = []
  checklistContainer.querySelectorAll(".checklist-item").forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]')
    const textInput = item.querySelector('input[type="text"]')

    checklist.push({
      text: textInput.value,
      completed: checkbox.checked,
    })
  })

  // Get reminders
  const reminders = []
  if (reminderDayBefore.checked) reminders.push("day-before")
  if (reminderHourBefore.checked) reminders.push("hour-before")

  let customReminderTime = null
  if (reminderCustom.checked) {
    reminders.push("custom")
    customReminderTime = customReminderTimeInput.value
  }

  // Get tags
  const tagsString = assignmentTagsInput.value
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : []

  // Get color
  const color = assignmentColorInput.value

  // Get attachments
  const attachments = []
  attachmentsContainer.querySelectorAll(".attachment-item").forEach((item) => {
    attachments.push(item.dataset.id)
  })

  // Create assignment object
  const assignment = {
    id,
    title,
    subject,
    dueDate,
    priority,
    status,
    description,
    checklist,
    reminders,
    customReminderTime,
    tags,
    color,
    attachments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Check if this is a new assignment or an edit
  const existingIndex = assignmentData.assignments.findIndex((a) => a.id === id)

  if (existingIndex !== -1) {
    // Update existing assignment
    assignment.createdAt = assignmentData.assignments[existingIndex].createdAt
    assignmentData.assignments[existingIndex] = assignment
  } else {
    // Add new assignment
    assignmentData.assignments.push(assignment)
  }

  // Add temporary attachments to the main attachments array
  if (temporaryAttachments.length > 0) {
    assignmentData.attachments = [...assignmentData.attachments, ...temporaryAttachments]
    temporaryAttachments = []
  }

  // Save data
  saveData()

  // Update UI
  updateUI()

  // Close modal
  assignmentModal.style.display = "none"

  // Show notification
  showNotification(
    existingIndex !== -1 ? "Assignment Updated" : "Assignment Added",
    existingIndex !== -1
      ? "The assignment has been updated successfully."
      : "The assignment has been added successfully.",
  )
}

// Save file attachment
function saveFileAttachment(e) {
  e.preventDefault()

  // Get form values
  const name = attachmentNameInput.value
  const file = attachmentFileInput.files[0]

  if (!name || !file) {
    alert("Please provide both a name and a file.")
    return
  }

  // Create a unique ID for the attachment
  const id = `attachment_${Date.now()}_${assignmentData.lastId++}`

  // Create a file reader to convert the file to a data URL
  const reader = new FileReader()

  reader.onload = (event) => {
    // Create attachment object
    const attachment = {
      id,
      name,
      type: "file",
      fileData: event.target.result,
      fileName: file.name,
      fileType: file.type,
      createdAt: new Date().toISOString(),
    }

    // Add to temporary attachments
    temporaryAttachments.push(attachment)

    // Add to form
    addAttachmentToForm(attachment)

    // Close modal
    fileAttachmentModal.style.display = "none"
  }

  reader.readAsDataURL(file)
}

// Save link attachment
function saveLinkAttachment(e) {
  e.preventDefault()

  // Get form values
  const name = linkNameInput.value
  const url = linkUrlInput.value

  if (!name || !url) {
    alert("Please provide both a name and a URL.")
    return
  }

  // Create a unique ID for the attachment
  const id = `attachment_${Date.now()}_${assignmentData.lastId++}`

  // Create attachment object
  const attachment = {
    id,
    name,
    type: "link",
    url,
    createdAt: new Date().toISOString(),
  }

  // Add to temporary attachments
  temporaryAttachments.push(attachment)

  // Add to form
  addAttachmentToForm(attachment)

  // Close modal
  linkAttachmentModal.style.display = "none"
}

// Save study session
function saveStudySession(e) {
  e.preventDefault()

  // Get form values
  const assignmentId = sessionAssignmentSelect.value
  const subject = sessionSubjectInput.value
  const time = Number.parseInt(sessionTimeInput.value)
  const notes = sessionNotesInput.value

  // Create session object
  const session = {
    id: `session_${Date.now()}_${assignmentData.lastId++}`,
    assignmentId,
    subject,
    time,
    notes,
    timestamp: new Date().toISOString(),
  }

  // Add to study sessions
  assignmentData.studySessions.push(session)

  // Save data
  saveData()

  // Update UI
  updateUI()

  // Close modal
  linkSessionModal.style.display = "none"

  // Show notification
  showNotification("Study Session Linked", "The study session has been linked to the assignment successfully.")

  // Also add to the main study tracker data
  addToStudyTracker(subject, time, notes, assignmentId)
}

// Add study session to the main study tracker
function addToStudyTracker(subject, time, notes, assignmentId) {
  try {
    // Load study tracker data
    const studyData = JSON.parse(localStorage.getItem("studyTrackerData") || "{}")

    // Add session
    if (!studyData.sessions) {
      studyData.sessions = []
    }

    // Create a tag with the assignment title
    const assignment = assignmentData.assignments.find((a) => a.id === assignmentId)
    const tag = assignment ? `Assignment: ${assignment.title}` : "Assignment"

    studyData.sessions.push({
      subject,
      time,
      timestamp: new Date().toISOString(),
      tag,
      notes,
    })

    // Add XP (1 XP per minute)
    if (studyData.xp !== undefined) {
      studyData.xp += time
    }

    // Save back to localStorage
    localStorage.setItem("studyTrackerData", JSON.stringify(studyData))
  } catch (error) {
    console.error("Error saving to study tracker:", error)
  }
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

// Add this function after the toggleDarkMode function
// Request notification permissions
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showNotification("Notifications Enabled", "You will now receive notifications about your assignment deadlines.")
        return true
      }
    })
  }

  return false
}

// Replace the existing showReminderNotification function with this enhanced version
// Show reminder notification
function showReminderNotification(assignment, reminderType) {
  // Create in-app notification element
  const notification = document.createElement("div")
  notification.className = "notification reminder-notification"

  const notificationTitle = document.createElement("h3")
  notificationTitle.textContent = `Assignment ${reminderType}`

  const notificationMessage = document.createElement("p")
  notificationMessage.textContent = `"${assignment.title}" for ${assignment.subject} is ${reminderType}.`

  notification.appendChild(notificationTitle)
  notification.appendChild(notificationMessage)

  // Add to document
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)

  // Also play a sound if available
  try {
    const audio = new Audio("sounds/notification.mp3")
    audio.play()
  } catch (error) {
    console.error("Error playing notification sound:", error)
  }

  // Send desktop notification if permission is granted
  if (Notification.permission === "granted") {
    const options = {
      body: `"${assignment.title}" for ${assignment.subject} is ${reminderType}.`,
      icon: "icon.png",
      badge: "icon.png",
      vibrate: [200, 100, 200],
      tag: `assignment-${assignment.id}`,
      requireInteraction: true,
    }

    const notification = new Notification(`Assignment ${reminderType}`, options)

    notification.onclick = function () {
      window.focus()
      showAssignmentDetails(assignment.id)
      this.close()
    }
  }
}

// Add this function to check for upcoming assignments
function checkUpcomingAssignments() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Set to beginning of day
  tomorrow.setHours(0, 0, 0, 0)

  assignmentData.assignments.forEach((assignment) => {
    if (assignment.status === "completed") return

    const dueDate = new Date(assignment.dueDate)

    // Check if due tomorrow
    if (dueDate >= tomorrow && dueDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
      // Only show if we haven't already shown this notification today
      const notificationKey = `notified_${assignment.id}_tomorrow`
      const lastNotified = localStorage.getItem(notificationKey)
      const today = now.toDateString()

      if (lastNotified !== today) {
        showReminderNotification(assignment, "due tomorrow")
        localStorage.setItem(notificationKey, today)
      }
    }

    // Check if due today
    if (dueDate >= now && dueDate < new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      const notificationKey = `notified_${assignment.id}_today`
      const lastNotified = localStorage.getItem(notificationKey)
      const today = now.toDateString()

      if (lastNotified !== today) {
        showReminderNotification(assignment, "due today")
        localStorage.setItem(notificationKey, today)
      }
    }

    // Check if overdue
    if (dueDate < now && assignment.status !== "overdue") {
      const notificationKey = `notified_${assignment.id}_overdue`
      const lastNotified = localStorage.getItem(notificationKey)
      const today = now.toDateString()

      if (lastNotified !== today) {
        showReminderNotification(assignment, "overdue")
        localStorage.setItem(notificationKey, today)

        // Update status to overdue
        assignment.status = "overdue"
        saveData()
      }
    }
  })
}

// Modify the DOMContentLoaded event listener to add the notification permission request
// Find this section in the existing code and add the requestNotificationPermission() call
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Flatpickr for date inputs
  dueDatePicker = flatpickr(assignmentDueDateInput, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
  })

  customReminderPicker = flatpickr(customReminderTimeInput, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
  })

  // View switching
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update active view
      const view = button.dataset.view
      currentView = view

      viewSections.forEach((section) => {
        if (section.id === `${view}-view`) {
          section.classList.add("active")
        } else {
          section.classList.remove("active")
        }
      })
    })
  })

  // Filters and sorting
  statusFilterElement.addEventListener("change", updateAssignmentsList)
  subjectFilterElement.addEventListener("change", updateAssignmentsList)
  sortByElement.addEventListener("change", updateAssignmentsList)

  // Add assignment button
  addAssignmentBtn.addEventListener("click", showAddAssignmentModal)

  // Assignment form
  assignmentForm.addEventListener("submit", saveAssignment)

  // Add checklist item button
  addChecklistItemBtn.addEventListener("click", () => addChecklistItem())

  // Custom reminder toggle
  reminderCustom.addEventListener("change", () => {
    if (reminderCustom.checked) {
      customReminderContainer.classList.remove("hidden")
    } else {
      customReminderContainer.classList.add("hidden")
    }
  })

  // Add attachment buttons
  addFileAttachmentBtn.addEventListener("click", showFileAttachmentModal)
  addLinkAttachmentBtn.addEventListener("click", showLinkAttachmentModal)

  // Cancel assignment button
  cancelAssignmentBtn.addEventListener("click", () => {
    assignmentModal.style.display = "none"
  })

  // File attachment form
  fileAttachmentForm.addEventListener("submit", saveFileAttachment)

  // Cancel file attachment button
  cancelFileAttachmentBtn.addEventListener("click", () => {
    fileAttachmentModal.style.display = "none"
  })

  // Link attachment form
  linkAttachmentForm.addEventListener("submit", saveLinkAttachment)

  // Cancel link attachment button
  cancelLinkAttachmentBtn.addEventListener("click", () => {
    linkAttachmentModal.style.display = "none"
  })

  // Link session form
  linkSessionForm.addEventListener("submit", saveStudySession)

  // Cancel link session button
  cancelLinkSessionBtn.addEventListener("click", () => {
    linkSessionModal.style.display = "none"
  })

  // Edit and delete assignment buttons in details modal
  editAssignmentBtn.addEventListener("click", () => {
    detailsModal.style.display = "none"
    editAssignment(currentAssignmentId)
  })

  deleteAssignmentBtn.addEventListener("click", () => {
    detailsModal.style.display = "none"
    deleteAssignment(currentAssignmentId)
  })

  // Calendar navigation
  prevMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1)
    updateCalendarView()
  })

  nextMonthBtn.addEventListener("click", () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1)
    updateCalendarView()
  })

  // Timeline navigation
  prevWeekBtn.addEventListener("click", () => {
    currentTimelineDate.setDate(currentTimelineDate.getDate() - 14)
    updateTimelineView()
  })

  nextWeekBtn.addEventListener("click", () => {
    currentTimelineDate.setDate(currentTimelineDate.getDate() + 14)
    updateTimelineView()
  })

  // Close modals when clicking on the close button
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.style.display = "none"
      })
    })
  })

  // Close modals when clicking outside the modal content
  window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })
  })

  // Add the toggleDarkMode function
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode")
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
  }

  // Add event listener for the dark mode toggle button
  themeToggle.addEventListener("click", toggleDarkMode)

  // Load dark mode preference on page load
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
  }

  // Request notification permission
  requestNotificationPermission()

  // Check URL parameters for assignment ID
  const urlParams = new URLSearchParams(window.location.search)
  const assignmentId = urlParams.get("id")
  if (assignmentId) {
    // Find the assignment and show details
    const assignment = assignmentData.assignments.find((a) => a.id === assignmentId)
    if (assignment) {
      setTimeout(() => {
        showAssignmentDetails(assignmentId)
      }, 500) // Small delay to ensure UI is ready
    }
  }

  // Load data
  loadData()

  // Check for reminders
  checkReminders()

  // Also check for upcoming assignments
  checkUpcomingAssignments()

  // Set up reminder checking interval (every minute)
  setInterval(checkReminders, 60000)

  // Check upcoming assignments every hour
  setInterval(checkUpcomingAssignments, 3600000)
})

// Check for reminders
function checkReminders() {
  const now = new Date()

  assignmentData.assignments.forEach((assignment) => {
    if (assignment.status === "completed") return

    const dueDate = new Date(assignment.dueDate)

    // Check day before reminder
    if (assignment.reminders && assignment.reminders.includes("day-before")) {
      const dayBefore = new Date(dueDate)
      dayBefore.setDate(dayBefore.getDate() - 1)

      if (isSameMinute(now, dayBefore)) {
        showReminderNotification(assignment, "due tomorrow")
      }
    }

    // Check hour before reminder
    if (assignment.reminders && assignment.reminders.includes("hour-before")) {
      const hourBefore = new Date(dueDate)
      hourBefore.setHours(hourBefore.getHours() - 1)

      if (isSameMinute(now, hourBefore)) {
        showReminderNotification(assignment, "due in 1 hour")
      }
    }

    // Check custom reminder
    if (assignment.reminders && assignment.reminders.includes("custom") && assignment.customReminderTime) {
      const customTime = new Date(assignment.customReminderTime)

      if (isSameMinute(now, customTime)) {
        showReminderNotification(assignment, "reminder")
      }
    }
  })
}

// Check if two dates are in the same minute
function isSameMinute(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate() &&
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes()
  )
}

// Handle messages from service worker
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data && event.data.type === "VIEW_ASSIGNMENT" && event.data.assignmentId) {
    showAssignmentDetails(event.data.assignmentId)
  }
})
