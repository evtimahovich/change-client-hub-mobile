import React from 'react';
import { ChatWindow } from '../../components/ChatWindow';
import { useApp } from '../../contexts/AppContext';

export default function ClientMessagesScreen() {
  const { currentUser, chats } = useApp();
  return <ChatWindow user={currentUser} initialChats={chats} />;
}
