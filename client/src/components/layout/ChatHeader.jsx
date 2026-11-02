import React from 'react';
import { Menu, Plus, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatHeader({
  conversationTitle = 'New Chat',
  onToggleSidebar,
  onNewChat
}) {
  const navigate = useNavigate();

  const handleNewChatClick = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      navigate('/chat');
    }
  };

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden transition"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <h1 className="text-sm font-semibold text-slate-800 truncate">
            {conversationTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Gemini AI</span>
        </div>

        <button
          type="button"
          onClick={handleNewChatClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
}

