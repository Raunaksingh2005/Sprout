// Firebase data models for AutiScan

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'parent' | 'clinician' | 'admin';
  createdAt: FirebaseFirestore.Timestamp;
  lastLoginAt: FirebaseFirestore.Timestamp;
  children: string[]; // Array of child document IDs
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  dateOfBirth: FirebaseFirestore.Timestamp;
  gender: 'male' | 'female' | 'other';
  gestationalAgeAtBirth: number; // in weeks
  birthWeight: number; // in grams
  developmentalConcerns?: string[];
  medicalHistory?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface MCHATQuestion {
  id: number;
  text: string;
  category: 'joint_attention' | 'social_communication' | 'repetitive_behavior' | 'sensory';
  expectedResponse: 'yes' | 'no' | 'sometimes';
  score: number; // 0 or 1 based on response
  followUpQuestion?: string;
}

export interface MCHATResponse {
  questionId: number;
  answer: 'yes' | 'no' | 'sometimes' | 'not_sure';
  followUpAnswer?: string;
  timestamp: FirebaseFirestore.Timestamp;
}

export interface ScreeningSession {
  id: string;
  childId: string;
  parentId: string;
  mchatResponses: MCHATResponse[];
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  completedAt: FirebaseFirestore.Timestamp;
  status: 'in_progress' | 'completed' | 'abandoned';
  followUpNeeded: boolean;
  recommendedAction: 'monitor' | 'follow_up' | 'referral';
  createdAt: FirebaseFirestore.Timestamp;
}

export interface SpeechAnalysis {
  id: string;
  childId: string;
  audioFileUrl: string;
  duration: number; // in seconds
  wordCount: number;
  meanLengthOfUtterance: number;
  typeTokenRatio: number; // Vocabulary diversity
  pronounReversals: number;
  echolaliaScore: number; // 0-1 scale
  linguisticFeatures: {
    mlu: number; // Mean Length of Utterance
    ttr: number; // Type-Token Ratio
    pronounErrors: number;
    echolaliaScore: number;
  };
  processedAt: FirebaseFirestore.Timestamp;
  aiAnalysis: {
    riskScore: number;
    confidence: number;
    recommendations: string[];
  };
}

export interface VideoAnalysis {
  id: string;
  childId: string;
  videoUrl: string;
  duration: number; // in seconds
  gazeAnalysis: {
    faceAttentionScore: number; // 0-1, attention to faces
    objectAttentionScore: number; // 0-1, attention to objects
    jointAttentionScore: number; // 0-1, joint attention events
    gazeShiftsPerMinute: number;
  };
  behavioralMetrics: {
    socialSmiles: number;
    eyeContactDuration: number;
    responseToName: number; // 0-1 scale
    jointAttentionAttempts: number;
  };
  processedAt: FirebaseFirestore.Timestamp;
}

export interface ScreeningReport {
  id: string;
  childId: string;
  screeningId: string;
  riskLevel: 'low' | 'medium' | 'high';
  mchatScore: number;
  speechAnalysisScore?: number;
  videoAnalysisScore?: number;
  overallRiskScore: number; // 0-100
  recommendations: {
    immediateActions: string[];
    followUpTimeline: string;
    specialistReferral: boolean;
    recommendedAssessments: string[];
  };
  generatedAt: FirebaseFirestore.Timestamp;
  sharedWithClinician: boolean;
  clinicianNotes?: string;
}

export interface ClinicianReview {
  id: string;
  clinicianId: string;
  reportId: string;
  childId: string;
  reviewNotes: string;
  confidenceScore: number; // 0-100
  referralRecommendation: 'monitor' | 'assessment' | 'urgent_referral';
  reviewedAt: FirebaseFirestore.Timestamp;
}