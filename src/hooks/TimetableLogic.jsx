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
  exportScheduleAsJSON,
  exportScheduleAsCSV,
  exportScheduleAsHTML,
  exportScheduleForPDF,
  exportConflictsReport,
  exportStatistics,
  exportMultipleFormats,
  importScheduleFromJSON,
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
  const exportAsJSON = useCallback((filename) => {
    const defaultFilename = filename || generateTimestampedFilename('timetable', 'json');
    const currentConflicts = detectScheduleConflicts(schedule);
    exportScheduleAsJSON(schedule, courses, rooms, currentConflicts, defaultFilename);
  }, [schedule, courses, rooms]);

  const exportAsCSV = useCallback((filename) => {
    const defaultFilename = filename || generateTimestampedFilename('timetable', 'csv');
    exportScheduleAsCSV(schedule, days, timeSlots, defaultFilename);
  }, [schedule, days, timeSlots]);

  const exportAsHTML = useCallback((filename) => {
    const defaultFilename = filename || generateTimestampedFilename('timetable', 'html');
    exportScheduleAsHTML(schedule, days, timeSlots, defaultFilename);
  }, [schedule, days, timeSlots]);

  const exportForPDF = useCallback((filename) => {
    const defaultFilename = filename || generateTimestampedFilename('timetable_pdf', 'html');
    exportScheduleForPDF(schedule, days, timeSlots, defaultFilename);
  }, [schedule, days, timeSlots]);

  const exportConflicts = useCallback((filename) => {
    const currentConflicts = detectScheduleConflicts(schedule);
    const defaultFilename = filename || generateTimestampedFilename('conflicts_report', 'json');
    exportConflictsReport(currentConflicts, defaultFilename);
  }, [schedule]);

  const exportScheduleStatistics = useCallback((filename) => {
    const stats = getScheduleStatistics(schedule, courses, rooms);
    const defaultFilename = filename || generateTimestampedFilename('schedule_statistics', 'json');
    exportStatistics(stats, defaultFilename);
  }, [schedule, courses, rooms]);

  const exportMultiple = useCallback((formats = ['json']) => {
    const currentConflicts = detectScheduleConflicts(schedule);
    exportMultipleFormats(schedule, courses, rooms, days, timeSlots, currentConflicts, formats);
  }, [schedule, courses, rooms, days, timeSlots]);

  // Import function
  const importFromJSON = useCallback(async (file) => {
    try {
      const importedData = await importScheduleFromJSON(file);
      
      // Validate and merge imported data
      if (importedData.schedule) {
        setSchedule(importedData.schedule);
        checkConflicts(importedData.schedule);
      }
      
      return {
        success: true,
        data: importedData,
        message: 'Schedule imported successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to import schedule'
      };
    }
  }, [setSchedule, checkConflicts]);

  // Legacy export function for backward compatibility
  // const exportSchedule = useCallback(() => {
  //   exportAsJSON();
  // }, [exportAsJSON]);
  
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
    exportAsJSON,
    exportAsCSV,
    exportAsHTML,
    exportForPDF,
    exportConflicts,
    exportScheduleStatistics,
    exportMultiple,
    importFromJSON
  // exportSchedule // Uncomment if you want to keep the legacy export function
  };
};