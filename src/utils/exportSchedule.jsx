// utils/exportUtils.js - Export Functionality Utilities

/**
 * Export schedule as JSON file
 * @param {Object} schedule - Current schedule
 * @param {Array} courses - Array of course objects
 * @param {Array} rooms - Array of room objects
 * @param {Array} conflicts - Array of conflict objects
 * @param {string} filename - Optional filename (default: 'timetable.json')
 */
export const exportScheduleAsJSON = (schedule, courses, rooms, conflicts = [], filename = 'timetable.json') => {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      totalAssignments: Object.keys(schedule).length,
      conflictCount: conflicts.length
    },
    schedule,
    courses,
    rooms,
    conflicts
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  downloadFile(dataStr, filename, 'application/json');
};

/**
 * Export schedule as CSV file
 * @param {Object} schedule - Current schedule
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @param {string} filename - Optional filename (default: 'timetable.csv')
 */
export const exportScheduleAsCSV = (schedule, days, timeSlots, filename = 'timetable.csv') => {
  const headers = ['Day', 'Time Slot', 'Course Code', 'Course Name', 'Lecturer', 'Room', 'Credits'];
  const rows = [headers];

  days.forEach(day => {
    timeSlots.forEach(timeSlot => {
      const slotKey = `${day}-${timeSlot}`;
      const assignment = schedule[slotKey];
      
      if (assignment) {
        rows.push([
          day,
          timeSlot,
          assignment.code || '',
          assignment.course || '',
          assignment.lecturer || '',
          assignment.room || '',
          assignment.credits || ''
        ]);
      } else {
        rows.push([day, timeSlot, '', '', '', '', '']);
      }
    });
  });

  const csvContent = rows.map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export schedule as HTML table
 * @param {Object} schedule - Current schedule
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @param {string} filename - Optional filename (default: 'timetable.html')
 */
export const exportScheduleAsHTML = (schedule, days, timeSlots, filename = 'timetable.html') => {
  const title = 'Academic Timetable';
  const exportDate = new Date().toLocaleDateString();
  
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .export-info {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
        }
        .time-slot {
            background-color: #f8f9fa;
            font-weight: bold;
            width: 120px;
        }
        .assignment {
            background-color: #e0f2fe;
            border-left: 4px solid #2196f3;
        }
        .course-code {
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 4px;
        }
        .course-name {
            font-size: 0.9em;
            margin-bottom: 4px;
        }
        .lecturer {
            font-size: 0.8em;
            color: #666;
            margin-bottom: 2px;
        }
        .room {
            font-size: 0.8em;
            color: #888;
        }
        .empty-slot {
            background-color: #f9f9f9;
            color: #ccc;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
    </div>
    <div class="export-info">
        <p>Generated on: ${exportDate}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Time Slot</th>
                ${days.map(day => `<th>${day}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
`;

  timeSlots.forEach(timeSlot => {
    htmlContent += `
            <tr>
                <td class="time-slot">${timeSlot}</td>
`;
    
    days.forEach(day => {
      const slotKey = `${day}-${timeSlot}`;
      const assignment = schedule[slotKey];
      
      if (assignment) {
        htmlContent += `
                <td class="assignment">
                    <div class="course-code">${assignment.code}</div>
                    <div class="course-name">${assignment.course}</div>
                    <div class="lecturer">${assignment.lecturer}</div>
                    <div class="room">${assignment.room}</div>
                </td>
`;
      } else {
        htmlContent += `
                <td class="empty-slot">-</td>
`;
      }
    });
    
    htmlContent += `
            </tr>
`;
  });

  htmlContent += `
        </tbody>
    </table>
</body>
</html>
`;

  downloadFile(htmlContent, filename, 'text/html');
};

/**
 * Export schedule as PDF-ready HTML (simplified for better PDF conversion)
 * @param {Object} schedule - Current schedule
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @param {string} filename - Optional filename (default: 'timetable-pdf.html')
 */
export const exportScheduleForPDF = (schedule, days, timeSlots, filename = 'timetable-pdf.html') => {
  const title = 'Academic Timetable';
  const exportDate = new Date().toLocaleDateString();
  
  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .time-slot {
            background-color: #f8f8f8;
            font-weight: bold;
            width: 100px;
        }
        .course-code {
            font-weight: bold;
            margin-bottom: 2px;
        }
        .course-details {
            font-size: 10px;
            line-height: 1.2;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>Generated: ${exportDate}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Time</th>
                ${days.map(day => `<th>${day}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
`;

  timeSlots.forEach(timeSlot => {
    htmlContent += `<tr><td class="time-slot">${timeSlot}</td>`;
    
    days.forEach(day => {
      const slotKey = `${day}-${timeSlot}`;
      const assignment = schedule[slotKey];
      
      if (assignment) {
        htmlContent += `
                <td>
                    <div class="course-code">${assignment.code}</div>
                    <div class="course-details">
                        ${assignment.course}<br>
                        ${assignment.lecturer}<br>
                        ${assignment.room}
                    </div>
                </td>`;
      } else {
        htmlContent += `<td>-</td>`;
      }
    });
    
    htmlContent += `</tr>`;
  });

  htmlContent += `
        </tbody>
    </table>
</body>
</html>`;

  downloadFile(htmlContent, filename, 'text/html');
};

/**
 * Export conflicts report as JSON
 * @param {Array} conflicts - Array of conflict objects
 * @param {string} filename - Optional filename (default: 'conflicts-report.json')
 */
export const exportConflictsReport = (conflicts, filename = 'conflicts-report.json') => {
  const report = {
    metadata: {
      reportDate: new Date().toISOString(),
      totalConflicts: conflicts.length
    },
    summary: {
      lecturerConflicts: conflicts.filter(c => c.type === 'lecturer').length,
      roomConflicts: conflicts.filter(c => c.type === 'room').length
    },
    conflicts: conflicts.map(conflict => ({
      ...conflict,
      timestamp: new Date().toISOString()
    }))
  };

  const dataStr = JSON.stringify(report, null, 2);
  downloadFile(dataStr, filename, 'application/json');
};

/**
 * Export schedule statistics as JSON
 * @param {Object} statistics - Statistics object
 * @param {string} filename - Optional filename (default: 'schedule-statistics.json')
 */
export const exportStatistics = (statistics, filename = 'schedule-statistics.json') => {
  const report = {
    metadata: {
      reportDate: new Date().toISOString(),
      reportType: 'Schedule Statistics'
    },
    ...statistics
  };

  const dataStr = JSON.stringify(report, null, 2);
  downloadFile(dataStr, filename, 'application/json');
};

/**
 * Import schedule from JSON file
 * @param {File} file - File object from input
 * @returns {Promise<Object>} Promise that resolves to imported data
 */
export const importScheduleFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate imported data structure
        if (!data.schedule || !data.courses || !data.rooms) {
          throw new Error('Invalid timetable file format');
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error(`Failed to parse JSON file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Create and download a file
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Generate filename with timestamp
 * @param {string} baseName - Base filename without extension
 * @param {string} extension - File extension
 * @returns {string} Filename with timestamp
 */
export const generateTimestampedFilename = (baseName, extension) => {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .split('.')[0];
  
  return `${baseName}_${timestamp}.${extension}`;
};

/**
 * Export multiple formats at once
 * @param {Object} schedule - Current schedule
 * @param {Array} courses - Array of course objects
 * @param {Array} rooms - Array of room objects
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @param {Array} conflicts - Array of conflict objects
 * @param {Array} formats - Array of format strings ['json', 'csv', 'html']
 */
export const exportMultipleFormats = (schedule, courses, rooms, days, timeSlots, conflicts, formats = ['json']) => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  formats.forEach(format => {
    switch (format.toLowerCase()) {
      case 'json':
        exportScheduleAsJSON(schedule, courses, rooms, conflicts, `timetable_${timestamp}.json`);
        break;
      case 'csv':
        exportScheduleAsCSV(schedule, days, timeSlots, `timetable_${timestamp}.csv`);
        break;
      case 'html':
        exportScheduleAsHTML(schedule, days, timeSlots, `timetable_${timestamp}.html`);
        break;
      case 'pdf-html':
        exportScheduleForPDF(schedule, days, timeSlots, `timetable_${timestamp}_pdf.html`);
        break;
      default:
        console.warn(`Unsupported export format: ${format}`);
    }
  });
};


// import { useCallback } from 'react';

// // Custom hook to export schedule as JSON
// export function useExportSchedule(schedule, courses, rooms) {
//   const exportSchedule = useCallback(() => {
//     const dataStr = JSON.stringify(
//       { 
//         schedule, 
//         courses, 
//         rooms, 
//         conflicts: [] 
//       }, 
//       null, 
//       2
//     );
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'timetable.json';
//     link.click();
//     URL.revokeObjectURL(url);
//   }, [schedule, courses, rooms]);

//   return exportSchedule;
// }

