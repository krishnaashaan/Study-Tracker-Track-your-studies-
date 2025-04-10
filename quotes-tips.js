// Daily quotes and tips
const quotes = [
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "The more I read, the more I acquire, the more certain I am that I know nothing.",
    author: "Voltaire",
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The difference between try and triumph is just a little umph!",
    author: "Marvin Phillips",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
]

const studyTips = [
  {
    title: "The Pomodoro Technique",
    tip: "Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.",
  },
  {
    title: "Active Recall",
    tip: "Instead of re-reading, test yourself on the material. Try to recall information from memory to strengthen retention.",
  },
  {
    title: "Spaced Repetition",
    tip: "Review material at increasing intervals: today, tomorrow, in 3 days, in a week, etc. This optimizes long-term retention.",
  },
  {
    title: "Teach What You Learn",
    tip: "Explaining concepts to others (or even to yourself) helps solidify your understanding and identify knowledge gaps.",
  },
  {
    title: "Create Mind Maps",
    tip: "Visualize connections between ideas by creating mind maps. This helps with understanding complex relationships.",
  },
  {
    title: "Set Specific Goals",
    tip: "Instead of 'study biology,' set specific goals like 'understand photosynthesis process' or 'memorize 20 anatomy terms.'",
  },
  {
    title: "Change Study Locations",
    tip: "Occasionally changing where you study can improve retention by creating different environmental cues for memory.",
  },
  {
    title: "Use Multiple Learning Styles",
    tip: "Engage with material visually, auditorily, and kinesthetically to strengthen neural connections.",
  },
  {
    title: "Take Effective Notes",
    tip: "Don't just copy text. Summarize, use your own words, and organize information in a way that makes sense to you.",
  },
  {
    title: "Stay Hydrated and Eat Well",
    tip: "Your brain needs proper nutrition and hydration to function optimally. Avoid heavy meals before study sessions.",
  },
  {
    title: "Exercise Regularly",
    tip: "Physical activity improves cognitive function and memory. Even a short walk before studying can help.",
  },
  {
    title: "Get Enough Sleep",
    tip: "Sleep is crucial for memory consolidation. Aim for 7-9 hours per night, and avoid all-nighters.",
  },
  {
    title: "Eliminate Distractions",
    tip: "Put your phone on silent, use website blockers, and create a dedicated study environment.",
  },
  {
    title: "Use Mnemonic Devices",
    tip: "Create acronyms, rhymes, or visual associations to remember complex information.",
  },
  {
    title: "Take Regular Breaks",
    tip: "Your brain needs downtime to process information. Take short breaks every 25-30 minutes.",
  },
]

// Function to get daily content
export function getDailyContent() {
  // Use the date as a seed for consistent daily content
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)

  // Alternate between quotes and tips
  if (dayOfYear % 2 === 0) {
    const quoteIndex = dayOfYear % quotes.length
    return {
      type: "quote",
      content: quotes[quoteIndex],
    }
  } else {
    const tipIndex = dayOfYear % studyTips.length
    return {
      type: "tip",
      content: studyTips[tipIndex],
    }
  }
}

