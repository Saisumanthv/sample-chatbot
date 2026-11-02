import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 py-2 px-1 max-w-3xl mx-auto animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-100">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
        </div>
        <span className="text-xs text-slate-500 font-medium ml-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
          Thinking...
        </span>
      </div>
    </div>
  );
}

