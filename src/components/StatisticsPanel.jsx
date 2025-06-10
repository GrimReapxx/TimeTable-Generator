import React from 'react';

const StatisticsPanel = ({ courses, rooms, schedule }) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-7">
        <h3 className="font-bold text-gray-900 mb-4 tracking-wide">Room Utilization</h3>
        <div className="space-y-3">
          {rooms.map(room => {
            const usage = Object.values(schedule).filter(s => s?.room === room.name).length;
            const maxSlots = courses.length;
            const utilization = Math.round((usage / maxSlots) * 100);
            return (
              <div key={room.id} className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-800">{room.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-10 text-right">{utilization}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-7">
        <h3 className="font-bold text-gray-900 mb-4 tracking-wide">Lecturer Workload</h3>
        <div className="space-y-3">
          {Array.from(new Set(courses.map(c => c.lecturer))).map(lecturer => {
            const workload = Object.values(schedule).filter(s => s?.lecturer === lecturer).length;
            return (
              <div key={lecturer} className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-800">{lecturer}</span>
                <span className="text-base font-bold text-indigo-700">{workload} classes</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-7">
        <h3 className="font-bold text-gray-900 mb-4 tracking-wide">Schedule Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800">Total Classes</span>
            <span className="text-lg font-extrabold text-green-700">{Object.keys(schedule).length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800">Completion</span>
            <span className="text-lg font-extrabold text-blue-700">
              {Math.round((Object.keys(schedule).length / courses.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel; 