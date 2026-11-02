import React from 'react';
import WelcomeScreen from './WelcomeScreen.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function ChatWindow({
  messages = [],
  suggestions = [],
  isLoadingMessages = false,
  isGenerating = false,
  error = null,
  onSendMessage,
  onRetry,
  onSelectSuggestion
}) {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Messages area or Welcome Screen */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="md" text="Loading conversation..." />
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen
            suggestions={suggestions}
            onSelectSuggestion={onSelectSuggestion || onSendMessage}
            isLoading={isGenerating}
          />
        ) : (
          <MessageList
            messages={messages}
            isGenerating={isGenerating}
          />
        )}
      </div>

      {/* Error banner if request failed */}
      {error && (
        <div className="max-w-3xl w-full mx-auto px-4 pb-2">
          <ErrorMessage
            message={error}
            onRetry={onRetry}
          />
        </div>
      )}

      {/* Message input area */}
      <div className="shrink-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-2">
        <MessageInput
          onSendMessage={onSendMessage}
          disabled={isGenerating || isLoadingMessages}
        />
      </div>
    </div>
  );
}

