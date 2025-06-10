import React, { useState, useRef } from 'react';
import { Calendar, Plus, Download, ChevronDown } from 'lucide-react';
import StatusBar from './StatusBar';

const EXPORT_OPTIONS = [
  { label: 'Excel (.xlsx)', value: 'xlsx' },
  { label: 'CSV (.csv)', value: 'csv' },
  { label: 'PDF (.pdf)', value: 'pdf' },
];

const Header = ({ courses, rooms, schedule, onAutoGenerate, onClear, onExport }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format) => {
    setDropdownOpen(false);
    if (onExport) onExport(format);
  };

  return (
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {dropdownOpen && (
              <ul
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fade-in"
                role="listbox"
              >
                {EXPORT_OPTIONS.map(option => (
                  <li
                    key={option.value}
                    className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-800 text-sm"
                    role="option"
                    tabIndex={0}
                    onClick={() => handleExport(option.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') handleExport(option.value);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <StatusBar courses={courses} rooms={rooms} schedule={schedule} />
    </div>
  );
};

export default Header; 