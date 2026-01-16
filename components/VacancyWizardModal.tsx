import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { X, Upload, ChevronDown, Check, Trash2, Briefcase } from 'lucide-react-native';
import { Vacancy, Company } from '../types';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(600, SCREEN_WIDTH * 0.9);

interface ContactPerson {
  id: string;
  name: string;
  position: string;
  phone: string;
  telegram: string;
}

interface VacancyWizardModalProps {
  visible: boolean;
  companies: Company[];
  onClose: () => void;
  onCreateVacancy: (vacancy: Vacancy) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { number: 1, title: 'Основная', subtitle: 'информация' },
  { number: 2, title: 'Требования', subtitle: 'к кандидату' },
  { number: 3, title: 'Условия', subtitle: 'работы' },
  { number: 4, title: 'Процесс', subtitle: 'отбора' },
  { number: 5, title: 'Контакты', subtitle: '' },
];

const LANGUAGES = ['Русский', 'Казахский', 'Английский', 'Украинский', 'Китайский'];

const EDUCATION_OPTIONS = [
  { value: '', label: 'Образование' },
  { value: 'higher', label: 'Высшее' },
  { value: 'incomplete_higher', label: 'Неполное высшее' },
  { value: 'secondary_special', label: 'Среднее специальное' },
  { value: 'secondary', label: 'Среднее' },
  { value: 'none', label: 'Не требуется' },
];

const EMPLOYEE_REGISTRATION_OPTIONS = [
  { value: '', label: 'Оформление сотрудника' },
  { value: 'official', label: 'Официальное трудоустройство' },
  { value: 'contract', label: 'Договор ГПХ' },
  { value: 'ip', label: 'Работа через ИП' },
  { value: 'self_employed', label: 'Самозанятость' },
];

const INTERVIEW_COUNT_OPTIONS = [
  { value: '', label: 'Количество собеседований' },
  { value: '1', label: '1 собеседование' },
  { value: '2', label: '2 собеседования' },
  { value: '3', label: '3 собеседования' },
  { value: '4', label: '4 и более' },
];

const COUNTRY_OPTIONS = [
  { value: '', label: 'Страна' },
  { value: 'kz', label: 'Казахстан' },
  { value: 'ru', label: 'Россия' },
  { value: 'ua', label: 'Украина' },
  { value: 'by', label: 'Беларусь' },
  { value: 'uz', label: 'Узбекистан' },
];

const CITY_OPTIONS = [
  { value: '', label: 'Город' },
  { value: 'almaty', label: 'Алматы' },
  { value: 'astana', label: 'Астана' },
  { value: 'shymkent', label: 'Шымкент' },
  { value: 'karaganda', label: 'Караганда' },
  { value: 'aktobe', label: 'Актобе' },
];

