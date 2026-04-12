// M-CHAT-R/F: "Sometimes" maps to the FAIL answer per clinical scoring guidelines.
// If expected="yes", then "sometimes" = fail (same as "no").
// If expected="no", then "sometimes" = fail (same as "yes").
// We keep "Sometimes" as a UI option but score it as a concern.

export const MCHAT_QUESTIONS = [
  {
    id: 1,
    text: "If you point at something across the room, does your child look at it?",
    shortLabel: "Follows your point across the room",
    observation: {
      pass: "Follows your point to look at objects across the room",
      fail: "Does not follow your point to look at objects across the room",
    },
    category: "joint_attention",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 2,
    text: "Have you ever wondered if your child might be deaf?",
    shortLabel: "Hearing / sound response",
    observation: {
      pass: "Responds to sounds and voices as expected",
      fail: "Parent has concerns about hearing or sound response",
    },
    category: "social_communication",
    expected: "no",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 3,
    text: "Does your child pretend in play (e.g., care for dolls, talk on a toy phone)?",
    shortLabel: "Pretend / imaginative play",
    observation: {
      pass: "Engages in pretend and imaginative play",
      fail: "Limited or no pretend / imaginative play observed",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 4,
    text: "Does your child like climbing on things, such as stairs?",
    shortLabel: "Climbing and physical exploration",
    observation: {
      pass: "Enjoys climbing and physical exploration",
      fail: "Does not show interest in climbing or physical exploration",
    },
    category: "behavior",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 5,
    text: "Does your child make unusual finger movements near his/her eyes?",
    shortLabel: "Unusual repetitive hand/finger movements",
    observation: {
      pass: "No unusual repetitive finger or hand movements near eyes",
      fail: "Shows unusual repetitive finger or hand movements near eyes",
    },
    category: "behavior",
    expected: "no",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 6,
    text: "Does your child point with one finger to ask for something?",
    shortLabel: "Points to request objects",
    observation: {
      pass: "Points with one finger to request objects or help",
      fail: "Does not point with one finger to request objects",
    },
    category: "joint_attention",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 7,
    text: "Does your child point with one finger to show you something interesting?",
    shortLabel: "Points to share interest",
    observation: {
      pass: "Points to share interesting things with you",
      fail: "Does not point to share interest or show you things",
    },
    category: "joint_attention",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 8,
    text: "Is your child interested in other children?",
    shortLabel: "Interest in other children",
    observation: {
      pass: "Shows interest in and engages with other children",
      fail: "Shows limited interest in other children",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 9,
    text: "Does your child show you things by bringing or holding up objects for you to see?",
    shortLabel: "Brings objects to show parent",
    observation: {
      pass: "Brings or holds up objects to share with you",
      fail: "Does not bring or hold up objects to show you",
    },
    category: "joint_attention",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 10,
    text: "Does your child respond to his/her name when you call?",
    shortLabel: "Responds to own name",
    observation: {
      pass: "Responds consistently when their name is called",
      fail: "Does not consistently respond when their name is called",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 11,
    text: "When you smile at your child, does he/she smile back?",
    shortLabel: "Reciprocal smiling",
    observation: {
      pass: "Smiles back when you smile at them",
      fail: "Does not consistently smile back when smiled at",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 12,
    text: "Does your child get upset by everyday noises?",
    shortLabel: "Sensitivity to everyday sounds",
    observation: {
      pass: "Not unusually upset by everyday sounds",
      fail: "Gets upset or distressed by everyday noises",
    },
    category: "sensory",
    expected: "no",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 13,
    text: "Does your child walk?",
    shortLabel: "Walking / gross motor",
    observation: {
      pass: "Walks independently",
      fail: "Does not yet walk independently",
    },
    category: "motor",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 14,
    text: "Does your child make eye contact with you during play or dressing?",
    shortLabel: "Eye contact during interaction",
    observation: {
      pass: "Makes eye contact during play and daily routines",
      fail: "Limited eye contact during play or daily routines",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 15,
    text: "Does your child try to copy what you do?",
    shortLabel: "Imitates actions",
    observation: {
      pass: "Imitates and copies your actions and gestures",
      fail: "Does not imitate or copy your actions",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 16,
    text: "If you look at something across the room, does your child look at it too?",
    shortLabel: "Follows your gaze",
    observation: {
      pass: "Follows your gaze to look at things across the room",
      fail: "Does not follow your gaze to look at things",
    },
    category: "joint_attention",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 17,
    text: "Does your child try to get you to watch what he/she is doing?",
    shortLabel: "Seeks your attention during play",
    observation: {
      pass: "Tries to get your attention and share activities with you",
      fail: "Does not seek your attention or try to share activities",
    },
    category: "joint_attention",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 18,
    text: "Does your child understand when you tell him/her to do something?",
    shortLabel: "Follows simple instructions",
    observation: {
      pass: "Understands and follows simple verbal instructions",
      fail: "Does not consistently follow simple verbal instructions",
    },
    category: "language",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 19,
    text: "Does your child sometimes stare at nothing or wander with no purpose?",
    shortLabel: "Purposeless staring or wandering",
    observation: {
      pass: "Does not stare blankly or wander without purpose",
      fail: "Sometimes stares at nothing or wanders without purpose",
    },
    category: "behavior",
    expected: "no",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: 20,
    text: "When faced with something unfamiliar, does your child look at your face to see how you react?",
    shortLabel: "Social referencing",
    observation: {
      pass: "Looks at your face for reassurance in new situations",
      fail: "Does not look to your face for guidance in new situations",
    },
    category: "social_communication",
    expected: "yes",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
];
