import React from 'react';
import { Mic } from 'lucide-react';
import { useSpeechCommand } from '../../hooks/useSpeechCommand';
import { SpeechFeedback } from './SpeechFeedback';

const MAX_RECORDING_DURATION = 25000; // 25 seconds

export function SpeechButton() {
  const {
    isSupported,
    isProcessing,
    transcript,
    error,
    startListening,
    stopListening,
    recordingDuration,
    processingResult
  } = useSpeechCommand(MAX_RECORDING_DURATION);

  const [feedback, setFeedback] = React.useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
    command?: string;
  }>({ type: null, message: '' });

  const handleMouseDown = async () => {
    if (!isSupported) {
      setFeedback({
        type: 'error',
        message: 'Speech recognition is not supported in your browser.'
      });
      return;
    }

    try {
      setFeedback({ 
        type: 'info', 
        message: 'Listening... Hold to speak', 
        command: '' 
      });
      await startListening();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to start speech recognition. Please try again.'
      });
    }
  };

  const handleMouseUp = async () => {
    try {
      await stopListening();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to process speech command.'
      });
    }
  };

  React.useEffect(() => {
    if (error) {
      setFeedback({
        type: 'error',
        message: error
      });
    } else if (processingResult) {
      setFeedback({
        type: 'success',
        message: processingResult,
        command: transcript
      });
    } else if (transcript && isProcessing) {
      setFeedback({
        type: 'info',
        message: 'Processing...',
        command: transcript
      });
    }
  }, [error, transcript, isProcessing, processingResult]);

  const progressPercentage = (recordingDuration / MAX_RECORDING_DURATION) * 100;

  return (
    <div className="relative">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`p-2 rounded-lg transition-colors ${
          isProcessing
            ? 'bg-blue-600 text-white'
            : 'text-white hover:bg-blue-600/10'
        }`}
        disabled={!isSupported}
        title={isSupported ? 'Press and hold to speak' : 'Speech recognition not supported'}
      >
        <div className="relative">
          <Mic className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`} />
          {isProcessing && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white rounded-full animate-ping opacity-25" />
              </div>
              <svg
                className="absolute inset-0 w-8 h-8 -rotate-90 transform"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current"
                  strokeWidth="2"
                  strokeDasharray={`${progressPercentage} 100`}
                />
              </svg>
            </>
          )}
        </div>
      </button>

      <SpeechFeedback
        isVisible={!!feedback.type}
        type={feedback.type}
        message={feedback.message}
        command={feedback.command}
        onClose={() => setFeedback({ type: null, message: '' })}
      />
    </div>
  );
}