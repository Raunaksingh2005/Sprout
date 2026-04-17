'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { SuggestedPrompts } from './SuggestedPrompts';
import { DisclaimerBanner } from './DisclaimerBanner';
import { ChatHeader } from './ChatHeader';
import { useChat } from '@/hooks/useChat';

export function ChatContainer() {
  const {
    messages,
    isLoading,
    sendMessage,
    suggestedPrompts,
    isTyping
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    await sendMessage(content);
    setInput('');
  };

  const handleQuickReply = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader />
      
      <DisclaimerBanner />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                I'm your AutiScan Assistant
              </h2>
              <p className="text-gray-600 mb-6">
                I can help you understand early signs of autism, developmental milestones, 
                and guide you through the screening process.
              </p>
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-3">I can help with:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedPrompts.general.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(prompt)}
                      className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} isUser={message.role === 'user'} />
            ))
          )}
          
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <SuggestedPrompts 
            prompts={suggestedPrompts.general} 
            onSelect={handleQuickReply}
          />
          <MessageInput 
            value={input}
            onChange={setInput}
            onSend={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}