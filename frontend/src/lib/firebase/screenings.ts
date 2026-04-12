import { db } from './firebase-client';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ScreeningData, ScreeningReport } from '@/types/screening';

const SCREENINGS_COLLECTION = 'screenings';
const REPORTS_COLLECTION = 'reports';

export interface ScreeningData {
  childId: string;
  parentId: string;
  mchatResponses: Array<{
    questionId: number;
    answer: 'yes' | 'no' | 'sometimes' | 'not_sure';
    followUpAnswer?: string;
  }>;
  totalScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'in_progress' | 'completed' | 'abandoned';
  createdAt: any;
  completedAt?: any;
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
}

export const saveScreening = async (screeningData: Omit<ScreeningData, 'createdAt'>) => {
  try {
    const screeningRef = collection(db, SCREENINGS_COLLECTION);
    const screeningWithTimestamp = {
      ...screeningData,
      createdAt: serverTimestamp(),
      status: 'completed' as const
    };
    
    const docRef = await addDoc(screeningRef, screeningWithTimestamp);
    return { id: docRef.id, ...screeningData };
  } catch (error) {
    console.error('Error saving screening:', error);
    throw error;
  }
};

export const getScreeningsByUser = async (userId: string) => {
  try {
    const screeningsRef = collection(db, SCREENINGS_COLLECTION);
    const q = query(
      screeningsRef,
      where('parentId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching screenings:', error);
    throw error;
  }
};

export const getScreeningById = async (screeningId: string) => {
  try {
    const screeningRef = doc(db, SCREENINGS_COLLECTION, screeningId);
    const screeningDoc = await getDoc(screeningRef);
    
    if (screeningDoc.exists()) {
      return { id: screeningDoc.id, ...screeningDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting screening:', error);
    throw error;
  }
};

export const generateReport = async (screeningId: string, screeningData: ScreeningData) => {
  try {
    // Calculate risk level based on M-CHAT score
    const riskLevel = screeningData.riskLevel;
    const mchatScore = screeningData.totalScore;
    
    // Generate AI summary (in production, this would call an AI service)
    const aiSummary = generateAISummary(screeningData);
    
    const reportData = {
      screeningId,
      childId: screeningData.childId,
      parentId: screeningData.parentId,
      riskLevel,
      mchatScore: screeningData.totalScore,
      recommendations: generateRecommendations(riskLevel, mchatScore),
      aiSummary,
      followUpActions: generateFollowUpActions(riskLevel),
      createdAt: serverTimestamp()
    };
    
    const reportsRef = collection(db, REPORTS_COLLECTION);
    const reportRef = await addDoc(reportsRef, reportData);
    
    return { id: reportRef.id, ...reportData };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Helper functions
const generateAISummary = (screeningData: ScreeningData): string => {
  const { riskLevel, totalScore } = screeningData;
  
  const summaries = {
    low: `Based on the M-CHAT-R screening, the results indicate a low risk for autism spectrum disorder. The score of ${totalScore} suggests typical development in the areas assessed. Continue monitoring development and consult with a pediatrician during regular check-ups.`,
    medium: `The screening results suggest some developmental concerns. A score of ${totalScore} indicates that further evaluation may be beneficial. Consider discussing these results with a healthcare provider for a more comprehensive assessment.`,
    high: `The screening results indicate a higher likelihood of developmental concerns. A score of ${totalScore} suggests that a comprehensive evaluation by a specialist may be warranted. Please consult with a developmental pediatrician or specialist for further assessment.`
  };
  
  return summaries[riskLevel] || summaries.medium;
};

const generateRecommendations = (riskLevel: string, mchatScore: number): string[] => {
  const recommendations = [];
  
  if (riskLevel === 'low') {
    recommendations.push(
      'Continue routine developmental monitoring',
      'Schedule regular pediatric check-ups',
      'Engage in age-appropriate play and social activities'
    );
  } else if (riskLevel === 'medium') {
    recommendations.push(
      'Schedule a developmental screening with your pediatrician',
      'Consider a comprehensive developmental evaluation',
      'Engage in early intervention services if available'
    );
  } else {
    recommendations.push(
      'Schedule an appointment with a developmental pediatrician',
      'Request a comprehensive developmental evaluation',
      'Consider early intervention services',
      'Discuss results with your pediatrician immediately'
    );
  }
  
  return recommendations;
};

const generateFollowUpActions = (riskLevel: string): string[] => {
  const actions = [];
  
  if (riskLevel === 'high') {
    actions.push(
      'Schedule developmental evaluation within 1 month',
      'Contact early intervention services',
      'Schedule follow-up with pediatrician'
    );
  } else if (riskLevel === 'medium') {
    actions.push(
      'Schedule developmental screening within 3 months',
      'Monitor development closely',
      'Consider developmental screening tools'
    );
  } else {
    actions.push(
      'Continue routine developmental monitoring',
      'Schedule next well-child visit',
      'Continue to monitor developmental milestones'
    );
  }
  
  return actions;
};