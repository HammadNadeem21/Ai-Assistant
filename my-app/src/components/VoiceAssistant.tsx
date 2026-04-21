"use client";

import React, { useState, useEffect, useRef } from 'react';
import Visualizer, { AssistantState } from './Visualizer';
import Transcript, { Message } from './Transcript';
import Controls from './Controls';

export default function VoiceAssistant() {
  const [state, setState] = useState<AssistantState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserSpeech(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setState('idle');
      };

      recognitionRef.current.onend = () => {
        // Only return to idle if we aren't moving to processing
        if (state === 'listening') {
          setState('idle');
        }
      };
    }
  }, [state]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    window.speechSynthesis.speak(utterance);
  };

  const handleUserSpeech = async (text: string) => {
    // Add user message to transcript
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    
    // Switch to processing state
    setState('processing');

    try {
      // Call Groq API Route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      const aiResponse = data.content;
      
      // Add AI response to transcript
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: aiResponse };
      setMessages(prev => [...prev, aiMsg]);

      // Speak the response
      speak(aiResponse);
    } catch (error) {
      console.error('AI Error:', error);
      setState('idle');
    }
  };

  const handleStartListening = () => {
    if (recognitionRef.current) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      setState('listening');
      recognitionRef.current.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.cancel();
    setState('idle');
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between w-full max-w-4xl px-4 py-4 mx-auto overflow-hidden bg-background">
      
      {/* Header Area - Reduced margin */}
      <div className="w-full text-center space-y-1 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">
        AI Voice Assistant
        </h1>
        <p className="text-muted-foreground text-xs">
          Your intelligent voice companion
        </p>
      </div>

      {/* Main Visualizer - Adjusted flex and margins */}
      <div className="flex-1 flex items-center justify-center w-full min-h-0 py-2">
        <Visualizer state={state} />
      </div>

      {/* Transcript & Chat Log - Balanced height and seamless integration */}
      <div className="w-full h-44 relative mt-4">
        {/* Subtle background glow for transcript area */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background pointer-events-none z-10" />
        <Transcript messages={messages} />
      </div>

      {/* Action Controls - Fixed bottom spacing */}
      <div className="w-full pb-6 pt-2 z-20">
        <Controls 
          state={state} 
          onMicClick={handleStartListening} 
          onStopClick={handleStop} 
        />
      </div>
      
    </div>
  );
}
