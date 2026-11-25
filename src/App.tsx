import React, { useState, useCallback, useMemo } from 'react';
import { 
  Sparkles, 
  Home, 
  Play, 
  Network, 
  Table, 
  Cpu, 
  BookOpen, 
  ArrowLeftRight, 
  FlaskConical, 
  GraduationCap, 
  Trophy, 
  Presentation, 
  Terminal, 
  Send, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Mic 
} from 'lucide-react';

import { useElevenLabsVoice } from './hooks/useElevenLabsVoice';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { AssistantOrb, AssistantState } from './components/assistant/AssistantOrb';
import { HomeLanding } from './components/home/HomeLanding';
import { CinematicShowreel } from './components/cinematic/CinematicShowreel';
import { PropositionBuilder } from './components/proposition/PropositionBuilder';
import { TruthTableViewer } from './components/truthtable/TruthTableViewer';
import { CircuitSimulator } from './components/circuit/CircuitSimulator';
import { BooleanSimplifierViewer } from './components/algebra/BooleanSimplifierViewer';
import { ConversionWorkspace } from './components/converter/ConversionWorkspace';
import { LogicPlayground } from './components/playground/LogicPlayground';
import { GuidedTutorial } from './components/tutorial/GuidedTutorial';
import { LiveChallenge } from './components/challenge/LiveChallenge';
import { ProfessorMode } from './components/presentation/ProfessorMode';
import { DrMahmoudGuidedExperience } from './components/copilot/DrMahmoudGuidedExperience';

import { Parser } from './core/logic/parser';
import { Evaluator } from './core/logic/evaluator';
import { BooleanSimplifier } from './core/logic/simplifier';
import { TruthTableGenerator } from './core/logic/truthtable';

export type ActiveModule = 
  | 'home'
  | 'copilot'
  | 'showreel'
  | 'proposition'
  | 'truthtable'
  | 'circuit'
  | 'algebra'
  | 'converter'
  | 'playground'
  | 'tutorial'
  | 'challenge'
  | 'presentation';

