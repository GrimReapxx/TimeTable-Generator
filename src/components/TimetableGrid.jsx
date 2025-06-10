import React from 'react';
import { Clock } from 'lucide-react';
const TimetableGrid = ({ days, timeSlots, schedule, onCellClick, onRemoveAssignment }) => {
  const getSlotKey = (day, timeSlot) => `${day}-${timeSlot}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-500">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-r-gray-700 flex items-center gap-2">
                <Clock className="inline w-5 h-5 mr-1 text-white opacity-80" />
                Time Slot
              </th>
              {days.map(day => (
                <th key={day} className="px-4 py-3 text-center text-sm font-semibold text-white border-r border-r-gray-700 min-w-[200px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, timeIndex) => (
              <tr key={timeSlot} className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {/* Time Slot Header */}
                <td className="px-4 py-6 text-base text-center font-medium text-gray-900 border-r bg-indigo-300">
                  {timeSlot}
                </td>
                {days.map(day => {
                  const slotKey = getSlotKey(day, timeSlot);
                  const assignment = schedule[slotKey];
                  
                  return (
                    <td 
                      key={slotKey}
                      className={`px-2 py-2 border-r border-r-gray-500 border-b border-b-gray-500 cursor-pointer transition-colors hover:bg-blue-50`}
                      onClick={() => onCellClick(day, timeSlot)}
                    >
                      {assignment ? (
                        <div className={`p-3 rounded-lg border-l-4 bg-blue-50 border-blue-500`}>
                          <div className="font-semibold text-sm text-gray-900 mb-1">
                            {assignment.code}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {assignment.course}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            👨‍🏫 {assignment.lecturer}
                          </div>
                          <div className="text-xs text-gray-500">
                            📍 {assignment.room}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveAssignment(day, timeSlot);
                            }}
                            className="mt-2 text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 flex items-center justify-center text-gray-800 text-sm">
                          Click to assign
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableGrid; 