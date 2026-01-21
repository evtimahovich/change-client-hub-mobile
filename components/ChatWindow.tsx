import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, StyleSheet } from 'react-native';
import { ChatMessage, User, UserRole } from '../types';
import { Send, Paperclip, Smile, Phone, Video } from 'lucide-react-native';
import { MenuButton } from './MenuButton';

interface ChatWindowProps {
  user: User;
  initialChats: ChatMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ user, initialChats }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChats);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const renderMessage = ({ item: m }: { item: ChatMessage }) => {
    const isMe = m.senderId === user.id;
    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
            {m.text}
          </Text>
        </View>
        <View style={[styles.messageInfo, isMe && styles.messageInfoMe]}>
          {!isMe && <Text style={styles.senderName}>{m.senderName}</Text>}
          <Text style={styles.timestamp}>
            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MenuButton />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.role === UserRole.CLIENT ? 'P' : 'M'}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {user.role === UserRole.CLIENT ? 'Чат с рекрутером Алексеем' : 'Чат с Марией (Клиент)'}
            </Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>В СЕТИ</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Phone size={22} color="#CBD5E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Video size={22} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={scrollRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <TouchableOpacity style={styles.inputButton}>
            <Paperclip size={22} color="#94A3B8" />
          </TouchableOpacity>
          <TextInput
            placeholder="Напишите сообщение..."
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.inputButton}>
            <Smile size={22} color="#CBD5E1" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendButton, inputValue.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
          >
            <Send size={20} color={inputValue.trim() ? 'white' : '#94A3B8'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#E4E4E7', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  avatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#F4F4F5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '600', color: '#52525B' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#000000', marginBottom: 6 },
  onlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineDot: { width: 6, height: 6, backgroundColor: '#10B981', borderRadius: 3 },
  onlineText: { fontSize: 12, fontWeight: '400', color: '#71717A' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerButton: { padding: 8, width: 40, height: 40, borderRadius: 8, backgroundColor: '#F4F4F5', alignItems: 'center', justifyContent: 'center' },
  messagesList: { padding: 24, backgroundColor: '#FAFAFA' },
  messageRow: { marginBottom: 16 },
  messageRowMe: { alignItems: 'flex-end' },
  messageBubble: { maxWidth: '75%', padding: 14, borderRadius: 12 },
  messageBubbleMe: { backgroundColor: '#000000', borderTopRightRadius: 4 },
  messageBubbleOther: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E4E7', borderTopLeftRadius: 4 },
  messageText: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  messageTextMe: { color: '#FFFFFF' },
  messageInfo: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  messageInfoMe: { justifyContent: 'flex-end' },
  senderName: { fontSize: 11, fontWeight: '400', color: '#A1A1AA' },
  timestamp: { fontSize: 11, fontWeight: '400', color: '#A1A1AA' },
  inputContainer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E4E4E7' },
  inputBox: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E4E4E7' },
  inputButton: { padding: 8 },
  input: { flex: 1, fontSize: 14, fontWeight: '400', paddingHorizontal: 12, paddingVertical: 8, color: '#000000' },
  sendButton: { padding: 10, borderRadius: 8 },
  sendButtonActive: { backgroundColor: '#000000' },
  sendButtonInactive: { backgroundColor: '#E4E4E7' },
});
