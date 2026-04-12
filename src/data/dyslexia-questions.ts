// Dyslexia screening based on the Dyslexia Checklist (adapted from BDA and EDA guidelines)
// Suitable for children aged 5-12 years

export const DYSLEXIA_QUESTIONS = [
  {
    id: 1,
    text: "Has difficulty learning the alphabet, nursery rhymes, or songs",
    shortLabel: "Difficulty learning alphabet or rhymes",
    category: "phonological",
    observation: {
      concern: "Struggles to learn the alphabet, nursery rhymes, or songs compared to peers",
      ok: "Learns the alphabet, rhymes, and songs at an expected pace",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 2,
    text: "Has difficulty identifying or producing rhyming words",
    shortLabel: "Difficulty with rhyming",
    category: "phonological",
    observation: {
      concern: "Struggles to identify or produce rhyming words",
      ok: "Can identify and produce rhyming words",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 3,
    text: "Has difficulty blending sounds together to make words",
    shortLabel: "Difficulty blending sounds",
    category: "phonological",
    observation: {
      concern: "Struggles to blend individual sounds together to form words",
      ok: "Can blend sounds together to form words",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 4,
    text: "Confuses letters that look similar (e.g., b/d, p/q, m/n)",
    shortLabel: "Confuses similar-looking letters",
    category: "reading",
    observation: {
      concern: "Frequently confuses visually similar letters such as b/d, p/q, or m/n",
      ok: "Generally distinguishes between similar-looking letters",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 5,
    text: "Reads slowly or hesitantly, losing their place on the page",
    shortLabel: "Slow or hesitant reading",
    category: "reading",
    observation: {
      concern: "Reads slowly, hesitantly, or frequently loses their place on the page",
      ok: "Reads at an expected pace for their age",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 6,
    text: "Omits, adds, or substitutes words when reading aloud",
    shortLabel: "Omits or substitutes words when reading",
    category: "reading",
    observation: {
      concern: "Frequently omits, adds, or substitutes words when reading aloud",
      ok: "Reads words accurately when reading aloud",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 7,
    text: "Has difficulty understanding what they have just read",
    shortLabel: "Poor reading comprehension",
    category: "reading",
    observation: {
      concern: "Struggles to understand or recall what they have just read",
      ok: "Generally understands what they have read",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 8,
    text: "Has messy or inconsistent handwriting",
    shortLabel: "Messy or inconsistent handwriting",
    category: "writing",
    observation: {
      concern: "Handwriting is frequently messy, inconsistent, or difficult to read",
      ok: "Handwriting is reasonably consistent for their age",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 9,
    text: "Has difficulty spelling common words, even after practice",
    shortLabel: "Difficulty spelling common words",
    category: "writing",
    observation: {
      concern: "Struggles to spell common words correctly, even after repeated practice",
      ok: "Spells common words at an expected level for their age",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 10,
    text: "Writes letters or numbers in reverse (e.g., writing 'b' as 'd')",
    shortLabel: "Reverses letters or numbers",
    category: "writing",
    observation: {
      concern: "Frequently writes letters or numbers in reverse beyond the expected age",
      ok: "Does not frequently reverse letters or numbers",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 11,
    text: "Has difficulty remembering sequences (e.g., days of the week, months, times tables)",
    shortLabel: "Difficulty remembering sequences",
    category: "memory",
    observation: {
      concern: "Struggles to remember sequences like days of the week, months, or times tables",
      ok: "Can remember common sequences at an expected level",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 12,
    text: "Has difficulty following multi-step instructions",
    shortLabel: "Difficulty following multi-step instructions",
    category: "memory",
    observation: {
      concern: "Struggles to follow instructions with multiple steps",
      ok: "Can follow multi-step instructions appropriately for their age",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 13,
    text: "Has difficulty telling left from right",
    shortLabel: "Confusion with left and right",
    category: "spatial",
    observation: {
      concern: "Frequently confuses left and right beyond the expected age",
      ok: "Can distinguish left from right for their age",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 14,
    text: "Has difficulty with tasks involving time (e.g., telling the time, being on time)",
    shortLabel: "Difficulty with time concepts",
    category: "spatial",
    observation: {
      concern: "Struggles with time-related tasks such as telling the time or managing time",
      ok: "Manages time-related tasks at an expected level",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
  {
    id: 15,
    text: "Shows a significant gap between verbal ability and written work",
    shortLabel: "Gap between verbal and written ability",
    category: "processing",
    observation: {
      concern: "Verbal ability is noticeably stronger than written work",
      ok: "Verbal and written abilities are broadly consistent",
    },
    options: [
      { label: "Not at all", value: "0" },
      { label: "Sometimes", value: "1" },
      { label: "Often", value: "2" },
    ],
    threshold: 1,
  },
];

export const DYSLEXIA_CATEGORIES = {
  phonological: { label: 'Phonological Awareness', color: [99, 102, 241] as [number,number,number] },
  reading: { label: 'Reading', color: [236, 72, 153] as [number,number,number] },
  writing: { label: 'Writing & Spelling', color: [245, 158, 11] as [number,number,number] },
  memory: { label: 'Memory & Sequencing', color: [20, 184, 166] as [number,number,number] },
  spatial: { label: 'Spatial Awareness', color: [59, 130, 246] as [number,number,number] },
  processing: { label: 'Processing Speed', color: [16, 185, 129] as [number,number,number] },
};
