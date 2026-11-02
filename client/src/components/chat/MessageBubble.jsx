import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check } from 'lucide-react';
import { formatMessageDate } from '../../utils/formatDate.js';
import toast from 'react-hot-toast';

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard.');
    }
  };

  return (
    <div
      className={`group py-3 px-2 sm:px-4 transition-colors ${
        isAssistant ? 'bg-transparent' : 'bg-transparent'
      }`}
    >
      <div
        className={`max-w-3xl mx-auto flex gap-3 sm:gap-4 ${
          isAssistant ? 'items-start' : 'items-start flex-row-reverse'
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
            isAssistant
              ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
              : 'bg-slate-800 text-slate-100'
          }`}
        >
          {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Content bubble */}
        <div
          className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
            isAssistant ? 'items-start' : 'items-end'
          }`}
        >
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              isAssistant
                ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm'
                : 'bg-indigo-600 text-white rounded-tr-sm'
            }`}
          >
            {isAssistant ? (
              <div className="prose prose-slate max-w-none text-sm break-words overflow-hidden">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline font-medium hover:text-indigo-800"
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-3">
                        <table {...props} className="min-w-full divide-y divide-slate-200 border border-slate-200 text-xs" />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th {...props} className="bg-slate-100 px-3 py-2 text-left font-semibold text-slate-700" />
                    ),
                    td: ({ node, ...props }) => (
                      <td {...props} className="px-3 py-2 border-t border-slate-100 text-slate-600" />
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>

          {/* Footer with timestamp and copy button */}
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-[11px] text-slate-400">
              {formatMessageDate(message.created_at)}
            </span>

            {isAssistant && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy response"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 inline-flex items-center gap-1 text-[11px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

