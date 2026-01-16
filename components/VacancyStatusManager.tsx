import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { CheckCircle2, XCircle, Lock, Unlock } from 'lucide-react-native';
import { Vacancy } from '../types';
import { useApp } from '../contexts/AppContext';

interface VacancyStatusManagerProps {
  vacancy: Vacancy;
}

export default function VacancyStatusManager({ vacancy }: VacancyStatusManagerProps) {
  const { handleCloseVacancy, handleReopenVacancy } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [actionType, setActionType] = useState<'close' | 'reopen'>('close');

  const handleOpenModal = (action: 'close' | 'reopen') => {
    setActionType(action);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      Alert.alert('Ошибка', 'Укажите причину');
      return;
    }

    if (actionType === 'close') {
      handleCloseVacancy?.(vacancy.id, reason);
    } else {
      handleReopenVacancy?.(vacancy.id, reason);
    }

    setReason('');
    setShowModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusBadgeContainer}>
            {vacancy.status === 'active' ? (
              <>
                <Unlock size={16} color="#10B981" />
                <Text style={styles.statusBadgeTextActive}>Активна</Text>
              </>
            ) : (
              <>
                <Lock size={16} color="#EF4444" />
                <Text style={styles.statusBadgeTextClosed}>Закрыта</Text>
              </>
            )}
          </View>

          {vacancy.status === 'active' ? (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleOpenModal('close')}
            >
              <XCircle size={18} color="#EF4444" />
              <Text style={styles.closeButtonText}>Закрыть вакансию</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.reopenButton}
              onPress={() => handleOpenModal('reopen')}
            >
              <CheckCircle2 size={18} color="#10B981" />
              <Text style={styles.reopenButtonText}>Открыть заново</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === 'close' ? 'Закрыть вакансию' : 'Открыть вакансию заново'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {vacancy.title}
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder={
                actionType === 'close'
                  ? 'Причина закрытия (кандидат нанят, вакансия отменена и т.д.)'
                  : 'Причина повторного открытия'
              }
              placeholderTextColor="#A1A1AA"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowModal(false);
                  setReason('');
                }}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  actionType === 'close' ? styles.confirmButtonClose : styles.confirmButtonReopen
                ]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>
                  {actionType === 'close' ? 'Закрыть' : 'Открыть'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
  },
  statusBadgeTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  statusBadgeTextClosed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  reopenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  reopenButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000000',
    minHeight: 100,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
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
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonClose: {
    backgroundColor: '#EF4444',
  },
  confirmButtonReopen: {
    backgroundColor: '#10B981',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
