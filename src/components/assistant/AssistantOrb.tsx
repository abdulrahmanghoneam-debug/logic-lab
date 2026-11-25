import React, { useEffect, useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertCircle, 
  RefreshCw,
  Square,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

export type AssistantState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'speaking' 
  | 'processing' 
  | 'error' 
  | 'permission_needed';

interface AssistantOrbProps {
  state: AssistantState;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  audioFrequency?: number;
  subtitle?: string;
  selectedVoiceId?: string;
  onSelectVoice?: (voiceId: string) => void;
  onToggleMic: () => void;
  onToggleMute: () => void;
  onInterrupt?: () => void;
  onReplayWelcome?: () => void;
  className?: string;
}

export const AssistantOrb: React.FC<AssistantOrbProps> = ({
  state,
  isListening,
  isSpeaking,
  isMuted,
  audioFrequency = 0,
  subtitle,
  selectedVoiceId = '21m00Tcm4TlvDq8ikWAM',
  onSelectVoice,
  onToggleMic,
  onToggleMute,
  onInterrupt,
  onReplayWelcome,
  className = ''
}) => {
  const [pulsePhase, setPulsePhase] = useState(0);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', note: 'Warm & Articulate' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', note: 'Deep Narrative' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', note: 'Academic Clarity' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', note: 'Scholarly British' }
  ];

  const stateConfig: Record<AssistantState, { label: string; ringColor: string; coreColor: string; glow: string }> = {
    idle: {
      label: 'Assistant Ready',
      ringColor: '#06b6d4',
      coreColor: '#2563eb',
      glow: 'rgba(6, 182, 212, 0.4)'
    },
    listening: {
      label: 'Listening...',
      ringColor: '#22c55e',
      coreColor: '#16a34a',
      glow: 'rgba(34, 197, 94, 0.6)'
    },
    thinking: {
      label: 'Reasoning...',
      ringColor: '#a855f7',
      coreColor: '#9333ea',
      glow: 'rgba(168, 85, 247, 0.6)'
    },
    speaking: {
      label: 'ElevenLabs Voice Output',
      ringColor: '#00f5ff',
      coreColor: '#3b82f6',
      glow: 'rgba(0, 245, 255, 0.7)'
    },
    processing: {
      label: 'Evaluating Discrete Model...',
      ringColor: '#f59e0b',
      coreColor: '#d97706',
      glow: 'rgba(245, 158, 11, 0.6)'
    },
    error: {
      label: 'Voice Notice',
      ringColor: '#ef4444',
      coreColor: '#dc2626',
      glow: 'rgba(239, 68, 68, 0.6)'
    },
    permission_needed: {
      label: 'Microphone Required',
      ringColor: '#f97316',
      coreColor: '#ea580c',
      glow: 'rgba(249, 115, 22, 0.6)'
    }
  };

  const currentConfig = stateConfig[state] || stateConfig.idle;
  const reactiveScale = 1 + Math.min(0.6, (audioFrequency / 255) * 0.8);

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Animated Orb Container */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer Audio-Reactive Aura */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-150 blur-xl"
          style={{
            backgroundColor: currentConfig.glow,
            transform: `scale(${isSpeaking ? reactiveScale * 1.2 : isListening ? 1.25 : 1})`,
            opacity: isSpeaking || isListening ? 0.85 : 0.4
          }}
        />

        {/* Outer Orbital Ring 1 */}
        <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={currentConfig.ringColor}
            strokeWidth="1.5"
            strokeDasharray="20 15 5 15"
            opacity="0.8"
          />
        </svg>

        {/* Counter Orbital Ring 2 */}
        <svg
          className="absolute w-24 h-24"
          style={{ transform: `rotate(-${pulsePhase * 3.6}deg)` }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={currentConfig.coreColor}
            strokeWidth="2"
            strokeDasharray="40 25"
            opacity="0.9"
          />
        </svg>

        {/* Central Core Sphere */}
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 overflow-hidden cursor-pointer"
          onClick={isSpeaking ? onInterrupt : onToggleMic}
          title={isSpeaking ? 'Click to interrupt' : 'Click to speak'}
          style={{
            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${currentConfig.ringColor} 45%, ${currentConfig.coreColor} 85%, #030712 100%)`,
            boxShadow: `0 0 25px ${currentConfig.glow}, inset 0 0 12px rgba(255,255,255,0.6)`
          }}
        >
          {state === 'thinking' || state === 'processing' ? (
            <Sparkles className="w-5 h-5 text-white animate-spin" />
          ) : state === 'error' ? (
            <AlertCircle className="w-5 h-5 text-white" />
          ) : isSpeaking ? (
            /* Audio Frequency Modulating Equalizer Bars */
            <div className="flex items-center gap-0.5 h-6">
              {[0, 1, 2, 3, 4].map(i => {
                const height = Math.max(
                  4,
                  Math.min(22, 6 + (audioFrequency / 255) * 20 + Math.sin(pulsePhase * 0.3 + i) * 6)
                );
                return (
                  <div
                    key={i}
                    className="w-1 bg-white rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            </div>
          )}
        </div>
      </div>

      {/* State Badge with Interruption Button */}
      <div className="mt-2.5 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur">
        <span
          className="w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: currentConfig.ringColor }}
        />
        <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-slate-300">
          {currentConfig.label}
        </span>

        {isSpeaking && onInterrupt && (
          <button
            onClick={onInterrupt}
            className="ml-1 p-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 transition-colors"
            title="Interrupt speech"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        )}
      </div>

      {/* Subtitles Drawer */}
      {subtitle && (
        <div className="mt-2 max-w-xl text-center px-4 py-2 rounded-xl bg-cosmos-900/90 border border-cyan-500/20 backdrop-blur shadow-xl transition-all duration-300 animate-fade-in">
          <p className="text-xs md:text-sm font-medium text-cyan-200 tracking-wide leading-relaxed italic">
            "{subtitle}"
          </p>
        </div>
      )}

      {/* Audio Controls Bar */}
      <div className="mt-2.5 flex items-center gap-2">
        <button
          onClick={onToggleMic}
          className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
            isListening
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
              : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200'
          }`}
          title={isListening ? 'Mute Microphone' : 'Enable Voice Command'}
        >
          {isListening ? <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
          <span>{isListening ? 'Listening' : 'Mic'}</span>
        </button>

        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
            isMuted
              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
              : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200'
          }`}
          title={isMuted ? 'Unmute Speech Synthesis' : 'Mute Speech Synthesis'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isMuted ? 'Muted' : 'Audio'}</span>
        </button>

        {/* Voice Selector Pill */}
        {onSelectVoice && (
          <div className="relative">
            <button
              onClick={() => setShowVoiceMenu(prev => !prev)}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-500/60 text-xs flex items-center gap-1 font-mono"
              title="Select Voice"
            >
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>{voices.find(v => v.id === selectedVoiceId)?.name || 'Voice'}</span>
            </button>

            {showVoiceMenu && (
              <div className="absolute bottom-full mb-2 left-0 w-44 rounded-xl bg-cosmos-900 border border-slate-700 shadow-2xl p-1.5 z-50 flex flex-col gap-1 font-mono text-xs">
                {voices.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      onSelectVoice(v.id);
                      setShowVoiceMenu(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-left flex flex-col transition-all ${
                      v.id === selectedVoiceId
                        ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="text-[10px] text-slate-500">{v.note}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {onReplayWelcome && (
          <button
            onClick={onReplayWelcome}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-cyan-500/60 text-slate-400 hover:text-cyan-300 transition-all text-xs flex items-center gap-1"
            title="Replay Welcome Address"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Greeting</span>
          </button>
        )}
      </div>
    </div>
  );
};
