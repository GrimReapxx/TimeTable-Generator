// Data Management Hook
import { useState } from 'react';

export const useTimetableData = () => {
  const [courses] = useState([
    { 
      id: 1, 
      name: 'Computer Science 101', 
      code: 'CS101', 
      credits: 3, 
      lecturer: 'Mr. Obinna', 
      duration: 2 
    },
    { 
      id: 2, 
      name: 'Mathematics', 
      code: 'MATH201', 
      credits: 4, 
      lecturer: 'Prof. Eve', 
      duration: 2 
    },
    { 
      id: 3, 
      name: 'Physics', 
      code: 'PHY101', 
      credits: 3, 
      lecturer: 'Dr. James', 
      duration: 1.5 
    },
    { 
      id: 4, 
      name: 'Chemistry', 
      code: 'CHEM101', 
      credits: 3, 
      lecturer: 'Dr. Yekken', 
      duration: 2 
    },
    { 
      id: 5, 
      name: 'Computer Science 201', 
      code: 'CS201', 
      credits: 3, 
      lecturer: 'Dr. Ada', 
      duration: 2 
    },
    { 
      id: 6, 
      name: 'Computer Science 202', 
      code: 'CS202', 
      credits: 3, 
      lecturer: 'Dr. Turing', 
      duration: 2 
    },
    { 
      id: 7, 
      name: 'Computer Science 203', 
      code: 'CS203', 
      credits: 3, 
      lecturer: 'Dr. Hopper', 
      duration: 2 
    },
    { 
      id: 8, 
      name: 'Computer Science 204', 
      code: 'CS204', 
      credits: 3, 
      lecturer: 'Dr. Linus', 
      duration: 2 
    }
  ]);

  const [rooms] = useState([
    { id: 1, name: 'Class A', capacity: 50, type: 'Classroom' },
    { id: 2, name: 'Class B', capacity: 30, type: 'Classroom' },
    { id: 3, name: 'Class C', capacity: 40, type: 'Classroom' },
    { id: 4, name: 'Class 1A', capacity: 200, type: 'Lecture Hall' }
  ]);

  const [timeSlots] = useState([
    '08:00-10:00', 
    '10:00-12:00', 
    '13:00-15:00', 
    '15:00-17:00'
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