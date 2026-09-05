import { useState, useCallback, useEffect } from 'react';
import { sendMessageToAgent } from '../services/api';
import { generateId } from '../utils/helpers';

const STORAGE_KEY = 'stockgpt_conversations';
const MAX_CONVERSATIONS = 100;
const MAX_MESSAGES_PER_CONVO = 50;

const WELCOME = {
  id: generateId(),
  sender: 'agent',
  text: 'Hello! I am StockGPT, your AI Stock Research Agent. How can I assist you with your investments today?',
  timestamp: new Date().toISOString()
};

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.activeId && data.conversations) return data;
    }
  } catch {}

  // Migrate from old single-conversation format
  try {
    const oldRaw = localStorage.getItem('stockgpt_messages');
    if (oldRaw) {
      const msgs = JSON.parse(oldRaw);
      if (Array.isArray(msgs) && msgs.length > 0) {
        const id = generateId();
        const title = msgs.find(m => m.sender === 'user')?.text?.slice(0, 40) || 'New Chat';
        const data = {
          activeId: id,
          conversations: {
            [id]: { id, title, messages: msgs, createdAt: msgs[0]?.timestamp || new Date().toISOString() }
          }
        };
        localStorage.removeItem('stockgpt_messages');
        return data;
      }
    }
  } catch {}

  const id = generateId();
  return {
    activeId: id,
    conversations: {
      [id]: { id, title: 'New Chat', messages: [WELCOME], createdAt: new Date().toISOString() }
    }
  };
}

function saveConversations(data) {
  try {
    // Trim old conversations if over limit
    const ids = Object.keys(data.conversations).sort((a, b) =>
      new Date(data.conversations[b].createdAt) - new Date(data.conversations[a].createdAt)
    );
    if (ids.length > MAX_CONVERSATIONS) {
      ids.slice(MAX_CONVERSATIONS).forEach(id => delete data.conversations[id]);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export const useChat = () => {
  const [state, setState] = useState(loadConversations);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const { activeId, conversations } = state;
  const messages = conversations[activeId]?.messages || [WELCOME];
  const conversationList = Object.values(conversations).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  useEffect(() => { saveConversations(state); }, [state]);

  const updateActiveMessages = useCallback((updater) => {
    setState(prev => {
      const convo = prev.conversations[prev.activeId];
      if (!convo) return prev;
      const newMessages = typeof updater === 'function' ? updater(convo.messages) : updater;
      return {
        ...prev,
        conversations: {
          ...prev.conversations,
          [prev.activeId]: { ...convo, messages: newMessages.slice(-MAX_MESSAGES_PER_CONVO) }
        }
      };
    });
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    // Auto-title from first user message
    setState(prev => {
      const convo = prev.conversations[prev.activeId];
      if (!convo) return prev;
      const isFirstUserMsg = !convo.messages.some(m => m.sender === 'user');
      return {
        ...prev,
        conversations: {
          ...prev.conversations,
          [prev.activeId]: {
            ...convo,
            title: isFirstUserMsg ? text.slice(0, 40) : convo.title,
            messages: [...convo.messages, userMessage].slice(-MAX_MESSAGES_PER_CONVO)
          }
        }
      };
    });

    setIsTyping(true);
    setError(null);

    try {
      const agentResponse = await sendMessageToAgent(text, messages);
      updateActiveMessages(prev => [...prev, agentResponse]);
    } catch (err) {
      setError('Failed to get a response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  }, [messages, updateActiveMessages]);

  const createNewChat = useCallback(() => {
    const id = generateId();
    const newConvo = { id, title: 'New Chat', messages: [WELCOME], createdAt: new Date().toISOString() };
    setState(prev => ({
      activeId: id,
      conversations: { ...prev.conversations, [id]: newConvo }
    }));
  }, []);

  const switchChat = useCallback((id) => {
    setState(prev => {
      if (prev.conversations[id]) return { ...prev, activeId: id };
      return prev;
    });
  }, []);

  const deleteChat = useCallback((id) => {
    setState(prev => {
      const next = { ...prev.conversations };
      delete next[id];
      const remainingIds = Object.keys(next);
      if (remainingIds.length === 0) {
        const newId = generateId();
        next[newId] = { id: newId, title: 'New Chat', messages: [WELCOME], createdAt: new Date().toISOString() };
        return { activeId: newId, conversations: next };
      }
      return {
        activeId: prev.activeId === id ? remainingIds[0] : prev.activeId,
        conversations: next
      };
    });
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    conversationList,
    activeId,
    createNewChat,
    switchChat,
    deleteChat
  };
};
