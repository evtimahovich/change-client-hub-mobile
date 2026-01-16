import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Upload, Link as LinkIcon, X } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { Vacancy } from '../../types';
import * as DocumentPicker from 'expo-document-picker';

const CITIES = [
  { value: 'Алматы', country: 'Казахстан' },
  { value: 'Астана', country: 'Казахстан' },
  { value: 'Шымкент', country: 'Казахстан' },
  { value: 'Караганда', country: 'Казахстан' },
];

export default function NewVacancyWizard() {
  const router = useRouter();
  const { companies, currentUser, handleCreateVacancy } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Шаг 1: Основная информация
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [contractPrice, setContractPrice] = useState('');
  const [contractDocument, setContractDocument] = useState<string>('');
  const [contractDocumentType, setContractDocumentType] = useState<'link' | 'file'>('link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [workFormats, setWorkFormats] = useState<('office' | 'remote' | 'hybrid')[]>([]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [publishToHH, setPublishToHH] = useState(false);

  // Шаг 2: Требования
  const [requirements, setRequirements] = useState<string[]>(['']);

  // Шаг 3: Условия работы
  const [conditions, setConditions] = useState<string[]>(['']);
  const [niceToHave, setNiceToHave] = useState<string[]>(['']);

  const toggleWorkFormat = (format: 'office' | 'remote' | 'hybrid') => {
    setWorkFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets[0]) {
        setContractDocument(result.assets[0].uri);
        setContractDocumentType('file');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить документ');
    }
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const addCondition = () => {
    setConditions([...conditions, '']);
  };

  const updateCondition = (index: number, value: string) => {
    const updated = [...conditions];
    updated[index] = value;
    setConditions(updated);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const addNiceToHave = () => {
    setNiceToHave([...niceToHave, '']);
  };

  const updateNiceToHave = (index: number, value: string) => {
    const updated = [...niceToHave];
    updated[index] = value;
    setNiceToHave(updated);
  };

  const removeNiceToHave = (index: number) => {
    if (niceToHave.length > 1) {
      setNiceToHave(niceToHave.filter((_, i) => i !== index));
    }
  };

  const validateStep1 = () => {
    if (!selectedCompanyId) {
      Alert.alert('Ошибка', 'Выберите компанию');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название вакансии');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Ошибка', 'Введите описание обязанностей');
      return false;
    }
    if (!salaryMin || !salaryMax) {
      Alert.alert('Ошибка', 'Укажите диапазон зарплаты');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const filledRequirements = requirements.filter(r => r.trim());
    if (filledRequirements.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы одно требование');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const selectedCity = CITIES.find(c => c.value === city);

    const newVacancy: Vacancy = {
      id: `vac_${Date.now()}`,
      title,
      companyId: selectedCompanyId,
      recruiterId: currentUser.id,
      description,
      location: city ? {
        city,
        country: selectedCity?.country || 'Казахстан',
        address: address || undefined,
      } : undefined,
      workFormat: workFormats.length > 0 ? workFormats : undefined,
      experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
      requirements: requirements.filter(r => r.trim()),
      responsibilities: [description],
      conditions: conditions.filter(c => c.trim()),
      niceToHave: niceToHave.filter(n => n.trim()),
      salaryRange: {
        min: parseInt(salaryMin),
        max: parseInt(salaryMax),
      },
      contract: contractPrice ? {
        price: parseInt(contractPrice),
        documentUrl: contractDocument || undefined,
      } : undefined,
      publishToHH,
      status: 'active',
      history: [{
        date: new Date().toISOString(),
        user: currentUser.name,
        action: 'created',
        details: 'Вакансия создана',
      }],
    };

    handleCreateVacancy(newVacancy);
    Alert.alert('Успех', 'Вакансия успешно создана', [
      { text: 'ОК', onPress: () => router.back() }
    ]);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep > step && styles.stepCircleCompleted
          ]}>
            {currentStep > step ? (
              <Check size={16} color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive
              ]}>
                {step}
              </Text>
            )}
          </View>
          <Text style={[
            styles.stepLabel,
            currentStep >= step && styles.stepLabelActive
          ]}>
            {step === 1 && 'Основная\nинформация'}
            {step === 2 && 'Требования к\nкандидату'}
            {step === 3 && 'Условия\nработы'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      {/* Компания */}
      <View style={styles.field}>
        <Text style={styles.label}>Компания *</Text>
        <View style={styles.selectContainer}>
          {companies.map(company => (
            <TouchableOpacity
              key={company.id}
              style={[
                styles.selectOption,
                selectedCompanyId === company.id && styles.selectOptionActive
              ]}
              onPress={() => setSelectedCompanyId(company.id)}
            >
              <Text style={[
                styles.selectOptionText,
                selectedCompanyId === company.id && styles.selectOptionTextActive
              ]}>
                {company.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Договор */}
      <View style={styles.field}>
        <Text style={styles.label}>Договор</Text>
        <View style={styles.contractSection}>
          <View style={styles.priceInput}>
            <TextInput
              style={styles.input}
              placeholder="Цена вакансии"
              placeholderTextColor="#A1A1AA"
              value={contractPrice}
              onChangeText={setContractPrice}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>₸</Text>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
            <Upload size={18} color="#0066FF" />
            <Text style={styles.uploadButtonText}>Загрузить договор</Text>
          </TouchableOpacity>

          {contractDocument && contractDocumentType === 'file' && (
            <View style={styles.uploadedFile}>
              <Text style={styles.uploadedFileText} numberOfLines={1}>
                {contractDocument.split('/').pop()}
              </Text>
              <TouchableOpacity onPress={() => setContractDocument('')}>
                <X size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.orText}>или</Text>

          <View style={styles.linkInput}>
            <LinkIcon size={18} color="#71717A" />
            <TextInput
              style={styles.linkInputField}
              placeholder="https://static.ond.kz/media/..."
              placeholderTextColor="#A1A1AA"
              value={contractDocumentType === 'link' ? contractDocument : ''}
              onChangeText={(text) => {
                setContractDocument(text);
                setContractDocumentType('link');
              }}
            />
          </View>
        </View>
      </View>

      {/* Название вакансии */}
      <View style={styles.field}>
        <Text style={styles.label}>Название вакансии *</Text>
        <TextInput
          style={styles.input}
          placeholder="например: Senior Frontend Developer"
          placeholderTextColor="#A1A1AA"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Должностные обязанности */}
      <View style={styles.field}>
        <Text style={styles.label}>Должностные обязанности (описание) *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Опишите основные обязанности..."
          placeholderTextColor="#A1A1AA"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      {/* Опыт работы */}
      <View style={styles.field}>
        <Text style={styles.label}>Опыт работы</Text>
        <TextInput
          style={styles.input}
          placeholder="Количество лет"
          placeholderTextColor="#A1A1AA"
          value={experienceYears}
          onChangeText={setExperienceYears}
          keyboardType="numeric"
        />
      </View>

      {/* Тип занятости */}
      <View style={styles.field}>
        <Text style={styles.label}>Тип занятости</Text>
        <TextInput
          style={styles.input}
          placeholder="Полная занятость, частичная, проектная"
          placeholderTextColor="#A1A1AA"
          value={employmentType}
          onChangeText={setEmploymentType}
        />
      </View>

      {/* Формат работы */}
      <View style={styles.field}>
        <Text style={styles.label}>Формат работы</Text>
        <View style={styles.checkboxGroup}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleWorkFormat('office')}
          >
            <View style={[styles.checkboxBox, workFormats.includes('office') && styles.checkboxBoxChecked]}>
              {workFormats.includes('office') && <Check size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Офис</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleWorkFormat('remote')}
          >
            <View style={[styles.checkboxBox, workFormats.includes('remote') && styles.checkboxBoxChecked]}>
              {workFormats.includes('remote') && <Check size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Удаленка</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleWorkFormat('hybrid')}
          >
            <View style={[styles.checkboxBox, workFormats.includes('hybrid') && styles.checkboxBoxChecked]}>
              {workFormats.includes('hybrid') && <Check size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Гибрид</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Уровень ЗП */}
      <View style={styles.field}>
        <Text style={styles.label}>Уровень ЗП *</Text>
        <View style={styles.salaryRow}>
          <View style={styles.salaryInput}>
            <Text style={styles.salaryLabel}>От</Text>
            <TextInput
              style={styles.salaryField}
              placeholder="0"
              placeholderTextColor="#A1A1AA"
              value={salaryMin}
              onChangeText={setSalaryMin}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>₸</Text>
          </View>

          <View style={styles.salaryInput}>
            <Text style={styles.salaryLabel}>До</Text>
            <TextInput
              style={styles.salaryField}
              placeholder="0"
              placeholderTextColor="#A1A1AA"
              value={salaryMax}
              onChangeText={setSalaryMax}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>₸</Text>
          </View>
        </View>
      </View>

      {/* Город */}
      <View style={styles.field}>
        <Text style={styles.label}>Город</Text>
        <View style={styles.selectContainer}>
          {CITIES.map(cityItem => (
            <TouchableOpacity
              key={cityItem.value}
              style={[
                styles.selectOption,
                city === cityItem.value && styles.selectOptionActive
              ]}
              onPress={() => setCity(cityItem.value)}
            >
              <Text style={[
                styles.selectOptionText,
                city === cityItem.value && styles.selectOptionTextActive
              ]}>
                {cityItem.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Адрес офиса */}
      {workFormats.includes('office') && (
        <View style={styles.field}>
          <Text style={styles.label}>Адрес офиса</Text>
          <TextInput
            style={styles.input}
            placeholder="Улица, дом"
            placeholderTextColor="#A1A1AA"
            value={address}
            onChangeText={setAddress}
          />
        </View>
      )}

      {/* Опубликовать на hh.kz */}
      <View style={styles.field}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setPublishToHH(!publishToHH)}
        >
          <View style={[styles.checkboxBox, publishToHH && styles.checkboxBoxChecked]}>
            {publishToHH && <Check size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Опубликовать на hh.kz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Требования к кандидату</Text>
      <Text style={styles.sectionDescription}>
        Укажите обязательные требования к кандидату
      </Text>

      {requirements.map((req, index) => (
        <View key={index} style={styles.arrayItemContainer}>
          <TextInput
            style={[styles.input, styles.arrayInput]}
            placeholder={`Требование ${index + 1}`}
            placeholderTextColor="#A1A1AA"
            value={req}
            onChangeText={(text) => updateRequirement(index, text)}
            multiline
          />
          {requirements.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeRequirement(index)}
            >
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
        <Text style={styles.addButtonText}>+ Добавить требование</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>Условия работы</Text>
      <Text style={styles.sectionDescription}>
        Опишите, что предлагает компания
      </Text>

      {conditions.map((cond, index) => (
        <View key={index} style={styles.arrayItemContainer}>
          <TextInput
            style={[styles.input, styles.arrayInput]}
            placeholder={`Условие ${index + 1}`}
            placeholderTextColor="#A1A1AA"
            value={cond}
            onChangeText={(text) => updateCondition(index, text)}
            multiline
          />
          {conditions.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeCondition(index)}
            >
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addCondition}>
        <Text style={styles.addButtonText}>+ Добавить условие</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Будет плюсом</Text>
      <Text style={styles.sectionDescription}>
        Необязательные навыки и качества
      </Text>

      {niceToHave.map((nice, index) => (
        <View key={index} style={styles.arrayItemContainer}>
          <TextInput
            style={[styles.input, styles.arrayInput]}
            placeholder={`Плюс ${index + 1}`}
            placeholderTextColor="#A1A1AA"
            value={nice}
            onChangeText={(text) => updateNiceToHave(index, text)}
            multiline
          />
          {niceToHave.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeNiceToHave(index)}
            >
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addNiceToHave}>
        <Text style={styles.addButtonText}>+ Добавить плюс</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новая вакансия</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevious}>
            <Text style={styles.secondaryButtonText}>Назад</Text>
          </TouchableOpacity>
        )}

        {currentStep < 3 ? (
          <TouchableOpacity
            style={[styles.primaryButton, currentStep === 1 && styles.primaryButtonFull]}
            onPress={handleNext}
          >
            <Text style={styles.primaryButtonText}>Далее</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, styles.primaryButtonFull]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>Создать вакансию</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#0066FF',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A1A1AA',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 14,
  },
  stepLabelActive: {
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#000000',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    gap: 8,
  },
  selectOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    padding: 14,
  },
  selectOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0066FF',
    borderWidth: 2,
  },
  selectOptionText: {
    fontSize: 15,
    color: '#52525B',
    fontWeight: '500',
  },
  selectOptionTextActive: {
    color: '#0066FF',
    fontWeight: '600',
  },
  contractSection: {
    gap: 12,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingRight: 14,
  },
  currency: {
    fontSize: 15,
    fontWeight: '600',
    color: '#71717A',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingVertical: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066FF',
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 12,
  },
  uploadedFileText: {
    flex: 1,
    fontSize: 13,
    color: '#15803D',
    marginRight: 8,
  },
  orText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  linkInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  linkInputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000000',
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D4D4D8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  salaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  salaryInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingHorizontal: 14,
    gap: 8,
  },
  salaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
  },
  salaryField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 20,
  },
  arrayItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  arrayInput: {
    flex: 1,
  },
  removeButton: {
    padding: 10,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E7',
    marginVertical: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52525B',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#0066FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonFull: {
    flex: 2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
