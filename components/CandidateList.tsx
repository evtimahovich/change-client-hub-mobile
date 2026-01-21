import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, ScrollView } from 'react-native';
import { Candidate, CandidateStatus, Company, Vacancy } from '../types';
import { Search, Filter, Star, MessageSquare, ListFilter, Briefcase, Plus, X, ChevronDown, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { KanbanBoard } from './KanbanBoard';
import CandidateDrawer from './CandidateDrawer';
import { VacancyWizardModal } from './VacancyWizardModal';

interface CandidateListProps {
  candidates: Candidate[];
  vacancies?: Array<{ id: string; title: string; companyId: string; companyName?: string }>;
  companies?: Company[];
  onToggleShortlist: (id: string) => void;
  onStatusChange: (candidateId: string, newStatus: CandidateStatus, comment: string) => void;
  onAddToVacancy?: (candidateIds: string[], vacancyId: string) => void;
  onCreateVacancy?: (vacancy: Vacancy) => void;
  isClientView?: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  vacancies = [],
  companies = [],
  onToggleShortlist,
  onStatusChange,
  onAddToVacancy,
  onCreateVacancy,
  isClientView = false,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode] = useState<'list' | 'kanban'>('list');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addToVacancyModalVisible, setAddToVacancyModalVisible] = useState(false);
  const [selectedCandidateForVacancy, setSelectedCandidateForVacancy] = useState<string | null>(null);
  const [vacancyFilter, setVacancyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [wizardModalVisible, setWizardModalVisible] = useState(false);

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesVacancy = vacancyFilter === 'all' || c.vacancyId === vacancyFilter;
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesVacancy && matchesStatus;
    });
  }, [candidates, searchTerm, vacancyFilter, statusFilter]);

  const getStatusColor = (status: CandidateStatus) => {
    const colors: Record<CandidateStatus, string> = {
      [CandidateStatus.NEW]: '#94A3B8',
      [CandidateStatus.SENT_TO_CLIENT]: '#3B82F6',
      [CandidateStatus.CLIENT_INTERVIEW]: '#8B5CF6',
      [CandidateStatus.TEST_TASK]: '#F59E0B',
      [CandidateStatus.SECURITY_CHECK]: '#EC4899',
      [CandidateStatus.INTERNSHIP]: '#06B6D4',
      [CandidateStatus.OFFER]: '#10B981',
      [CandidateStatus.HIRED]: '#059669',
      [CandidateStatus.REJECTED]: '#EF4444',
      [CandidateStatus.RESERVE]: '#F97316',
      [CandidateStatus.FIRED]: '#71717A',
      [CandidateStatus.BLACKLIST]: '#000000',
    };
    return colors[status] || '#94A3B8';
  };

  const handleOpenAddToVacancy = (candidateId: string) => {
    setSelectedCandidateForVacancy(candidateId);
    setAddToVacancyModalVisible(true);
  };

  const handleAddToVacancy = (vacancyId: string) => {
    if (onAddToVacancy && selectedCandidateForVacancy) {
      onAddToVacancy([selectedCandidateForVacancy], vacancyId);
    }

    setAddToVacancyModalVisible(false);
    setSelectedCandidateForVacancy(null);
  };

  const renderCandidate = ({ item: c }: { item: Candidate }) => {
    const firstName = c.name.split(' ')[0];
    const initials = c.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
      <View style={styles.candidateCard}>
        {/* Top section - Avatar and main info */}
        <View style={styles.cardTop}>
          {/* Left - Avatar with match overlay */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              {c.isNew && <View style={styles.newIndicator} />}
              {c.shortlisted && (
                <View style={styles.starBadge}>
                  <Star size={10} color="#FFD700" fill="#FFD700" />
                </View>
              )}
              <View style={styles.matchCircle}>
                <Text style={styles.matchText}>100%</Text>
              </View>
            </View>
          </View>

          {/* Right - Info */}
          <View style={styles.infoSection}>
            {/* Position title */}
            <TouchableOpacity onPress={() => {
              setSelectedCandidate(c);
              setDrawerVisible(true);
            }}>
              <Text style={styles.positionTitle}>{c.position}</Text>
            </TouchableOpacity>

            {/* Name and location */}
            <Text style={styles.nameText}>
              {firstName}, <Text style={styles.locationText}>{c.location}, Киев, 28 лет</Text>
            </Text>

            {/* Salary */}
            <View style={styles.salaryRow}>
              <Text style={styles.salaryAmount}>${c.salaryExpectation.toLocaleString()}</Text>
            </View>

            {/* Last job */}
            <View style={styles.jobSection}>
              <View style={styles.jobHeader}>
                <Briefcase size={10} color="#9E9E9E" />
                <Text style={styles.jobLabel}>ПОСЛЕДНЕЕ МЕСТО РАБОТЫ</Text>
              </View>
              <Text style={styles.jobTitle}>
                Android Developer, в GlobalIT, Киев
              </Text>
              <Text style={styles.jobPeriod}>
                Октябрь 2019 - по настоящее время (6 лет){' '}
                <Text style={styles.moreLink}>еще 3 ▼</Text>
              </Text>
            </View>
          </View>

          {/* Right - Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionMenuItem}>
              <ListFilter size={12} color="#424242" />
              <Text style={styles.actionMenuText}>В шортлист</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionMenuItem}>
              <MessageSquare size={12} color="#424242" />
              <Text style={styles.actionMenuText}>Связаться</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionMenuItem, c.shortlisted && styles.actionMenuItemActive]}
              onPress={() => onToggleShortlist(c.id)}
            >
              <Star
                size={12}
                color={c.shortlisted ? '#F59E0B' : '#424242'}
                fill={c.shortlisted ? '#F59E0B' : 'transparent'}
              />
              <Text style={[styles.actionMenuText, c.shortlisted && styles.actionMenuTextActive]}>
                В избранное
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => router.push(`/candidate/${c.id}`)}
            >
              <Clock size={12} color="#424242" />
              <Text style={styles.actionMenuText}>История взаимодействий</Text>
            </TouchableOpacity>

            {!isClientView && (
              <TouchableOpacity
                style={styles.sendToVacancyButton}
                onPress={() => handleOpenAddToVacancy(c.id)}
              >
                <Briefcase size={12} color="#FFFFFF" />
                <Text style={styles.sendToVacancyText}>Отправить на вакансию</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Фильтры</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Вакансия</Text>
              <TouchableOpacity
                style={[styles.filterOption, vacancyFilter === 'all' && styles.filterOptionActive]}
                onPress={() => setVacancyFilter('all')}
              >
                <Text style={[styles.filterOptionText, vacancyFilter === 'all' && styles.filterOptionTextActive]}>
                  Все вакансии
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterOption, vacancyFilter === 'v1' && styles.filterOptionActive]}
                onPress={() => setVacancyFilter('v1')}
              >
                <Text style={[styles.filterOptionText, vacancyFilter === 'v1' && styles.filterOptionTextActive]}>
                  Senior Frontend Developer
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Статус</Text>
              <TouchableOpacity
                style={[styles.filterOption, statusFilter === 'all' && styles.filterOptionActive]}
                onPress={() => setStatusFilter('all')}
              >
                <Text style={[styles.filterOptionText, statusFilter === 'all' && styles.filterOptionTextActive]}>
                  Все статусы
                </Text>
              </TouchableOpacity>
              {Object.values(CandidateStatus).map(status => (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterOption, statusFilter === status && styles.filterOptionActive]}
                  onPress={() => setStatusFilter(status)}
                >
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                  <Text style={[styles.filterOptionText, statusFilter === status && styles.filterOptionTextActive]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.filterResetButton}
              onPress={() => {
                setVacancyFilter('all');
                setStatusFilter('all');
              }}
            >
              <Text style={styles.filterResetText}>Сбросить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterApplyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.filterApplyText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderAddToVacancyModal = () => {
    const selectedCandidate = candidates.find(c => c.id === selectedCandidateForVacancy);

    return (
      <Modal
        visible={addToVacancyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddToVacancyModalVisible(false)}
      >
        <View style={styles.vacancyModalOverlay}>
          <View style={styles.vacancyModal}>
            {/* Header */}
            <View style={styles.vacancyModalHeader}>
              <Text style={styles.vacancyModalTitle}>Добавить кандидата в вакансию</Text>
              <TouchableOpacity
                onPress={() => setAddToVacancyModalVisible(false)}
                style={styles.vacancyModalClose}
              >
                <X size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {vacancies.length === 0 ? (
              /* Empty State */
              <>
                <View style={styles.emptyVacancies}>
                  <View style={styles.emptyVacanciesIcon}>
                    <Briefcase size={48} color="#E0E0E0" />
                  </View>
                  <Text style={styles.emptyVacanciesTitle}>
                    У вас пока нет созданных вакансий
                  </Text>
                  <Text style={styles.emptyVacanciesText}>
                    Создайте первую вакансию, чтобы начать процесс подбора кандидатов
                  </Text>
                </View>

                <View style={styles.emptyVacanciesActions}>
                  <TouchableOpacity
                    style={styles.cancelVacancyButton}
                    onPress={() => setAddToVacancyModalVisible(false)}
                  >
                    <Text style={styles.cancelVacancyButtonText}>Отменить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.createVacancyButton}
                    onPress={() => {
                      setAddToVacancyModalVisible(false);
                      setWizardModalVisible(true);
                    }}
                  >
                    <Text style={styles.createVacancyButtonText}>Создать</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Vacancy List */
              <>
                {selectedCandidate && (
                  <View style={styles.selectedCandidateInfo}>
                    <View style={styles.selectedCandidateAvatar}>
                      <Text style={styles.selectedCandidateInitials}>
                        {selectedCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>
                    <View style={styles.selectedCandidateDetails}>
                      <Text style={styles.selectedCandidateName}>{selectedCandidate.name}</Text>
                      <Text style={styles.selectedCandidatePosition}>{selectedCandidate.position}</Text>
                    </View>
                  </View>
                )}

                <Text style={styles.vacancySectionTitle}>Выберите вакансию</Text>
                <ScrollView style={styles.vacancyModalContent} showsVerticalScrollIndicator={false}>
                  {vacancies.map((vacancy) => (
                    <TouchableOpacity
                      key={vacancy.id}
                      style={styles.vacancyOption}
                      onPress={() => handleAddToVacancy(vacancy.id)}
                    >
                      <View style={styles.vacancyOptionIcon}>
                        <Briefcase size={20} color="#4A5FD6" />
                      </View>
                      <View style={styles.vacancyOptionInfo}>
                        <Text style={styles.vacancyOptionTitle}>{vacancy.title}</Text>
                        {vacancy.companyName && (
                          <Text style={styles.vacancyOptionCompany}>
                            в {vacancy.companyName}
                          </Text>
                        )}
                      </View>
                      <ChevronDown
                        size={20}
                        color="#9E9E9E"
                        style={{ transform: [{ rotate: '-90deg' }] }}
                      />
                    </TouchableOpacity>
                  ))}

                  {/* Create new vacancy option */}
                  <TouchableOpacity
                    style={styles.createNewVacancyOption}
                    onPress={() => {
                      setAddToVacancyModalVisible(false);
                      setWizardModalVisible(true);
                    }}
                  >
                    <View style={styles.createNewVacancyIcon}>
                      <Plus size={20} color="#4A5FD6" />
                    </View>
                    <Text style={styles.createNewVacancyText}>Создать новую вакансию</Text>
                    <ChevronDown
                      size={20}
                      color="#9E9E9E"
                      style={{ transform: [{ rotate: '-90deg' }] }}
                    />
                  </TouchableOpacity>
                </ScrollView>

                <View style={styles.vacancyModalActions}>
                  <TouchableOpacity
                    style={styles.cancelVacancyButton}
                    onPress={() => setAddToVacancyModalVisible(false)}
                  >
                    <Text style={styles.cancelVacancyButtonText}>Отменить</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Кандидаты</Text>
            <Text style={styles.subtitle}>(1 280) Кандидатов отображается</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
              <Filter size={16} color="#18181B" />
              <Text style={styles.filterButtonText}>Фильтр</Text>
            </TouchableOpacity>
            {!isClientView && (
              <TouchableOpacity style={styles.addButton} onPress={() => router.push('/candidate/new')}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Добавить</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={18} color="#9E9E9E" />
            <TextInput
              placeholder="Введите навыки, технологию, сферу деятельности или другое"
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#9E9E9E"
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Найти</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={filtered}
          renderItem={renderCandidate}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <KanbanBoard
          candidates={filtered}
          onStatusChange={(id, status) => onStatusChange(id, status, 'Статус изменен через Kanban')}
          onToggleShortlist={onToggleShortlist}
        />
      )}

      {renderFilterModal()}
      {renderAddToVacancyModal()}

      <CandidateDrawer
        visible={drawerVisible}
        candidate={selectedCandidate}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedCandidate(null);
        }}
        isClientView={isClientView}
      />

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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {},
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#1E2875',
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
  },
  searchButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#1E2875',
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  candidateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E2875',
  },
  newIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  starBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  matchCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  matchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoSection: {
    flex: 1,
  },
  positionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5FD6',
    marginBottom: 3,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9E9E9E',
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  salaryAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  jobSection: {
    marginBottom: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  jobLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: '#BDBDBD',
    letterSpacing: 0.3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#424242',
    marginBottom: 2,
    lineHeight: 15,
  },
  jobPeriod: {
    fontSize: 10,
    fontWeight: '400',
    color: '#BDBDBD',
    lineHeight: 14,
  },
  moreLink: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4A5FD6',
  },
  cardActions: {
    gap: 4,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionMenuItemActive: {
    // No special background for active state
  },
  actionMenuText: {
    fontSize: 9,
    fontWeight: '400',
    color: '#616161',
    lineHeight: 12,
  },
  actionMenuTextActive: {
    color: '#F57C00',
    fontWeight: '500',
  },
  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#1E2875',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  filterResetButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  filterResetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
  },
  filterApplyButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#1E2875',
    borderRadius: 10,
    alignItems: 'center',
  },
  filterApplyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Vacancy Modal
  vacancyModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 24,
  },
  vacancyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  vacancyModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  vacancyModalSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#757575',
  },
  vacancyModalContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  emptyVacancies: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyVacanciesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyVacanciesText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 0,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  createVacancyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  createVacancyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  vacancySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  vacancyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 8,
  },
  vacancyOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vacancyOptionInfo: {
    flex: 1,
  },
  vacancyOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vacancyOptionCompany: {
    fontSize: 13,
    fontWeight: '400',
    color: '#757575',
  },
  vacancyModalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
  },
  sendToVacancyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4A5FD6',
    borderRadius: 6,
    marginTop: 8,
  },
  sendToVacancyText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  vacancyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  vacancyModalClose: {
    padding: 4,
  },
  emptyVacanciesIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyVacanciesActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cancelVacancyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelVacancyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  selectedCandidateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedCandidateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedCandidateInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2875',
  },
  selectedCandidateDetails: {
    flex: 1,
  },
  selectedCandidateName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  selectedCandidatePosition: {
    fontSize: 13,
    color: '#616161',
  },
  vacancyOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  createNewVacancyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  createNewVacancyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  createNewVacancyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5FD6',
  },
});
