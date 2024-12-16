import React, { useState, useEffect, useRef } from 'react';
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
  onNext,
}: InterviewQuestionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Function to play the question using Text-to-Speech API
  const playQuestion = async (questionText: string) => {
    try {
      const response = await fetch('https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'Ocp-Apim-Subscription-Key': 'DeoOKbdW0XKWGcz88Y9EVE7hMiyudIYgojWUPFI58QD0UzPeH6PcJQQJ99ALACGhslBXJ3w3AAAYACOGqbIN',
          'X-MICROSOFT-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
                  <voice name="en-US-AriaNeural">${questionText}</voice>
                </speak>`,
      });

      if (!response.ok) {
        throw new Error('Error in fetching text-to-speech audio');
      }

      // Convert the response to an audio blob and play it
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Set audio playing state and handle completion
      setAudioPlaying(true);
      audio.play();

      audio.onended = () => {
        setAudioPlaying(false); // Re-enable mic once the audio has finished
      };
    } catch (error) {
      console.error('Error playing question:', error);
    }
  };

  // Play the question whenever the component is mounted or the question changes
  useEffect(() => {
    playQuestion(question.question);
  }, [question]); // This ensures that every time the question changes, the new question is played

  const toggleRecording = () => {
    if (audioPlaying) {
      return; // Don't allow recording if audio is still playing
    }

    setIsRecording((prev) => !prev);

    if (isRecording) {
      setAnswer('Sample recorded answer for demonstration');
    } else {
      setAnswer('');
    }
  };

  return (
    <GlassCard className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="font-medium">Time: {question.time}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Mic Button with animation */}
        <button
          onClick={toggleRecording}
          disabled={audioPlaying}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                     ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}
                     ${audioPlaying ? 'cursor-not-allowed' : ''}`}
        >
          {audioPlaying ? (
            <div className="animate-bounce">
              <Mic className="w-8 h-8 text-white" />
            </div>
          ) : isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Waveform Animation */}
        {audioPlaying && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-150"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-300"></div>
          </div>
        )}

        {/* Hide Answer Preview while audio is playing */}
        {!audioPlaying && answer && (
          <div className="w-full mt-4">
            <p className="text-gray-600 mb-4">Your Answer:</p>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg shadow-sm">{answer}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full mt-4">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Next Button */}
        <button
          onClick={() => onNext(answer)}
          disabled={audioPlaying || !answer}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold
                     transition-all duration-300 ${answer && !audioPlaying ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}
