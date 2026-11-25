import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechRecognitionProps {
  lang?: string;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({ lang = 'ar-EG', onResult, onError }: UseSpeechRecognitionProps = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLang, setCurrentLang] = useState(lang);

  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  onResultRef.current = onResult;
  onErrorRef.current = onError;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = currentLang;

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage('');
        };

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);

          if (event.results[0].isFinal) {
            onResultRef.current?.(currentText);
          }
        };

        recognition.onerror = (event: any) => {
          const err = event.error || 'Speech recognition error';
          setErrorMessage(err);
          setIsListening(false);
          onErrorRef.current?.(err);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }
    setTranscript('');
    setErrorMessage('');
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      console.warn('SpeechRecognition start failed (might already be running):', e);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('SpeechRecognition stop failed:', e);
      }
    }
    setIsListening(false);
  }, [isListening]);

  return {
    isSupported,
    isListening,
    transcript,
    errorMessage,
    currentLang,
    setLang: setCurrentLang,
    startListening,
    stopListening
  };
}
