import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, StyleSheet } from 'react-native';
import { X, Send } from 'lucide-react-native';
import { Candidate, CandidateStatus } from '../types';
import { useApp } from '../contexts/AppContext';

interface StatusChangeModalProps {
  visible: boolean;
  candidate: Candidate;
  onClose: () => void;
}

export default function StatusChangeModal({ visible, candidate, onClose }: StatusChangeModalProps) {
  const { handleStatusChange } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<CandidateStatus>(candidate.status);
  const [comment, setComment] = useState('');
  const [notifyClient, setNotifyClient] = useState(false);

  const statuses: CandidateStatus[] = [
    CandidateStatus.NEW,
    CandidateStatus.SENT_TO_CLIENT,
    CandidateStatus.CLIENT_INTERVIEW,
    CandidateStatus.TEST_TASK,
    CandidateStatus.SECURITY_CHECK,
    CandidateStatus.OFFER,
    CandidateStatus.HIRED,
    CandidateStatus.REJECTED,
    CandidateStatus.BLACKLIST,
  ];

  const getStatusStyle = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.NEW:
        return { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' };
      case CandidateStatus.SENT_TO_CLIENT:
        return { backgroundColor: '#F3E8FF', borderColor: '#D8B4FE' };
      case CandidateStatus.CLIENT_INTERVIEW:
        return { backgroundColor: '#E0E7FF', borderColor: '#A5B4FC' };
      case CandidateStatus.TEST_TASK:
        return { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' };
      case CandidateStatus.SECURITY_CHECK:
        return { backgroundColor: '#FED7AA', borderColor: '#FDBA74' };
      case CandidateStatus.OFFER:
        return { backgroundColor: '#CCFBF1', borderColor: '#5EEAD4' };
      case CandidateStatus.HIRED:
        return { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' };
      case CandidateStatus.REJECTED:
        return { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' };
      case CandidateStatus.BLACKLIST:
        return { backgroundColor: '#1F2937', borderColor: '#111827' };
      default:
        return { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' };
    }
  };

  const getStatusTextColor = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.BLACKLIST:
        return '#FFFFFF';
      default:
        return '#111827';
    }
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      return;
    }

    handleStatusChange(candidate.id, selectedStatus, comment);

    // TODO: Send notification to client if notifyClient is true

    setComment('');
    setNotifyClient(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Изменить статус</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Current Status */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Текущий статус:</Text>
              <View style={[styles.statusBadge, getStatusStyle(candidate.status)]}>
                <Text style={styles.statusText}>{candidate.status}</Text>
              </View>
            </View>

            {/* New Status */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Выберите новый статус:</Text>
              <View style={styles.statusGrid}>
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setSelectedStatus(status)}
                    style={[
                      styles.statusChip,
                      getStatusStyle(status),
                      selectedStatus === status && styles.statusChipSelected,
                    ]}
                  >
                    <Text style={[styles.statusChipText, { color: getStatusTextColor(status) }]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Комментарий: <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Опишите причину изменения статуса или оставьте заметку..."
                placeholderTextColor="#A1A1AA"
                multiline
                numberOfLines={4}
                style={styles.textInput}
              />
            </View>

            {/* Notify Client */}
            <TouchableOpacity
              onPress={() => setNotifyClient(!notifyClient)}
              style={styles.checkboxContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  notifyClient && styles.checkboxChecked,
                ]}
              >
                {notifyClient && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Уведомить заказчика об изменении статуса
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!comment.trim()}
              style={[
                styles.submitButton,
                !comment.trim() && styles.submitButtonDisabled,
              ]}
            >
              <Send size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Сохранить изменения</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
  },
  statusChipSelected: {
    borderColor: '#2563EB',
    borderWidth: 3,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
