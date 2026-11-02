import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { formatConversationDate } from '../../utils/formatDate.js';

export default function ConversationItem({
  conversation,
  isActive = false,
  onRename,
  onDelete
}) {
  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
        isActive
          ? 'bg-indigo-50 text-indigo-900 font-medium'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <NavLink
        to={`/chat/${conversation.id}`}
        className="flex items-center gap-2.5 min-w-0 flex-1 pr-2"
        title={conversation.title}
      >
        <MessageSquare
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate text-xs sm:text-sm">
            {conversation.title || 'Untitled Conversation'}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            {formatConversationDate(conversation.updated_at || conversation.created_at)}
          </span>
        </div>
      </NavLink>

      {/* Action buttons (Rename & Delete) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRename(conversation);
          }}
          title="Rename conversation"
          className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-white transition"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(conversation);
          }}
          title="Delete conversation"
          className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-white transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

