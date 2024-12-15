import React from 'react';
import { Job } from '../../types';

interface JobDetailsProps {
  job: Job;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-600">{job.description}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Requirements</h3>
        <ul className="list-disc list-inside text-gray-600">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    </>
  );
}