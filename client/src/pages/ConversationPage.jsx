import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import { chatService } from '../services/chatService.js';
import toast from 'react-hot-toast';

export default function ConversationPage() {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshConversations } = useOutletContext();

  const [messages, setMessages] = useState(location.state?.initialMessages || []);
  const [isLoadingMessages, setIsLoadingMessages] = useState(!location.state?.initialMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [lastAttemptedMessage, setLastAttemptedMessage] = useState('');

  const currentConvIdRef = useRef(conversationId);

  useEffect(() => {
    currentConvIdRef.current = conversationId;
    setError(null);

    // If initial messages were passed from state (e.g. from new chat transition), use them
    if (location.state?.initialMessages) {
      setMessages(location.state.initialMessages);
      setIsLoadingMessages(false);
      // Clean up location state
      window.history.replaceState({}, document.title);
      return;
    }

    async function loadMessages() {
      try {
        setIsLoadingMessages(true);
        const data = await chatService.getMessages(conversationId);
        if (currentConvIdRef.current === conversationId) {
          setMessages(data);
        }
      } catch (err) {
        console.error('[ConversationPage] Load error:', err);
        if (err.statusCode === 404) {
          toast.error('Conversation not found or inaccessible.');
          navigate('/chat', { replace: true });
        } else {
          setError(err.message || 'Failed to load messages.');
        }
      } finally {
        if (currentConvIdRef.current === conversationId) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();
  }, [conversationId]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isGenerating) return;

    setError(null);
    setLastAttemptedMessage(text);

    // Optimistically add user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setIsGenerating(true);

    try {
      const response = await chatService.sendMessage({
        conversationId,
        message: text
      });

      const userMsg = response.userMessage || response.data?.userMessage;
      const assistantMsg = response.assistantMessage || response.data?.assistantMessage;

      setMessages(prev => {
        // Replace tempUserMsg with real userMsg and append assistantMsg
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        return [...withoutTemp, userMsg || tempUserMsg, assistantMsg];
      });

      // Refresh sidebar conversation last activity
      if (refreshConversations) {
        refreshConversations();
      }
    } catch (err) {
      console.error('[ConversationPage] Send message error:', err);

      // If backend saved the user message before Gemini failed, attach it
      if (err.data?.userMessage) {
        setMessages(prev => {
          const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
          return [...withoutTemp, err.data.userMessage];
        });
      }

      const msg = err.message || 'Failed to generate AI response.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    if (lastAttemptedMessage) {
      handleSendMessage(lastAttemptedMessage);
    }
  };

  return (
    <ChatWindow
      messages={messages}
      isLoadingMessages={isLoadingMessages}
      isGenerating={isGenerating}
      error={error}
      onSendMessage={handleSendMessage}
      onRetry={handleRetry}
    />
  );
}

