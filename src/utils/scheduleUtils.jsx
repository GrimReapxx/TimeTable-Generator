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
 * Check for scheduling conflicts in a given schedule
 * @param {Object} schedule - Current schedule object
 * @returns {Array} Array of conflict objects
 */
export const detectScheduleConflicts = (schedule) => {
  const conflicts = [];
  const lecturerSlots = {};
  const roomSlots = {};

  Object.entries(schedule).forEach(([slotKey, assignment]) => {
    if (!assignment) return;

    // Check lecturer conflicts
    if (lecturerSlots[assignment.lecturer]?.includes(slotKey)) {
      conflicts.push({
        type: 'lecturer',
        message: `${assignment.lecturer} has overlapping classes`,
        slot: slotKey,
        severity: 'high'
      });
    } else {
      if (!lecturerSlots[assignment.lecturer]) {
        lecturerSlots[assignment.lecturer] = [];
      }
      lecturerSlots[assignment.lecturer].push(slotKey);
    }

    // Check room conflicts
    if (roomSlots[assignment.room]?.includes(slotKey)) {
      conflicts.push({
        type: 'room',
        message: `${assignment.room} is double-booked`,
        slot: slotKey,
        severity: 'high'
      });
    } else {
      if (!roomSlots[assignment.room]) {
        roomSlots[assignment.room] = [];
      }
      roomSlots[assignment.room].push(slotKey);
    }
  });

  return conflicts;
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
 * Check if a slot is available (no conflicts)
 * @param {Object} schedule - Current schedule
 * @param {string} slotKey - Slot key to check
 * @param {string} lecturer - Lecturer name
 * @param {string} room - Room name
 * @returns {boolean} True if slot is available
 */
export const isSlotAvailable = (schedule, slotKey, lecturer, room) => {
  // Check if slot is already occupied
  if (schedule[slotKey]) {
    return false;
  }

  // Check for lecturer conflicts
  const lecturerConflict = Object.entries(schedule).some(([key, assignment]) => 
    key === slotKey && assignment?.lecturer === lecturer
  );

  // Check for room conflicts
  const roomConflict = Object.entries(schedule).some(([key, assignment]) => 
    key === slotKey && assignment?.room === room
  );

  return !lecturerConflict && !roomConflict;
};

/**
 * Generate automatic schedule based on courses and constraints
 * @param {Array} courses - Array of course objects
 * @param {Array} rooms - Array of room objects
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @returns {Object} Generated schedule object
 */
export const generateAutoSchedule = (courses, rooms, days, timeSlots) => {
  const schedule = {};
  const usedSlots = new Set();
  const lecturerSchedule = {};

  courses.forEach((course, index) => {
    let assigned = false;
    
    // Try to find an available slot
    for (let dayIndex = 0; dayIndex < days.length && !assigned; dayIndex++) {
      for (let timeIndex = 0; timeIndex < timeSlots.length && !assigned; timeIndex++) {
        const day = days[dayIndex];
        const timeSlot = timeSlots[timeIndex];
        const slotKey = generateSlotKey(day, timeSlot);
        
        // Check if slot is available and lecturer is free
        if (!usedSlots.has(slotKey) && 
            !lecturerSchedule[course.lecturer]?.includes(slotKey)) {
          
          // Assign room (simple round-robin assignment)
          const room = rooms[index % rooms.length];
          
          // Create assignment
          schedule[slotKey] = createScheduleAssignment(course, room);
          
          // Track used slots and lecturer schedule
          usedSlots.add(slotKey);
          if (!lecturerSchedule[course.lecturer]) {
            lecturerSchedule[course.lecturer] = [];
          }
          lecturerSchedule[course.lecturer].push(slotKey);
          assigned = true;
        }
      }
    }
  });

  return schedule;
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