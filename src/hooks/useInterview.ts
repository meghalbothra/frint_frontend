import { useState } from 'react';
import { Job, InterviewQuestion } from '../types';
import { JobDetails } from '../api/interview'; 
import { parseResume, generateQuestions } from '../api/interview';
import { parseQuestions } from '../utils/questionParser';

export function useInterview() {
  const [step, setStep] = useState<'jobs' | 'upload' | 'interview' | 'complete'>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onContinueToInterview = async () => {
    console.log("onContinueToInterview called");

    if (!selectedJob || !userId) {
      console.log("Missing selectedJob or userId", { selectedJob, userId });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Generating questions for job:", selectedJob, "and user:", userId);
      const jobDetails: JobDetails = {
        user_id: userId,
        job_description: selectedJob.description,
        job_requirements: selectedJob.requirements.join('\n'),
      };

      const response = await generateQuestions(
        jobDetails.user_id,
        jobDetails.job_description,
        jobDetails.job_requirements
      );

      console.log("Generated response:", response);

      if (Array.isArray(response) && response.length > 0) {
        const parsedQuestions = parseQuestions(response); // Ensure questions are parsed properly
        setQuestions(parsedQuestions);                   // Update questions state
        setStep('interview');                            // Set step to 'interview'
        console.log("Questions parsed and step updated to interview");
      } else {
        setError('No questions were generated.');
        console.log("No questions generated");
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('There was an issue retrieving the questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    console.log("Job applied:", job);
    setSelectedJob(job);
    setStep('upload');
  };

  const handleUpload = async (files: FileList) => {
    console.log("Handle upload called");

    setIsLoading(true);
    setError(null);

    try {
      const file = files[0];
      if (!file) throw new Error('No file selected');

      console.log("File selected:", file);
      const parsedResume = await parseResume(file);
      console.log("Parsed resume:", parsedResume);

      const inputUserId = window.prompt('Please enter your user ID:', parsedResume.user_id);
      if (!inputUserId) throw new Error('User ID is required');

      console.log("User ID entered:", inputUserId);
      setUserId(inputUserId);

      // Now we can directly call handleGenerateQuestions with the userId and job
      if (inputUserId && selectedJob) {
        await handleGenerateQuestions(inputUserId, selectedJob);
        console.log("Step set to interview after question generation");
        setStep('interview');  // Move to interview step
      }
    } catch (err) {
      console.error('Error in handleUpload:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async (userId: string, selectedJob: Job | null) => {
    if (!selectedJob) {
      console.log("No selected job in handleGenerateQuestions");
      return;
    }
  
    console.log("handleGenerateQuestions called with userId:", userId, "and job:", selectedJob);
    setIsLoading(true);
  
    try {
      const jobDetails: JobDetails = {
        user_id: userId,
        job_description: selectedJob.description,
        job_requirements: selectedJob.requirements.join('\n'),
      };
  
      console.log("Sending request to generate questions:", jobDetails);
      const response = await generateQuestions(
        jobDetails.user_id,
        jobDetails.job_description,
        jobDetails.job_requirements
      );
  
      console.log("Received response from generateQuestions:", response);
  
      // Expecting response to be an array of question objects
      if (Array.isArray(response)) {
        const parsedQuestions = parseQuestions(response); // Pass the array directly
        setQuestions(parsedQuestions);
        setStep('interview');  // Directly set step to interview
      } else {
        console.log("No questions received from API");
        setError('No questions generated.');
      }
    } catch (error) {
      console.error('Error generating questions:', error); 
      setError('Error generating questions.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextQuestion = (answer: string) => {
    console.log("Handle next question called, answer:", answer);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = answer;
    setQuestions(updatedQuestions);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('complete');
    }
  };

  const handleFinishInterview = () => {
    console.log("Interview finished, resetting state");
    setStep('jobs');
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedJob(null);
    setUserId('');
  };

  console.log("Current step:", step);  // Log the current step at the end of the hook

  return {
    step,
    selectedJob,
    currentQuestionIndex,
    questions,
    isLoading,
    error,
    handleApply,
    handleUpload,
    handleNextQuestion,
    handleFinishInterview,
  };
}
