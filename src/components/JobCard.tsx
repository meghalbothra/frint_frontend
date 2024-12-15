import React from 'react';
import { Job } from '../types';
import { GlassCard } from './ui/GlassCard';
import { JobHeader } from './job/JobHeader';
import { JobDetails } from './job/JobDetails';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  return (
    <GlassCard className="p-6 mb-4 transform hover:scale-[1.02]">
      <JobHeader job={job} />
      <JobDetails job={job} />
      <button
        onClick={() => onApply(job)}
        className="w-full bg-blue-600/90 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-semibold 
                 transition-all duration-300 hover:bg-blue-700 focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Apply Now
      </button>
    </GlassCard>
  );
}