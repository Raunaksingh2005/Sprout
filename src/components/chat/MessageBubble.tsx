'use client';

import { ChatMessage } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  User, 
  Bot, 
  PlayCircle, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-3xl mx-auto`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
          }`}>
            {isUser ? (
              <User className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'order-1 text-right' : 'order-2'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}>
            {/* Message content with markdown support */}
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
            
            {/* Actions */}
            {message.actions && message.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant === 'primary' ? 'default' : 'outline'}
                    className="text-xs"
                    onClick={() => handleAction(action.action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            
            {/* References */}
            {message.references && message.references.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">References:</p>
                {message.references.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {ref.title}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TypingIndicatorProps {
  isTyping: boolean;
}

export function TypingIndicator({ isTyping }: TypingIndicatorProps) {
  if (!isTyping) return null;
  
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <span>Assistant is typing...</span>
    </div>
  );
}

interface DisclaimerBannerProps {
  className?: string;
}

export function DisclaimerBanner({ className = '' }: DisclaimerBannerProps) {
  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <span className="font-semibold">Important:</span> This AI assistant provides educational information only. 
            It is not a medical professional and cannot provide diagnoses. 
            Always consult with qualified healthcare providers for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}