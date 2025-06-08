// components/ConflictAlert.jsx - Conflict Display Component
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConflictAlert = ({ conflicts }) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-red-800">Schedule Conflicts Detected</h3>
      </div>
      <ul className="text-red-700 text-sm space-y-1">
        {conflicts.map((conflict, index) => (
          <li key={index}>• {conflict.message} ({conflict.slot})</li>
        ))}
      </ul>
    </div>
  );
};

export default ConflictAlert;