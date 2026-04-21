import React from 'react';
import { MicIcon, SquareIcon, SettingsIcon, HistoryIcon } from './Icons';
import { AssistantState } from './Visualizer';

interface ControlsProps {
  state: AssistantState;
  onMicClick: () => void;
  onStopClick: () => void;
}

export default function Controls({ state, onMicClick, onStopClick }: ControlsProps) {
  const isListening = state === 'listening';

  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {/* Secondary Button: History */}
      <button className="p-3 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors border border-border/50">
        <HistoryIcon className="w-5 h-5" />
      </button>

      {/* Primary Action Button */}
      {isListening || state === 'processing' || state === 'speaking' ? (
        <button 
          onClick={onStopClick}
          className="p-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all shadow-lg hover:scale-105 active:scale-95 animate-in zoom-in duration-300"
          aria-label="Stop"
        >
          <SquareIcon className="w-8 h-8 fill-current" />
        </button>
      ) : (
        <button 
          onClick={onMicClick}
          className="p-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 animate-in zoom-in duration-300"
          aria-label="Start listening"
        >
          <MicIcon className="w-8 h-8" />
        </button>
      )}

      {/* Secondary Button: Settings */}
      <button className="p-3 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors border border-border/50">
        <SettingsIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
