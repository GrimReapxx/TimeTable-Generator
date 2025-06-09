// Export Functionality Utilities

import ExcelJS from 'exceljs';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


/**
 * Export schedule as XLSX file
 * @param {Object} schedule - Current schedule
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @param {string} filename - Optional filename (default: 'timetable.xlsx')
 */
export const exportScheduleAsXLSX = async (schedule, days, timeSlots, filename = 'timetable.xlsx') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Timetable');

  // Set up headers
  const headers = ['Time Slot', ...days];
  worksheet.addRow(headers);

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' }
  };
  worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } };

  // Add data
  timeSlots.forEach(timeSlot => {
    const rowData = [timeSlot];
    days.forEach(day => {
      const slotKey = `${day}-${timeSlot}`;
      const assignment = schedule[slotKey];
      
      if (assignment) {
        rowData.push(`${assignment.code}\n${assignment.course}\n${assignment.lecturer}\n${assignment.room}`);
      } else {
        rowData.push('');
      }
    });
    worksheet.addRow(rowData);
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = 20;
  });

  // Generate and download the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
 * Download file helper function
 * @param {string|Blob} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate timestamped filename
 * @param {string} baseName - Base filename
 * @param {string} extension - File extension
 * @returns {string} Timestamped filename
 */
export const generateTimestampedFilename = (baseName, extension) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${baseName}-${timestamp}.${extension}`;
};

/**
 * Export schedule as PDF using @react-pdf/renderer
 * @param {Object} schedule - Current schedule
 * @param {Array} days - Array of day strings
 * @param {Array} timeSlots - Array of time slot strings
 * @param {string} filename - Optional filename (default: 'timetable.pdf')
 */
export const exportScheduleAsPDF = async (schedule, days, timeSlots, filename = 'timetable.pdf') => {
  // Define styles for the PDF
  const styles = StyleSheet.create({
    page: { padding: 24, fontFamily: 'Helvetica' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#3730a3' },
    table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
    tableRow: { flexDirection: 'row' },
    tableColHeader: { width: `${100 / (days.length + 1)}%`, backgroundColor: '#6366f1', color: 'white', padding: 6, fontWeight: 'bold', fontSize: 12, borderRightWidth: 1, borderRightColor: '#e5e7eb' },
    tableCol: { width: `${100 / (days.length + 1)}%`, padding: 6, fontSize: 10, borderRightWidth: 1, borderRightColor: '#e5e7eb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    cell: { minHeight: 32, justifyContent: 'center' },
    assignment: { fontWeight: 'bold', color: '#2563eb', fontSize: 10 },
    meta: { fontSize: 10, color: '#6b7280', marginBottom: 8 },
  });

  // PDF Document
  const TimetablePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Academic Timetable</Text>
        <Text style={styles.meta}>Generated: {new Date().toLocaleDateString()}</Text>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Time Slot</Text>
            {days.map(day => (
              <Text key={day} style={styles.tableColHeader}>{day}</Text>
            ))}
          </View>
          {/* Data Rows */}
          {timeSlots.map(timeSlot => (
            <View key={timeSlot} style={styles.tableRow}>
              <Text style={styles.tableCol}>{timeSlot}</Text>
              {days.map(day => {
                const slotKey = `${day}-${timeSlot}`;
                const assignment = schedule[slotKey];
                return (
                  <Text key={day} style={styles.tableCol}>
                    {assignment ? (
                      <Text style={styles.assignment}>
                        {assignment.code}\n{assignment.course}\n{assignment.lecturer}\n{assignment.room}
                      </Text>
                    ) : (
                      '-'
                    )}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  // Generate PDF and trigger download
  const blob = await pdf(<TimetablePDF />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};




