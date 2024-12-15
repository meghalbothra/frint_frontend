export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  postedDate: string;
}

export interface InterviewQuestion {
  question: string;
  time: string;
  answer?: string;
}

export interface ResumeUploadResponse {
  message: string;
  data: {
    file_name: string;
    resume_data: string;
  }[];
}