import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useSpeechSynthesis(props?: UseSpeechSynthesisProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  const onStartRef = useRef(props?.onStart);
  const onEndRef = useRef(props?.onEnd);
  onStartRef.current = props?.onStart;
  onEndRef.current = props?.onEnd;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
        if (!selectedVoice && available.length > 0) {
          // Prefer natural English voices (Google, Natural, Samantha, Alex)
          const preferred = available.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Samantha'))
          ) || available.find(v => v.lang.startsWith('en')) || available[0];
          setSelectedVoice(preferred || null);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = useCallback((text: string, lang = 'en-US') => {
    setCurrentSubtitle(text);

    if (isMuted || !isSupported || !('speechSynthesis' in window)) {
      setIsSpeaking(true);
      onStartRef.current?.();
      // Simulate reading duration for subtitles if muted
      const wordCount = text.split(/\s+/).length;
      const durationMs = Math.max(2500, (wordCount / 2.5) * 1000);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
        onEndRef.current?.();
      }, durationMs);
      return () => clearTimeout(timer);
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.volume = volume;
      utterance.lang = lang;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        onStartRef.current?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onEndRef.current?.();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        onEndRef.current?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis exception:', e);
      setIsSpeaking(false);
      onEndRef.current?.();
    }
  }, [isMuted, isSupported, rate, volume, selectedVoice]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSubtitle('');
    onEndRef.current?.();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  }, []);

  return {
    isSupported,
    isSpeaking,
    isMuted,
    volume,
    setVolume,
    rate,
    setRate,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentSubtitle,
    setCurrentSubtitle,
    speak,
    stop,
    toggleMute
  };
}
