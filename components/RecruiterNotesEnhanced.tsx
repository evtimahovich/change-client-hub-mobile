import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal } from 'react-native';
import { FileEdit, Plus, Trash2, Clock, AtSign, X } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { Interaction } from '../types';

interface RecruiterNotesEnhancedProps {
  candidateId: string;
  companyId?: string;
}

export default function RecruiterNotesEnhanced({ candidateId, companyId }: RecruiterNotesEnhancedProps) {
  const { candidates, companies, handleAddComment } = useApp();
  const [newNoteText, setNewNoteText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showMentionModal, setShowMentionModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const candidate = candidates.find(c => c.id === candidateId);
  const company = companies.find(c => c.id === (companyId || candidate?.companyId));

  // Get all comments from candidate history
  const comments = useMemo(() => {
    if (!candidate) return [];
    return candidate.history.filter(h => h.type === 'comment');
  }, [candidate]);

  // Get ЛПР for mentions
  const decisionMakers = company?.decisionMakers || [];

  // Parse text to highlight mentions
  const renderTextWithMentions = (text: string, mentions?: string[]) => {
    if (!mentions || mentions.length === 0) {
      return <Text style={styles.commentText}>{text}</Text>;
    }

    const parts: { text: string; isMention: boolean; dmId?: string }[] = [];
    let lastIndex = 0;

    // Find all @mentions in text
    const mentionRegex = /@(\w+\s+\w+)/g;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.index), isMention: false });
      }

      // Add mention
      const mentionedName = match[1];
      const dm = decisionMakers.find(d => d.name === mentionedName);
      parts.push({
        text: `@${mentionedName}`,
        isMention: true,
        dmId: dm?.id
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), isMention: false });
    }

    return (
      <Text style={styles.commentText}>
        {parts.map((part, idx) => (
          part.isMention ? (
            <Text key={idx} style={styles.mentionText}>{part.text}</Text>
          ) : (
            <Text key={idx}>{part.text}</Text>
          )
        ))}
      </Text>
    );
  };

  const handleAddMention = (dmName: string) => {
    const beforeCursor = newNoteText.substring(0, cursorPosition);
    const afterCursor = newNoteText.substring(cursorPosition);

    // Find the last @ symbol
    const lastAtIndex = beforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const newText = beforeCursor.substring(0, lastAtIndex) + `@${dmName} ` + afterCursor;
      setNewNoteText(newText);
      setCursorPosition(lastAtIndex + dmName.length + 2);
    } else {
      const newText = beforeCursor + `@${dmName} ` + afterCursor;
      setNewNoteText(newText);
      setCursorPosition(beforeCursor.length + dmName.length + 2);
    }

    setShowMentionModal(false);
  };

  const handleTextChange = (text: string) => {
    setNewNoteText(text);

    // Check if user typed @ to show mention suggestions
    const lastChar = text[text.length - 1];
    if (lastChar === '@') {
      setShowMentionModal(true);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+\s+\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedName = match[1];
      const dm = decisionMakers.find(d => d.name === mentionedName);
      if (dm) {
        mentions.push(dm.id);
      }
    }

    return mentions;
  };

  const handleSaveNote = () => {
    if (!newNoteText.trim()) {
      Alert.alert('Ошибка', 'Введите текст комментария');
      return;
    }

    if (!handleAddComment) {
      Alert.alert('Ошибка', 'Функция добавления комментария недоступна');
      return;
    }

    const mentions = extractMentions(newNoteText);
    handleAddComment(candidateId, newNoteText, mentions);

    setNewNoteText('');
    setIsAdding(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Вчера в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FileEdit size={20} color="#F59E0B" />
          <Text style={styles.title}>Комментарии</Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsAdding(!isAdding)}
          style={styles.addButton}
        >
          <Plus size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {/* Add New Comment */}
      {isAdding && (
        <View style={styles.addCommentBox}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={newNoteText}
              onChangeText={handleTextChange}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
              placeholder="Введите комментарий... Используйте @ для упоминания ЛПР"
              placeholderTextColor="#A1A1AA"
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />

            {decisionMakers.length > 0 && (
              <TouchableOpacity
                style={styles.mentionButton}
                onPress={() => setShowMentionModal(true)}
              >
                <AtSign size={20} color="#F59E0B" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleSaveNote}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsAdding(false);
                setNewNoteText('');
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Пока нет комментариев. Добавьте первый комментарий!
          </Text>
        </View>
      ) : (
        <View style={styles.commentsList}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentHeaderLeft}>
                  <Text style={styles.commentAuthor}>{comment.user}</Text>
                  <View style={styles.commentTime}>
                    <Clock size={12} color="#A1A1AA" />
                    <Text style={styles.commentTimeText}>
                      {formatDate(comment.date)}
                    </Text>
                  </View>
                </View>

                {comment.mentions && comment.mentions.length > 0 && (
                  <View style={styles.mentionsBadge}>
                    <AtSign size={12} color="#F59E0B" />
                    <Text style={styles.mentionsBadgeText}>{comment.mentions.length}</Text>
                  </View>
                )}
              </View>

              {renderTextWithMentions(comment.details, comment.mentions)}

              {comment.mentions && comment.mentions.length > 0 && (
                <View style={styles.mentionedSection}>
                  <Text style={styles.mentionedLabel}>Упомянуты:</Text>
                  <View style={styles.mentionedList}>
                    {comment.mentions.map((dmId) => {
                      const dm = decisionMakers.find(d => d.id === dmId);
                      return dm ? (
                        <View key={dmId} style={styles.mentionedChip}>
                          <Text style={styles.mentionedChipText}>{dm.name}</Text>
                        </View>
                      ) : null;
                    })}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Mention Modal */}
      <Modal
        visible={showMentionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMentionModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMentionModal(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите ЛПР</Text>
              <TouchableOpacity onPress={() => setShowMentionModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dmList}>
              {decisionMakers.map((dm) => (
                <TouchableOpacity
                  key={dm.id}
                  style={styles.dmItem}
                  onPress={() => handleAddMention(dm.name)}
                >
                  <View style={styles.dmAvatar}>
                    <Text style={styles.dmAvatarText}>
                      {dm.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.dmInfo}>
                    <Text style={styles.dmName}>{dm.name}</Text>
                    <Text style={styles.dmRole}>{dm.role}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
  },
  addCommentBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  mentionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  cancelButtonText: {
    color: '#71717A',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyState: {
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentHeaderLeft: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  commentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentTimeText: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  mentionText: {
    color: '#F59E0B',
    fontWeight: '600',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mentionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mentionsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  mentionedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  mentionedLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
    marginBottom: 6,
  },
  mentionedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  mentionedChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  mentionedChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D97706',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  dmList: {
    padding: 16,
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  dmAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dmAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066FF',
  },
  dmInfo: {
    flex: 1,
  },
  dmName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  dmRole: {
    fontSize: 12,
    color: '#71717A',
  },
});
