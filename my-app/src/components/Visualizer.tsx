import React from 'react';

export type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VisualizerProps {
  state: AssistantState;
}

export default function Visualizer({ state }: VisualizerProps) {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto my-2">
      {/* Background glow layers */}
      <div 
        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-60
          ${state === 'idle' ? 'bg-primary/20 scale-90' : ''}
          ${state === 'listening' ? 'bg-cyan-500/50 scale-110 animate-pulse-slow' : ''}
          ${state === 'processing' ? 'bg-purple-500/50 scale-100 animate-spin-slow' : ''}
          ${state === 'speaking' ? 'bg-blue-500/50 scale-125 animate-ping-slow' : ''}
        `}
      />
      
      {/* Core Shape */}
      <div className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-700
        ${state === 'idle' ? 'w-24 h-24 bg-primary/10 border border-primary/20 shadow-lg' : ''}
        ${state === 'listening' ? 'w-32 h-32 bg-cyan-950/80 border-2 border-cyan-400 glow-cyan' : ''}
        ${state === 'processing' ? 'w-24 h-24 bg-purple-950/80 border-[3px] border-dashed border-purple-400 glow-purple animate-spin' : ''}
        ${state === 'speaking' ? 'w-40 h-40 bg-blue-950/80 border border-blue-400 glow-blue' : ''}
      `}>
        {/* Inner Waveform for speaking state */}
        {state === 'speaking' && (
          <div className="flex items-center justify-center gap-1 h-12 w-24">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 bg-blue-400 rounded-full animate-wave-bars"
                style={{ 
                  height: `${Math.max(20, Math.random() * 100)}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.6 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Core dot for other states */}
        {state !== 'speaking' && (
          <div className={`rounded-full bg-white transition-all duration-500
            ${state === 'idle' ? 'w-3 h-3 opacity-50' : ''}
            ${state === 'listening' ? 'w-8 h-8 opacity-90 animate-ping' : ''}
            ${state === 'processing' ? 'w-4 h-4 opacity-100' : ''}
          `} />
        )}
      </div>
      
      {/* State Label */}
      <div className="absolute -bottom-12 text-center w-full">
        <span className={`text-sm tracking-widest uppercase font-medium transition-colors duration-500
          ${state === 'idle' ? 'text-muted-foreground' : ''}
          ${state === 'listening' ? 'text-cyan-400' : ''}
          ${state === 'processing' ? 'text-purple-400' : ''}
          ${state === 'speaking' ? 'text-blue-400' : ''}
        `}>
          {state}
        </span>
      </div>
    </div>
  );
}