export function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [activeExpression, setActiveExpression] = useState<string>('(P ∧ Q) → R');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [textCommand, setTextCommand] = useState('');
  const [assistantNotification, setAssistantNotification] = useState<string | null>(null);

  // ElevenLabs Voice Hook
  const {
    isReady: isElevenLabsReady,
    isSpeaking,
    isMuted,
    currentSubtitle,
    audioFrequency,
    selectedVoiceId,
    setSelectedVoiceId,
    speak,
    stop: stopSpeaking,
    toggleMute
  } = useElevenLabsVoice({
    onStart: () => setAssistantState('speaking'),
    onEnd: () => setAssistantState('idle')
  });

  const drMahmoudWelcome = 
    "Good afternoon, Dr. Mahmoud. Welcome to LOGIC LAB. An interactive environment designed to transform logical expressions into truth tables, Boolean representations, and digital logic circuits. Today, you won't just watch a presentation. You'll interact with it.";

  // Context-aware command interpretation with deterministic execution
  const executeUserCommand = useCallback((rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;

    setAssistantState('processing');
    setAssistantNotification(`Evaluating: "${query}"`);

    const lower = query.toLowerCase();

    // 1. Navigation Commands
    if (lower.includes('copilot') || lower.includes('جولة') || lower.includes('دكتور محمود') || lower.includes('walkthrough')) {
      setActiveModule('copilot');
      speak("أهلاً بحضرتك يا دكتور محمود في الجولة التفاعلية الحية!");
    } else if (lower.includes('home') || lower.includes('main menu')) {
      setActiveModule('home');
      speak("Returning to the main laboratory overview.");
    } else if (lower.includes('showreel') || lower.includes('intro') || lower.includes('welcome')) {
      setActiveModule('showreel');
      speak("Opening the cinematic introduction and welcome showreel.");
    } else if (lower.includes('proposition') || lower.includes('ast') || lower.includes('build')) {
      setActiveModule('proposition');
      speak("Opening the Proposition and Abstract Syntax Tree Builder.");
    } else if (lower.includes('truth table') || lower.includes('table')) {
      setActiveModule('truthtable');
      speak("Navigating to the Truth Table Generator.");
    } else if (lower.includes('circuit') || lower.includes('gate') || lower.includes('schematic')) {
      setActiveModule('circuit');
      speak("Engaging the Digital Logic Circuit Simulator.");
    } else if (lower.includes('simplify') || lower.includes('algebra') || lower.includes('de morgan') || lower.includes('law')) {
      setActiveModule('algebra');
      speak("Opening the Boolean Algebra and Axiomatic Laws Lab.");
    } else if (lower.includes('convert') || lower.includes('sop') || lower.includes('pos') || lower.includes('canonical')) {
      setActiveModule('converter');
      speak("Opening the Canonical SOP and POS Conversion Workspace.");
    } else if (lower.includes('playground') || lower.includes('sandbox')) {
      setActiveModule('playground');
      speak("Opening the Open Discrete Logic Playground.");
    } else if (lower.includes('tutorial') || lower.includes('learn') || lower.includes('lesson')) {
      setActiveModule('tutorial');
      speak("Starting the 11-stage Guided Discrete Structures Course.");
    } else if (lower.includes('challenge') || lower.includes('quiz') || lower.includes('test')) {
      setActiveModule('challenge');
      speak("Entering the Live Challenge Arena.");
    } else if (lower.includes('presentation') || lower.includes('lecture') || lower.includes('professor') || lower.includes('dr mahmoud')) {
      setActiveModule('presentation');
      speak("Launching Professor Presentation Mode for Dr. Mahmoud.");
    } 
    // 2. Contextual Explanations & Calculations
    else if (lower.includes('explain') || lower.includes('why') || lower.includes('what is')) {
      try {
        const table = TruthTableGenerator.generate(activeExpression);
        const explanation = `The current expression ${table.normalizedExpression} is classified as a ${table.classification}. It evaluates to True in ${table.trueCount} states and False in ${table.falseCount} states out of ${table.totalRows} combinations.`;
        speak(explanation);
      } catch {
        speak("I can explain any propositional formula, truth table row, or Boolean law currently on your screen.");
      }
    } 
    // 3. Fallback: Parse as a new mathematical formula
    else {
      try {
        const ast = new Parser(query).parse();
        const normalized = Evaluator.stringify(ast);
        setActiveExpression(normalized);
        setActiveModule('truthtable');
        speak(`Synthesizing truth table for ${normalized}.`);
      } catch {
        speak("I am ready to help you navigate, calculate truth tables, simulate gates, or explain Boolean laws.");
      }
    }

    setTimeout(() => {
      setAssistantState('idle');
      setAssistantNotification(null);
    }, 3500);
  }, [activeExpression, speak]);

  // Speech Recognition Hook
  const {
    isListening,
    startListening,
    stopListening
  } = useSpeechRecognition({
    onResult: (transcriptText) => {
      executeUserCommand(transcriptText);
    }
  });

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      setAssistantState('idle');
    } else {
      startListening();
      setAssistantState('listening');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textCommand.trim()) return;
    executeUserCommand(textCommand);
    setTextCommand('');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'copilot', label: 'جولة د. محمود ⚡', icon: Sparkles },
    { id: 'showreel', label: 'Showreel', icon: Play },
    { id: 'proposition', label: 'Builder', icon: Network },
    { id: 'truthtable', label: 'Truth Table', icon: Table },
    { id: 'circuit', label: 'Circuits', icon: Cpu },
    { id: 'algebra', label: 'Boolean Lab', icon: BookOpen },
    { id: 'converter', label: 'Converter', icon: ArrowLeftRight },
    { id: 'playground', label: 'Playground', icon: FlaskConical },
    { id: 'tutorial', label: 'Tutorial (11)', icon: GraduationCap },
    { id: 'challenge', label: 'Challenges', icon: Trophy },
    { id: 'presentation', label: 'Presentation', icon: Presentation },
  ];

  return (
    <div className="min-h-screen bg-cosmos-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />

      {/* Main Top Header */}
      <header className="relative z-30 border-b border-slate-800/80 bg-cosmos-950/90 backdrop-blur-md sticky top-0 px-4 md:px-8 py-3 flex items-center justify-between shadow-xl">
        {/* Brand */}
        <div 
          onClick={() => setActiveModule('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5 text-cyan-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl font-display tracking-tight text-white">
                LOGIC LAB
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                v2.0
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase font-semibold">
              Think. Connect. Prove.
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Presentation Button & ElevenLabs Indicator */}
        <div className="flex items-center gap-3">
          {isElevenLabsReady && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              ElevenLabs AI Voice Active
            </span>
          )}

          <button
            onClick={() => setActiveModule('presentation')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-105 active:scale-95"
          >
            <Presentation className="w-4 h-4" />
            <span className="hidden sm:inline">Dr. Mahmoud Presentation</span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Horizontal Module Bar */}
      <div className="xl:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 select-none">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id as ActiveModule)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap ${
              activeModule === item.id
                ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-200 font-bold'
                : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Workspace Stage */}
      <main className="relative z-10 flex-1 px-4 md:px-8 py-8 flex flex-col items-center justify-center">
        {activeModule === 'home' && (
          <HomeLanding
            onNavigate={(mod) => setActiveModule(mod as ActiveModule)}
            onStartShowreel={() => setActiveModule('showreel')}
            onVoiceWelcome={() => speak(drMahmoudWelcome)}
          />
        )}

        {activeModule === 'showreel' && (
          <CinematicShowreel
            onComplete={() => setActiveModule('copilot')}
            onSpeak={speak}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {activeModule === 'copilot' && (
          <DrMahmoudGuidedExperience
            onSpeak={speak}
            isSpeaking={isSpeaking}
            onNavigateToModule={(mod) => setActiveModule(mod as ActiveModule)}
          />
        )}

        {activeModule === 'proposition' && (
          <PropositionBuilder
            onSendToWorkspace={(expr) => {
              setActiveExpression(expr);
              setActiveModule('truthtable');
            }}
          />
        )}

        {activeModule === 'truthtable' && (
          <TruthTableViewer
            initialExpression={activeExpression}
            onExpressionChange={setActiveExpression}
          />
        )}

        {activeModule === 'circuit' && (
          <CircuitSimulator
            expression={activeExpression}
            onExpressionChange={setActiveExpression}
          />
        )}

        {activeModule === 'algebra' && (
          <BooleanSimplifierViewer
            initialExpression={activeExpression}
          />
        )}

        {activeModule === 'converter' && (
          <ConversionWorkspace />
        )}

        {activeModule === 'playground' && (
          <LogicPlayground />
        )}

        {activeModule === 'tutorial' && (
          <GuidedTutorial
            onSpeak={speak}
            onNavigateToTool={(tool) => setActiveModule(tool as ActiveModule)}
          />
        )}

        {activeModule === 'challenge' && (
          <LiveChallenge />
        )}

        {activeModule === 'presentation' && (
          <ProfessorMode
            onSpeak={speak}
            onExit={() => setActiveModule('home')}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}
      </main>

      {/* Persistent Conversational Voice Assistant HUD Bar */}
      <footer className="relative z-30 border-t border-slate-800/80 bg-cosmos-950/95 backdrop-blur-md px-4 md:px-8 py-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Assistant Orb & Audio Visualizer */}
          <div className="flex items-center gap-4">
            <AssistantOrb
              state={assistantState}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              audioFrequency={audioFrequency}
              subtitle={currentSubtitle}
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={setSelectedVoiceId}
              onToggleMic={toggleMic}
              onToggleMute={toggleMute}
              onInterrupt={stopSpeaking}
              onReplayWelcome={() => speak(drMahmoudWelcome)}
            />

            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ElevenLabs Conversational Companion
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {isSpeaking ? 'Streaming natural speech to Dr. Mahmoud...' : isListening ? 'Listening for natural speech...' : 'Ready for questions or lecture commands'}
              </span>
            </div>
          </div>

          {/* Natural Language Command Bar */}
          <form
            onSubmit={handleTextSubmit}
            className="w-full md:w-auto md:flex-1 max-w-lg flex items-center gap-2 bg-cosmos-900 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-cyan-500/80 transition-all shadow-inner"
          >
            <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <input
              type="text"
              value={textCommand}
              onChange={e => setTextCommand(e.target.value)}
              placeholder='Ask: "explain truth table", "show circuit", "simplify", "start challenge"...'
              className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 transition-colors"
              title="Execute command"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Academic Dedication Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dedicated to <strong>Dr. Mahmoud</strong></span>
          </div>

        </div>
      </footer>
    </div>
  );
}
export default App;
