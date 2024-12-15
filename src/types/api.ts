export interface JobDetails {
  user_id: string;
  job_description: string;
  job_requirements: string;
}

export interface ParsedResumeResponse {
  message: string;
  data: {
    file_name: string;
    resume_data: string;
  }[];
}

export interface GenerateQuestionsResponse {
  message: string;
  questions: string;
}