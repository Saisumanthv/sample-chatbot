import React from 'react';
import { Bot } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions.jsx';

export default function WelcomeScreen({ suggestions = [], onSelectSuggestion, isLoading = false }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mb-5 shadow-xl shadow-indigo-100 ring-8 ring-indigo-50">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          How can I help you today?
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-md leading-relaxed">
          Ask questions, get step-by-step explanations, debug code, brainstorm ideas, or learn something new with Gemini AI.
        </p>

        <div className="w-full mt-6">
          <SuggestedQuestions
            suggestions={suggestions}
            onSelectSuggestion={onSelectSuggestion}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

