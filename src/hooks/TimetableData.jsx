// Data Management Hook
import { useState } from 'react';

export const useTimetableData = () => {
  const [courses] = useState([
    { 
      id: 1, 
      name: 'Computer Science 101', 
      code: 'CS101', 
      credits: 3, 
      lecturer: 'Dr. Smith', 
      duration: 2 
    },
    { 
      id: 2, 
      name: 'Mathematics', 
      code: 'MATH201', 
      credits: 4, 
      lecturer: 'Prof. Johnson', 
      duration: 2 
    },
    { 
      id: 3, 
      name: 'Physics', 
      code: 'PHY101', 
      credits: 3, 
      lecturer: 'Dr. Brown', 
      duration: 1.5 
    },
    { 
      id: 4, 
      name: 'Chemistry', 
      code: 'CHEM101', 
      credits: 3, 
      lecturer: 'Dr. Davis', 
      duration: 2 
    }
  ]);

  const [rooms] = useState([
    { id: 1, name: 'Room A101', capacity: 50, type: 'Lecture Hall' },
    { id: 2, name: 'Lab B201', capacity: 30, type: 'Laboratory' },
    { id: 3, name: 'Room C301', capacity: 40, type: 'Classroom' },
    { id: 4, name: 'Auditorium', capacity: 200, type: 'Auditorium' }
  ]);

  const [timeSlots] = useState([
    '08:00-10:00', 
    '10:00-12:00', 
    '12:00-14:00', 
    '14:00-16:00', 
    '16:00-18:00'
  ]);

  const [days] = useState([
    'Monday', 
    'Tuesday', 
    'Wednesday', 
    'Thursday', 
    'Friday'
  ]);

  return {
    courses,
    rooms,
    timeSlots,
    days
  };
};