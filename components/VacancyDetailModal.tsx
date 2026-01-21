import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { X, Download } from 'lucide-react-native';
import { Vacancy, Company } from '../types';
import { useRouter } from 'expo-router';

interface VacancyDetailModalProps {
  visible: boolean;
  vacancy: Vacancy | null;
  companyName?: string;
  company?: Company;
  onClose: () => void;
  onUpdateVacancy?: (vacancyId: string, updates: Partial<Vacancy>) => void;
}

export const VacancyDetailModal: React.FC<VacancyDetailModalProps> = ({
  visible,
  vacancy,
  companyName,
  company,
  onClose,
  onUpdateVacancy,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'requirements' | 'conditions' | 'contacts' | 'comments'>('requirements');

  // Edit state
  const [editingRequirements, setEditingRequirements] = useState(false);
  const [requirementsText, setRequirementsText] = useState(vacancy?.requirements?.join('\n') || '');
  const [editingConditions, setEditingConditions] = useState(false);
  const [conditionsText, setConditionsText] = useState(vacancy?.workConditions || '');

  if (!vacancy || !visible) return null;

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
            <View style={styles.headerLeft}>
              <Text style={styles.title}>{vacancy?.title || 'Untitled'}</Text>
              <View style={styles.companyRow}>
                <Text style={styles.companyLabel}>в</Text>
                <TouchableOpacity onPress={() => router.push(`/company/${vacancy.companyId}`)}>
                  <Text style={[styles.companyName, styles.companyNameClickable]}>
                    {companyName || 'Компания'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.companyIcon}>
                  <Text style={styles.companyIconText}>🚀</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Salary and Details */}
          <View style={styles.metaSection}>
            <Text style={styles.salary}>
              ${vacancy.salaryRange?.min || 0} - ${vacancy.salaryRange?.max || 0}
            </Text>
            <View style={styles.metaTags}>
              <Text style={styles.metaTag}>• {vacancy.location?.city || 'Не указано'}</Text>
              {vacancy.workFormat && vacancy.workFormat.length > 0 && (
                <Text style={styles.metaTag}>• {vacancy.workFormat.join(', ')}</Text>
              )}
              <Text style={styles.metaTag}>• полная занятость</Text>
            </View>
          </View>

          {/* Info Row */}
          <View style={styles.infoRow}>
            {vacancy.experienceYears && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Опыт:</Text>
                <Text style={styles.infoValue}>{vacancy.experienceYears}+ лет</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Пол:</Text>
              <Text style={styles.infoValue}>Не указан</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Возраст не указан</Text>
            </View>
          </View>

          {/* Status Row */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Добавлено:</Text>
            <Text style={styles.statusValue}>28.10.24</Text>
            <Text style={styles.statusLabel}>Осталось дней:</Text>
            <View style={styles.daysLeftBadge}>
              <Text style={styles.daysLeftText}>21</Text>
            </View>
          </View>

          {/* Recruiter */}
          <View style={styles.recruiterRow}>
            <Text style={styles.recruiterLabel}>Рекрутер:</Text>
            <View style={styles.recruiterAvatar}>
              <Text style={styles.recruiterInitials}>АШ</Text>
            </View>
            <Text style={styles.recruiterName}>Алексей Шашкевич</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'requirements' && styles.tabActive]}
              onPress={() => setActiveTab('requirements')}
            >
              <Text style={[styles.tabText, activeTab === 'requirements' && styles.tabTextActive]}>
                Требования
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'conditions' && styles.tabActive]}
              onPress={() => setActiveTab('conditions')}
            >
              <Text style={[styles.tabText, activeTab === 'conditions' && styles.tabTextActive]}>
                Условия работы
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'contacts' && styles.tabActive]}
              onPress={() => setActiveTab('contacts')}
            >
              <Text style={[styles.tabText, activeTab === 'contacts' && styles.tabTextActive]}>
                Контакты
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'comments' && styles.tabActive]}
              onPress={() => setActiveTab('comments')}
            >
              <Text style={[styles.tabText, activeTab === 'comments' && styles.tabTextActive]}>
                Комментарии
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'requirements' && (
              <View style={styles.contentSection}>
                {/* Requirements */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Требования</Text>
                    <TouchableOpacity onPress={() => {
                      if (editingRequirements && onUpdateVacancy && vacancy) {
                        onUpdateVacancy(vacancy.id, { requirements: requirementsText.split('\n').filter(r => r.trim()) });
                      }
                      setEditingRequirements(!editingRequirements);
                    }}>
                      <Text style={styles.editButton}>
                        {editingRequirements ? '✓ Сохранить' : '✏️ Ред.'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {editingRequirements ? (
                    <TextInput
                      style={styles.requirementsTextInput}
                      value={requirementsText}
                      onChangeText={setRequirementsText}
                      multiline
                      numberOfLines={10}
                      placeholder="Введите требования к кандидату..."
                      textAlignVertical="top"
                    />
                  ) : (
                    <Text style={styles.sectionText}>
                      {requirementsText || 'Требования не указаны'}
                    </Text>
                  )}
                </View>

                {/* Special Skills */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Специальные навыки</Text>
                  <Text style={styles.sectionText}>
                    Умение работать с Power BI, AutoCAD, знание оборудования, опыт проведения презентаций
                  </Text>
                </View>

                {/* Language */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Язык</Text>
                  <View style={styles.languageRow}>
                    <Text style={styles.languageText}>Русский</Text>
                    <Text style={styles.languageLevel}>- C1</Text>
                  </View>
                  <View style={styles.languageRow}>
                    <Text style={styles.languageText}>Английский</Text>
                    <Text style={styles.languageLevel}>- C1</Text>
                  </View>
                  <View style={styles.languageRow}>
                    <Text style={styles.languageText}>Украинский</Text>
                    <Text style={styles.languageLevel}>- Носитель</Text>
                  </View>
                </View>

                {/* Personal Qualities */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Личные качества</Text>
                  <Text style={styles.sectionText}>
                    Стрессоустойчивость, коммуникабельность, внимание к деталям
                  </Text>
                </View>

                {/* Education */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Образование</Text>
                  <Text style={styles.sectionText}>Среднее</Text>
                  <Text style={styles.sectionText}>Среднее специальное</Text>
                </View>
              </View>
            )}

            {activeTab === 'conditions' && (
              <View style={styles.contentSection}>
                {/* Work Conditions */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Условия работы</Text>
                    <TouchableOpacity onPress={() => {
                      if (editingConditions && onUpdateVacancy && vacancy) {
                        onUpdateVacancy(vacancy.id, { workConditions: conditionsText });
                      }
                      setEditingConditions(!editingConditions);
                    }}>
                      <Text style={styles.editButton}>
                        {editingConditions ? '✓ Сохранить' : '✏️ Ред.'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {editingConditions ? (
                    <TextInput
                      style={styles.editableTextInput}
                      value={conditionsText}
                      onChangeText={setConditionsText}
                      multiline
                      placeholder="Введите условия работы..."
                    />
                  ) : (
                    <Text style={styles.sectionText}>{conditionsText || 'Условия работы не указаны'}</Text>
                  )}
                </View>

                {/* Employment Type */}
                {vacancy.employmentType && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Оформление</Text>
                    <Text style={styles.sectionText}>{vacancy.employmentType}</Text>
                  </View>
                )}

                {/* Location */}
                {vacancy.location && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Локация</Text>
                    <Text style={styles.sectionText}>
                      {vacancy.location.country}, {vacancy.location.city}, {vacancy.location.address || ''}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'contacts' && (
              <View style={styles.contentSection}>
                {company?.decisionMakers && company.decisionMakers.length > 0 ? (
                  company.decisionMakers.map((dm, index) => (
                    <View key={dm.id} style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        ЛПР №{index + 1}
                      </Text>

                      <View style={styles.contactRow}>
                        <Text style={styles.contactLabel}>ФИО:</Text>
                        <Text style={styles.contactValue}>{dm.name}</Text>
                      </View>

                      <View style={styles.contactRow}>
                        <Text style={styles.contactLabel}>Должность:</Text>
                        <Text style={styles.contactValue}>{dm.role}</Text>
                      </View>

                      <View style={styles.contactRow}>
                        <Text style={styles.contactLabel}>Телефон:</Text>
                        <Text style={[styles.contactValue, styles.contactLink]}>
                          {dm.phone}
                        </Text>
                      </View>

                      <View style={styles.contactRow}>
                        <Text style={styles.contactLabel}>Email:</Text>
                        <Text style={[styles.contactValue, styles.contactLink]}>
                          {dm.email}
                        </Text>
                      </View>

                      {dm.communicationStyle && (
                        <>
                          <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>Стиль общения</Text>
                          </View>
                          <Text style={styles.contactDescription}>
                            {dm.communicationStyle}
                          </Text>
                        </>
                      )}

                      {dm.hiringPreferences && (
                        <>
                          <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>Предпочтения при найме</Text>
                          </View>
                          <Text style={styles.contactDescription}>
                            {dm.hiringPreferences}
                          </Text>
                        </>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.sectionText}>
                    Контактная информация отсутствует. Добавьте ЛПР в карточке компании.
                  </Text>
                )}
              </View>
            )}

            {activeTab === 'comments' && (
              <View style={styles.contentSection}>
                {vacancy.comments && vacancy.comments.length > 0 ? (
                  <>
                    {/* Positive Comments */}
                    {vacancy.comments.filter(c => c.type === 'positive').length > 0 && (
                      <View style={styles.section}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.sectionTitle}>Позитивные качества</Text>
                          <TouchableOpacity>
                            <Text style={styles.editButton}>✏️ Ред.</Text>
                          </TouchableOpacity>
                        </View>
                        {vacancy.comments.filter(c => c.type === 'positive').map(comment => (
                          <View key={comment.id} style={styles.commentItem}>
                            <View style={styles.commentAuthorRow}>
                              <View style={styles.commentAvatar}>
                                <Text style={styles.commentAvatarText}>
                                  {comment.author.split(' ').map(n => n[0]).join('')}
                                </Text>
                              </View>
                              <Text style={styles.commentAuthor}>{comment.author}</Text>
                              <Text style={styles.commentDate}>{comment.date}</Text>
                            </View>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Negative Comments */}
                    {vacancy.comments.filter(c => c.type === 'negative').length > 0 && (
                      <View style={styles.section}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.sectionTitle}>Негативные качества</Text>
                          <TouchableOpacity>
                            <Text style={styles.editButton}>✏️ Ред.</Text>
                          </TouchableOpacity>
                        </View>
                        {vacancy.comments.filter(c => c.type === 'negative').map(comment => (
                          <View key={comment.id} style={styles.commentItem}>
                            <View style={styles.commentAuthorRow}>
                              <View style={styles.commentAvatar}>
                                <Text style={styles.commentAvatarText}>
                                  {comment.author.split(' ').map(n => n[0]).join('')}
                                </Text>
                              </View>
                              <Text style={styles.commentAuthor}>{comment.author}</Text>
                              <Text style={styles.commentDate}>{comment.date}</Text>
                            </View>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Add Comment Button */}
                    <TouchableOpacity style={styles.addCommentButton}>
                      <Text style={styles.addCommentButtonText}>Добавить комментарий</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View>
                    <Text style={styles.sectionText}>Комментариев пока нет</Text>
                    <TouchableOpacity style={styles.addCommentButton}>
                      <Text style={styles.addCommentButtonText}>Добавить комментарий</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Download Button */}
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>Digis_fr...</Text>
            <Download size={16} color="#4A5FD6" />
          </TouchableOpacity>
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
    maxWidth: 800,
    maxHeight: '90%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5FD6',
    marginBottom: 6,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyLabel: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  companyName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  companyNameClickable: {
    textDecorationLine: 'underline',
    color: '#4A5FD6',
  },
  companyIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyIconText: {
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
  },
  metaSection: {
    marginBottom: 16,
  },
  salary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  metaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaTag: {
    fontSize: 12,
    color: '#616161',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  statusValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  daysLeftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#D1FAE5',
    borderRadius: 4,
  },
  daysLeftText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  recruiterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  recruiterLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  recruiterAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recruiterInitials: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E2875',
  },
  recruiterName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
    gap: 24,
  },
  tab: {
    paddingBottom: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A5FD6',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#616161',
  },
  tabTextActive: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  contentSection: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 6,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#52525B',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  languageText: {
    fontSize: 13,
    color: '#424242',
  },
  languageLevel: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4A5FD6',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    minWidth: 100,
  },
  contactValue: {
    fontSize: 13,
    color: '#424242',
    flex: 1,
  },
  contactLink: {
    color: '#4A5FD6',
    textDecorationLine: 'underline',
  },
  contactDescription: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 12,
    marginLeft: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    fontSize: 13,
    color: '#4A5FD6',
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E2875',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
  commentDate: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  commentText: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
  },
  addCommentButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A5FD6',
    alignItems: 'center',
  },
  addCommentButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5FD6',
  },
  editableTextInput: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    minHeight: 100,
  },
  requirementsTextInput: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    minHeight: 200,
    maxHeight: 200,
  },
});
