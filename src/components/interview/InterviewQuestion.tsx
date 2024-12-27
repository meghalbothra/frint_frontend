import React, { useState, useEffect, useRef } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'; // Azure Speech SDK
import { Mic, MicOff, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InterviewQuestion as IInterviewQuestion } from '../../types';
import 'animate.css'; // Import Animate.css for animations

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
  const [recognizing, setRecognizing] = useState(false); // New state to track recognition process
  const [questionAnimating, setQuestionAnimating] = useState(false); // State to track question animation
  const [answerAnimating, setAnswerAnimating] = useState(false); // State to track answer animation
  const [micEnabled, setMicEnabled] = useState(false); // State to control mic enable/disable
  const [micDisabled, setMicDisabled] = useState(true); // State to track if mic should be disabled during question

  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null); // Reference for speech recognizer

  // Azure Speech SDK credentials
  const speechKey = 'DeoOKbdW0XKWGcz88Y9EVE7hMiyudIYgojWUPFI58QD0UzPeH6PcJQQJ99ALACGhslBXJ3w3AAAYACOGqbIN';
  const serviceRegion = 'centralindia';

  // Function to play the question using Text-to-Speech API
  const playQuestion = async (questionText: string) => {
    try {
      const response = await fetch(
        'https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ssml+xml',
            'Ocp-Apim-Subscription-Key': speechKey,
            'X-MICROSOFT-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          },
          body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
                    <voice name="en-US-AriaNeural">${questionText}</voice>
                  </speak>`,
        }
      );

      if (!response.ok) throw new Error('Error fetching TTS audio');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setAudioPlaying(true);
      setQuestionAnimating(true); // Start animation when question starts
      audio.play();
      audio.onended = () => {
        setAudioPlaying(false);
        setQuestionAnimating(false); // End animation when question ends
        setMicDisabled(false); // Enable the mic after the question finishes playing
      };
    } catch (error) {
      console.error('Error playing question:', error);
    }
  };

  // Initialize Azure Speech Recognizer
  const startRecording = async () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizerRef.current = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    setIsRecording(true);
    setAnswer(''); // Reset the answer for the new question
    setRecognizing(true); // Set recognizing to true

    // Recognize speech
    recognizerRef.current.recognizing = (s, e) => {
      console.log(`Recognizing: ${e.result.text}`);
      setRecognizing(true); // Indicate that recognition is ongoing
    };

    recognizerRef.current.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`Recognized: ${e.result.text}`);
        setAnswer((prev) => prev + ' ' + e.result.text); // Append answer for this question
      } else {
        console.error(`Speech recognition failed: ${e.result.reason}`);
      }
    };

    recognizerRef.current.canceled = (s, e) => {
      console.log(`Canceled: ${e.errorDetails}`);
      setIsRecording(false);
      setRecognizing(false); // Recognition has ended
      if (e.errorDetails) {
        alert('Speech recognition failed. Please try again.');
      }
    };

    recognizerRef.current.sessionStopped = () => {
      console.log('Session stopped');
      setIsRecording(false);
      setRecognizing(false); // Recognition session has stopped
      recognizerRef.current?.stopContinuousRecognitionAsync();
    };

    // Start continuous recognition
    recognizerRef.current.startContinuousRecognitionAsync();
  };

  // Stop Speech Recognition
  const stopRecording = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
    }
    setIsRecording(false);
    setRecognizing(false); // Stop recognizing when the session is stopped
  };

  // Toggle Recording
  const toggleRecording = () => {
    if (audioPlaying || recognizing) return; // Don't allow recording while TTS is playing or recognition is in progress

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Play the question whenever the component is mounted or the question changes
  useEffect(() => {
    let isMounted = true; // To ensure the cleanup function prevents duplicate calls
  
    const fetchAndPlayQuestion = async () => {
      setAnswer(''); // Reset the answer whenever the question changes
      setMicDisabled(true); // Disable mic before the question is asked
  
      if (isMounted) {
        await playQuestion(question.question);
      }
    };
  
    fetchAndPlayQuestion();
  
    return () => {
      isMounted = false; // Cleanup to prevent the function from running twice
    };
  }, [question]);
  

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

      <div className={`mb-6 ${questionAnimating ? 'animate__animated animate__fadeIn' : ''}`}>
        <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Mic Button */}
        <button
          onClick={toggleRecording}
          disabled={micDisabled || audioPlaying || recognizing}  // Disable if mic is not enabled, TTS is playing, or recognition is in progress
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 
            ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} 
            ${audioPlaying || recognizing ? 'cursor-not-allowed' : ''} 
            ${questionAnimating ? 'animate__animated animate__pulse animate__infinite' : ''}`} 
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Answer Preview with animation */}
        {answer && (
          <div className={`w-full mt-4 ${answerAnimating ? 'animate__animated animate__fadeIn' : ''}`}>
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
          onClick={() => {
            console.log('Answer:', answer); // Log answer to ensure it's being captured
            onNext(answer);
            setAnswerAnimating(true); // Start answer animation when "Next" is clicked
          }}
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
