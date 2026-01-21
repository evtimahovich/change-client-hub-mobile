import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { MenuButton } from '../../components/MenuButton';
import { Users, Briefcase, Calendar, CheckCircle2, Clock, UserCheck } from 'lucide-react-native';
import { CandidateStatus } from '../../types';

export default function ClientDashboardScreen() {
  const { currentUser, visibleCandidates, activeVacancies, companies } = useApp();

  const company = companies.find(c => c.id === currentUser.companyId);

  // Статистика по кандидатам для клиента
  const stats = useMemo(() => {
    const total = visibleCandidates.length;
    const newCandidates = visibleCandidates.filter(c => c.status === CandidateStatus.SENT_TO_CLIENT).length;
    const inInterview = visibleCandidates.filter(c => c.status === CandidateStatus.CLIENT_INTERVIEW).length;
    const inProgress = visibleCandidates.filter(c =>
      [CandidateStatus.TEST_TASK, CandidateStatus.SECURITY_CHECK, CandidateStatus.INTERNSHIP].includes(c.status)
    ).length;
    const withOffer = visibleCandidates.filter(c => c.status === CandidateStatus.OFFER).length;
    const hired = visibleCandidates.filter(c => c.status === CandidateStatus.HIRED).length;

    return [
      { label: 'Всего кандидатов', value: total, icon: Users, color: '#0066FF' },
      { label: 'Новые на рассмотрение', value: newCandidates, icon: Clock, color: '#F59E0B' },
      { label: 'На интервью', value: inInterview, icon: Calendar, color: '#8B5CF6' },
      { label: 'В процессе', value: inProgress, icon: Briefcase, color: '#06B6D4' },
      { label: 'С оффером', value: withOffer, icon: UserCheck, color: '#10B981' },
      { label: 'Наняты', value: hired, icon: CheckCircle2, color: '#059669' },
    ];
  }, [visibleCandidates]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Добро пожаловать,</Text>
          <Text style={styles.userName}>{currentUser.name}</Text>
          {company && (
            <Text style={styles.companyName}>{company.name}</Text>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Active Vacancies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ваши вакансии ({activeVacancies.length})</Text>
          {activeVacancies.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Нет активных вакансий</Text>
            </View>
          ) : (
            activeVacancies.map(vacancy => {
              const candidatesCount = visibleCandidates.filter(c => c.position === vacancy.title).length;
              return (
                <View key={vacancy.id} style={styles.vacancyCard}>
                  <View style={styles.vacancyHeader}>
                    <View style={styles.vacancyIconContainer}>
                      <Briefcase size={20} color="#0066FF" />
                    </View>
                    <View style={styles.vacancyInfo}>
                      <Text style={styles.vacancyTitle}>{vacancy.title}</Text>
                      <Text style={styles.vacancyLocation}>
                        {vacancy.location ? `${vacancy.location.city}, ${vacancy.location.country}` : 'Не указано'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.vacancyFooter}>
                    <View style={styles.vacancyStat}>
                      <Users size={14} color="#64748B" />
                      <Text style={styles.vacancyStatText}>{candidatesCount} кандидатов</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                      <Text style={[styles.statusText, { color: '#16A34A' }]}>Активна</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <MenuButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#0066FF',
    marginTop: 4,
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
  vacancyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vacancyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vacancyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vacancyInfo: {
    flex: 1,
  },
  vacancyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  vacancyLocation: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  vacancyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  vacancyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vacancyStatText: {
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
