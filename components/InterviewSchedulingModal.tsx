import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput, Platform } from 'react-native';
import { X, Calendar, Clock, Users, MapPin, MessageSquare } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Candidate } from '../types';
import { useApp } from '../contexts/AppContext';

interface InterviewSchedulingModalProps {
  visible: boolean;
  candidate: Candidate;
  onClose: () => void;
}

export default function InterviewSchedulingModal({
  visible,
  candidate,
  onClose,
}: InterviewSchedulingModalProps) {
  const { companies, handleScheduleInterview } = useApp();
  const company = companies.find(c => c.id === candidate.companyId);
  const decisionMakers = company?.decisionMakers || [];

  const [interviewDate, setInterviewDate] = useState(new Date());
  const [interviewTime, setInterviewTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const toggleParticipant = (dmId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(dmId)
        ? prev.filter(id => id !== dmId)
        : [...prev, dmId]
    );
  };

  const handleSave = () => {
    if (!handleScheduleInterview) {
      alert('Функция планирования интервью недоступна');
      return;
    }

    if (selectedParticipants.length === 0) {
      alert('Выберите хотя бы одного участника');
      return;
    }

    const dateString = interviewDate.toISOString().split('T')[0];
    const timeString = interviewTime.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    handleScheduleInterview(
      candidate.id,
      dateString,
      timeString,
      selectedParticipants,
      location,
      notes
    );

    // Reset form
    setLocation('');
    setNotes('');
    setSelectedParticipants([]);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Запланировать интервью</Text>
              <Text style={styles.modalSubtitle}>{candidate.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#71717A" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Date Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Calendar size={18} color="#0066FF" />
                <Text style={styles.sectionTitle}>Дата</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDate(interviewDate)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={interviewDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setInterviewDate(selectedDate);
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Time Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={18} color="#10B981" />
                <Text style={styles.sectionTitle}>Время</Text>
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatTime(interviewTime)}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={interviewTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setInterviewTime(selectedTime);
                    }
                  }}
                />
              )}
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MapPin size={18} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Место проведения</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Офис, ссылка на Zoom, Google Meet и т.д."
                placeholderTextColor="#A1A1AA"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Participants */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={18} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Участники из компании</Text>
              </View>
              {decisionMakers.length === 0 ? (
                <Text style={styles.emptyText}>Нет ЛПР для выбора</Text>
              ) : (
                <View style={styles.participantsList}>
                  {decisionMakers.map(dm => (
                    <TouchableOpacity
                      key={dm.id}
                      style={[
                        styles.participantItem,
                        selectedParticipants.includes(dm.id) && styles.participantItemSelected
                      ]}
                      onPress={() => toggleParticipant(dm.id)}
                    >
                      <View style={styles.participantAvatar}>
                        <Text style={styles.participantAvatarText}>
                          {dm.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </View>
                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{dm.name}</Text>
                        <Text style={styles.participantRole}>{dm.role}</Text>
                      </View>
                      {selectedParticipants.includes(dm.id) && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MessageSquare size={18} color="#EF4444" />
                <Text style={styles.sectionTitle}>Дополнительные заметки</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Темы для обсуждения, особые инструкции..."
                placeholderTextColor="#A1A1AA"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Запланировать</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },
  modalBody: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  dateButton: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000000',
  },
  textArea: {
    minHeight: 100,
  },
  participantsList: {
    gap: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
  },
  participantItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0066FF',
    borderWidth: 2,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066FF',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  participantRole: {
    fontSize: 12,
    color: '#71717A',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    color: '#A1A1AA',
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#52525B',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#0066FF',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
