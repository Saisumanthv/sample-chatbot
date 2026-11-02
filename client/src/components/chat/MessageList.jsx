import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function MessageList({ messages = [], isGenerating = false }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-1">
      {messages.map((message) => (
        <MessageBubble key={message.id || message.created_at} message={message} />
      ))}

      {isGenerating && <TypingIndicator />}

      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}

