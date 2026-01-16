import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, X, Plus } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { Vacancy } from '../../types';

const LOCATIONS = [
  { city: 'Алматы', country: 'Казахстан' },
  { city: 'Астана', country: 'Казахстан' },
  { city: 'Шымкент', country: 'Казахстан' },
  { city: 'Караганда', country: 'Казахстан' },
  { city: 'Актобе', country: 'Казахстан' },
  { city: 'Тараз', country: 'Казахстан' },
  { city: 'Павлодар', country: 'Казахстан' },
  { city: 'Атырау', country: 'Казахстан' },
  { city: 'Костанай', country: 'Казахстан' },
  { city: 'Москва', country: 'Россия' },
  { city: 'Санкт-Петербург', country: 'Россия' },
  { city: 'Ташкент', country: 'Узбекистан' },
  { city: 'Бишкек', country: 'Кыргызстан' },
  { city: 'Тбилиси', country: 'Грузия' },
  { city: 'Баку', country: 'Азербайджан' },
  { city: 'Ереван', country: 'Армения' },
  { city: 'Дубай', country: 'ОАЭ' },
];

export default function NewVacancyScreen() {
  const router = useRouter();
  const { handleCreateVacancy, companies, currentUser } = useApp();

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{id: string, name: string} | null>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{city: string, country: string} | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    experienceYears: '',
    officeAddress: '',
  });

  const [workFormat, setWorkFormat] = useState<string[]>([]);

  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [conditions, setConditions] = useState<string[]>(['']);
  const [niceToHave, setNiceToHave] = useState<string[]>(['']);

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const toggleWorkFormat = (format: string) => {
    setWorkFormat(prev => {
      if (prev.includes(format)) {
        return prev.filter(f => f !== format);
      } else {
        return [...prev, format];
      }
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Ошибка', 'Введите название вакансии');
      return;
    }

    if (!selectedCompany) {
      Alert.alert('Ошибка', 'Выберите компанию');
      return;
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      Alert.alert('Ошибка', 'Укажите диапазон зарплаты');
      return;
    }

    const newVacancy: Vacancy = {
      id: `vac_${Date.now()}`,
      title: formData.title,
      companyId: selectedCompany.id,
      recruiterId: currentUser.id,
      description: formData.description,
      location: selectedLocation ? {
        city: selectedLocation.city,
        country: selectedLocation.country,
        address: formData.officeAddress || undefined
      } : undefined,
      workFormat: workFormat.length > 0 ? workFormat as ('office' | 'remote' | 'hybrid')[] : undefined,
      experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
      requirements: requirements.filter(r => r.trim() !== ''),
      responsibilities: responsibilities.filter(r => r.trim() !== ''),
      conditions: conditions.filter(c => c.trim() !== ''),
      niceToHave: niceToHave.filter(n => n.trim() !== ''),
      salaryRange: {
        min: parseInt(formData.salaryMin),
        max: parseInt(formData.salaryMax),
      },
      status: 'active',
      history: [{
        date: new Date().toISOString(),
        user: currentUser.name,
        action: 'Создана вакансия',
        details: `Вакансия "${formData.title}" создана`
      }]
    };

    handleCreateVacancy(newVacancy);
    Alert.alert('Успех', 'Вакансия успешно создана', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const renderArrayInput = (
    title: string,
    items: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string
  ) => (
    <View style={styles.formGroup}>
      <View style={styles.sectionHeader}>
        <Text style={styles.label}>{title}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addItem(setter)}
        >
          <Plus size={16} color="#0066FF" />
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder={placeholder}
            value={item}
            onChangeText={(text) => updateItem(setter, index, text)}
          />
          {items.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(setter, index)}
            >
              <X size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новая вакансия</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Company Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Компания *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowCompanyModal(true)}
            >
              <Text style={[styles.selectButtonText, !selectedCompany && styles.selectButtonPlaceholder]}>
                {selectedCompany ? selectedCompany.name : 'Выберите компанию'}
              </Text>
              <ChevronDown size={20} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Название вакансии *</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: Senior React Native Developer"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Город</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowLocationModal(true)}
            >
              <Text style={[styles.selectButtonText, !selectedLocation && styles.selectButtonPlaceholder]}>
                {selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : 'Выберите город'}
              </Text>
              <ChevronDown size={20} color="#71717A" />
            </TouchableOpacity>
          </View>

          {/* Office Address */}
          {selectedLocation && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Адрес офиса (опционально)</Text>
              <TextInput
                style={styles.input}
                placeholder="Например: ул. Абая 150, БЦ «Нурлы Тау», офис 501"
                value={formData.officeAddress}
                onChangeText={(text) => setFormData({ ...formData, officeAddress: text })}
                multiline
              />
            </View>
          )}

          {/* Work Format */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Формат работы</Text>
            <View style={styles.checkboxGroup}>
              <TouchableOpacity
                style={[styles.checkbox, workFormat.includes('office') && styles.checkboxActive]}
                onPress={() => toggleWorkFormat('office')}
              >
                <View style={[styles.checkboxBox, workFormat.includes('office') && styles.checkboxBoxActive]}>
                  {workFormat.includes('office') && (
                    <View style={styles.checkboxCheck} />
                  )}
                </View>
                <Text style={[styles.checkboxText, workFormat.includes('office') && styles.checkboxTextActive]}>
                  Офис
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.checkbox, workFormat.includes('remote') && styles.checkboxActive]}
                onPress={() => toggleWorkFormat('remote')}
              >
                <View style={[styles.checkboxBox, workFormat.includes('remote') && styles.checkboxBoxActive]}>
                  {workFormat.includes('remote') && (
                    <View style={styles.checkboxCheck} />
                  )}
                </View>
                <Text style={[styles.checkboxText, workFormat.includes('remote') && styles.checkboxTextActive]}>
                  Удаленно
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.checkbox, workFormat.includes('hybrid') && styles.checkboxActive]}
                onPress={() => toggleWorkFormat('hybrid')}
              >
                <View style={[styles.checkboxBox, workFormat.includes('hybrid') && styles.checkboxBoxActive]}>
                  {workFormat.includes('hybrid') && (
                    <View style={styles.checkboxCheck} />
                  )}
                </View>
                <Text style={[styles.checkboxText, workFormat.includes('hybrid') && styles.checkboxTextActive]}>
                  Гибрид
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Experience Years */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Требуемый опыт (лет)</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: 5"
              value={formData.experienceYears}
              onChangeText={(text) => setFormData({ ...formData, experienceYears: text })}
              keyboardType="numeric"
            />
          </View>

          {/* Salary Range */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Диапазон зарплаты (USD) *</Text>
            <View style={styles.salaryRow}>
              <TextInput
                style={[styles.input, styles.salaryInput]}
                placeholder="Мин"
                value={formData.salaryMin}
                onChangeText={(text) => setFormData({ ...formData, salaryMin: text })}
                keyboardType="numeric"
              />
              <Text style={styles.salaryDivider}>—</Text>
              <TextInput
                style={[styles.input, styles.salaryInput]}
                placeholder="Макс"
                value={formData.salaryMax}
                onChangeText={(text) => setFormData({ ...formData, salaryMax: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Расскажите о вакансии"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Requirements */}
          {renderArrayInput('Требования', requirements, setRequirements, 'Требование к кандидату')}

          {/* Responsibilities */}
          {renderArrayInput('Обязанности', responsibilities, setResponsibilities, 'Обязанность')}

          {/* Conditions */}
          {renderArrayInput('Условия', conditions, setConditions, 'Условие работы')}

          {/* Nice to Have */}
          {renderArrayInput('Будет плюсом', niceToHave, setNiceToHave, 'Дополнительное преимущество')}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Создать вакансию</Text>
          </TouchableOpacity>
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
          <View style={styles.modalContent}>
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
                    selectedCompany?.id === item.id && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedCompany({ id: item.id, name: item.name });
                    setShowCompanyModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {item.industry && (
                    <Text style={styles.modalItemSubtext}>{item.industry}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите город</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={LOCATIONS}
              keyExtractor={(item) => `${item.city}-${item.country}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedLocation?.city === item.city && selectedLocation?.country === item.country && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedLocation(item);
                    setShowLocationModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.city}</Text>
                  <Text style={styles.modalItemSubtext}>{item.country}</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectButton: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
  },
  selectButtonPlaceholder: {
    color: '#9CA3AF',
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  salaryInput: {
    flex: 1,
  },
  salaryDivider: {
    fontSize: 16,
    fontWeight: '500',
    color: '#71717A',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0066FF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputFlex: {
    flex: 1,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    borderBottomColor: '#E4E4E7',
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
    borderBottomColor: '#F4F4F5',
  },
  modalItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  modalItemSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#71717A',
  },
  checkboxGroup: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 10,
    gap: 8,
  },
  checkboxActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0066FF',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D4D4D8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  checkboxCheck: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#71717A',
  },
  checkboxTextActive: {
    color: '#0066FF',
    fontWeight: '500',
  },
});
