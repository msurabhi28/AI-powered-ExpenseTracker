import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, Coins } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '../../hooks/useChat';

export function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg 
                   hover:bg-blue-700 transition-colors z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed right-4 bottom-4 bg-white dark:bg-blue-950 rounded-2xl shadow-2xl 
                  flex flex-col transition-all duration-300 z-50 ${
                    isMaximized 
                      ? 'left-4 top-4' 
                      : 'w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)]'
                  }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Penny</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
          >
            {isMaximized ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isTyping={index === messages.length - 1 && isLoading}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-100 dark:border-blue-800">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}