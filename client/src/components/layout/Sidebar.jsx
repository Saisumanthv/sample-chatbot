import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Plus, LogOut, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import ConversationList from '../conversations/ConversationList.jsx';
import toast from 'react-hot-toast';

export default function Sidebar({
  isOpen = false,
  onClose,
  conversations = [],
  activeConversationId = null,
  isLoadingConversations = false,
  onRenameConversation,
  onDeleteConversation,
  onNewChat
}) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully.');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to log out.');
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
          <NavLink to="/chat" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-sm">
              Simple AI Chatbot
            </span>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onNewChat) onNewChat();
              else navigate('/chat');
              if (onClose) onClose();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={isLoadingConversations}
          onRename={onRenameConversation}
          onDelete={onDeleteConversation}
        />

        {/* User Profile Section at bottom */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/70 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-semibold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {displayEmail}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

