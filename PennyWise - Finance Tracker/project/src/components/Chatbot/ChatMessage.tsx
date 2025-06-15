import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </div>
      )}
      
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isBot 
          ? 'bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
          : 'bg-blue-600 dark:bg-blue-700 text-white'
      }`}>
        {isTyping ? (
          <div className="flex gap-2 py-2">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              code: ({ children }) => (
                <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}