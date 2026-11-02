import React, { useState, useMemo } from 'react';
import { Search, MessageSquareDashed } from 'lucide-react';
import ConversationItem from './ConversationItem.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function ConversationList({
  conversations = [],
  activeConversationId = null,
  isLoading = false,
  onRename,
  onDelete
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    const term = searchTerm.toLowerCase();
    return conversations.filter(c =>
      c.title?.toLowerCase().includes(term)
    );
  }, [conversations, searchTerm]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search Input */}
      <div className="px-3 pb-2 pt-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/80 border border-slate-200/60 rounded-lg placeholder-slate-400 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Conversations scroll area */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {isLoading ? (
          <div className="py-8">
            <LoadingSpinner size="sm" text="Loading chats..." />
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeConversationId === conv.id}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <MessageSquareDashed className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {searchTerm ? 'No matching conversations' : 'No conversation history'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {searchTerm ? 'Try a different search word' : 'Start a new chat to begin'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

