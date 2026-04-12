import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { Request, Response } from 'express';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

// CORS configuration
const corsHandler = cors({ origin: true });

// Cloud Function to process M-CHAT screening
export const processScreening = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { childId, responses, childAgeMonths } = data;
  const userId = context.auth.uid;

  try {
    // Calculate score
    const score = calculateMCHATScore(responses);
    const riskLevel = calculateRiskLevel(score);
    
    // Store screening result
    const screeningRef = db.collection('screenings').doc();
    const screeningData = {
      userId,
      childId,
      responses,
      score,
      riskLevel: riskLevel,
      childAgeMonths,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    };

    await screeningRef.set(screeningData);

    // Generate AI report
    const report = await generateAIReport(screeningData);
    
    // Store report
    const reportRef = db.collection('reports').doc();
    await reportRef.set({
      screeningId: screeningRef.id,
      userId,
      childId,
      report,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { 
      success: true, 
      screeningId: screeningRef.id,
      reportId: reportRef.id,
      score,
      riskLevel
    };
  } catch (error) {
    console.error('Error processing screening:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process screening');
  }
});

// Function to calculate M-CHAT score
function calculateMCHATScore(responses: any[]): number {
  let score = 0;
  // Scoring logic based on M-CHAT-R/F
  responses.forEach((response: any) => {
    // Add scoring logic based on M-CHAT-R/F scoring rules
    if (response.answer === 'no' && response.expected === 'yes') {
      score += 1;
    }
  });
  return score;
}

function calculateRiskLevel(score: number): string {
  if (score <= 2) return 'low';
  if (score <= 7) return 'medium';
  return 'high';
}

async function generateAIReport(screeningData: any): Promise<any> {
  // This would integrate with MedGemma-4B-IT or similar AI model
  // For now, return a mock report
  return {
    summary: `Based on the M-CHAT-R/F screening, the child shows ${screeningData.riskLevel} risk.`,
    recommendations: [
      'Continue routine developmental monitoring',
      'Discuss results with pediatrician',
      'Consider developmental screening'
    ],
    riskFactors: [],
    followUpActions: []
  };
}

// Function to process audio/video uploads
export const processMediaUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  
  // Process audio/video files for analysis
  if (filePath.startsWith('audio/') || filePath.startsWith('video/')) {
    // Trigger AI analysis
    // This would call your AI service for speech/behavior analysis
    console.log(`Processing media file: ${filePath}`);
  }
  
  return null;
});

// Scheduled function for cleanup
export const cleanupOldData = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago
    
    // Delete old temporary files
    const files = await storage.bucket().getFiles({
      prefix: 'temp/'
    });
    
    for (const file of files) {
      const [metadata] = await file.getMetadata();
      const created = new Date(metadata.timeCreated);
      
      if (created < cutoffDate) {
        await file.delete();
      }
    }
  });

// Export all functions
export { processScreening, processMediaUpload, cleanupOldData };