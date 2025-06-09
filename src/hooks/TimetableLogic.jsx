// hooks/useTimetableLogic.js - Business Logic Hook

import { useCallback } from 'react';
import {
  generateSlotKey,
  detectScheduleConflicts,
  createScheduleAssignment,
  addScheduleAssignment,
  removeScheduleAssignment,
  generateAutoSchedule,
  validateScheduleAssignment,
  isSlotAvailable,
  getScheduleStatistics
} from '../utils/scheduleUtils';

import {
  exportScheduleAsCSV,
  generateTimestampedFilename
} from '../utils/exportSchedule';

export const useTimetableLogic = ({
  courses,
  rooms,
  days,
  timeSlots,
  schedule,
  setSchedule,
  setConflicts,
  setShowAssignDialog,
  setSelectedCell
}) => {
  
  // Generate a unique key for schedule slots (using utility)
  const getSlotKey = useCallback((day, timeSlot) => {
    return generateSlotKey(day, timeSlot);
  }, []);

  // Check for conflicts in the schedule (using utility)
  const checkConflicts = useCallback((newSchedule) => {
    const conflicts = detectScheduleConflicts(newSchedule);
    setConflicts(conflicts);
  }, [setConflicts]);

  // Assign a course to a time slot
  const assignCourse = useCallback((day, timeSlot, courseId, roomId) => {
    const course = courses.find(c => c.id === courseId);
    const room = rooms.find(r => r.id === roomId);
    
    // Validate assignment
    const validation = validateScheduleAssignment(course, room, day, timeSlot);
    if (!validation.isValid) {
      console.error('Assignment validation failed:', validation.errors);
      return;
    }

    const slotKey = getSlotKey(day, timeSlot);
    
    // Check if slot is available
    if (!isSlotAvailable(schedule, slotKey, course.lecturer, room.name)) {
      console.warn('Slot is not available due to conflicts');
    }

    // Create assignment and update schedule
    const assignment = createScheduleAssignment(course, room);
    const newSchedule = addScheduleAssignment(schedule, slotKey, assignment);

    setSchedule(newSchedule);
    checkConflicts(newSchedule);
    setShowAssignDialog(false);
    setSelectedCell(null);
  }, [
    courses, 
    rooms, 
    schedule, 
    getSlotKey, 
    checkConflicts, 
    setSchedule, 
    setShowAssignDialog, 
    setSelectedCell
  ]);

  // Remove assignment from slot (using utility)
  const removeAssignment = useCallback((day, timeSlot) => {
    const slotKey = getSlotKey(day, timeSlot);
    const newSchedule = removeScheduleAssignment(schedule, slotKey);
    setSchedule(newSchedule);
    checkConflicts(newSchedule);
  }, [schedule, getSlotKey, checkConflicts, setSchedule]);

  // Auto-generate basic schedule (using utility)
  const autoGenerate = useCallback(() => {
    const newSchedule = generateAutoSchedule(courses, rooms, days, timeSlots);
    setSchedule(newSchedule);
    checkConflicts(newSchedule);
  }, [courses, rooms, days, timeSlots, checkConflicts, setSchedule]);

  // Clear schedule
  const clearSchedule = useCallback(() => {
    setSchedule({});
    setConflicts([]);
  }, [setSchedule, setConflicts]);

  // Validate a potential assignment
  const validateAssignment = useCallback((courseId, roomId, day, timeSlot) => {
    const course = courses.find(c => c.id === courseId);
    const room = rooms.find(r => r.id === roomId);
    return validateScheduleAssignment(course, room, day, timeSlot);
  }, [courses, rooms]);

  // Check if a specific slot is available
  const checkSlotAvailability = useCallback((day, timeSlot, courseId, roomId) => {
    const course = courses.find(c => c.id === courseId);
    const room = rooms.find(r => r.id === roomId);
    
    if (!course || !room) return false;
    
    const slotKey = getSlotKey(day, timeSlot);
    return isSlotAvailable(schedule, slotKey, course.lecturer, room.name);
  }, [courses, rooms, schedule, getSlotKey]);

  // Get schedule statistics
  const getStatistics = useCallback(() => {
    return getScheduleStatistics(schedule, courses, rooms);
  }, [schedule, courses, rooms]);
  
    // Export functions
  const exportAsCSV = useCallback((filename) => {
    const defaultFilename = filename || generateTimestampedFilename('timetable', 'csv');
    exportScheduleAsCSV(schedule, days, timeSlots, defaultFilename);
  }, [schedule, days, timeSlots]);

  
  
  return {
    getSlotKey,
    checkConflicts,
    assignCourse,
    removeAssignment,
    autoGenerate,
    clearSchedule,
    validateAssignment,
    checkSlotAvailability,
    getStatistics,
    exportAsCSV
  };
};