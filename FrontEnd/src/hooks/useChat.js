import { useState, useCallback, useEffect } from 'react';
import { sendMessageToAgent } from '../services/api';
import { generateId } from '../utils/helpers';

const STORAGE_KEY = 'stockgpt_messages';
const MAX_STORED = 50;

const WELCOME = {
  id: generateId(),
  sender: 'agent',
  text: 'Hello! I am StockGPT, your AI Stock Research Agent. How can I assist you with your investments today?',
  timestamp: new Date().toISOString()
};

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [WELCOME];
}

function saveMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_STORED)));
  } catch {}
}

export const useChat = () => {
  const [messages, setMessages] = useState(loadMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const agentResponse = await sendMessageToAgent(text, messages);
      setMessages((prev) => [...prev, agentResponse]);
    } catch (err) {
      setError('Failed to get a response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    const fresh = [WELCOME];
    setMessages(fresh);
    saveMessages(fresh);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearChat
  };
};
