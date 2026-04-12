// M-CHAT-R/F Questions and Scoring Logic
// Based on the Modified Checklist for Autism in Toddlers, Revised with Follow-up

export interface MCHATQuestion {
  id: number;
  question: string;
  category: 'joint_attention' | 'social_communication' | 'repetitive_behavior' | 'sensory';
  expectedResponse: 'yes' | 'no' | 'sometimes';
  scoreForNo: number; // Points if answer is NO
  scoreForYes: number; // Points if answer is YES
  followUpQuestion?: string;
  followUpOptions?: string[];
}

export const MCHAT_QUESTIONS: MCHATQuestion[] = [
  {
    id: 1,
    question: "If you point at something across the room, does your child look at it?",
    category: 'joint_attention',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "If you point at a toy across the room, does your child look at it?"
  },
  {
    id: 2,
    question: "Have you ever wondered if your child might be deaf?",
    category: 'social_communication',
    expectedResponse: 'no',
    scoreForNo: 0,
    scoreForYes: 1, // YES scores 1 point
    followUpQuestion: "Does your child respond to their name when called?"
  },
  {
    id: 3,
    question: "Does your child play pretend or make-believe?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child pretend to feed a doll or talk on a toy phone?"
  },
  {
    id: 4,
    question: "Does your child like climbing on things, such as up stairs?",
    category: 'repetitive_behavior',
    expectedResponse: 'yes',
    scoreForNo: 1,
    scoreForYes: 0
  },
  {
    id: 5,
    question: "Does your child make unusual finger movements near his/her eyes?",
    category: 'repetitive_behavior',
    expectedResponse: 'no',
    scoreForNo: 0,
    scoreForYes: 1, // YES scores 1 point
    followUpQuestion: "Does your child flap their hands, rock, or spin?"
  },
  {
    id: 6,
    question: "Does your child point with one finger to ask for something?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child point to show you something interesting?"
  },
  {
    id: 7,
    question: "Does your child point with one finger to show you something interesting?",
    category: 'joint_attention',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child point to share interest with you?"
  },
  {
    id: 8,
    question: "Is your child interested in other children?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child watch other children or try to join their play?"
  },
  {
    id: 9,
    question: "Does your child bring objects over to you or hold them up to show you?",
    category: 'joint_attention',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child show you things by bringing or holding them up?"
  },
  {
    id: 10,
    question: "Does your child respond to his/her name when you call?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child look at you when you call their name?"
  },
  {
    id: 11,
    question: "When you smile at your child, does he/she smile back?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child smile back at you?"
  },
  {
    id: 12,
    question: "Does your child get upset by everyday noises?",
    category: 'sensory',
    expectedResponse: 'no',
    scoreForNo: 0,
    scoreForYes: 1, // YES scores 1 point
    followUpQuestion: "Does your child cover their ears or get upset by vacuum cleaners, blenders, etc.?"
  },
  {
    id: 13,
    question: "Does your child walk?",
    category: 'repetitive_behavior',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point (for 18+ months)
    scoreForYes: 0
  },
  {
    id: 14,
    question: "Does your child make eye contact with you during play or dressing?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child look at you when you're talking or playing together?"
  },
  {
    id: 15,
    question: "Does your child try to copy what you do?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child try to imitate your actions or words?"
  },
  {
    id: 16,
    question: "If you turn to look at something, does your child look to see what you're looking at?",
    category: 'joint_attention',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child follow your gaze or pointing?"
  },
  {
    id: 17,
    question: "Does your child try to get you to watch what they're doing?",
    category: 'joint_attention',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child try to get your attention to show you things?"
  },
  {
    id: 18,
    question: "Does your child understand when you tell them to do something?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 0,
    scoreForYes: 1, // YES scores 1 point
    followUpQuestion: "Does your child follow simple instructions like 'come here' or 'give me'?"
  },
  {
    id: 19,
    question: "Does your child sometimes stare at nothing or wander with no purpose?",
    category: 'repetitive_behavior',
    expectedResponse: 'no',
    scoreForNo: 0,
    scoreForYes: 1, // YES scores 1 point
    followUpQuestion: "Does your child seem to 'zone out' or stare into space?"
  },
  {
    id: 20,
    question: "When faced with something new, does your child look at your face to check your reaction?",
    category: 'social_communication',
    expectedResponse: 'yes',
    scoreForNo: 1, // NO scores 1 point
    scoreForYes: 0,
    followUpQuestion: "Does your child look at you to see how you react to new things?"
  }
];

// Scoring function
export function calculateMCHATScore(responses: { questionId: number; answer: 'yes' | 'no' | 'sometimes' }[]): number {
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

// Risk stratification
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 2) return 'low';
  if (score <= 7) return 'medium';
  return 'high';
}

// Get follow-up questions for a specific question
export function getFollowUpQuestion(questionId: number, answer: string): string | null {
  const question = MCHAT_QUESTIONS.find(q => q.id === questionId);
  if (!question || !question.followUpQuestion) return null;
  
  // Only ask follow-up for certain answers
  if (question.expectedResponse === 'yes' && answer === 'no') {
    return question.followUpQuestion || null;
  }
  if (question.expectedResponse === 'no' && answer === 'yes') {
    return question.followUpQuestion || null;
  }
  return null;
}