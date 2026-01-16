import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { Vacancy, Company } from '../types';
import { Users, ClipboardList, Building2, Search, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { VacancyDetailModal } from './VacancyDetailModal';
import { VacancyWizardModal } from './VacancyWizardModal';

interface VacancyListProps {
  vacancies: Vacancy[];
  companies: Company[];
  onUpdateVacancy?: (vacancyId: string, updates: Partial<Vacancy>) => void;
  onCreateVacancy?: (vacancy: Vacancy) => void;
}

export const VacancyList: React.FC<VacancyListProps> = ({ vacancies, companies, onUpdateVacancy, onCreateVacancy }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'all'>('all');
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wizardModalVisible, setWizardModalVisible] = useState(false);

  const filtered = useMemo(() => {
    let result = vacancies;

    // Filter by status
    if (activeTab !== 'all') {
      result = result.filter(v => v.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.title.toLowerCase().includes(query) ||
        v.requirements.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [vacancies, activeTab, searchQuery]);

  const activeCount = vacancies.filter(v => v.status === 'active').length;
  const closedCount = vacancies.filter(v => v.status === 'closed').length;

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Компания';
  };

  const renderVacancy = ({ item: v }: { item: Vacancy }) => (
    <View style={styles.vacancyCard}>
      {/* Left - Company Icon */}
      <View style={styles.companyIcon}>
        <Building2 size={24} color="#1E2875" />
      </View>

      {/* Center - Vacancy Info */}
      <View style={styles.vacancyInfo}>
        {/* Title */}
        <TouchableOpacity onPress={() => {
          setSelectedVacancy(v);
          setModalVisible(true);
        }}>
          <Text style={styles.vacancyTitle}>{v.title}</Text>
        </TouchableOpacity>

        {/* Company name */}
        <View style={styles.companyRow}>
          <Text style={styles.companyLabel}>в</Text>
          <Text style={styles.companyName}>{getCompanyName(v.companyId)}</Text>
          {v.status === 'active' && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        {/* Meta info */}
        <View style={styles.metaRow}>
          <Text style={styles.metaDot}>●</Text>
          <Text style={styles.metaText}>
            {v.salaryRange ? `$${v.salaryRange.min}` : 'Договорная'}
          </Text>
          <Text style={styles.metaDot}>●</Text>
          <Text style={styles.metaText}>
            {v.location ? `${v.location.country} и ${v.location.city}` : 'Страны Европы и Украины'}
          </Text>
          <Text style={styles.metaDot}>●</Text>
          <Text style={styles.metaText}>
            удалённо
          </Text>
          <Text style={styles.metaDot}>●</Text>
          <Text style={styles.metaText}>
            гибрид
          </Text>
          <Text style={styles.metaDot}>●</Text>
          <Text style={styles.metaText}>
            полная занятость
          </Text>
        </View>

        {/* Requirements Preview */}
        {v.requirements && (
          <Text style={styles.requirementsPreview} numberOfLines={2}>
            {v.requirements}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <Text style={styles.dateText}>12.08.25</Text>
          <Text style={styles.statsSeparator}>Осталось дней:</Text>
          <View style={styles.daysLeft}>
            <Text style={styles.daysLeftText}>21</Text>
          </View>
          <View style={styles.stat}>
            <Users size={14} color="#424242" />
            <Text style={styles.statText}>4</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>💬 0</Text>
          </View>
        </View>
      </View>

      {/* Right - Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Users size={14} color="#424242" />
          <Text style={styles.actionText}>Найти кадидатов</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <ClipboardList size={14} color="#424242" />
          <Text style={styles.actionText}>Кандидаты</Text>
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>АШ</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Вакансии</Text>
          <Text style={styles.subtitle}>({vacancies.length}) Всего вакансий</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setWizardModalVisible(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Создать вакансию</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {/* Status Filter Buttons */}
        <View style={styles.statusFilters}>
          <TouchableOpacity
            style={[styles.statusButton, activeTab === 'active' && styles.statusButtonActive]}
            onPress={() => setActiveTab('active')}
          >
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.statusButtonText, activeTab === 'active' && styles.statusButtonTextActive]}>
              Активные
            </Text>
            <View style={styles.statusCount}>
              <Text style={styles.statusCountText}>{activeCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, activeTab === 'closed' && styles.statusButtonActive]}
            onPress={() => setActiveTab('closed')}
          >
            <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.statusButtonText, activeTab === 'closed' && styles.statusButtonTextActive]}>
              Закрытые
            </Text>
            <View style={styles.statusCount}>
              <Text style={styles.statusCountText}>{closedCount}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, activeTab === 'all' && styles.statusButtonActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.statusButtonText, activeTab === 'all' && styles.statusButtonTextActive]}>
              Все
            </Text>
            <View style={styles.statusCount}>
              <Text style={styles.statusCountText}>{vacancies.length}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по ключевым словам..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        renderItem={renderVacancy}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Vacancy Detail Modal */}
      <VacancyDetailModal
        visible={modalVisible}
        vacancy={selectedVacancy}
        companyName={selectedVacancy ? getCompanyName(selectedVacancy.companyId) : undefined}
        company={selectedVacancy ? companies.find(c => c.id === selectedVacancy.companyId) : undefined}
        onUpdateVacancy={onUpdateVacancy}
        onClose={() => {
          setModalVisible(false);
          setSelectedVacancy(null);
        }}
      />

      {/* Vacancy Wizard Modal */}
      <VacancyWizardModal
        visible={wizardModalVisible}
        companies={companies}
        onClose={() => setWizardModalVisible(false)}
        onCreateVacancy={(vacancy) => {
          if (onCreateVacancy) {
            onCreateVacancy(vacancy);
          }
          setWizardModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 6,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  statusButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusButtonTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  statusCount: {
    minWidth: 20,
    height: 16,
    paddingHorizontal: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  clearButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  vacancyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
    overflow: 'hidden',
  },
  companyIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  vacancyInfo: {
    flex: 1,
    minWidth: 0,
  },
  vacancyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A5FD6',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  companyLabel: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  companyName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  proBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  proBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  metaDot: {
    fontSize: 6,
    color: '#D0D0D0',
  },
  metaText: {
    fontSize: 11,
    color: '#616161',
  },
  requirementsPreview: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  statsSeparator: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  daysLeft: {
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
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#424242',
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 4,
    flexShrink: 0,
    minWidth: 120,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#616161',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E2875',
  },
});
