import React from 'react';
import { Clock } from 'lucide-react';
import { Question } from '../types';
import { GlassCard } from './ui/GlassCard';

interface QuestionsProps {
  questions: Question[];
  onStartInterview: () => void;
}

export function Questions({ questions, onStartInterview }: QuestionsProps) {
  return (
    <GlassCard className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Interview Questions</h2>
      
      <div className="space-y-4 mb-8">
        {questions.map((q, index) => (
          <div
            key={index}
            className="p-4 bg-blue-50/50 backdrop-blur-sm rounded-lg transform transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Question {index + 1}
              </h3>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{q.time}</span>
              </div>
            </div>
            <p className="text-gray-700">{q.question}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onStartInterview}
        className="w-full bg-blue-600/90 backdrop-blur-sm text-white py-3 px-6 rounded-lg font-semibold
                 transition-all duration-300 hover:bg-blue-700 focus:outline-none
                 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Start Interview
      </button>
    </GlassCard>
  );
}
