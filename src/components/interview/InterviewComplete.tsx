import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InterviewQuestion } from '../../types';

interface InterviewCompleteProps {
  questions: InterviewQuestion[];
  onFinish: () => void;
}

export function InterviewComplete({ questions, onFinish }: InterviewCompleteProps) {
  return (
    <GlassCard className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Interview Complete!
        </h2>
        <p className="text-gray-600">
          Thank you for completing the interview. Here's a summary of your responses:
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((q, index) => (
          <div key={index} className="bg-white/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Question {index + 1}
              </h3>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{q.time}</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{q.question}</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600">Your Answer:</p>
              <p className="text-gray-800">{q.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onFinish}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
                 transition-all duration-300 hover:bg-blue-700"
      >
        Finish Interview
      </button>
    </GlassCard>
  );
}