import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, Briefcase, Building2, Plus, ChevronRight } from 'lucide-react-native';
import { Vacancy, Company, Candidate } from '../types';
import { useRouter } from 'expo-router';

interface AddToVacancyModalProps {
  visible: boolean;
  candidate: Candidate | null;
  vacancies: Vacancy[];
  companies: Company[];
  onClose: () => void;
  onSelectVacancy: (candidateId: string, vacancyId: string) => void;
  onCreateVacancy: () => void;
}

export const AddToVacancyModal: React.FC<AddToVacancyModalProps> = ({
  visible,
  candidate,
  vacancies,
  companies,
  onClose,
  onSelectVacancy,
  onCreateVacancy,
}) => {
  const router = useRouter();
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);

  // Only show active vacancies
  const activeVacancies = vacancies.filter(v => v.status === 'active');

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Компания';
  };

  const handleConfirm = () => {
    if (selectedVacancyId && candidate) {
      onSelectVacancy(candidate.id, selectedVacancyId);
      setSelectedVacancyId(null);
      onClose();
    }
  };

  const handleCreateVacancy = () => {
    onClose();
    onCreateVacancy();
  };

  if (!visible) return null;

  // Empty state - no vacancies
  if (activeVacancies.length === 0) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Добавить кандидата в вакансию</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Empty State */}
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Briefcase size={48} color="#E0E0E0" />
              </View>
              <Text style={styles.emptyTitle}>У вас пока нет созданных вакансий</Text>
              <Text style={styles.emptyDescription}>
                Создайте первую вакансию, чтобы начать процесс подбора кандидатов
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.emptyActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Отменить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateVacancy}>
                <Text style={styles.createButtonText}>Создать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Normal state - list of vacancies
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Добавить кандидата в вакансию</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Candidate Info */}
          {candidate && (
            <View style={styles.candidateInfo}>
              <View style={styles.candidateAvatar}>
                <Text style={styles.candidateInitials}>
                  {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
              <View style={styles.candidateDetails}>
                <Text style={styles.candidateName}>{candidate.name}</Text>
                <Text style={styles.candidatePosition}>{candidate.position}</Text>
              </View>
            </View>
          )}

          {/* Vacancy List */}
          <Text style={styles.sectionTitle}>Выберите вакансию</Text>
          <ScrollView style={styles.vacancyList} showsVerticalScrollIndicator={false}>
            {activeVacancies.map(vacancy => (
              <TouchableOpacity
                key={vacancy.id}
                style={[
                  styles.vacancyItem,
                  selectedVacancyId === vacancy.id && styles.vacancyItemSelected,
                ]}
                onPress={() => setSelectedVacancyId(vacancy.id)}
              >
                <View style={styles.vacancyIcon}>
                  <Building2 size={20} color="#4A5FD6" />
                </View>
                <View style={styles.vacancyInfo}>
                  <Text style={styles.vacancyTitle}>{vacancy.title}</Text>
                  <Text style={styles.vacancyCompany}>
                    в {getCompanyName(vacancy.companyId)}
                  </Text>
                  <View style={styles.vacancyMeta}>
                    <Text style={styles.vacancySalary}>
                      ${vacancy.salaryRange?.min || 0} - ${vacancy.salaryRange?.max || 0}
                    </Text>
                    <Text style={styles.vacancyLocation}>
                      • {vacancy.location?.city || 'Не указано'}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedVacancyId === vacancy.id && styles.radioOuterSelected,
                ]}>
                  {selectedVacancyId === vacancy.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Create New Vacancy Option */}
            <TouchableOpacity
              style={styles.createNewItem}
              onPress={handleCreateVacancy}
            >
              <View style={styles.createNewIcon}>
                <Plus size={20} color="#4A5FD6" />
              </View>
              <Text style={styles.createNewText}>Создать новую вакансию</Text>
              <ChevronRight size={20} color="#9E9E9E" />
            </TouchableOpacity>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Отменить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedVacancyId && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!selectedVacancyId}
            >
              <Text style={[
                styles.confirmButtonText,
                !selectedVacancyId && styles.confirmButtonTextDisabled,
              ]}>
                Добавить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  candidateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
  },
  candidateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  candidateInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2875',
  },
  candidateDetails: {
    flex: 1,
  },
  candidateName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  candidatePosition: {
    fontSize: 13,
    color: '#616161',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  vacancyList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  vacancyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 8,
  },
  vacancyItemSelected: {
    borderColor: '#4A5FD6',
    backgroundColor: '#F5F7FF',
  },
  vacancyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vacancyInfo: {
    flex: 1,
  },
  vacancyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  vacancyCompany: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
  },
  vacancyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacancySalary: {
    fontSize: 12,
    fontWeight: '500',
    color: '#424242',
  },
  vacancyLocation: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#4A5FD6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A5FD6',
  },
  createNewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  createNewIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  createNewText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5FD6',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  confirmButtonTextDisabled: {
    color: '#9E9E9E',
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
