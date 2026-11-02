import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ChatHeader from './ChatHeader.jsx';
import RenameDialog from '../conversations/RenameDialog.jsx';
import DeleteDialog from '../conversations/DeleteDialog.jsx';
import { conversationService } from '../../services/conversationService.js';
import toast from 'react-hot-toast';

export default function AppLayout() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  // Dialog states
  const [renameTarget, setRenameTarget] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const data = await conversationService.getConversations();
      setConversations(data);
    } catch (err) {
      console.warn('[AppLayout] Failed to load conversations:', err.message);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const activeConversation = conversations.find(c => c.id === conversationId);
  const headerTitle = activeConversation ? activeConversation.title : 'New Chat';

  const handleStartRename = (conversation) => {
    setRenameTarget(conversation);
  };

  const handleConfirmRename = async (newTitle) => {
    if (!renameTarget) return;
    try {
      setIsRenaming(true);
      const updated = await conversationService.renameConversation(renameTarget.id, newTitle);
      setConversations(prev =>
        prev.map(c => (c.id === renameTarget.id ? { ...c, title: updated.title } : c))
      );
      toast.success('Conversation renamed');
      setRenameTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to rename conversation');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleStartDelete = (conversation) => {
    setDeleteTarget(conversation);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await conversationService.deleteConversation(deleteTarget.id);
      setConversations(prev => prev.filter(c => c.id !== deleteTarget.id));
      toast.success('Conversation deleted');

      // If user deleted the active conversation, navigate back to /chat
      if (conversationId === deleteTarget.id) {
        navigate('/chat', { replace: true });
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete conversation');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNewChat = () => {
    navigate('/chat');
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={conversationId}
        isLoadingConversations={isLoadingConversations}
        onRenameConversation={handleStartRename}
        onDeleteConversation={handleStartDelete}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <ChatHeader
          conversationTitle={headerTitle}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onNewChat={handleNewChat}
        />

        <main className="flex-1 overflow-hidden">
          <Outlet
            context={{
              conversations,
              setConversations,
              refreshConversations: loadConversations
            }}
          />
        </main>
      </div>

      {/* Rename Dialog */}
      <RenameDialog
        isOpen={Boolean(renameTarget)}
        initialTitle={renameTarget?.title || ''}
        isLoading={isRenaming}
        onSave={handleConfirmRename}
        onCancel={() => setRenameTarget(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={Boolean(deleteTarget)}
        conversationTitle={deleteTarget?.title}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

