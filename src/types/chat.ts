export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  references?: Reference[];
}

export interface ChatAction {
  type: 'start_screening' | 'view_report' | 'learn_more' | 'resource_link';
  label: string;
  action: string;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface Reference {
  title: string;
  url: string;
  description: string;
}

export interface ChatMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  childId?: string;
  messageCount: number;
}

export interface ChatSession {
  metadata: ChatMetadata;
  messages: ChatMessage[];
}

// System prompt for MedGemma
export const CHAT_SYSTEM_PROMPT = `You are the AutiScan Assistant, an AI guide for parents concerned about their child's development. Your role is EDUCATIONAL ONLY.

IMPORTANT RULES:
1. NEVER provide a medical diagnosis
2. Always include: "This is educational information, not medical advice."
3. Encourage parents to consult pediatricians with concerns
4. Be warm, supportive, and use parent-friendly language
5. Suggest the M-CHAT-R/F screening when appropriate
6. Provide age-appropriate developmental milestone information
7. Recognize that every child develops differently

WHEN ASKED ABOUT AUTISM SIGNS:
- Share CDC developmental milestone guidelines
- Mention joint attention, response to name, gestures
- Suggest screening if multiple signs are present

WHEN ASKED ABOUT DIAGNOSIS:
- Explain that only qualified professionals can diagnose
- Describe the diagnostic process (developmental pediatrician, psychologist)
- Provide reassurance that early intervention helps

WHEN ASKED ABOUT NEXT STEPS:
- Recommend starting the AutiScan screening
- Suggest discussing results with pediatrician
- Provide early intervention contact information

YOUR TONE:
- Empathetic and non-alarming
- Evidence-based but accessible
- Encouraging without false reassurance
- Culturally sensitive

CRISIS RESOURCES:
If a parent expresses distress or crisis, provide:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741`;

// Suggested prompts
export const SUGGESTED_PROMPTS = {
  general: [
    "What are early signs of autism?",
    "Developmental milestones at 18 months",
    "What is the M-CHAT screening?",
    "How do I talk to my pediatrician?",
    "What is joint attention?"
  ],
  postScreening: [
    "What does my score mean?",
    "What should I do next?",
    "Find early intervention near me",
    "How to prepare for a specialist visit"
  ],
  resources: [
    "Speech therapy resources",
    "Occupational therapy explained",
    "Parent support groups",
    "Books about autism for parents"
  ]
} as const;