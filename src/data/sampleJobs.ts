import { Job } from '../types';

export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Machine Learning Engineer',
    company: 'TechCorp AI',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are seeking an experienced Machine Learning Engineer to join our AI team...',
    requirements: [
      'Masters or PhD in Computer Science or related field',
      '5+ years of experience in ML/AI',
      'Strong Python programming skills',
      'Experience with TensorFlow and PyTorch'
    ],
    salary: '150K - 200K',
    postedDate: '2 days ago'
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'DataTech Solutions',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our data science team to build innovative solutions...',
    requirements: [
      'BS/MS in Computer Science, Statistics, or related field',
      '3+ years of experience in data science',
      'Expertise in statistical modeling',
      'Experience with big data technologies'
    ],
    salary: '120K - 160K',
    postedDate: '1 week ago'
  },
  {
    id: '3',
    title: 'AI Research Scientist',
    company: 'Innovation Labs',
    location: 'Boston, MA',
    type: 'Full-time',
    description: 'Looking for an AI Research Scientist to push the boundaries of AI...',
    requirements: [
      'PhD in Computer Science or related field',
      'Strong publication record',
      'Experience with deep learning frameworks',
      'Background in computer vision or NLP'
    ],
    salary: '160K - 220K',
    postedDate: '3 days ago'
  }
];