import { functions } from '@/lib/firebase/client';
import { httpsCallable } from 'firebase/functions';

export interface ChatRequest {
  message: string;
  chatId?: string;
  childId?: string;
  includeScreeningContext?: boolean;
}

export interface ChatResponse {
  message: string;
  actions?: Array<{
    type: string;
    label: string;
    action: string;
  }>;
  suggestedPrompts?: string[];
}

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    // In a real implementation, this would call a Firebase Cloud Function
    // For now, we'll simulate a response
    return {
      message: `I'm your AutiScan Assistant. I can help you understand early signs of autism, developmental milestones, and guide you through the screening process. How can I help you today?`,
      actions: [
        {
          type: 'start_screening',
          label: 'Start Screening',
          action: '/screening/new'
        }
      ],
      suggestedPrompts: [
        'What are early signs of autism?',
        'How does the screening work?',
        'What is the M-CHAT-R/F?'
      ]
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Mock function for development
export const mockChatResponse = (message: string): ChatResponse => {
  const responses = {
    greeting: "Hello! I'm your AutiScan Assistant. I can help you understand early signs of autism, developmental milestones, and guide you through the screening process.",
    screening: "The M-CHAT-R/F is a validated screening tool for autism in toddlers. It consists of 20 questions about your child's behavior and development.",
    resources: "I can help you find local resources, including developmental pediatricians, speech therapists, and early intervention programs in your area."
  };

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('sign') || lowerMessage.includes('early sign')) {
    return {
      message: "Early signs of autism can include limited eye contact, delayed speech, lack of pointing or gesturing, and limited social engagement. However, it's important to remember that every child develops at their own pace. Would you like to start a screening to learn more about your child's development?",
      actions: [
        {
          type: 'start_screening',
          label: 'Start Screening',
          action: '/screening/new'
        }
      ]
    };
  }

  if (lowerMessage.includes('screening') || lowerMessage.includes('test')) {
    return {
      message: "The M-CHAT-R/F (Modified Checklist for Autism in Toddlers, Revised with Follow-up) is a 20-question screening tool for children 16-30 months. It helps identify children who should receive a more thorough assessment. Would you like to start the screening?",
      actions: [
        {
          type: 'start_screening',
          label: 'Start Screening',
          action: '/screening/new'
        }
      ]
    };
  }

  return {
    message: "I'm here to help you understand autism screening and child development. You can ask me about developmental milestones, early signs, or start a screening to learn more about your child's development.",
    actions: [
      {
        type: 'learn_more',
        label: 'Learn About Autism',
        action: '/learn'
      }
    ]
  };
};