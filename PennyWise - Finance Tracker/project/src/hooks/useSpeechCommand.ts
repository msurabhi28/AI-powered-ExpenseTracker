import { useState, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { processCommand } from '../services/commandProcessor';

export function useSpeechCommand(maxDuration: number = 25000) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [processingResult, setProcessingResult] = useState<string | null>(null);
  const recordingStartTime = useRef<number | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    setTranscript(text);
    if (!isFinal) {
      setError(null);
      setProcessingResult(null);
    }
  }, []);

  const handleResult = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const result = await processCommand(text);
      setProcessingResult(result);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process command';
      setError(errorMessage);
      setProcessingResult(null);
      return null;
    } finally {
      setIsProcessing(false);
      setTranscript('');
      setRecordingDuration(0);
      stopRecordingTimer();
    }
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    setIsProcessing(false);
    setTranscript('');
    setRecordingDuration(0);
    setProcessingResult(null);
    stopRecordingTimer();
  }, []);

  const startRecordingTimer = useCallback(() => {
    recordingStartTime.current = Date.now();
    recordingInterval.current = setInterval(() => {
      if (recordingStartTime.current) {
        const duration = Date.now() - recordingStartTime.current;
        setRecordingDuration(Math.min(duration, maxDuration));
      }
    }, 100);
  }, [maxDuration]);

  const stopRecordingTimer = useCallback(() => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = undefined;
    }
    recordingStartTime.current = null;
    setRecordingDuration(0);
  }, []);

  const { startListening: startRecognition, stopListening: stopRecognition, isSupported } = useSpeechRecognition({
    onTranscript: handleTranscript,
    onResult: handleResult,
    onError: handleError,
    maxDuration,
  });

  const startListening = useCallback(async () => {
    setIsProcessing(true);
    setProcessingResult(null);
    await startRecognition();
    startRecordingTimer();
  }, [startRecognition, startRecordingTimer]);

  const stopListening = useCallback(async () => {
    await stopRecognition();
    stopRecordingTimer();
  }, [stopRecognition, stopRecordingTimer]);

  return {
    isSupported,
    isProcessing,
    transcript,
    error,
    recordingDuration,
    processingResult,
    startListening,
    stopListening,
  };
}