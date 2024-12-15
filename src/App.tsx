import React from 'react';
import { JobCard } from './components/JobCard';
import { ResumeUpload } from './components/ResumeUpload';
import { InterviewQuestion } from './components/interview/InterviewQuestion';
import { InterviewComplete } from './components/interview/InterviewComplete';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useInterview } from './hooks/useInterview';
import { sampleJobs } from './data/sampleJobs';

function App() {
  const {
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
  } = useInterview();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-blue-700">AI Interview Platform</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <ErrorMessage message={error} />}
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {step === 'jobs' && (
              <div className="space-y-6">
                {sampleJobs.map(job => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))}
              </div>
            )}

            {step === 'upload' && selectedJob && (
              <ResumeUpload onUpload={handleUpload} />
            )}

            {step === 'interview' && questions[currentQuestionIndex] && (
              <InterviewQuestion
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onNext={handleNextQuestion}
              />
            )}

            {step === 'complete' && (
              <InterviewComplete
                questions={questions}
                onFinish={handleFinishInterview}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;