// Schedule Utility Functions

/**
 * Generate a unique key for schedule slots
 * @param {string} day - Day of the week
 * @param {string} timeSlot - Time slot (e.g., "08:00-10:00")
 * @returns {string} Unique slot key
 */
export const generateSlotKey = (day, timeSlot) => {
  return `${day}-${timeSlot}`;
};

/**
 * Create a schedule assignment object
 * @param {Object} course - Course object
 * @param {Object} room - Room object
 * @returns {Object} Assignment object for schedule
 */
export const createScheduleAssignment = (course, room) => {
  return {
    course: course.name,
    code: course.code,
    lecturer: course.lecturer,
    room: room.name,
    credits: course.credits,
    duration: course.duration
  };
};

/**
 * Remove assignment from schedule
 * @param {Object} schedule - Current schedule
 * @param {string} slotKey - Slot key to remove
 * @returns {Object} New schedule without the specified assignment
 */
export const removeScheduleAssignment = (schedule, slotKey) => {
  const newSchedule = { ...schedule };
  delete newSchedule[slotKey];
  return newSchedule;
};

/**
 * Add assignment to schedule
 * @param {Object} schedule - Current schedule
 * @param {string} slotKey - Slot key for assignment
 * @param {Object} assignment - Assignment object
 * @returns {Object} New schedule with added assignment
 */
export const addScheduleAssignment = (schedule, slotKey, assignment) => {
  return {
    ...schedule,
    [slotKey]: assignment
  };
};

/**
 * Check if a slot is available (just checks if slot is empty)
 * @param {Object} schedule - Current schedule
 * @param {string} slotKey - Slot key to check
 * @returns {boolean} True if slot is available
 */
export const isSlotAvailable = (schedule, slotKey) => {
  return !schedule[slotKey];
};

// Helper: Generate a random timetable
function generateRandomTimetable(courses, rooms, days, timeSlots) {
  const schedule = {};
  const usedSlots = new Set();
  const allSlots = [];
  days.forEach(day => timeSlots.forEach(ts => allSlots.push({ day, timeSlot: ts })));

  // Shuffle slots
  for (let i = allSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSlots[i], allSlots[j]] = [allSlots[j], allSlots[i]];
  }

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    let assigned = false;
    for (let s = 0; s < allSlots.length && !assigned; s++) {
      const { day, timeSlot } = allSlots[s];
      const slotKey = generateSlotKey(day, timeSlot);
      if (!usedSlots.has(slotKey)) {
        const room = rooms[i % rooms.length];
        schedule[slotKey] = createScheduleAssignment(course, room);
        usedSlots.add(slotKey);
        assigned = true;
      }
    }
  }
  return schedule;
}

// Helper: Fitness function (now only penalizes unbalanced distribution)
function scoreTimetable(schedule, courses, days) {
  // Penalize unbalanced distribution (prefer even spread across days)
  const dayCounts = days.map(day =>
    Object.keys(schedule).filter(k => k.startsWith(day + '-')).length
  );
  const max = Math.max(...dayCounts), min = Math.min(...dayCounts);
  let spreadPenalty = max - min; // lower is better
  return -spreadPenalty; // higher is better
}

// Main: GA-inspired auto-schedule
export const generateAutoSchedule = (courses, rooms, days, timeSlots) => {
  const NUM_CANDIDATES = 50;
  let bestSchedule = null;
  let bestScore = -Infinity;
  for (let i = 0; i < NUM_CANDIDATES; i++) {
    const candidate = generateRandomTimetable(courses, rooms, days, timeSlots);
    const score = scoreTimetable(candidate, courses, days);
    if (score > bestScore) {
      bestScore = score;
      bestSchedule = candidate;
    }
  }
  return bestSchedule;
};

/**
 * Get schedule statistics
 * @param {Object} schedule - Current schedule
 * @param {Array} courses - Array of course objects
 * @param {Array} rooms - Array of room objects
 * @returns {Object} Statistics object
 */
export const getScheduleStatistics = (schedule, courses, rooms) => {
  const totalSlots = Object.keys(schedule).length;
  const assignedCourses = new Set();
  const usedRooms = new Set();
  const lecturerLoad = {};

  Object.values(schedule).forEach(assignment => {
    if (assignment) {
      assignedCourses.add(assignment.code);
      usedRooms.add(assignment.room);
      
      if (!lecturerLoad[assignment.lecturer]) {
        lecturerLoad[assignment.lecturer] = 0;
      }
      lecturerLoad[assignment.lecturer]++;
    }
  });

  return {
    totalAssignments: totalSlots,
    assignedCourses: assignedCourses.size,
    totalCourses: courses.length,
    usedRooms: usedRooms.size,
    totalRooms: rooms.length,
    lecturerLoad,
    utilizationRate: totalSlots > 0 ? (assignedCourses.size / courses.length) * 100 : 0
  };
};

/**
 * Validate schedule assignment
 * @param {Object} course - Course to assign
 * @param {Object} room - Room to assign
 * @param {string} day - Day of assignment
 * @param {string} timeSlot - Time slot of assignment
 * @returns {Object} Validation result with isValid and errors
 */
export const validateScheduleAssignment = (course, room, day, timeSlot) => {
  const errors = [];

  if (!course) {
    errors.push('Course is required');
  }

  if (!room) {
    errors.push('Room is required');
  }

  if (!day) {
    errors.push('Day is required');
  }

  if (!timeSlot) {
    errors.push('Time slot is required');
  }

  // Additional validations can be added here
  // e.g., room capacity vs course requirements, room type compatibility

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Find available time slots for a specific lecturer
 * @param {Object} schedule - Current schedule
 * @param {string} lecturer - Lecturer name
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @returns {Array} Array of available slot keys
 */
export const findAvailableSlots = (schedule, lecturer, days, timeSlots) => {
  const availableSlots = [];
  const lecturerSlots = new Set();

  // Find all slots occupied by the lecturer
  Object.entries(schedule).forEach(([slotKey, assignment]) => {
    if (assignment?.lecturer === lecturer) {
      lecturerSlots.add(slotKey);
    }
  });

  // Check all possible slots
  days.forEach(day => {
    timeSlots.forEach(timeSlot => {
      const slotKey = generateSlotKey(day, timeSlot);
      if (!lecturerSlots.has(slotKey) && !schedule[slotKey]) {
        availableSlots.push(slotKey);
      }
    });
  });

  return availableSlots;
};