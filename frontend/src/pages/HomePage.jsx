import React from 'react'
import { useChatStore } from '../store/useChatStore.js';
// import { Sidebar } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';


const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center pt-20 px-4 h-full">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-7xl h-full overflow-hidden">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};


export default HomePage