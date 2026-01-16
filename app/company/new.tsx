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
import { ArrowLeft, ChevronDown, X, Plus, Trash2, Check } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { Company } from '../../types';

// Predefined options
const INDUSTRIES = [
  'IT / Software Development',
  'FinTech',
  'E-commerce',
  'EdTech',
  'Healthcare',
  'Manufacturing',
  'Consulting',
  'Marketing',
  'Real Estate',
  'Logistics',
  'Other'
];

const COMPANY_SIZES = [
  '1-10 сотрудников',
  '11-50 сотрудников',
  '51-200 сотрудников',
  '201-500 сотрудников',
  '501+ сотрудников'
];

interface DecisionMaker {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  communicationStyle?: string;
  hiringPreferences?: string;
}

export default function NewCompanyScreen() {
  const router = useRouter();
  const { handleCreateCompany } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Basic Information
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    employees: '',
    website: '',
    location: '',
    description: '',
    founded: '',
  });

  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Step 2: Decision Makers
  const [decisionMakers, setDecisionMakers] = useState<DecisionMaker[]>([
    {
      id: `dm_${Date.now()}`,
      name: '',
      role: '',
      email: '',
      phone: ''
    }
  ]);

  // Step 3: Create first vacancy option
  const [createVacancy, setCreateVacancy] = useState<'yes' | 'no'>('no');

  const addDecisionMaker = () => {
    if (decisionMakers.length >= 10) {
      Alert.alert('Ограничение', 'Максимум 10 ЛПР можно добавить');
      return;
    }
    setDecisionMakers([...decisionMakers, {
      id: `dm_${Date.now()}_${Math.random()}`,
      name: '',
      role: '',
      email: '',
      phone: ''
    }]);
  };

  const removeDecisionMaker = (id: string) => {
    if (decisionMakers.length > 1) {
      setDecisionMakers(decisionMakers.filter(dm => dm.id !== id));
    }
  };

  const updateDecisionMaker = (id: string, field: keyof DecisionMaker, value: string) => {
    setDecisionMakers(decisionMakers.map(dm =>
      dm.id === id ? { ...dm, [field]: value } : dm
    ));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Введите название компании');
      return false;
    }
    if (!formData.industry) {
      Alert.alert('Ошибка', 'Выберите индустрию');
      return false;
    }
    if (!formData.employees) {
      Alert.alert('Ошибка', 'Выберите размер компании');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (const dm of decisionMakers) {
      if (!dm.name.trim()) {
        Alert.alert('Ошибка', 'Заполните имя для всех ЛПР');
        return false;
      }
      if (!dm.role.trim()) {
        Alert.alert('Ошибка', 'Заполните должность для всех ЛПР');
        return false;
      }
      if (!dm.email.trim()) {
        Alert.alert('Ошибка', 'Заполните email для всех ЛПР');
        return false;
      }
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(dm.email)) {
        Alert.alert('Ошибка', `Некорректный email: ${dm.email}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const sendInvitationEmails = (company: Company) => {
    // Mock email sending functionality
    decisionMakers.forEach(dm => {
      console.log(`
📧 Email отправлен на: ${dm.email}
═══════════════════════════════════════════════════
Тема: Приглашение в Change Client Hub

Здравствуйте, ${dm.name.split(' ')[0]}!

Вы получили доступ к Change Client Hub для управления
процессом подбора персонала в ${company.name}.

Ваш логин: ${dm.email}
Временный пароль: Change2026!

Войти: https://hub.change.kz/login

С уважением,
Команда Change
═══════════════════════════════════════════════════
      `);
    });
  };

  const handleSubmit = () => {
    const newCompany: Company = {
      id: `comp_${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      employees: formData.employees,
      location: formData.location || undefined,
      website: formData.website || undefined,
      description: formData.description || undefined,
      founded: formData.founded || undefined,
      clientSince: new Date().toLocaleDateString('ru-RU'),
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=0066FF`,
      decisionMakers: decisionMakers.map(dm => ({
        id: dm.id,
        name: dm.name,
        role: dm.role,
        email: dm.email,
        phone: dm.phone
      }))
    };

    handleCreateCompany(newCompany);

    // Send invitation emails to all decision makers
    sendInvitationEmails(newCompany);

    Alert.alert(
      'Успех',
      `Компания успешно создана!\n\nПриглашения отправлены на ${decisionMakers.length} email${decisionMakers.length > 1 ? 'а' : ''}.\nПроверьте консоль для деталей.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Шаг {currentStep} из {totalSteps}</Text>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              step <= currentStep && styles.progressSegmentActive
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>
        {currentStep === 1 && 'Основная информация'}
        {currentStep === 2 && 'Добавить ЛПР'}
        {currentStep === 3 && 'Создать вакансию?'}
        {currentStep === 4 && 'Подтверждение'}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Название компании *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tech Innovations LLC"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Индустрия *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowIndustryModal(true)}
          >
            <Text style={[styles.selectButtonText, !formData.industry && styles.selectButtonPlaceholder]}>
              {formData.industry || 'Выбрать из списка'}
            </Text>
            <ChevronDown size={20} color="#71717A" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Размер компании *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowSizeModal(true)}
          >
            <Text style={[styles.selectButtonText, !formData.employees && styles.selectButtonPlaceholder]}>
              {formData.employees || 'Выбрать'}
            </Text>
            <ChevronDown size={20} color="#71717A" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Сайт компании</Text>
          <TextInput
            style={styles.input}
            placeholder="https://techinnovations.com"
            value={formData.website}
            onChangeText={(text) => setFormData({ ...formData, website: text })}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Локация</Text>
          <TextInput
            style={styles.input}
            placeholder="Алматы, Казахстан"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Год основания</Text>
          <TextInput
            style={styles.input}
            placeholder="2020"
            value={formData.founded}
            onChangeText={(text) => setFormData({ ...formData, founded: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Описание (опционально)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Разработка SaaS решений для бизнеса"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.sectionDescription}>
          Добавьте контакты лиц, принимающих решения в компании. После создания им будут отправлены приглашения.
        </Text>

        {decisionMakers.map((dm, index) => (
          <View key={dm.id} style={styles.dmCard}>
            <View style={styles.dmHeader}>
              <View style={styles.dmBadge}>
                <Text style={styles.dmBadgeText}>ЛПР #{index + 1}</Text>
              </View>
              {decisionMakers.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeDecisionMaker(dm.id)}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.dmForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>ФИО *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Мария Иванова"
                  value={dm.name}
                  onChangeText={(text) => updateDecisionMaker(dm.id, 'name', text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Должность *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HR Director"
                  value={dm.role}
                  onChangeText={(text) => updateDecisionMaker(dm.id, 'role', text)}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="maria@techinnovations.com"
                  value={dm.email}
                  onChangeText={(text) => updateDecisionMaker(dm.id, 'email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Телефон *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+7 777 123 4567"
                  value={dm.phone}
                  onChangeText={(text) => updateDecisionMaker(dm.id, 'phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addDmButton, decisionMakers.length >= 10 && styles.addDmButtonDisabled]}
          onPress={addDecisionMaker}
          disabled={decisionMakers.length >= 10}
        >
          <Plus size={20} color={decisionMakers.length >= 10 ? "#9CA3AF" : "#0066FF"} />
          <Text style={[styles.addDmButtonText, decisionMakers.length >= 10 && styles.addDmButtonTextDisabled]}>
            Добавить еще одного ЛПР ({decisionMakers.length}/10)
          </Text>
        </TouchableOpacity>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ После создания компании на email каждого ЛПР будет отправлено приглашение с доступом в систему.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.confirmTitle}>Хотите сразу создать вакансию для {formData.name}?</Text>
        <Text style={styles.confirmSubtitle}>
          Вы сможете добавить вакансии позже в любое время
        </Text>

        <TouchableOpacity
          style={[styles.optionCard, createVacancy === 'yes' && styles.optionCardSelected]}
          onPress={() => setCreateVacancy('yes')}
        >
          <View style={styles.optionRadio}>
            {createVacancy === 'yes' && <View style={styles.optionRadioInner} />}
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Да, создать сейчас</Text>
            <Text style={styles.optionDescription}>
              Создайте первую вакансию прямо после регистрации компании
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, createVacancy === 'no' && styles.optionCardSelected]}
          onPress={() => setCreateVacancy('no')}
        >
          <View style={styles.optionRadio}>
            {createVacancy === 'no' && <View style={styles.optionRadioInner} />}
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Нет, создам позже</Text>
            <Text style={styles.optionDescription}>
              Сначала завершить создание компании
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        <Text style={styles.confirmTitle}>Проверьте данные перед созданием</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Основная информация</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Название:</Text>
            <Text style={styles.summaryValue}>{formData.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Индустрия:</Text>
            <Text style={styles.summaryValue}>{formData.industry}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Размер:</Text>
            <Text style={styles.summaryValue}>{formData.employees}</Text>
          </View>
          {formData.website && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Сайт:</Text>
              <Text style={styles.summaryValue}>{formData.website}</Text>
            </View>
          )}
          {formData.location && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Локация:</Text>
              <Text style={styles.summaryValue}>{formData.location}</Text>
            </View>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>ЛПР ({decisionMakers.length})</Text>
          {decisionMakers.map((dm, index) => (
            <View key={dm.id} style={styles.dmSummary}>
              <View style={styles.dmSummaryHeader}>
                <Text style={styles.dmSummaryNumber}>#{index + 1}</Text>
                <Text style={styles.dmSummaryName}>{dm.name}</Text>
              </View>
              <Text style={styles.dmSummaryDetail}>{dm.role}</Text>
              <Text style={styles.dmSummaryDetail}>{dm.email}</Text>
              <Text style={styles.dmSummaryDetail}>{dm.phone}</Text>
            </View>
          ))}
        </View>

        <View style={styles.confirmBox}>
          <Check size={24} color="#10B981" />
          <Text style={styles.confirmText}>
            Нажмите "Создать компанию" для завершения
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Новая компания</Text>
      </View>

      {renderProgressBar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <View style={styles.footer}>
        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Продолжить →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Создать компанию</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Industry Selection Modal */}
      <Modal
        visible={showIndustryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIndustryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите индустрию</Text>
              <TouchableOpacity onPress={() => setShowIndustryModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={INDUSTRIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    formData.industry === item && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, industry: item });
                    setShowIndustryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {formData.industry === item && (
                    <Check size={20} color="#0066FF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Company Size Selection Modal */}
      <Modal
        visible={showSizeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSizeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите размер компании</Text>
              <TouchableOpacity onPress={() => setShowSizeModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COMPANY_SIZES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    formData.employees === item && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, employees: item });
                    setShowSizeModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {formData.employees === item && (
                    <Check size={20} color="#0066FF" />
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
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717A',
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: '#E4E4E7',
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: '#0066FF',
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  stepContent: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 20,
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
  sectionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    lineHeight: 20,
    marginBottom: 24,
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  dmCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  dmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dmBadge: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dmBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dmForm: {
    gap: 16,
  },
  addDmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addDmButtonDisabled: {
    backgroundColor: '#F4F4F5',
    borderColor: '#E4E4E7',
    opacity: 0.6,
  },
  addDmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0066FF',
  },
  addDmButtonTextDisabled: {
    color: '#9CA3AF',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#92400E',
    lineHeight: 20,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  confirmSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    marginBottom: 32,
    lineHeight: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  optionCardSelected: {
    borderColor: '#0066FF',
    backgroundColor: '#EFF6FF',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E4E4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066FF',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
    width: 100,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
  dmSummary: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  dmSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dmSummaryNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066FF',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dmSummaryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  dmSummaryDetail: {
    fontSize: 13,
    fontWeight: '400',
    color: '#71717A',
    marginBottom: 4,
  },
  confirmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  confirmText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#065F46',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  nextButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontWeight: '400',
    color: '#000000',
  },
});
