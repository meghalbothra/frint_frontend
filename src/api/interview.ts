import { z } from 'zod';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Zod schema for job details
const JobDetails = z.object({
  user_id: z.string(),
  job_description: z.string(),
  job_requirements: z.string(),
});

export const ResumeResponse = z.object({
  message: z.string(),
  data: z.array(z.object({
    file_name: z.string(),
    resume_data: z.string(),
  })),
});

export const QuestionsResponse = z.object({
  message: z.string(),
  questions: z.string(), // The API returns a string that we'll parse
});

export type JobDetails = z.infer<typeof JobDetails>;
export type ParsedResume = z.infer<typeof ResumeResponse>['data'][0];
export type GeneratedQuestions = { question: string; time: string }[]; // Array of question and text strings after parsing

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Function to parse resume
export async function parseResume(file: File): Promise<ParsedResume> {
  try {
    const formData = new FormData();
    formData.append('files', file); // API expects 'files' as the field name

    const response = await fetch(`${API_BASE_URL}/parse_resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new APIError('Failed to parse resume', response.status);
    }

    const data = await response.json();
    const parsed = ResumeResponse.parse(data);
    return parsed.data[0]; // Return the first parsed resume
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError('Invalid response format from server');
    }
    console.error('Error parsing resume:', error);
    throw error;
  }
}

// Function to generate questions
export async function generateQuestions(
  userId: string,
  jobDescription: string,
  jobRequirements: string
): Promise<GeneratedQuestions> {
  try {
    console.log('Starting question generation process...');

    const response = await fetch(`${API_BASE_URL}/generate_questions_with_resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        job_description: jobDescription,
        job_requirements: jobRequirements,
      }),
    });

    if (!response.ok) {
      throw new APIError('Failed to generate questions', response.status);
    }

    const data = await response.json();
    const parsed = QuestionsResponse.parse(data);
    const questionsString = parsed.questions;

    console.log('Original questions string:', questionsString);

    // Ensure questionsString is a valid string before parsing
    if (typeof questionsString !== 'string' || questionsString.trim() === '') {
      console.warn('Invalid or empty questions string');
      return [];
    }

    // Parse Q<number> and T<number> type strings
    const questions = parseQuestionsString(questionsString);
    console.log('Parsed questions array:', questions);

    return questions;
  } catch (error) {
    // Improved error handling for better clarity
    if (error instanceof APIError) {
      console.error('API Error during question generation:', error.message);
    } else {
      console.error('Unhandled error in generateQuestions:', error);
    }

    // Gracefully return empty array in case of error
    return [];
  }
}

function parseQuestionsString(questionsString: string): { question: string; time: string }[] {
  try {
    console.log('Raw questions string:', questionsString);

    // Ensure the questionsString is a valid string
    if (typeof questionsString !== 'string' || questionsString.trim() === '') {
      console.warn('Invalid format: questionsString is not a valid non-empty string.');
      return [];
    }

    // Step 1: Clean the input string by replacing improper characters
    const cleanedString = questionsString
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/,\s*}/g, '}') // Remove trailing commas before closing curly braces
      .replace(/,\s*]/g, ']') // Remove trailing commas before closing square brackets
      .trim(); // Trim any surrounding whitespace

    console.log('Cleaned questions string:', cleanedString);

    // Step 2: Regex to match entire blocks like "Q1: ... T1: ..."
    const blockRegex = /Q\d+\s*:\s*(.*?)(?:\s*,\s*)?\s*T\d+\s*:\s*([0-9mhs]+)/g;
    const result: { question: string; time: string }[] = [];
    
    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(cleanedString)) !== null) {
      const question = match[1]?.trim() || 'N/A';
      const time = match[2]?.trim() || 'N/A';
      result.push({ question, time });
    }

    console.log('Parsed combined content:', result);
    return result;
  } catch (error) {
    console.error('Error parsing Q<number> and T<number> strings:', error);
    // Return empty array instead of throwing an error if parsing fails
    return [];
  }
}
