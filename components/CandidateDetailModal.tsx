import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  X,
  MoreVertical,
  Share2,
  Heart,
  MapPin,
  DollarSign,
  Briefcase,
  Star,
  Play,
  Award,
  FileText,
} from 'lucide-react-native';
import { Candidate } from '../types';
import { useApp } from '../contexts/AppContext';
import InteractionTimeline from './InteractionTimeline';
import RecruiterNotes from './RecruiterNotes';
import AIAnalysisCard from './AIAnalysisCard';
import PDFExportOptionsModal from './PDFExportOptionsModal';
import { exportCandidateToPDF } from '../services/pdfExportService';

interface CandidateDetailModalProps {
  visible: boolean;
  candidateId: string | null;
  onClose: () => void;
  onOpenInTab?: (id: string) => void;
  onExportPDF?: (id: string) => void;
}

type TabType = 'experience' | 'ai-matching' | 'history' | 'verification' | 'comments';

export default function CandidateDetailModal({
  visible,
  candidateId,
  onClose,
  onOpenInTab,
  onExportPDF,
}: CandidateDetailModalProps) {
  const { candidates, toggleShortlist } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('experience');
  const [showMenu, setShowMenu] = useState(false);
  const [showPDFOptionsModal, setShowPDFOptionsModal] = useState(false);

  const candidate = candidates.find((c) => c.id === candidateId);

  if (!candidate) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'experience', label: 'Опыт и навыки' },
    { key: 'ai-matching', label: 'AI-matching' },
    { key: 'history', label: 'История и отклики' },
    { key: 'verification', label: 'Доп. проверка' },
    { key: 'comments', label: 'Коммент.' },
  ];

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert('Поделиться', 'Функция в разработке');
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    switch (action) {
      case 'openInTab':
        if (onOpenInTab && candidate.id) {
          onClose();
          onOpenInTab(candidate.id);
        }
        break;
      case 'exportPDF':
        setShowPDFOptionsModal(true);
        break;
      case 'share':
        handleShare();
        break;
    }
  };

  const handleExportPDF = async (selectedSections: string[]) => {
    try {
      await exportCandidateToPDF({
        candidate,
        selectedSections,
      });
      Alert.alert('Успех', 'PDF успешно создан и готов к отправке');
    } catch (error) {
      console.error('PDF Export Error:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось создать PDF. Попробуйте еще раз.'
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Top row with buttons */}
      <View style={styles.headerTopRow}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Share2 size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.iconButton}
          >
            <MoreVertical size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu dropdown */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction('openInTab')}
          >
            <FileText size={18} color="#000000" />
            <Text style={styles.menuText}>Открыть в отдельной вкладке</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction('exportPDF')}
          >
            <FileText size={18} color="#000000" />
            <Text style={styles.menuText}>Экспортировать в PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction('share')}
          >
            <Share2 size={18} color="#000000" />
            <Text style={styles.menuText}>Поделиться</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Avatar and Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {candidate.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          {candidate.videoUrl && (
            <TouchableOpacity style={styles.playButton}>
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{candidate.name}</Text>
              <Text style={styles.location}>
                {candidate.location}
                {candidate.experienceYears && `, ${candidate.experienceYears} лет`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleShortlist(candidate.id)}>
              <Heart
                size={24}
                color="#EF4444"
                fill={candidate.shortlisted ? '#EF4444' : 'none'}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.position}>{candidate.position}</Text>

          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.statusText}>Звездный</Text>
          </View>
        </View>
      </View>

      {/* Shortlist chip */}
      {candidate.shortlisted && (
        <View style={styles.shortlistChip}>
          <Text style={styles.shortlistChipText}>В шортлист</Text>
        </View>
      )}

      {/* Add to shortlist button */}
      {!candidate.shortlisted && (
        <TouchableOpacity
          onPress={() => toggleShortlist(candidate.id)}
          style={styles.addToShortlistButton}
        >
          <Text style={styles.addToShortlistText}>Добавить в ч.с.</Text>
        </TouchableOpacity>
      )}

      {/* Quick Info Cards */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <DollarSign size={16} color="#71717A" />
          <Text style={styles.infoCardText}>${candidate.salaryExpectation}</Text>
        </View>
        <View style={styles.infoCard}>
          <MapPin size={16} color="#71717A" />
          <Text style={styles.infoCardText}>Офис, Удаленно</Text>
        </View>
        <View style={styles.infoCard}>
          <Briefcase size={16} color="#71717A" />
          <Text style={styles.infoCardText}>Полная занятость, не полная занятость</Text>
        </View>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          style={[styles.tab, activeTab === tab.key && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderExperienceTab = () => (
    <View style={styles.tabContent}>
      {/* Skills Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award size={20} color="#0066FF" />
          <Text style={styles.sectionTitle}>Навыки</Text>
        </View>
        <View style={styles.skillsContainer}>
          {candidate.skills.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Analysis */}
      {candidate.aiAnalysis && (
        <View style={styles.section}>
          <AIAnalysisCard analysis={candidate.aiAnalysis} />
        </View>
      )}

      {/* Experience */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Briefcase size={20} color="#0066FF" />
          <Text style={styles.sectionTitle}>Опыт работы</Text>
        </View>
        <Text style={styles.sectionText}>
          {candidate.experienceYears} лет опыта в сфере {candidate.position}
        </Text>
      </View>
    </View>
  );

  const renderAIMatchingTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <FileText size={32} color="#A1A1AA" />
        </View>
        <Text style={styles.emptyStateTitle}>AI-matching недоступен</Text>
        <Text style={styles.emptyStateText}>
          Для отображения процента совпадения кандидата, сначала выберите вакансию, под
          которую выполняется подбор.
        </Text>
      </View>
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <InteractionTimeline history={candidate.history} />
    </View>
  );

  const renderVerificationTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>Дополнительная проверка</Text>
        <Text style={styles.emptyStateText}>
          Информация о проверках и рекомендациях будет отображаться здесь
        </Text>
      </View>
    </View>
  );

  const renderCommentsTab = () => (
    <View style={styles.tabContent}>
      <RecruiterNotes candidateId={candidate.id} />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'experience':
        return renderExperienceTab();
      case 'ai-matching':
        return renderAIMatchingTab();
      case 'history':
        return renderHistoryTab();
      case 'verification':
        return renderVerificationTab();
      case 'comments':
        return renderCommentsTab();
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          {renderHeader()}
          {renderTabBar()}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderTabContent()}
          </ScrollView>
        </View>
      </Modal>

      <PDFExportOptionsModal
        visible={showPDFOptionsModal}
        onClose={() => setShowPDFOptionsModal(false)}
        onExport={handleExportPDF}
        candidateName={candidate.name}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  menu: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    minWidth: 220,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  profileSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },
  position: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  shortlistChip: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  shortlistChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525B',
  },
  addToShortlistButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  addToShortlistText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  infoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoCardText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525B',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 16,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#52525B',
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E40AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 20,
  },
});
