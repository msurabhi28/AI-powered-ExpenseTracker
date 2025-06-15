import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Mic } from 'lucide-react';

interface SpeechFeedbackProps {
  isVisible: boolean;
  type: 'success' | 'error' | 'info' | null;
  message: string;
  command?: string;
  onClose: () => void;
}

export function SpeechFeedback({ isVisible, type, message, command, onClose }: SpeechFeedbackProps) {
  useEffect(() => {
    if (isVisible && (type === 'success' || type === 'error')) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const styles = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
  };

  const Icon = type ? icons[type] : Info;

  return (
    <div className="absolute right-0 mt-2 w-80 z-50">
      <div className={`rounded-lg p-4 shadow-lg ${type ? styles[type] : ''}`}>
        <div className="flex items-start">
          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            {command && (
              <div className="flex items-center mb-2 text-sm opacity-75">
                <Mic className="w-4 h-4 mr-2" />
                <p className="italic">"{command}"</p>
              </div>
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}