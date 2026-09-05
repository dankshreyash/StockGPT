import React, { useState } from 'react';
import MobileFrame from '../components/layout/MobileFrame';
import ChatHeader from '../components/chat/ChatHeader';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import ErrorMessage from '../components/common/ErrorMessage';
import WatchlistDrawer from '../components/chat/WatchlistDrawer';
import Sidebar from '../components/chat/Sidebar';
import { useChat } from '../hooks/useChat';

const Home = () => {
  const {
    messages, isTyping, error, sendMessage,
    conversationList, activeId, createNewChat, switchChat, deleteChat
  } = useChat();

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MobileFrame>
      <ChatHeader
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onNewChat={createNewChat}
      />

      {error && (
        <div className="absolute top-16 left-0 right-0 z-20 px-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <ChatContainer messages={messages} isTyping={isTyping} />

      <ChatInput
        onSendMessage={sendMessage}
        onSuggest={sendMessage}
        isTyping={isTyping}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        onSelect={(ticker) => sendMessage(`Analyze ${ticker}`)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversationList}
        activeId={activeId}
        onSelect={switchChat}
        onNew={createNewChat}
        onDelete={deleteChat}
      />
    </MobileFrame>
  );
};

export default Home;
