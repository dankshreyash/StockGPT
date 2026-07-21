import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import SuggestedPrompts from './SuggestedPrompts';

const ChatInput = ({ onSendMessage, onSuggest, isTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-zinc-950/80 backdrop-blur-md border-t border-black/10 dark:border-white/10 shrink-0">
      <SuggestedPrompts onSelect={onSuggest} />
      <form onSubmit={handleSubmit} className="p-4 pt-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Ask about any stock..."
            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full py-3 pl-4 pr-12 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="absolute right-2 p-2 rounded-full bg-green-accent text-white hover:bg-green-600 disabled:bg-gray-100 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-500 transition-colors"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
