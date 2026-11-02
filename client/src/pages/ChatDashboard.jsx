import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import { chatService } from '../services/chatService.js';
import toast from 'react-hot-toast';

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { refreshConversations } = useOutletContext();

  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [lastAttemptedMessage, setLastAttemptedMessage] = useState('');

  // Fetch suggested questions on mount
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const data = await chatService.getSuggestions();
        if (data && data.length > 0) {
          setSuggestions(data);
        }
      } catch (err) {
        // Fallback default suggestions
        setSuggestions([
          'Explain artificial intelligence in simple terms.',
          'Help me understand JavaScript.',
          'What are some effective study techniques?',
          'Explain how the internet works.',
          'Help me brainstorm a project idea.'
        ]);
      }
    }

    fetchSuggestions();
  }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isGenerating) return;

    setError(null);
    setLastAttemptedMessage(text);

    // Optimistically show user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages([tempUserMsg]);
    setIsGenerating(true);

    try {
      const response = await chatService.sendMessage({
        conversationId: null,
        message: text
      });

      const conversationId = response.conversationId || response.data?.conversationId;

      // Refresh sidebar so new conversation appears immediately
      if (refreshConversations) {
        refreshConversations();
      }

      // Navigate to the conversation page
      navigate(`/chat/${conversationId}`, {
        replace: true,
        state: {
          initialMessages: [
            response.userMessage || response.data?.userMessage,
            response.assistantMessage || response.data?.assistantMessage
          ]
        }
      });
    } catch (err) {
      console.error('[ChatDashboard] Message send error:', err);
      const msg = err.message || 'Failed to generate AI response.';
      setError(msg);
      toast.error(msg);
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
      suggestions={suggestions}
      isGenerating={isGenerating}
      error={error}
      onSendMessage={handleSendMessage}
      onRetry={handleRetry}
      onSelectSuggestion={handleSendMessage}
    />
  );
}

