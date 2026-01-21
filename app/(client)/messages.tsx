import React from 'react';
import { View } from 'react-native';
import { ChatWindow } from '../../components/ChatWindow';
import { useApp } from '../../contexts/AppContext';

export default function ClientMessagesScreen() {
  const { currentUser, chats } = useApp();

  return (
    <View style={{ flex: 1 }}>
      <ChatWindow user={currentUser} initialChats={chats} />
    </View>
  );
}
