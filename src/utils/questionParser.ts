export function parseQuestions(questions: { question: string; time: string }[]): { question: string; time: string }[] {
    return questions.map(q => {
      // Validate each question object format
      if (!q.question || !q.time) {
        throw new Error('Invalid question format');
      }
  
      return {
        question: q.question.trim(),
        time: q.time.trim(),
      };
    });
  }
  