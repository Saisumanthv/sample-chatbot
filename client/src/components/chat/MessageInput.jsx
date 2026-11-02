import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

const MAX_CHARS = 10000;

export default function MessageInput({ onSendMessage, disabled = false, placeholder = 'Type a message... (Shift + Enter for new line)' }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isOverLimit = text.length > MAX_CHARS;
  const canSend = text.trim().length > 0 && !isOverLimit && !disabled;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border border-slate-200/90 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all p-2"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full resize-none max-h-44 px-3 py-1.5 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-slate-400 text-slate-800 disabled:opacity-50"
        />

        <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="hidden sm:inline">Use</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-mono">
              <CornerDownLeft className="w-2.5 h-2.5" /> Enter
            </kbd>
            <span className="hidden sm:inline">to send</span>
            {text.length > 500 && (
              <span className={`ml-2 ${isOverLimit ? 'text-red-500 font-semibold' : ''}`}>
                {text.length}/{MAX_CHARS}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm disabled:shadow-none"
            title="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

