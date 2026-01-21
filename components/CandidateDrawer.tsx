import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  Video as VideoIcon,
  MessageSquare,
  Phone as PhoneIcon,
  Heart,
  HeartOff,
  Edit2,
  FileText,
  Clock,
  User,
} from 'lucide-react-native';
import { Candidate } from '../types';
import { useApp } from '../contexts/AppContext';

interface CandidateDrawerProps {
  visible: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  isClientView?: boolean;
}

type TabType = 'experience' | 'ai-matching' | 'history' | 'additional' | 'comments';

export default function CandidateDrawer({ visible, candidate, onClose, isClientView = false }: CandidateDrawerProps) {
  const { toggleShortlist } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('ai-matching');
  const [positiveComment, setPositiveComment] = useState('');
  const [negativeComment, setNegativeComment] = useState('');

  if (!candidate) return null;

  const renderExperienceTab = () => (
    <View style={styles.tabContent}>
      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О себе</Text>
        <Text style={styles.sectionText}>
          Я Frontend-разработчик, специализирующийся на создании современных, удобных и визуально
          привлекательных веб-приложений. Основные технологии, с которыми работаю: React, TypeScript,
          Next.js, Redux Toolkit, TailwindCSS, HTML5, CSS3 и JavaScript (ES6+).
        </Text>
      </View>

      {/* Last Position */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Последнее место работы</Text>
        <Text style={styles.sectionTitle}>{candidate.position}</Text>
        <Text style={styles.sectionSubtext}>
          {candidate.experienceYears} {candidate.experienceYears === 1 ? 'год' : 'лет'}
        </Text>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Образование</Text>
        <Text style={styles.sectionTitle}>ДВНЗ Черновицкий политехнический колледж</Text>
        <Text style={styles.sectionSubtext}>Среднее специальное • с 2014 по 2019 (3 год 9 месяцев)</Text>
        <Text style={styles.sectionText}>Разработка програмного обеспечения</Text>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Навыки</Text>
        <View style={styles.skillsGrid}>
          {candidate.skills.map((skill, idx) => (
            <View key={idx} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Языки</Text>
        <Text style={styles.languageText}>Украинский - Носитель</Text>
        <Text style={styles.languageText}>Английский - C1</Text>
        <Text style={styles.languageText}>Русский - C1</Text>
      </View>

      {/* Attached Files */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Прикрепленные файлы</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Прикрепить файл</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.fileCount}>Всего: 2</Text>

        <View style={styles.fileItem}>
          <FileText size={20} color="#4F46E5" />
          <Text style={styles.fileName}>Ivan_Ivanov_CV.pdf</Text>
        </View>
        <View style={styles.fileItem}>
          <FileText size={20} color="#4F46E5" />
          <Text style={styles.fileName}>Тестовое задание.docx</Text>
        </View>
      </View>
    </View>
  );

  const renderAIMatchingTab = () => (
    <View style={styles.tabContent}>
      {/* Resume Match */}
      <View style={styles.matchSection}>
        <Text style={styles.matchTitle}>Совпадение на основе резюме</Text>
        <Text style={styles.matchSubtitle}>Middle FullStack Engineer</Text>

        <View style={styles.matchCard}>
          <View style={styles.matchScore}>
            <Text style={styles.scoreNumber}>100%</Text>
          </View>
          <View style={styles.matchStats}>
            <View style={styles.matchRow}>
              <Text style={styles.matchLabel}>100% Навыки</Text>
              <Text style={styles.matchValue}>78% Опыт</Text>
            </View>
            <View style={styles.matchRow}>
              <Text style={styles.matchLabel}>100% Зарплата</Text>
              <Text style={styles.matchValue}>69% Позиция</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Читать подробно</Text>
        </TouchableOpacity>
      </View>

      {/* Video Match */}
      {candidate.videoUrl && (
        <View style={styles.matchSection}>
          <Text style={styles.matchTitle}>Совпадение на основе видео</Text>
          <Text style={styles.matchSubtitle}>Middle FullStack Engineer</Text>

          <View style={styles.matchCard}>
            <View style={styles.matchScore}>
              <Text style={styles.scoreNumber}>100%</Text>
            </View>
            <View style={styles.matchStats}>
              <View style={styles.matchRow}>
                <Text style={styles.matchLabel}>100% Навыки</Text>
                <Text style={styles.matchValue}>78% Опыт</Text>
              </View>
              <View style={styles.matchRow}>
                <Text style={styles.matchLabel}>100% Зарплата</Text>
                <Text style={styles.matchValue}>69% Позиция</Text>
              </View>
            </View>
          </View>

          <View style={styles.aiInsights}>
            <Text style={styles.insightTitle}>Сильная фронтенд-база</Text>
            <Text style={styles.insightText}>
              Кандидат имеет опыт работы с React, TypeScript, Next.js, TailwindCSS, что говорит о
              глубоком понимании архитектуры современных фронтенд-приложений, компонентного подхода,
              работы с состоянием и REST API.
            </Text>

            <Text style={styles.insightTitle}>Техническая гибкость и опыт интеграций.</Text>
            <Text style={styles.insightText}>
              Кандидат упоминает опыт взаимодействия с REST API и оптимизацию производительности.
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>(3) Отклики кандидата</Text>
      </View>

      <View style={styles.historyList}>
        <Text style={styles.historyCount}>Всего записей: 30</Text>

        {candidate.history.map((item, idx) => (
          <View key={idx} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyDate}>
                {new Date(item.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.historyTime}>
                {new Date(item.date).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyAction}>{item.details}</Text>
              <View style={styles.historyUser}>
                <User size={12} color="#6B7280" />
                <Text style={styles.historyUserName}>{item.user}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAdditionalTab = () => (
    <View style={styles.tabContent}>
      {/* Other Options */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Другие опции</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Ред.</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionText}>Работал в гугл, много знает, надежный</Text>
      </View>

      {/* Verification */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Проверка</Text>
        </View>
        <Text style={styles.verificationText}>Штрафов нет</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Ред.</Text>
        </TouchableOpacity>
      </View>

      {/* Test Files */}
      <View style={styles.section}>
        <View style={styles.fileItem}>
          <FileText size={20} color="#4F46E5" />
          <Text style={styles.fileName}>Тестовое .NET</Text>
        </View>
        <View style={styles.fileActions}>
          <TouchableOpacity style={styles.fileButton}>
            <Text style={styles.fileButtonText}>Добавить файл</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fileButton}>
            <Text style={styles.fileButtonText}>Добавить комментарий</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCommentsTab = () => (
    <View style={styles.tabContent}>
      {/* Positive */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Позитивные качества</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Ред.</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <User size={16} color="#6B7280" />
            <Text style={styles.commentAuthor}>Томчен Баратеон</Text>
            <Text style={styles.commentDate}>14:00 10.02.2025</Text>
          </View>
          <Text style={styles.commentText}>
            Быстро отвечает, готов к оверлапам, опыт в финтехе, работал в Google, гибкий по формату,
            релокация возможна, сильный английский, уверенно держится на интервью, тех. база крепкая,
            позитивный фидбек от команды.
          </Text>
        </View>
      </View>

      {/* Negative */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Негативные качества</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Ред.</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.commentCard}>
          <View style={styles.commentHeader}>
            <User size={16} color="#6B7280" />
            <Text style={styles.commentAuthor}>Томчен Баратеон</Text>
            <Text style={styles.commentDate}>14:00 10.02.2025</Text>
          </View>
          <Text style={styles.commentText}>
            Быстро отвечает, готов к оверлапам, опыт в финтехе, работал в Google, гибкий по формату,
            релокация возможна, сильный английский, уверенно держится на интервью, тех. база крепкая,
            позитивный фидбек от команды.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addCommentButton}>
        <Text style={styles.addCommentText}>Добавить комментарий</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.candidateInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {candidate.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                  {candidate.videoUrl && (
                    <View style={styles.videoIcon}>
                      <VideoIcon size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <View style={styles.nameSection}>
                  <Text style={styles.candidateName}>{candidate.name}</Text>
                  <Text style={styles.candidateLocation}>
                    {candidate.location}, {candidate.experienceYears} лет
                  </Text>
                  <View style={styles.candidateMeta}>
                    <Text style={styles.metaItem}>🚗 Автомобиль: нет</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Position */}
            <Text style={styles.positionTitle}>{candidate.position}</Text>

            {/* Contact Actions */}
            <View style={styles.contactActions}>
              <TouchableOpacity>
                <Text style={styles.linkBlue}>Посмотреть видеоинтервью</Text>
              </TouchableOpacity>
              {!isClientView && (
                <TouchableOpacity>
                  <Text style={styles.linkBlue}>Показать контакты</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Shortlist Badge */}
            <View style={styles.shortlistBadge}>
              <Text style={styles.shortlistText}>В шортлист</Text>
            </View>

            {/* Expectations */}
            <View style={styles.expectations}>
              <View style={styles.expectationItem}>
                <Text style={styles.expectationLabel}>$</Text>
                <Text style={styles.expectationValue}>${candidate.salaryExpectation}</Text>
              </View>
              <View style={styles.expectationItem}>
                <Text style={styles.expectationLabel}>📍</Text>
                <Text style={styles.expectationValue}>Офис, Удаленно</Text>
              </View>
              <View style={styles.expectationItem}>
                <Text style={styles.expectationLabel}>⏰</Text>
                <Text style={styles.expectationValue}>Полная занятость, не полная занятость</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {!isClientView && (
                <TouchableOpacity style={styles.iconButton}>
                  <Mail size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => toggleShortlist(candidate.id)}
              >
                {candidate.shortlisted ? (
                  <Heart size={20} color="#EF4444" fill="#EF4444" />
                ) : (
                  <Heart size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'experience' && styles.tabActive]}
                onPress={() => setActiveTab('experience')}
              >
                <Text
                  style={[styles.tabText, activeTab === 'experience' && styles.tabTextActive]}
                >
                  Опыт и навыки
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'ai-matching' && styles.tabActive]}
                onPress={() => setActiveTab('ai-matching')}
              >
                <Text
                  style={[styles.tabText, activeTab === 'ai-matching' && styles.tabTextActive]}
                >
                  AI-matching
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'history' && styles.tabActive]}
                onPress={() => setActiveTab('history')}
              >
                <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                  История
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'additional' && styles.tabActive]}
                onPress={() => setActiveTab('additional')}
              >
                <Text
                  style={[styles.tabText, activeTab === 'additional' && styles.tabTextActive]}
                >
                  Доп. проверка
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, activeTab === 'comments' && styles.tabActive]}
                onPress={() => setActiveTab('comments')}
              >
                <Text style={[styles.tabText, activeTab === 'comments' && styles.tabTextActive]}>
                  Коммент.
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'experience' && renderExperienceTab()}
            {activeTab === 'ai-matching' && renderAIMatchingTab()}
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'additional' && renderAdditionalTab()}
            {activeTab === 'comments' && renderCommentsTab()}
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
  drawer: {
    backgroundColor: '#FFFFFF',
    height: '95%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  candidateInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
  },
  videoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameSection: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  candidateLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  candidateMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    fontSize: 11,
    color: '#6B7280',
  },
  closeButton: {
    padding: 4,
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  linkBlue: {
    fontSize: 13,
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
  shortlistBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  shortlistText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  expectations: {
    marginBottom: 12,
  },
  expectationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  expectationLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  expectationValue: {
    fontSize: 13,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  linkText: {
    fontSize: 13,
    color: '#4F46E5',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  languageText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  fileCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  matchSection: {
    marginBottom: 32,
  },
  matchTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  matchSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  matchScore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  matchStats: {
    flex: 1,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  matchLabel: {
    fontSize: 13,
    color: '#374151',
  },
  matchValue: {
    fontSize: 13,
    color: '#6B7280',
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '500',
  },
  aiInsights: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 16,
  },
  historyHeader: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  historyList: {},
  historyCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
    textAlign: 'right',
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyLeft: {
    width: 80,
    marginRight: 16,
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  historyRight: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 6,
  },
  historyUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyUserName: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  verificationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  fileButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  fileButtonText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  commentCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  addCommentButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addCommentText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
