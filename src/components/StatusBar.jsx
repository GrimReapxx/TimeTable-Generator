import React from 'react';
import { Users, MapPin, Clock } from 'lucide-react';

const StatusBar = ({ courses, rooms, schedule }) => (
  <div className="mt-4 flex items-center gap-6 text-sm">
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4 text-blue-600" />
      <span className="text-gray-700">{courses.length} Courses</span>
    </div>
    <div className="flex items-center gap-2">
      <MapPin className="w-4 h-4 text-green-600" />
      <span className="text-gray-700">{rooms.length} Rooms</span>
    </div>
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-purple-600" />
      <span className="text-gray-700">{Object.keys(schedule).length} Scheduled Classes</span>
    </div>
  </div>
);

export default StatusBar; 