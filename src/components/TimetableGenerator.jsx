// Main Business Logic Component

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './Header';
import TimetableGrid from './TimetableGrid';
import AssignmentDialog from './AssignmentDialog';
import StatisticsPanel from './StatisticsPanel';
import ConflictAlert from './ConflictAlert';
import { useTimetableData } from '../hooks/TimetableData';
import { useTimetableLogic } from '../hooks/TimetableLogic';
import { exportScheduleAsPDF } from '../utils/exportSchedule';


const TimetableGenerator = () => {
  // Data from custom hook
  const { courses, rooms, timeSlots, days } = useTimetableData();
  
  // State management
  const [schedule, setSchedule] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Business logic from custom hook/utils
  const {
    // getSlotKey,
    // checkConflicts,
    assignCourse,
    removeAssignment,
    autoGenerate,
    clearSchedule,
    exportAsCSV,
    exportMultiple
  } = useTimetableLogic({
    courses,
    rooms,
    days,
    timeSlots,
    schedule,
    setSchedule,
    setConflicts,
    setShowAssignDialog,
    setSelectedCell
  });

  // Handle cell click
  const handleCellClick = (day, timeSlot) => {
    setSelectedCell({ day, timeSlot });
    setShowAssignDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowAssignDialog(false);
    setSelectedCell(null);
  };

  // Handle export with format
  const handleExport = (format) => {
    switch (format) {
      case 'xlsx':
        exportMultiple(['xlsx']);
        break;
      case 'csv':
        exportAsCSV();
        break;
      case 'pdf':
        exportScheduleAsPDF(schedule, days, timeSlots);
        break;
      default:
        exportMultiple(['xlsx']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header 
          courses={courses}
          rooms={rooms}
          schedule={schedule}
          conflicts={conflicts}
          onAutoGenerate={autoGenerate}
          onClear={clearSchedule}
          onExport={handleExport}
        />

        <ConflictAlert conflicts={conflicts} />

        <TimetableGrid 
          days={days}
          timeSlots={timeSlots}
          schedule={schedule}
          conflicts={conflicts}
          onCellClick={handleCellClick}
          onRemoveAssignment={removeAssignment}
        />

        {showAssignDialog && (
          <AssignmentDialog
            selectedCell={selectedCell}
            courses={courses}
            rooms={rooms}
            onAssign={assignCourse}
            onClose={handleDialogClose}
          />
        )}

        <StatisticsPanel
          courses={courses}
          rooms={rooms}
          schedule={schedule}
          conflicts={conflicts}
        />
      </div>
    </div>
  );
};

export default TimetableGenerator;