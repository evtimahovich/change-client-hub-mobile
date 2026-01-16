import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { FileEdit, Plus, Trash2, Clock } from 'lucide-react-native';

interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

interface RecruiterNotesProps {
  candidateId: string;
}

export default function RecruiterNotes({ candidateId }: RecruiterNotesProps) {
  // In real app, fetch notes from context/API based on candidateId
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 'note_1',
      text: 'Кандидат очень мотивирован, хорошо знает React и TypeScript. Рекомендую отправить клиенту.',
      createdAt: new Date().toISOString(),
      author: 'Алексей Петров',
    },
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNoteText.trim()) {
      Alert.alert('Ошибка', 'Введите текст заметки');
      return;
    }

    const newNote: Note = {
      id: `note_${Date.now()}`,
      text: newNoteText,
      createdAt: new Date().toISOString(),
      author: 'Алексей Петров', // TODO: Get from context
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteText('');
    setIsAdding(false);
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Удалить заметку?',
      'Это действие нельзя отменить',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => setNotes(prev => prev.filter(n => n.id !== noteId)),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FileEdit size={20} color="#F59E0B" />
          <Text style={styles.title}>Заметки рекрутера</Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsAdding(!isAdding)}
          style={styles.addButton}
        >
          <Plus size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {/* Add New Note */}
      {isAdding && (
        <View style={styles.addNoteBox}>
          <TextInput
            value={newNoteText}
            onChangeText={setNewNoteText}
            placeholder="Введите вашу заметку..."
            placeholderTextColor="#A1A1AA"
            multiline
            numberOfLines={4}
            style={styles.textInput}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleAddNote}
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

      {/* Notes List */}
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Пока нет заметок. Добавьте первую заметку!
          </Text>
        </View>
      ) : (
        <View>
          {notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteHeaderLeft}>
                  <Text style={styles.authorText}>{note.author}</Text>
                  <View style={styles.dateRow}>
                    <Clock size={12} color="#A1A1AA" />
                    <Text style={styles.dateText}>
                      {formatDate(note.createdAt)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteNote(note.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          ))}
        </View>
      )}
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
    backgroundColor: '#FED7AA',
    padding: 8,
    borderRadius: 8,
  },
  addNoteBox: {
    marginBottom: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    padding: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#F97316',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  noteCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteHeaderLeft: {
    flex: 1,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
