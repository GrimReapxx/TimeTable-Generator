import React from 'react';
import { Calendar, Plus, Download } from 'lucide-react';
import StatusBar from './StatusBar';

const Header = ({ courses, rooms, schedule, conflicts, onAutoGenerate, onClear, onExport }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Timetable Generator</h1>
          <p className="text-gray-600">Intelligent scheduling for academic institutions</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onAutoGenerate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Auto Generate
        </button>
        <button
          onClick={onClear}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
    <StatusBar courses={courses} rooms={rooms} schedule={schedule} conflicts={conflicts} />
  </div>
);

export default Header; 