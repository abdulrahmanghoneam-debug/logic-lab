import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseElevenLabsVoiceProps {
  defaultVoiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useElevenLabsVoice({
  defaultVoiceId = '21m00Tcm4TlvDq8ikWAM', // Rachel
  onStart,
  onEnd,
  onError
}: UseElevenLabsVoiceProps = {}) {
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState(defaultVoiceId);
  const [audioFrequency, setAudioFrequency] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  onStartRef.current = onStart;
  onEndRef.current = onEnd;
  onErrorRef.current = onError;

  // Check voice proxy server status on mount
  useEffect(() => {
    fetch('/api/voice-status')
      .then(res => res.json())
      .then(data => {
        setIsReady(data.configured);
      })
      .catch(() => {
        setIsReady(false);
      });

    return () => {
      stop();
    };
  }, []);

  // Update frequency visualizer loop
  const startFrequencyMonitor = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < 32; i++) {
        sum += dataArray[i];
      }
      const avg = sum / 32;
      setAudioFrequency(avg);
      animFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const stopFrequencyMonitor = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioFrequency(0);
  };

  const speak = useCallback(async (text: string, voiceIdOverride?: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    setCurrentSubtitle(cleanText);

    if (isMuted) {
      setIsSpeaking(true);
      onStartRef.current?.();
      const words = cleanText.split(/\s+/).length;
      const duration = Math.max(2000, (words / 3.0) * 1000);
      setTimeout(() => {
        setIsSpeaking(false);
        onEndRef.current?.();
      }, duration);
      return;
    }

    // Stop previous audio if playing
    stop();

    try {
      setIsSpeaking(true);
      onStartRef.current?.();

      const voice = voiceIdOverride || selectedVoiceId;
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voiceId: voice,
          modelId: 'eleven_turbo_v2_5'
        })
      });

      if (!response.ok) {
        throw new Error(`TTS server returned ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Initialize Web Audio Context
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      currentAudioSourceRef.current = source;
      analyserRef.current = analyser;

      startFrequencyMonitor(analyser);

      source.onended = () => {
        stopFrequencyMonitor();
        setIsSpeaking(false);
        currentAudioSourceRef.current = null;
        onEndRef.current?.();
      };

      source.start(0);
    } catch (err: any) {
      console.warn('ElevenLabs speech failed, falling back to browser synthesis:', err);
      // Graceful fallback to browser speech synthesis
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.onstart = () => {
          setIsSpeaking(true);
          onStartRef.current?.();
        };
        utter.onend = () => {
          setIsSpeaking(false);
          onEndRef.current?.();
        };
        utter.onerror = () => {
          setIsSpeaking(false);
          onEndRef.current?.();
        };
        window.speechSynthesis.speak(utter);
      } else {
        setIsSpeaking(false);
        onEndRef.current?.();
      }
    }
  }, [isMuted, selectedVoiceId]);

  const stop = useCallback(() => {
    stopFrequencyMonitor();
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current.disconnect();
      } catch (e) {
        // Ignore already stopped
      }
      currentAudioSourceRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onEndRef.current?.();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) stop();
      return !prev;
    });
  }, [stop]);

  return {
    isReady,
    isSpeaking,
    isMuted,
    currentSubtitle,
    audioFrequency,
    selectedVoiceId,
    setSelectedVoiceId,
    speak,
    stop,
    toggleMute
  };
}
