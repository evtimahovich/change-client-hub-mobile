import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, ChevronDown, X } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { Candidate, CandidateStatus } from '../../types';
import PDFUploadParser from '../../components/PDFUploadParser';
import VideoUploadTranscription from '../../components/VideoUploadTranscription';

export default function NewCandidateScreen() {
  const router = useRouter();
  const { setCandidates, currentUser, companies, vacancies } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    location: '',
    experienceYears: 0,
    skills: [] as string[],
    salaryExpectation: 0,
  });

  const [videoUrl, setVideoUrl] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');

  const [selectedCompany, setSelectedCompany] = useState<{id: string, name: string} | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<{id: string, title: string} | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showVacancyModal, setShowVacancyModal] = useState(false);

  // Filter vacancies by selected company
  const filteredVacancies = useMemo(() => {
    if (!selectedCompany) return [];
    return vacancies.filter(v => v.companyId === selectedCompany.id && v.status === 'active');
  }, [vacancies, selectedCompany]);

  const handlePDFDataParsed = (data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const handleVideoUploaded = (url: string, transcript: string) => {
    setVideoUrl(url);
    setTranscription(transcript);
  };

  const handleSaveCandidate = () => {
    // Validation
    if (!formData.name || !formData.position || !formData.email) {
      Alert.alert('Ошибка', 'Заполните обязательные поля: Имя, Должность, Email');
      return;
    }

    if (!selectedCompany) {
      Alert.alert('Ошибка', 'Выберите компанию');
      return;
    }

    if (!selectedVacancy) {
      Alert.alert('Ошибка', 'Выберите вакансию');
      return;
    }

    const newCandidate: Candidate = {
      id: `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      position: formData.position,
      location: formData.location || 'Не указано',
      email: formData.email,
      phone: formData.phone || '',
      salaryExpectation: formData.salaryExpectation,
      experienceYears: formData.experienceYears,
      skills: formData.skills,
      status: CandidateStatus.NEW,
      shortlisted: false,
      videoUrl: videoUrl || undefined,
      transcription: transcription || undefined,
      history: [
        {
          id: `hist_${Date.now()}`,
          date: new Date().toISOString(),
          type: 'comment',
          user: currentUser.name,
          details: 'Кандидат добавлен в систему',
        },
      ],
      isNew: true,
    };

    setCandidates(prev => [newCandidate, ...prev]);

    Alert.alert('Успех', 'Кандидат успешно добавлен!', [
      {
        text: 'OK',
        onPress: () => router.push(`/candidate/${newCandidate.id}`),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Новый кандидат</Text>
          </View>

          <TouchableOpacity
            onPress={handleSaveCandidate}
            style={styles.saveButton}
          >
            <Save size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {/* PDF Upload */}
        <PDFUploadParser onDataParsed={handlePDFDataParsed} />

        {/* Company and Vacancy Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Компания и вакансия</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Компания <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowCompanyModal(true)}
              style={styles.selectInput}
            >
              <Text style={selectedCompany ? styles.selectTextFilled : styles.selectTextPlaceholder}>
                {selectedCompany ? selectedCompany.name : 'Выберите компанию'}
              </Text>
              <ChevronDown size={20} color="#71717A" />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.fieldLabel}>
              Вакансия <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!selectedCompany) {
                  Alert.alert('Ошибка', 'Сначала выберите компанию');
                  return;
                }
                if (filteredVacancies.length === 0) {
                  Alert.alert('Ошибка', 'У выбранной компании нет активных вакансий');
                  return;
                }
                setShowVacancyModal(true);
              }}
              style={styles.selectInput}
              disabled={!selectedCompany}
            >
              <Text style={selectedVacancy ? styles.selectTextFilled : styles.selectTextPlaceholder}>
                {selectedVacancy ? selectedVacancy.title : 'Выберите вакансию'}
              </Text>
              <ChevronDown size={20} color="#71717A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Информация о кандидате</Text>

          <View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Имя <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Иван Иванов"
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Должность <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.position}
                onChangeText={(text) => setFormData(prev => ({ ...prev, position: text }))}
                placeholder="Senior Frontend Developer"
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="ivan@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Телефон</Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="+7 (777) 123-4567"
                keyboardType="phone-pad"
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Локация</Text>
              <TextInput
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Алматы"
                style={styles.textInput}
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <Text style={styles.fieldLabel}>Опыт (лет)</Text>
                <TextInput
                  value={formData.experienceYears.toString()}
                  onChangeText={(text) =>
                    setFormData(prev => ({ ...prev, experienceYears: parseInt(text) || 0 }))
                  }
                  placeholder="5"
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </View>

              <View style={[styles.fieldHalf, styles.fieldHalfRight]}>
                <Text style={styles.fieldLabel}>Зарплата ($)</Text>
                <TextInput
                  value={formData.salaryExpectation.toString()}
                  onChangeText={(text) =>
                    setFormData(prev => ({ ...prev, salaryExpectation: parseInt(text) || 0 }))
                  }
                  placeholder="5000"
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </View>
            </View>

            <View>
              <Text style={styles.fieldLabel}>
                Навыки (через запятую)
              </Text>
              <TextInput
                value={formData.skills.join(', ')}
                onChangeText={(text) =>
                  setFormData(prev => ({
                    ...prev,
                    skills: text.split(',').map(s => s.trim()).filter(s => s),
                  }))
                }
                placeholder="React, TypeScript, Node.js"
                style={styles.textInput}
              />
            </View>
          </View>
        </View>

        {/* Video Upload */}
        <View style={styles.videoSection}>
          <VideoUploadTranscription
            onVideoUploaded={handleVideoUploaded}
          />
        </View>
      </ScrollView>

      {/* Company Selection Modal */}
      <Modal
        visible={showCompanyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompanyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите компанию</Text>
              <TouchableOpacity onPress={() => setShowCompanyModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={companies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCompany?.id === item.id && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCompany({ id: item.id, name: item.name });
                    setSelectedVacancy(null); // Reset vacancy when company changes
                    setShowCompanyModal(false);
                  }}
                >
                  <Text style={styles.modalItemTitle}>{item.name}</Text>
                  {item.industry && (
                    <Text style={styles.modalItemSubtitle}>{item.industry}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Vacancy Selection Modal */}
      <Modal
        visible={showVacancyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVacancyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите вакансию</Text>
              <TouchableOpacity onPress={() => setShowVacancyModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredVacancies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedVacancy?.id === item.id && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedVacancy({ id: item.id, title: item.title });
                    setFormData(prev => ({ ...prev, position: item.title }));
                    setShowVacancyModal(false);
                  }}
                >
                  <Text style={styles.modalItemTitle}>{item.title}</Text>
                  {item.salaryRange && (
                    <Text style={styles.modalItemSubtitle}>
                      ${item.salaryRange.min} - ${item.salaryRange.max}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  selectInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTextFilled: {
    fontSize: 14,
    color: '#111827',
  },
  selectTextPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  fieldHalf: {
    flex: 1,
    marginRight: 8,
  },
  fieldHalfRight: {
    marginRight: 0,
    marginLeft: 8,
  },
  videoSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  modalItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});
