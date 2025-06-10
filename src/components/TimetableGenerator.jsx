// Main Business Logic Component
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './Header';
import TimetableGrid from './TimetableGrid';
import AssignmentDialog from './AssignmentDialog';
import StatisticsPanel from './StatisticsPanel';
import { useTimetableData } from '../hooks/TimetableData';
import { useTimetableLogic } from '../hooks/TimetableLogic';
import { exportScheduleAsPDF } from '../utils/exportSchedule';

// Loader CSS (Bars from cssloader.com/bars)
const loaderStyle = {
  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px'
};
const BarsLoader = () => (
  <div style={loaderStyle}>
    <div className="bars-loader" style={{ display: 'flex', gap: '4px' }}>
      <div style={{ width: '8px', height: '40px', background: '#6366f1', animation: 'bars 1s infinite alternate', animationDelay: '0s' }}></div>
      <div style={{ width: '8px', height: '40px', background: '#6366f1', animation: 'bars 1s infinite alternate', animationDelay: '0.2s' }}></div>
      <div style={{ width: '8px', height: '40px', background: '#6366f1', animation: 'bars 1s infinite alternate', animationDelay: '0.4s' }}></div>
      <div style={{ width: '8px', height: '40px', background: '#6366f1', animation: 'bars 1s infinite alternate', animationDelay: '0.6s' }}></div>
      <div style={{ width: '8px', height: '40px', background: '#6366f1', animation: 'bars 1s infinite alternate', animationDelay: '0.8s' }}></div>
    </div>
    <style>{`
      @keyframes bars {
        0% { transform: scaleY(1); }
        100% { transform: scaleY(0.3); }
      }
    `}</style>
  </div>
);

const TimetableGenerator = () => {
  // Data from custom hook
  const { courses, rooms, timeSlots, days } = useTimetableData();
  
  // State management
  const [schedule, setSchedule] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Business logic from custom hook/utils
  const {
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
        console.warn(`Unsupported export format: ${format}`);
    }
  };

  // Handle auto-generate with loader
  const handleAutoGenerate = async () => {
    setLoading(true);
    // Simulate async for smoother UX (GA-inspired logic is sync, but can be wrapped)
    await new Promise(res => setTimeout(res, 100));
    autoGenerate();
    setTimeout(() => setLoading(false), 300); // allow UI to update
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header 
          courses={courses}
          rooms={rooms}
          schedule={schedule}
          onAutoGenerate={handleAutoGenerate}
          onClear={clearSchedule}
          onExport={handleExport}
        />

        {loading ? (
          <BarsLoader />
        ) : (
          <TimetableGrid 
            days={days}
            timeSlots={timeSlots}
            schedule={schedule}
            onCellClick={handleCellClick}
            onRemoveAssignment={removeAssignment}
          />
        )}

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
        />
      </div>
    </div>
  );
};

export default TimetableGenerator;