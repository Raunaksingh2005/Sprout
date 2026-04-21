// AQ-10 — Autism Spectrum Quotient (10-item version)
// Validated for adults and adolescents aged 12+
// Score ≥ 6 = refer for further assessment
// Each question scored 1 if it indicates autism traits

export const AQ10_QUESTIONS = [
  {
    id: 1,
    text: "I often notice small sounds when others do not.",
    shortLabel: "Notices small sounds others miss",
    category: "attention",
    scoringDirection: "agree", // agree = 1 point
    observation: {
      pass: "Does not notice small sounds more than others",
      fail: "Often notices small sounds that others do not",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 2,
    text: "I usually concentrate more on the whole picture, rather than the small details.",
    shortLabel: "Focuses on whole picture vs details",
    category: "attention",
    scoringDirection: "disagree", // disagree = 1 point
    observation: {
      pass: "Focuses on the whole picture rather than small details",
      fail: "Focuses more on small details than the whole picture",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 3,
    text: "In a social group, I can easily keep track of several different people's conversations.",
    shortLabel: "Tracks multiple conversations",
    category: "social",
    scoringDirection: "disagree",
    observation: {
      pass: "Can keep track of several conversations in a group",
      fail: "Struggles to track multiple conversations in a social group",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 4,
    text: "I find it easy to go back and forth between different activities.",
    shortLabel: "Switches between activities easily",
    category: "flexibility",
    scoringDirection: "disagree",
    observation: {
      pass: "Finds it easy to switch between different activities",
      fail: "Finds it difficult to switch between different activities",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 5,
    text: "I don't know how to keep a conversation going with my peers.",
    shortLabel: "Difficulty keeping conversation going",
    category: "social",
    scoringDirection: "agree",
    observation: {
      pass: "Can keep a conversation going with peers",
      fail: "Struggles to keep a conversation going with peers",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 6,
    text: "I am good at social chit-chat.",
    shortLabel: "Good at social small talk",
    category: "social",
    scoringDirection: "disagree",
    observation: {
      pass: "Good at social chit-chat and small talk",
      fail: "Struggles with social chit-chat",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 7,
    text: "When I'm reading a story, I find it difficult to work out the characters' intentions.",
    shortLabel: "Difficulty understanding characters' intentions",
    category: "imagination",
    scoringDirection: "agree",
    observation: {
      pass: "Can work out characters' intentions when reading",
      fail: "Finds it difficult to understand characters' intentions in stories",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 8,
    text: "I like to collect information about categories of things (e.g. types of car, types of bird, types of train, types of plant, etc.).",
    shortLabel: "Collects information about categories",
    category: "behavior",
    scoringDirection: "agree",
    observation: {
      pass: "Does not have an unusual interest in collecting categorical information",
      fail: "Likes to collect information about categories of things",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 9,
    text: "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    shortLabel: "Reads facial expressions easily",
    category: "social",
    scoringDirection: "disagree",
    observation: {
      pass: "Can read emotions from facial expressions",
      fail: "Finds it difficult to read what someone is thinking from their face",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
  {
    id: 10,
    text: "I find it difficult to work out people's intentions.",
    shortLabel: "Difficulty understanding intentions",
    category: "social",
    scoringDirection: "agree",
    observation: {
      pass: "Can generally work out people's intentions",
      fail: "Finds it difficult to work out what people intend",
    },
    options: [
      { label: "Definitely agree",    value: "definitely_agree" },
      { label: "Slightly agree",      value: "slightly_agree" },
      { label: "Slightly disagree",   value: "slightly_disagree" },
      { label: "Definitely disagree", value: "definitely_disagree" },
    ],
  },
];

// AQ-10 scoring: "definitely/slightly agree" on agree-direction = 1 point
// "definitely/slightly disagree" on disagree-direction = 1 point
export function scoreAQ10Answer(questionId: number, answer: string): number {
  const q = AQ10_QUESTIONS.find(q => q.id === questionId);
  if (!q) return 0;
  if (q.scoringDirection === 'agree') {
    return (answer === 'definitely_agree' || answer === 'slightly_agree') ? 1 : 0;
  } else {
    return (answer === 'definitely_disagree' || answer === 'slightly_disagree') ? 1 : 0;
  }
}

export const AQ10_CATEGORIES = {
  social:       { label: 'Social Interaction',  color: [99, 102, 241]  as [number,number,number] },
  attention:    { label: 'Attention to Detail', color: [236, 72, 153]  as [number,number,number] },
  flexibility:  { label: 'Flexibility',         color: [245, 158, 11]  as [number,number,number] },
  imagination:  { label: 'Imagination',         color: [20, 184, 166]  as [number,number,number] },
  behavior:     { label: 'Behavior Patterns',   color: [59, 130, 246]  as [number,number,number] },
};
