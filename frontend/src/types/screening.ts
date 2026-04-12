export interface MCHATResponse {
  questionId: number;
  answer: 'yes' | 'no' | 'sometimes' | 'not_sure';
  followUpAnswer?: string;
  timestamp?: string;
}

export interface ScreeningData {
  id?: string;
  childId: string;
  parentId: string;
  mchatResponses: MCHATResponse[];
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'in_progress' | 'completed' | 'abandoned';
  createdAt: any;
  completedAt?: any;
  followUpNeeded?: boolean;
  recommendedAction?: 'monitor' | 'follow_up' | 'referral';
}

export interface ScreeningReport {
  id?: string;
  screeningId: string;
  childId: string;
  parentId: string;
  riskLevel: 'low' | 'medium' | 'high';
  mchatScore: number;
  recommendations: string[];
  aiSummary: string;
  followUpActions: string[];
  createdAt: any;
  sharedWithClinician?: boolean;
  clinicianNotes?: string;
}

export interface ChildProfile {
  id?: string;
  parentId: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  gestationalAgeAtBirth?: number;
  birthWeight?: number;
  developmentalConcerns?: string[];
  medicalHistory?: string;
  createdAt: any;
  updatedAt: any;
}

export interface SpeechAnalysis {
  id?: string;
  childId: string;
  audioFileUrl: string;
  duration: number;
  wordCount: number;
  meanLengthOfUtterance: number;
  typeTokenRatio: number;
  pronounReversals: number;
  echolaliaScore: number;
  processedAt: any;
  aiAnalysis?: {
    riskScore: number;
    confidence: number;
    recommendations: string[];
  };
}

export interface VideoAnalysis {
  id?: string;
  childId: string;
  videoUrl: string;
  duration: number;
  gazeAnalysis: {
    faceAttentionScore: number;
    objectAttentionScore: number;
    jointAttentionScore: number;
    gazeShiftsPerMinute: number;
  };
  behavioralMetrics: {
    socialSmiles: number;
    eyeContactDuration: number;
    responseToName: number;
    jointAttentionAttempts: number;
  };
  processedAt: any;
}