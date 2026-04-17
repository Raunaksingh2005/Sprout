'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, SUGGESTED_PROMPTS } from '@/types/chat';
import { sendChatMessage } from '@/lib/api/chat';

export function useChat(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState({
    general: SUGGESTED_PROMPTS.general,
    postScreening: SUGGESTED_PROMPTS.postScreening,
    resources: SUGGESTED_PROMPTS.resources
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage({
        message: content,
        chatId: getCurrentChatId(),
        includeScreeningContext: true
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update suggested prompts based on context
      if (content.toLowerCase().includes('screening') || content.toLowerCase().includes('result')) {
        setSuggestedPrompts(prev => ({ ...prev, general: SUGGESTED_PROMPTS.postScreening }));
      } else if (content.toLowerCase().includes('resource') || content.toLowerCase().includes('help')) {
        setSuggestedPrompts(prev => ({ ...prev, general: SUGGESTED_PROMPTS.resources }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chat_messages');
  }, []);

  const exportChat = useCallback(() => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `autiscan-chat-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [messages]);

  return {
    messages,
    sendMessage,
    clearChat,
    exportChat,
    isLoading,
    isTyping,
    suggestedPrompts
  };
}

function getCurrentChatId(): string {
  if (typeof window !== 'undefined') {
    const chatId = localStorage.getItem('current_chat_id');
    if (chatId) return chatId;
  }
  return 'default-chat';
}