export const VacancyWizardModal: React.FC<VacancyWizardModalProps> = ({
  visible,
  companies,
  onClose,
  onCreateVacancy,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [publishToHH, setPublishToHH] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 1: Basic Info
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [contractPrice, setContractPrice] = useState('');
  const [contractDocument, setContractDocument] = useState<string | null>(null);
  const [vacancyTitle, setVacancyTitle] = useState('');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [employmentType, setEmploymentType] = useState('');
  const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);
  const [workFormat, setWorkFormat] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  // Step 2: Requirements
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [specialSkills, setSpecialSkills] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [personalQualities, setPersonalQualities] = useState('');
  const [education, setEducation] = useState('');
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);

  // Step 3: Conditions
  const [employeeRegistration, setEmployeeRegistration] = useState('');
  const [showRegistrationDropdown, setShowRegistrationDropdown] = useState(false);
  const [workConditions, setWorkConditions] = useState('');
  const [country, setCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [city, setCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Step 4: Selection Process
  const [verificationStages, setVerificationStages] = useState('');
  const [interviewCount, setInterviewCount] = useState('');
  const [showInterviewCountDropdown, setShowInterviewCountDropdown] = useState(false);
  const [interviewers, setInterviewers] = useState('');
  const [stopFactors, setStopFactors] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Step 5: Contacts
  const [contacts, setContacts] = useState<ContactPerson[]>([
    { id: '1', name: '', position: '', phone: '', telegram: '' }
  ]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  const experienceOptions = [
    { value: '0', label: 'Без опыта' },
    { value: '1', label: '1+ год' },
    { value: '2', label: '2+ года' },
    { value: '3', label: '3+ года' },
    { value: '5', label: '5+ лет' },
    { value: '7', label: '7+ лет' },
  ];

  const employmentOptions = [
    { value: 'full', label: 'Полная занятость' },
    { value: 'part', label: 'Частичная занятость' },
    { value: 'project', label: 'Проектная работа' },
    { value: 'internship', label: 'Стажировка' },
  ];

  const toggleWorkFormat = (format: string) => {
    setWorkFormat(prev =>
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      { id: `${Date.now()}`, name: '', position: '', phone: '', telegram: '' }
    ]);
  };

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const updateContact = (id: string, field: keyof ContactPerson, value: string) => {
    setContacts(contacts.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleSaveDraft = () => {
    onClose();
  };

  const handleCreate = () => {
    const newVacancy: Vacancy = {
      id: `v_${Date.now()}`,
      title: vacancyTitle,
      companyId: selectedCompanyId,
      recruiterId: 'current_user',
      description: description,
      location: {
        country: COUNTRY_OPTIONS.find(c => c.value === country)?.label || '',
        city: CITY_OPTIONS.find(c => c.value === city)?.label || '',
        address: '',
      },
      workFormat: workFormat as ('office' | 'remote' | 'hybrid')[],
      experienceYears: parseInt(experienceYears) || 0,
      requirements: skills,
      responsibilities: [],
      conditions: [],
      niceToHave: [],
      salaryRange: {
        min: parseInt(salaryMin) || 0,
        max: parseInt(salaryMax) || 0,
      },
      contract: {
        price: parseInt(contractPrice) || 0,
        documentUrl: contractDocument || undefined,
      },
      publishToHH: publishToHH,
      status: 'active',
      history: [{
        date: new Date().toISOString(),
        user: 'Текущий пользователь',
        action: 'created',
        details: 'Вакансия создана',
      }],
      employmentType: employmentType,
      workConditions: workConditions,
      contactPersons: contacts.filter(c => c.name).map(c => ({
        id: c.id,
        name: c.name,
        position: c.position,
        phone: c.phone,
      })),
    };

    onCreateVacancy(newVacancy);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    onClose();
    resetForm();
  };

  const handleGoToVacancies = () => {
    setShowSuccessModal(false);
    onClose();
    resetForm();
    router.push('/(tabs)/vacancies');
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedCompanyId('');
    setContractPrice('');
    setContractDocument(null);
    setVacancyTitle('');
    setDescription('');
    setExperienceYears('');
    setEmploymentType('');
    setWorkFormat([]);
    setSalaryMin('');
    setSalaryMax('');
    setSkills([]);
    setSpecialSkills('');
    setSelectedLanguages([]);
    setPersonalQualities('');
    setEducation('');
    setEmployeeRegistration('');
    setWorkConditions('');
    setCountry('');
    setCity('');
    setVerificationStages('');
    setInterviewCount('');
    setInterviewers('');
    setStopFactors('');
    setAdditionalInfo('');
    setContacts([{ id: '1', name: '', position: '', phone: '', telegram: '' }]);
    setPublishToHH(false);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step.number}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => setCurrentStep(step.number as Step)}
          >
            <View style={[
              styles.stepCircle,
              currentStep === step.number && styles.stepCircleActive,
              currentStep > step.number && styles.stepCircleCompleted,
            ]}>
              {currentStep > step.number ? (
                <Check size={12} color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  currentStep === step.number && styles.stepNumberActive,
                ]}>
                  {step.number}
                </Text>
              )}
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={[
                styles.stepTitle,
                currentStep === step.number && styles.stepTitleActive,
              ]}>
                {step.title}
              </Text>
              {step.subtitle && (
                <Text style={[
                  styles.stepSubtitle,
                  currentStep === step.number && styles.stepSubtitleActive,
                ]}>
                  {step.subtitle}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          {index < STEPS.length - 1 && (
            <View style={[
              styles.stepLine,
              currentStep > step.number && styles.stepLineCompleted,
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepHeaderTitle}>Основная информация</Text>
        <TouchableOpacity
          style={styles.publishCheckbox}
          onPress={() => setPublishToHH(!publishToHH)}
        >
          <View style={[styles.checkbox, publishToHH && styles.checkboxChecked]}>
            {publishToHH && <Check size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Опубликовать на hh.kz</Text>
        </TouchableOpacity>
      </View>

      {/* Company Selection */}
      <Text style={styles.fieldLabel}>Компания</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowCompanyDropdown(!showCompanyDropdown)}
      >
        <Text style={selectedCompanyId ? styles.dropdownText : styles.dropdownPlaceholder}>
          {selectedCompany?.name || 'Выберите компанию'}
        </Text>
        <ChevronDown size={20} color="#9E9E9E" />
      </TouchableOpacity>
      {showCompanyDropdown && (
        <View style={styles.dropdownMenu}>
          {companies.map(company => (
            <TouchableOpacity
              key={company.id}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedCompanyId(company.id);
                setShowCompanyDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{company.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Contract Section */}
      <View style={styles.contractSection}>
        <Text style={styles.contractTitle}>Договор</Text>
        <View style={styles.contractContent}>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.priceInput}
              value={contractPrice}
              onChangeText={setContractPrice}
              placeholder="Цена вакансии"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
            />
            <Text style={styles.currencyLabel}>USD</Text>
          </View>

          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={20} color="#9E9E9E" />
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>Загрузить договор</Text>
              <Text style={styles.uploadFormats}>pdf, xml, dbf, txt, png, jpeg, doc, docx, xls, xlsx</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vacancy Title */}
      <TextInput
        style={styles.textInput}
        value={vacancyTitle}
        onChangeText={setVacancyTitle}
        placeholder="Название вакансии"
        placeholderTextColor="#9E9E9E"
      />

      {/* Description */}
      <TextInput
        style={[styles.textInput, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Должностные обязанности (описание)"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Experience & Employment Type */}
      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowExperienceDropdown(!showExperienceDropdown)}
          >
            <Text style={experienceYears ? styles.dropdownText : styles.dropdownPlaceholder}>
              {experienceOptions.find(o => o.value === experienceYears)?.label || 'Опыт работы'}
            </Text>
            <ChevronDown size={20} color="#9E9E9E" />
          </TouchableOpacity>
          {showExperienceDropdown && (
            <View style={styles.dropdownMenu}>
              {experienceOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setExperienceYears(option.value);
                    setShowExperienceDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.halfField}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowEmploymentDropdown(!showEmploymentDropdown)}
          >
            <Text style={employmentType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {employmentOptions.find(o => o.value === employmentType)?.label || 'Тип занятости'}
            </Text>
            <ChevronDown size={20} color="#9E9E9E" />
          </TouchableOpacity>
          {showEmploymentDropdown && (
            <View style={styles.dropdownMenu}>
              {employmentOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setEmploymentType(option.value);
                    setShowEmploymentDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Work Format */}
      <Text style={styles.fieldLabel}>Формат работы</Text>
      <View style={styles.workFormatRow}>
        {[
          { value: 'office', label: 'Офис' },
          { value: 'remote', label: 'Удаленка' },
          { value: 'hybrid', label: 'Гибрид' },
        ].map(format => (
          <TouchableOpacity
            key={format.value}
            style={styles.workFormatOption}
            onPress={() => toggleWorkFormat(format.value)}
          >
            <View style={[
              styles.radioOuter,
              workFormat.includes(format.value) && styles.radioOuterSelected,
            ]}>
              {workFormat.includes(format.value) && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.workFormatLabel}>{format.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Salary Range */}
      <Text style={styles.fieldLabel}>Уровень ЗП</Text>
      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <View style={styles.salaryInputContainer}>
            <TextInput
              style={styles.salaryInput}
              value={salaryMin}
              onChangeText={setSalaryMin}
              placeholder="От"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
            />
            <Text style={styles.salaryCurrency}>USD</Text>
          </View>
        </View>
        <View style={styles.halfField}>
          <View style={styles.salaryInputContainer}>
            <TextInput
              style={styles.salaryInput}
              value={salaryMax}
              onChangeText={setSalaryMax}
              placeholder="До"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
            />
            <Text style={styles.salaryCurrency}>USD</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepHeaderTitle}>Требования к кандидату</Text>
        <TouchableOpacity
          style={styles.publishCheckbox}
          onPress={() => setPublishToHH(!publishToHH)}
        >
          <View style={[styles.checkbox, publishToHH && styles.checkboxChecked]}>
            {publishToHH && <Check size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Опубликовать на hh.kz</Text>
        </TouchableOpacity>
      </View>

      {/* Hard Skills */}
      <TextInput
        style={styles.textInput}
        value={newSkill}
        onChangeText={setNewSkill}
        placeholder="Hard навыки"
        placeholderTextColor="#9E9E9E"
        onSubmitEditing={addSkill}
      />
      <Text style={styles.hintText}>Нажимайте Enter чтобы добавить тег</Text>

      {skills.length > 0 && (
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <TouchableOpacity
              key={index}
              style={styles.skillTag}
              onPress={() => removeSkill(skill)}
            >
              <Text style={styles.skillTagText}>{skill}</Text>
              <Text style={styles.skillRemove}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Special Skills */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={specialSkills}
        onChangeText={setSpecialSkills}
        placeholder="Специальные навыки, напр.: PowerBI, AutoCAD, Photoshop"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Languages */}
      <Text style={styles.fieldLabel}>Язык</Text>
      <View style={styles.languagesRow}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang}
            style={styles.languageOption}
            onPress={() => toggleLanguage(lang)}
          >
            <View style={[
              styles.checkboxSmall,
              selectedLanguages.includes(lang) && styles.checkboxSmallChecked,
            ]}>
              {selectedLanguages.includes(lang) && <Check size={10} color="#FFFFFF" />}
            </View>
            <Text style={styles.languageLabel}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Personal Qualities */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={personalQualities}
        onChangeText={setPersonalQualities}
        placeholder="Личные качества, напр.: стрессоустойчивость, коммуникабельность"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Education */}
      <TouchableOpacity
        style={[styles.dropdown, { marginTop: 16 }]}
        onPress={() => setShowEducationDropdown(!showEducationDropdown)}
      >
        <Text style={education ? styles.dropdownText : styles.dropdownPlaceholder}>
          {EDUCATION_OPTIONS.find(o => o.value === education)?.label || 'Образование'}
        </Text>
        <ChevronDown size={20} color="#9E9E9E" />
      </TouchableOpacity>
      {showEducationDropdown && (
        <View style={styles.dropdownMenu}>
          {EDUCATION_OPTIONS.filter(o => o.value).map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setEducation(option.value);
                setShowEducationDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepHeaderTitle}>Условия работы</Text>
        <TouchableOpacity
          style={styles.publishCheckbox}
          onPress={() => setPublishToHH(!publishToHH)}
        >
          <View style={[styles.checkbox, publishToHH && styles.checkboxChecked]}>
            {publishToHH && <Check size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Опубликовать на hh.kz</Text>
        </TouchableOpacity>
      </View>

      {/* Employee Registration */}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowRegistrationDropdown(!showRegistrationDropdown)}
      >
        <Text style={employeeRegistration ? styles.dropdownText : styles.dropdownPlaceholder}>
          {EMPLOYEE_REGISTRATION_OPTIONS.find(o => o.value === employeeRegistration)?.label || 'Оформление сотрудника'}
        </Text>
        <ChevronDown size={20} color="#9E9E9E" />
      </TouchableOpacity>
      {showRegistrationDropdown && (
        <View style={styles.dropdownMenu}>
          {EMPLOYEE_REGISTRATION_OPTIONS.filter(o => o.value).map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setEmployeeRegistration(option.value);
                setShowRegistrationDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Work Conditions */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={workConditions}
        onChangeText={setWorkConditions}
        placeholder="Условия работы / плюшки"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Location */}
      <Text style={styles.fieldLabel}>Локация</Text>
      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCountryDropdown(!showCountryDropdown)}
          >
            <Text style={country ? styles.dropdownText : styles.dropdownPlaceholder}>
              {COUNTRY_OPTIONS.find(o => o.value === country)?.label || 'Страна'}
            </Text>
            <ChevronDown size={20} color="#9E9E9E" />
          </TouchableOpacity>
          {showCountryDropdown && (
            <View style={styles.dropdownMenu}>
              {COUNTRY_OPTIONS.filter(o => o.value).map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCountry(option.value);
                    setShowCountryDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.halfField}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCityDropdown(!showCityDropdown)}
          >
            <Text style={city ? styles.dropdownText : styles.dropdownPlaceholder}>
              {CITY_OPTIONS.find(o => o.value === city)?.label || 'Город'}
            </Text>
            <ChevronDown size={20} color="#9E9E9E" />
          </TouchableOpacity>
          {showCityDropdown && (
            <View style={styles.dropdownMenu}>
              {CITY_OPTIONS.filter(o => o.value).map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCity(option.value);
                    setShowCityDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepHeaderTitle}>Процесс отбора</Text>
        <TouchableOpacity
          style={styles.publishCheckbox}
          onPress={() => setPublishToHH(!publishToHH)}
        >
          <View style={[styles.checkbox, publishToHH && styles.checkboxChecked]}>
            {publishToHH && <Check size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Опубликовать на hh.kz</Text>
        </TouchableOpacity>
      </View>

      {/* Verification Stages */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={verificationStages}
        onChangeText={setVerificationStages}
        placeholder="Этапы проверки, напр.: тестовое задание, проверка документов"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Interview Count */}
      <TouchableOpacity
        style={[styles.dropdown, { marginTop: 16 }]}
        onPress={() => setShowInterviewCountDropdown(!showInterviewCountDropdown)}
      >
        <Text style={interviewCount ? styles.dropdownText : styles.dropdownPlaceholder}>
          {INTERVIEW_COUNT_OPTIONS.find(o => o.value === interviewCount)?.label || 'Количество собеседований'}
        </Text>
        <ChevronDown size={20} color="#9E9E9E" />
      </TouchableOpacity>
      {showInterviewCountDropdown && (
        <View style={styles.dropdownMenu}>
          {INTERVIEW_COUNT_OPTIONS.filter(o => o.value).map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setInterviewCount(option.value);
                setShowInterviewCountDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Interviewers */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={interviewers}
        onChangeText={setInterviewers}
        placeholder="С кем проходят собеседования, напр.: HR, CEO, Техдиректор"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Stop Factors */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={stopFactors}
        onChangeText={setStopFactors}
        placeholder="Стоп-факторы, напр.: частая смена работ"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Additional Info */}
      <TextInput
        style={[styles.textInput, styles.textAreaMedium]}
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        placeholder="Доп. информация"
        placeholderTextColor="#9E9E9E"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepHeaderTitle}>Контакты</Text>
        <TouchableOpacity
          style={styles.publishCheckbox}
          onPress={() => setPublishToHH(!publishToHH)}
        >
          <View style={[styles.checkbox, publishToHH && styles.checkboxChecked]}>
            {publishToHH && <Check size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>Опубликовать на hh.kz</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.contactSectionTitle}>Контактные данные рекрутера</Text>

      {contacts.map((contact, index) => (
        <View key={contact.id} style={styles.contactCard}>
          <View style={styles.contactRow}>
            <View style={styles.contactFieldHalf}>
              <Text style={styles.contactFieldLabel}>ФИО</Text>
              <TextInput
                style={styles.contactInput}
                value={contact.name}
                onChangeText={(text) => updateContact(contact.id, 'name', text)}
                placeholder="Пухова Анна Олеговна"
                placeholderTextColor="#9E9E9E"
              />
            </View>
            <View style={styles.contactFieldHalf}>
              <Text style={styles.contactFieldLabel}>Должность</Text>
              <TextInput
                style={styles.contactInput}
                value={contact.position}
                onChangeText={(text) => updateContact(contact.id, 'position', text)}
                placeholder="Директор"
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactFieldHalf}>
              <Text style={styles.contactFieldLabel}>Телефон</Text>
              <TextInput
                style={styles.contactInput}
                value={contact.phone}
                onChangeText={(text) => updateContact(contact.id, 'phone', text)}
                placeholder="+7 708 963 8274"
                placeholderTextColor="#9E9E9E"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.contactFieldHalf}>
              <Text style={styles.contactFieldLabel}>Телефон</Text>
              <TextInput
                style={styles.contactInput}
                value={contact.telegram}
                onChangeText={(text) => updateContact(contact.id, 'telegram', text)}
                placeholder="https://t.me/Godgiven_short"
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>

          {contacts.length > 1 && (
            <TouchableOpacity
              style={styles.deleteContactButton}
              onPress={() => removeContact(contact.id)}
            >
              <Trash2 size={14} color="#EF4444" />
              <Text style={styles.deleteContactText}>Удалить</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addContactButton} onPress={addContact}>
        <Text style={styles.addContactText}>+ Добавить</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
      onRequestClose={handleCloseSuccess}
    >
      <View style={styles.successOverlay}>
        <View style={styles.successModal}>
          <TouchableOpacity style={styles.successCloseButton} onPress={handleCloseSuccess}>
            <X size={24} color="#9E9E9E" />
          </TouchableOpacity>

          <View style={styles.successIconContainer}>
            <Check size={40} color="#10B981" />
          </View>

          <Text style={styles.successTitle}>Вакансия успешно добавлена</Text>
          <Text style={styles.successDescription}>
            Вы можете просмотреть её в списке на странице «Вакансии»
          </Text>

          <TouchableOpacity style={styles.successPrimaryButton} onPress={handleGoToVacancies}>
            <Briefcase size={16} color="#FFFFFF" />
            <Text style={styles.successPrimaryButtonText}>Страница вакансии</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.successSecondaryButton} onPress={handleCloseSuccess}>
            <Text style={styles.successSecondaryButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!visible) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Новая вакансия</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Content */}
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.draftButton} onPress={handleSaveDraft}>
                <Text style={styles.draftButtonText}>Сохранить как черновик</Text>
              </TouchableOpacity>
              {currentStep < 5 ? (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Далее</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.nextButton} onPress={handleCreate}>
                  <Text style={styles.nextButtonText}>Создать</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {renderSuccessModal()}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: MODAL_WIDTH,
    height: '100%',
    maxWidth: 650,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    flexShrink: 0,
  },
  stepCircleActive: {
    borderColor: '#1E2875',
    backgroundColor: '#1E2875',
  },
  stepCircleCompleted: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepTextContainer: {
    marginLeft: 6,
    flexShrink: 1,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  stepTitleActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  stepSubtitle: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  stepSubtitleActive: {
    color: '#616161',
  },
  stepLine: {
    width: 16,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
    flexShrink: 0,
  },
  stepLineCompleted: {
    backgroundColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  stepContent: {
    padding: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  publishCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1E2875',
    borderColor: '#1E2875',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#4A5FD6',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 8,
    marginTop: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  contractSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  contractContent: {
    gap: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingRight: 16,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A1A',
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  uploadTextContainer: {
    marginLeft: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  uploadFormats: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textAreaMedium: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfField: {
    flex: 1,
  },
  workFormatRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  workFormatOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#1E2875',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E2875',
  },
  workFormatLabel: {
    fontSize: 14,
    color: '#424242',
  },
  salaryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingRight: 16,
  },
  salaryInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A1A',
  },
  salaryCurrency: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D9FF',
  },
  skillTagText: {
    fontSize: 13,
    color: '#1E2875',
    marginRight: 6,
  },
  skillRemove: {
    fontSize: 16,
    color: '#1E2875',
    fontWeight: '600',
  },
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxSmall: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSmallChecked: {
    backgroundColor: '#1E2875',
    borderColor: '#1E2875',
  },
  languageLabel: {
    fontSize: 13,
    color: '#424242',
  },
  contactSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  contactCard: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  contactFieldHalf: {
    flex: 1,
  },
  contactFieldLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  contactInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  deleteContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  deleteContactText: {
    fontSize: 13,
    color: '#EF4444',
  },
  addContactButton: {
    alignItems: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 24,
    alignSelf: 'flex-end',
  },
  addContactText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  draftButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  draftButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#1E2875',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Success Modal
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    width: 340,
    marginRight: 20,
    alignItems: 'center',
  },
  successCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#1E2875',
    borderRadius: 24,
    width: '100%',
    marginBottom: 12,
  },
  successPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successSecondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  successSecondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
});
