'use client';

interface SuggestedPromptsProps {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
  title?: string;
}

export function SuggestedPrompts({ prompts, onSelect, title = "Suggested questions:" }: SuggestedPromptsProps) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}