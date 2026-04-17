'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mic, Smile } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder = "Type your message here..." 
}: MessageInputProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value.trim());
        onChange('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onInput={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.height = 'auto';
              textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
            }}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                isRecording ? 'text-red-500' : 'text-gray-500'
              }`}
              title="Voice input"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          className="ml-2 px-6"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}