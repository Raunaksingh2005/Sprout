// ADHD screening based on Vanderbilt Assessment Scale (parent form)
// Adapted for children aged 4-12 years

export const ADHD_QUESTIONS = [
  {
    id: 1,
    text: "Fails to give close attention to details or makes careless mistakes in schoolwork or activities",
    shortLabel: "Careless mistakes / inattention to detail",
    category: "inattention",
    observation: {
      concern: "Makes frequent careless mistakes or struggles to pay close attention to details",
      ok: "Generally attentive to details in tasks and activities",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2, // score >= threshold = concern
  },
  {
    id: 2,
    text: "Has difficulty sustaining attention in tasks or play activities",
    shortLabel: "Difficulty sustaining attention",
    category: "inattention",
    observation: {
      concern: "Struggles to maintain focus during tasks or play for age-appropriate periods",
      ok: "Can sustain attention during tasks and play activities",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 3,
    text: "Does not seem to listen when spoken to directly",
    shortLabel: "Doesn't listen when spoken to",
    category: "inattention",
    observation: {
      concern: "Often appears not to listen when spoken to directly",
      ok: "Generally listens and responds when spoken to directly",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 4,
    text: "Does not follow through on instructions and fails to finish tasks",
    shortLabel: "Doesn't follow through on tasks",
    category: "inattention",
    observation: {
      concern: "Frequently fails to follow through on instructions or complete tasks",
      ok: "Generally follows through on instructions and completes tasks",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 5,
    text: "Has difficulty organising tasks and activities",
    shortLabel: "Difficulty organising tasks",
    category: "inattention",
    observation: {
      concern: "Struggles to organise tasks, activities, or belongings",
      ok: "Can organise tasks and activities reasonably well for their age",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 6,
    text: "Avoids, dislikes, or is reluctant to engage in tasks requiring sustained mental effort",
    shortLabel: "Avoids mentally demanding tasks",
    category: "inattention",
    observation: {
      concern: "Avoids or strongly dislikes tasks that require sustained mental effort",
      ok: "Willing to engage in mentally demanding tasks",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 7,
    text: "Loses things necessary for tasks or activities (e.g., toys, pencils, books)",
    shortLabel: "Loses items frequently",
    category: "inattention",
    observation: {
      concern: "Frequently loses items needed for tasks or activities",
      ok: "Generally keeps track of belongings",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 8,
    text: "Is easily distracted by outside stimuli",
    shortLabel: "Easily distracted",
    category: "inattention",
    observation: {
      concern: "Easily distracted by sounds, movement, or other external stimuli",
      ok: "Can filter out distractions reasonably well",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 9,
    text: "Is forgetful in daily activities",
    shortLabel: "Forgetful in daily activities",
    category: "inattention",
    observation: {
      concern: "Frequently forgetful in daily routines and activities",
      ok: "Generally remembers daily routines and activities",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 10,
    text: "Fidgets with hands or feet or squirms in seat",
    shortLabel: "Fidgets or squirms",
    category: "hyperactivity",
    observation: {
      concern: "Frequently fidgets with hands/feet or squirms when seated",
      ok: "Can sit reasonably still for age-appropriate periods",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 11,
    text: "Leaves seat in situations when remaining seated is expected",
    shortLabel: "Leaves seat unexpectedly",
    category: "hyperactivity",
    observation: {
      concern: "Frequently leaves seat in situations where staying seated is expected",
      ok: "Generally stays seated when expected",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 12,
    text: "Runs about or climbs excessively in situations where it is inappropriate",
    shortLabel: "Excessive running or climbing",
    category: "hyperactivity",
    observation: {
      concern: "Runs or climbs excessively in inappropriate situations",
      ok: "Generally controls physical activity in appropriate settings",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 13,
    text: "Has difficulty playing or engaging in leisure activities quietly",
    shortLabel: "Difficulty playing quietly",
    category: "hyperactivity",
    observation: {
      concern: "Struggles to play or engage in activities quietly",
      ok: "Can play quietly when the situation calls for it",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 14,
    text: "Is 'on the go' or acts as if 'driven by a motor'",
    shortLabel: "Constantly 'on the go'",
    category: "hyperactivity",
    observation: {
      concern: "Seems constantly in motion, as if driven by a motor",
      ok: "Activity level is appropriate for their age",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 15,
    text: "Talks excessively",
    shortLabel: "Talks excessively",
    category: "hyperactivity",
    observation: {
      concern: "Talks excessively beyond what is typical for their age",
      ok: "Talking is appropriate for their age and situation",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 16,
    text: "Blurts out answers before questions have been completed",
    shortLabel: "Blurts out answers",
    category: "impulsivity",
    observation: {
      concern: "Frequently blurts out answers before questions are finished",
      ok: "Generally waits for questions to be completed before answering",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 17,
    text: "Has difficulty waiting their turn",
    shortLabel: "Difficulty waiting turn",
    category: "impulsivity",
    observation: {
      concern: "Struggles to wait their turn in games or group situations",
      ok: "Can wait their turn appropriately",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
  {
    id: 18,
    text: "Interrupts or intrudes on others (e.g., butts into conversations or games)",
    shortLabel: "Interrupts or intrudes on others",
    category: "impulsivity",
    observation: {
      concern: "Frequently interrupts conversations or intrudes on others' activities",
      ok: "Generally respects others' conversations and activities",
    },
    options: [
      { label: "Never", value: "0" },
      { label: "Occasionally", value: "1" },
      { label: "Often", value: "2" },
      { label: "Very often", value: "3" },
    ],
    threshold: 2,
  },
];

export const ADHD_CATEGORIES = {
  inattention: { label: 'Inattention', color: [99, 102, 241] as [number,number,number] },
  hyperactivity: { label: 'Hyperactivity', color: [236, 72, 153] as [number,number,number] },
  impulsivity: { label: 'Impulsivity', color: [245, 158, 11] as [number,number,number] },
};
