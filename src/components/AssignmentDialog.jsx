import React from 'react';

const AssignmentDialog = ({ selectedCell, courses, rooms, onAssign, onClose }) => {
  if (!selectedCell) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw shadow-xl">
        <h3 className="text-lg font-semibold mb-4">
          Assign Class - {selectedCell.day} {selectedCell.timeSlot}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select 
              id="course-select"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name} ({course.lecturer})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Room
            </label>
            <select 
              id="room-select"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose a room...</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.type}, Cap: {room.capacity})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              const courseId = parseInt(document.getElementById('course-select').value);
              const roomId = parseInt(document.getElementById('room-select').value);
              if (courseId && roomId) {
                onAssign(selectedCell.day, selectedCell.timeSlot, courseId, roomId);
              }
            }}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Assign
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDialog; 