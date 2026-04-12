import { MCHAT_QUESTIONS } from '@/data/mchat-questions';

export function calculateMCHATScore(responses: { questionId: number; answer: string }[]): number {
  let score = 0;
  
  responses.forEach(response => {
    const question = MCHAT_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;
    
    if (response.answer === 'no' && question.scoreForNo > 0) {
      score += question.scoreForNo;
    } else if (response.answer === 'yes' && question.scoreForYes > 0) {
      score += question.scoreForYes;
    }
  });
  
  return score;
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 2) return 'low';
  if (score <= 7) return 'medium';
  return 'high';
}

export function getRiskDescription(riskLevel: 'low' | 'medium' | 'high'): string {
  const descriptions = {
    low: 'Low risk - Continue routine developmental surveillance',
    medium: 'Medium risk - Consider follow-up assessment',
    high: 'High risk - Consider referral for comprehensive evaluation'
  };
  return descriptions[riskLevel];
}

export function getFollowUpQuestions(questionId: number, answer: string): string | null {
  const question = MCHAT_QUESTIONS.find(q => q.id === questionId);
  if (!question?.followUpQuestion) return null;
  
  // Only show follow-up for certain answers
  if (question.expectedResponse === 'yes' && answer === 'no') {
    return question.followUpQuestion;
  }
  if (question.expectedResponse === 'no' && answer === 'yes') {
    return question.followUpQuestion;
  }
  return null;
}