// Level system
export const levelSystem = {
  // XP required for each level (index 0 is level 1)
  xpRequirements: [
    0, // Level 1
    100, // Level 2
    250, // Level 3
    450, // Level 4
    700, // Level 5
    1000, // Level 6
    1350, // Level 7
    1750, // Level 8
    2200, // Level 9
    2700, // Level 10
    3250, // Level 11
    3850, // Level 12
    4500, // Level 13
    5200, // Level 14
    6000, // Level 15
    6900, // Level 16
    7900, // Level 17
    9000, // Level 18
    10200, // Level 19
    11500, // Level 20
    12900, // Level 21
    14400, // Level 22
    16000, // Level 23
    17700, // Level 24
    19500, // Level 25
    21400, // Level 26
    23400, // Level 27
    25500, // Level 28
    27700, // Level 29
    30000, // Level 30
    32500, // Level 31
    35200, // Level 32
    38100, // Level 33
    41200, // Level 34
    44500, // Level 35
    48000, // Level 36
    51700, // Level 37
    55600, // Level 38
    59700, // Level 39
    64000, // Level 40
    68500, // Level 41
    73200, // Level 42
    78100, // Level 43
    83200, // Level 44
    88500, // Level 45
    94000, // Level 46
    99700, // Level 47
    105600, // Level 48
    111700, // Level 49
    118000, // Level 50
  ],

  // Perks unlocked at each level
  levelPerks: {
    1: {
      level: 1,
      name: "Beginner",
      description: "You've taken your first step on an incredible journey of knowledge. Every great scholar started exactly where you are now!",
    },
    2: {
      level: 2,
      name: "Curious Mind",
      description: "Your curiosity is your greatest asset. Keep asking questions and seeking answers - that's how we grow!",
    },
    3: {
      level: 3,
      name: "Dedicated Learner",
      description: "Your dedication is starting to show. Remember, consistency beats intensity every time. Keep showing up!",
    },
    4: {
      level: 4,
      name: "Knowledge Seeker",
      description: "You're actively seeking knowledge now. The more you learn, the more you realize how much there is to discover!",
    },
    5: {
      level: 5,
      name: "Focused Student",
      description: "Your focus is becoming sharper. When you concentrate your efforts, there's no limit to what you can achieve!",
    },
    6: {
      level: 6,
      name: "Persistent Scholar",
      description: "Your persistence is paying off. Remember that every expert was once a beginner - keep pushing forward!",
    },
    7: {
      level: 7,
      name: "Diligent Researcher",
      description: "Your diligence is admirable. The difference between ordinary and extraordinary is that little 'extra'!",
    },
    8: {
      level: 8,
      name: "Analytical Thinker",
      description: "You're developing strong analytical skills. The ability to think critically will serve you in all areas of life!",
    },
    9: {
      level: 9,
      name: "Disciplined Academic",
      description: "Your discipline sets you apart. Self-discipline is the bridge between goals and accomplishments!",
    },
    10: {
      level: 10,
      name: "Committed Intellectual",
      description: "Your commitment is inspiring. Success is the sum of small efforts repeated day in and day out!",
    },
    11: {
      level: 11,
      name: "Skilled Learner",
      description: "You're becoming skilled at the art of learning itself. Learning how to learn is life's most important skill!",
    },
    12: {
      level: 12,
      name: "Determined Scholar",
      description: "Your determination is unstoppable. The only limit to your impact is your imagination and commitment!",
    },
    13: {
      level: 13,
      name: "Insightful Student",
      description: "You're developing valuable insights. True education is about connecting dots and seeing patterns others miss!",
    },
    14: {
      level: 14,
      name: "Thoughtful Academic",
      description: "Your thoughtful approach to learning is impressive. Deep thinking leads to deep understanding!",
    },
    15: {
      level: 15,
      name: "Accomplished Scholar",
      description: "You've accomplished so much already. Take a moment to appreciate how far you've come, then keep going!",
    },
    16: {
      level: 16,
      name: "Devoted Intellectual",
      description: "Your devotion to learning is remarkable. Knowledge is the one thing that grows when shared!",
    },
    17: {
      level: 17,
      name: "Passionate Learner",
      description: "Your passion for knowledge is evident. When you study with passion, learning becomes a joy, not a chore!",
    },
    18: {
      level: 18,
      name: "Resilient Academic",
      description: "Your resilience in the face of challenges is admirable. The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice!",
    },
    19: {
      level: 19,
      name: "Ambitious Scholar",
      description: "Your ambition drives you to new heights. Shoot for the moon - even if you miss, you'll land among the stars!",
    },
    20: {
      level: 20,
      name: "Masterful Student",
      description: "You've mastered the fundamentals of effective learning. Mastery isn't perfection, it's a journey of continuous improvement!",
    },
    21: {
      level: 21,
      name: "Enlightened Thinker",
      description: "Your enlightened approach to learning sets you apart. True enlightenment comes from understanding not just facts, but connections!",
    },
    22: {
      level: 22,
      name: "Brilliant Mind",
      description: "Your brilliance is starting to shine. Intelligence is the ability to adapt to change - and you're proving how adaptable you are!",
    },
    23: {
      level: 23,
      name: "Scholarly Virtuoso",
      description: "You're becoming a virtuoso in your studies. Excellence is not an act but a habit - and you're forming that habit daily!",
    },
    24: {
      level: 24,
      name: "Intellectual Pioneer",
      description: "You're pioneering your own path of knowledge. The best way to predict your future is to create it through learning!",
    },
    25: {
      level: 25,
      name: "Distinguished Academic",
      description: "Your distinguished approach to learning is remarkable. What sets you apart is not just what you know, but your hunger to know more!",
    },
    26: {
      level: 26,
      name: "Erudite Scholar",
      description: "Your erudition is impressive. Deep knowledge comes not just from studying, but from questioning and connecting ideas!",
    },
    27: {
      level: 27,
      name: "Sagacious Learner",
      description: "Your sagacity in approaching complex topics is admirable. Wisdom begins with wonder - never lose your curiosity!",
    },
    28: {
      level: 28,
      name: "Profound Thinker",
      description: "Your profound thinking abilities are developing beautifully. The depth of your understanding reflects the depth of your questioning!",
    },
    29: {
      level: 29,
      name: "Visionary Academic",
      description: "You're developing a visionary perspective. The greatest visionaries are those who can see connections across different fields of knowledge!",
    },
    30: {
      level: 30,
      name: "Master Scholar",
      description: "You've achieved mastery in your learning journey. True mastery is not about perfection, but about continuous growth and sharing knowledge with others!",
    },
    31: {
      level: 31,
      name: "Luminary",
      description: "You shine as a luminary in your studies. Your light of knowledge can now illuminate paths for others!",
    },
    32: {
      level: 32,
      name: "Sage",
      description: "Your wisdom approaches that of a sage. Remember that a true sage knows that there is always more to learn!",
    },
    33: {
      level: 33,
      name: "Polymath",
      description: "You're developing the diverse knowledge of a polymath. The ability to connect different fields of study is a superpower!",
    },
    34: {
      level: 34,
      name: "Virtuoso Scholar",
      description: "Your virtuosity in learning is exceptional. You make the difficult look easy through your dedicated practice!",
    },
    35: {
      level: 35,
      name: "Enlightened Master",
      description: "Your enlightened mastery of learning techniques is inspiring. You've discovered that teaching others is the best way to deepen your own understanding!",
    },
    36: {
      level: 36,
      name: "Scholarly Paragon",
      description: "You stand as a paragon of scholarly dedication. Your commitment to excellence inspires everyone around you!",
    },
    37: {
      level: 37,
      name: "Intellectual Luminary",
      description: "Your intellectual light shines brightly. Knowledge is the torch that illuminates your path through uncertainty!",
    },
    38: {
      level: 38,
      name: "Erudite Master",
      description: "Your erudition has reached mastery levels. The breadth and depth of your knowledge reflect years of dedicated study!",
    },
    39: {
      level: 39,
      name: "Scholarly Virtuoso",
      description: "Your scholarly virtuosity is remarkable. You've learned that true expertise comes from both broad and deep understanding!",
    },
    40: {
      level: 40,
      name: "Grand Scholar",
      description: "You've achieved the status of a grand scholar. Your journey shows that learning is not about reaching a destination, but about enjoying the path of discovery!",
    },
    41: {
      level: 41,
      name: "Transcendent Thinker",
      description: "Your thinking has transcended ordinary boundaries. You see connections and patterns that others miss entirely!",
    },
    42: {
      level: 42,
      name: "Scholarly Illuminator",
      description: "You illuminate complex topics with clarity. The ability to make the complex simple is a sign of true mastery!",
    },
    43: {
      level: 43,
      name: "Intellectual Sovereign",
      description: "You've become sovereign in your intellectual pursuits. You chart your own course through the vast seas of knowledge!",
    },
    44: {
      level: 44,
      name: "Scholarly Exemplar",
      description: "You stand as an exemplar of scholarly dedication. Your example inspires others to pursue knowledge with similar passion!",
    },
    45: {
      level: 45,
      name: "Enlightened Sage",
      description: "Your enlightened wisdom approaches that of ancient sages. You've discovered that true wisdom lies in knowing how much there is still to learn!",
    },
    46: {
      level: 46,
      name: "Scholarly Eminence",
      description: "Your scholarly eminence is undeniable. Your dedication to learning has elevated you to remarkable heights!",
    },
    47: {
      level: 47,
      name: "Intellectual Paragon",
      description: "You stand as a paragon of intellectual achievement. Your journey demonstrates the power of consistent, dedicated study!",
    },
    48: {
      level: 48,
      name: "Scholarly Virtuoso",
      description: "Your scholarly virtuosity continues to develop. The depth of your understanding reflects years of passionate inquiry!",
    },
    49: {
      level: 49,
      name: "Transcendent Scholar",
      description: "Your scholarly achievements transcend ordinary boundaries. You've discovered that learning is not just about knowledge, but about transformation!",
    },
    50: {
      level: 50,
      name: "Legendary Scholar",
      description: "You've achieved legendary status in your learning journey. Your dedication to knowledge and growth serves as an inspiration to all. Remember that even at this pinnacle, the joy is in continuing to learn and share wisdom with others!",
    },
  },

  // Calculate level based on XP
  calculateLevel(xp) {
    let level = 1
    for (let i = 1; i < this.xpRequirements.length; i++) {
      if (xp >= this.xpRequirements[i]) {
        level = i + 1
      } else {
        break
      }
    }
    return level
  },

  // Calculate progress to next level (as percentage)
  progressToNextLevel(xp) {
    const currentLevel = this.calculateLevel(xp)
    
    // If at max level, return 100%
    if (currentLevel >= this.xpRequirements.length) {
      return 100
    }
    
    const currentLevelXP = this.xpRequirements[currentLevel - 1]
    const nextLevelXP = this.xpRequirements[currentLevel]
    const xpForCurrentLevel = xp - currentLevelXP
    const xpRequiredForNextLevel = nextLevelXP - currentLevelXP
    
    return Math.min(100, Math.floor((xpForCurrentLevel / xpRequiredForNextLevel) * 100))
  },

  // Get XP required for next level
  xpForNextLevel(xp) {
    const currentLevel = this.calculateLevel(xp)
    
    // If at max level, return null
    if (currentLevel >= this.xpRequirements.length) {
      return null
    }
    
    return this.xpRequirements[currentLevel]
  },

  // Check if user leveled up
  checkLevelUp(oldXP, newXP) {
    const oldLevel = this.calculateLevel(oldXP)
    const newLevel = this.calculateLevel(newXP)
    
    if (newLevel > oldLevel) {
      return newLevel
    }
    
    return null
  },

  // Get unlocked perks for a given level
  getUnlockedPerks(level) {
    const perks = []
    
    for (let i = 1; i <= level; i++) {
      if (this.levelPerks[i]) {
        perks.push(this.levelPerks[i])
      }
    }
    
    return perks
  },
}
