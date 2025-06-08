import React from 'react';

const StatisticsPanel = ({ courses, rooms, schedule, conflicts }) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Room Utilization</h3>
        <div className="space-y-2">
          {rooms.map(room => {
            const usage = Object.values(schedule).filter(s => s?.room === room.name).length;
            const maxSlots = courses.length;
            const utilization = Math.round((usage / maxSlots) * 100);
            
            return (
              <div key={room.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{room.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{utilization}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Lecturer Workload</h3>
        <div className="space-y-2">
          {Array.from(new Set(courses.map(c => c.lecturer))).map(lecturer => {
            const workload = Object.values(schedule).filter(s => s?.lecturer === lecturer).length;
            
            return (
              <div key={lecturer} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{lecturer}</span>
                <span className="text-sm font-medium text-gray-900">{workload} classes</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Schedule Health</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Classes</span>
            <span className="text-sm font-medium text-gray-900">{Object.keys(schedule).length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Conflicts</span>
            <span className={`text-sm font-medium ${conflicts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {conflicts.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completion</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((Object.keys(schedule).length / courses.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel; 