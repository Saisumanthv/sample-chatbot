import React from 'react';
import { Sparkles, HelpCircle, Code, Lightbulb, BookOpen } from 'lucide-react';

const SUGGESTION_ICONS = [Lightbulb, Code, BookOpen, Sparkles, HelpCircle];

export default function SuggestedQuestions({ suggestions = [], onSelectSuggestion, isLoading = false }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-4">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Suggested Prompts</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestions.map((suggestion, index) => {
          const IconComponent = SUGGESTION_ICONS[index % SUGGESTION_ICONS.length];
          return (
            <button
              key={index}
              onClick={() => onSelectSuggestion(suggestion)}
              disabled={isLoading}
              className="group flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all shadow-sm hover:shadow text-xs sm:text-sm text-slate-700 disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <span className="line-clamp-2 leading-snug font-medium pt-0.5">
                {suggestion}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

