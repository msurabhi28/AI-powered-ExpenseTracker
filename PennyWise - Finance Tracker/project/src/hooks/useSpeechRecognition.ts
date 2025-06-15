import { useCallback, useEffect, useRef } from 'react';
import { processAudioTranscript } from '../services/speechService';

interface UseSpeechRecognitionProps {
  onResult: (text: string) => void;
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (error: Error) => void;
  maxDuration?: number;
}

export function useSpeechRecognition({ 
  onResult, 
  onTranscript, 
  onError,
  maxDuration = 25000
}: UseSpeechRecognitionProps) {
  const recognition = useRef<any>(null);
  const isListeningRef = useRef(false);
  const transcriptRef = useRef('');
  const timerRef = useRef<NodeJS.Timeout>();

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const stopRecognition = useCallback(async () => {
    if (recognition.current && isListeningRef.current) {
      recognition.current.stop();
      isListeningRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (transcriptRef.current) {
        try {
          const enhancedTranscript = await processAudioTranscript(transcriptRef.current);
          onResult(enhancedTranscript);
        } catch (error) {
          onError(error instanceof Error ? error : new Error('Failed to process speech'));
        }
      }
    }
  }, [onResult, onError]);

  useEffect(() => {
    if (isSupported) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false; // Changed to false for immediate results
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        isListeningRef.current = true;
        transcriptRef.current = '';
        
        timerRef.current = setTimeout(() => {
          stopRecognition();
        }, maxDuration);
      };

      recognition.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          transcriptRef.current = finalTranscript;
          onTranscript(finalTranscript, true);
          stopRecognition(); // Stop after getting final result
        } else if (interimTranscript) {
          onTranscript(interimTranscript, false);
        }
      };

      recognition.current.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          onError(new Error('No speech was detected. Please try again.'));
        } else if (event.error === 'audio-capture') {
          onError(new Error('No microphone was found. Ensure it is plugged in and allowed.'));
        } else if (event.error === 'not-allowed') {
          onError(new Error('Microphone permission was denied. Please allow access and try again.'));
        } else {
          onError(new Error(`Error occurred in recognition: ${event.error}`));
        }
        stopRecognition();
      };

      recognition.current.onend = () => {
        isListeningRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
        isListeningRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    };
  }, [isSupported, maxDuration, onTranscript, onError, stopRecognition]);

  const startListening = useCallback(() => {
    if (recognition.current) {
      try {
        recognition.current.start();
      } catch (error) {
        if (error instanceof Error && error.message.includes('already started')) {
          return;
        }
        throw error;
      }
    }
  }, []);

  return {
    isSupported,
    startListening,
    stopListening: stopRecognition
  };
}