import React, { useState } from 'react';
import MobileFrame from '../components/layout/MobileFrame';
import ChatHeader from '../components/chat/ChatHeader';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import ErrorMessage from '../components/common/ErrorMessage';
import WatchlistDrawer from '../components/chat/WatchlistDrawer';
import { useChat } from '../hooks/useChat';

const Home = () => {
  const { messages, isTyping, error, sendMessage } = useChat();
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  return (
    <MobileFrame>
      <ChatHeader onOpenWatchlist={() => setIsWatchlistOpen(true)} />
      
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
    </MobileFrame>
  );
};

export default Home;
