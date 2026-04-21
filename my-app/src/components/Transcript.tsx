import React, { useEffect, useRef } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface TranscriptProps {
  messages: Message[];
}

export default function Transcript({ messages }: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

 
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 overflow-y-auto h-full px-4 py-4 scrollbar-none mask-image-fade no-scrollbar">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground/30 italic text-sm tracking-widest uppercase">
          Waiting for your voice...
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`
              max-w-[85%] px-6 py-3 rounded-2xl backdrop-blur-xl transition-all shadow-2xl
              ${msg.role === 'user' 
                ? 'bg-primary/20 text-white border border-white/10 rounded-tr-none' 
                : 'bg-white/5 text-zinc-100 border border-white/5 rounded-tl-none'}
            `}>
              <div className={`text-[10px] uppercase tracking-tighter mb-1 opacity-40 font-bold
                ${msg.role === 'user' ? 'text-right' : 'text-left'}
              `}>
                {msg.role === 'user' ? 'You' : 'Aura'}
              </div>
              <p className="text-[15px] leading-relaxed font-light">{msg.text}</p>
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
