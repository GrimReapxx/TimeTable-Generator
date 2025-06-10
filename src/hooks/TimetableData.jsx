// Data Management Hook
import { useState } from 'react';

export const useTimetableData = () => {
  const [courses] = useState([
    { 
      id: 1, 
      name: 'Computer Science 324', 
      code: 'CS324', 
      credits: 3, 
      lecturer: 'Mr. Obinna', 
      duration: 2 
    },
    { 
      id: 2, 
      name: 'Computer Science 321', 
      code: 'CS321', 
      credits: 3, 
      lecturer: 'Mr. Obinna', 
      duration: 2 
    },
    { 
      id: 3, 
      name: 'Entreprenurial Development', 
      code: 'ENT327', 
      credits: 3, 
      lecturer: 'Mrs. Matuluko', 
      duration: 1.5 
    },
    { 
      id: 4, 
      name: 'Computer Science 323', 
      code: 'CS323', 
      credits: 3, 
      lecturer: 'Mr. Yekeen', 
      duration: 2 
    },
    { 
      id: 5, 
      name: 'Computer Science 325', 
      code: 'CS325', 
      credits: 3, 
      lecturer: 'Mr. Yekeen', 
      duration: 2 
    },
    { 
      id: 6, 
      name: 'Computer Science 322', 
      code: 'CS322', 
      credits: 3, 
      lecturer: 'Mr. Obinna', 
      duration: 2 
    },
    { 
      id: 7, 
      name: 'Mathematics 221', 
      code: 'MAT221', 
      credits: 3, 
      lecturer: 'Mrs. Eze', 
      duration: 2 
    },
    { 
      id: 8, 
      name: 'French 301', 
      code: 'FRN301', 
      credits: 3, 
      lecturer: 'Mrs. Rock', 
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