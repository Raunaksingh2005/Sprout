// ASRS-v1.1 Screener — Adult ADHD Self-Report Scale
// Validated for ages 18+ (we use from 12+ as adolescent adaptation)
// Part A: 6 questions — most predictive of ADHD
// Score ≥ 4 on Part A = highly consistent with ADHD, refer for evaluation

export const ASRS_QUESTIONS = [
  {
    id: 1,
    text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    shortLabel: "Trouble finishing final details",
    category: "inattention",
    observation: {
      concern: "Frequently has trouble finishing the final details of projects",
      ok: "Generally able to wrap up final details of projects",
    },
    options: [
      { label: "Never",     value: "0" },
      { label: "Rarely",    value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Often",     value: "3" },
      { label: "Very often", value: "4" },
    ],
    threshold: 3, // "Often" or "Very often" = concern
  },
  {
    id: 2,
    text: "How often do you have difficulty getting things in order when you have to do a task that requires organisation?",
    shortLabel: "Difficulty organising tasks",
    category: "inattention",
    observation: {
      concern: "Frequently has difficulty organising tasks that require planning",
      ok: "Generally able to organise tasks effectively",
    },
    options: [
      { label: "Never",     value: "0" },
      { label: "Rarely",    value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Often",     value: "3" },
      { label: "Very often", value: "4" },
    ],
    threshold: 3,
  },
  {
    id: 3,
    text: "How often do you have problems remembering appointments or obligations?",
    shortLabel: "Forgets appointments or obligations",
    category: "inattention",
    observation: {
      concern: "Frequently forgets appointments or obligations",
      ok: "Generally remembers appointments and obligations",
    },
    options: [
      { label: "Never",     value: "0" },
      { label: "Rarely",    value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Often",     value: "3" },
      { label: "Very often", value: "4" },
    ],
    threshold: 3,
  },
  {
    id: 4,
    text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    shortLabel: "Avoids mentally demanding tasks",
    category: "inattention",
    observation: {
      concern: "Frequently avoids or delays starting tasks that require a lot of thought",
      ok: "Generally able to start mentally demanding tasks",
    },
    options: [
      { label: "Never",     value: "0" },
      { label: "Rarely",    value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Often",     value: "3" },
      { label: "Very often", value: "4" },
    ],
    threshold: 3,
  },
  {
    id: 5,
    text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    shortLabel: "Fidgets when sitting for long periods",
    category: "hyperactivity",
    observation: {
      concern: "Frequently fidgets or squirms when required to sit for long periods",
      ok: "Generally able to sit still for appropriate periods",
    },
    options: [
      { label: "Never",     value: "0" },
      { label: "Rarely",    value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Often",     value: "3" },
      { label: "Very often", value: "4" },
    ],
    threshold: 3,
  },
  {
    id: 6,
    text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    shortLabel: "Feels driven by a motor",
    category: "hyperactivity",
    observation: {
      concern: "Frequently feels overly active or driven by a motor",
      ok: "Activity level is generally appropriate",
    },
    options: [
      { label: "Never",     value: "0" },
      { label: "Rarely",    value: "1" },
      { label: "Sometimes", value: "2" },
      { label: "Often",     value: "3" },
      { label: "Very often", value: "4" },
    ],
    threshold: 3,
  },
];

export const ASRS_CATEGORIES = {
  inattention:  { label: 'Inattention',  color: [99, 102, 241] as [number,number,number] },
  hyperactivity: { label: 'Hyperactivity', color: [236, 72, 153] as [number,number,number] },
};
