import React, { useState } from 'react';
import { Mic, MicOff, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InterviewQuestion as IInterviewQuestion } from '../../types';

interface InterviewQuestionProps {
  question: IInterviewQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: (answer: string) => void;
}

export function InterviewQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onNext 
}: InterviewQuestionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    
    if (isRecording) {
      setAnswer('Sample recorded answer for demonstration');
    } else {
      setAnswer('');
    }
  };

  return (
    <GlassCard className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <span className="text-gray-600 font-medium">Time: {question.time}</span>
      </div>

      <div className="mb-8">
        <p className="text-lg text-gray-800">{question.question}</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                     ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        {answer && (
          <div className="w-full">
            <p className="text-gray-600 mb-4">Your Answer:</p>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{answer}</p>
          </div>
        )}

        <button
          onClick={() => onNext(answer)}
          disabled={!answer}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold
                     transition-all duration-300 ${answer ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}
