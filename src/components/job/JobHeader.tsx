import React from 'react';
import { Building2, MapPin, Clock, DollarSign } from 'lucide-react';
import { Job } from '../../types';

interface JobHeaderProps {
  job: Job;
}

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{job.title}</h2>
        <div className="flex items-center text-gray-600 mb-2">
          <Building2 className="w-4 h-4 mr-2" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{job.location}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="flex items-center text-green-600 font-semibold mb-2">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.salary}
        </span>
        <span className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {job.postedDate}
        </span>
      </div>
    </div>
  );
}