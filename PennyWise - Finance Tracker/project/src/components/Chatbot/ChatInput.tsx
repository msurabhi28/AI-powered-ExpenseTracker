import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUERIES = [
  "What's my current savings rate?",
  "Show my recent food expenses",
  "How much did I spend on entertainment last month?",
  "Give me advice on my spending habits",
  "Find transactions related to groceries",
  "What's my total monthly income including additional sources?"
];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceSupported] = useState('webkitSpeechRecognition' in window);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const toggleVoiceInput = () => {
    if (!isVoiceSupported) return;

    if (!isRecording) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        setMessage(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={EXAMPLE_QUERIES[currentExampleIndex]}
          className="w-full resize-none rounded-xl px-4 py-3 pr-12 bg-blue-50 dark:bg-blue-900 
                     border border-blue-200 dark:border-blue-700 focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent dark:text-blue-100
                     placeholder:text-blue-400/60 dark:placeholder:text-blue-500/60
                     min-h-[44px] max-h-32"
          rows={1}
          disabled={isLoading}
        />
      </div>

      {isVoiceSupported && (
        <button
          type="button"
          onClick={toggleVoiceInput}
          className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900 border border-blue-200 
                     dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-100 
                     dark:hover:bg-blue-800 transition-colors"
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      )}

      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}