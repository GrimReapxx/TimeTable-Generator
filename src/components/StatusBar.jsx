import React from 'react';
import { Users, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const StatusBar = ({ courses, rooms, schedule, conflicts }) => (
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
    {conflicts.length > 0 && (
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <span className="text-red-700">{conflicts.length} Conflicts</span>
      </div>
    )}
    {conflicts.length === 0 && Object.keys(schedule).length > 0 && (
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-green-700">No Conflicts</span>
      </div>
    )}
  </div>
);

export default StatusBar; 