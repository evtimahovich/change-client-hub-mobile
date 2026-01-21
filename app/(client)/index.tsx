import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { MenuButton } from '../../components/MenuButton';
import { Users, Briefcase, Calendar, CheckCircle2, Clock, UserCheck, Building2, AlertCircle } from 'lucide-react-native';
import { CandidateStatus } from '../../types';

export default function ClientDashboardScreen() {
  const { currentUser, visibleCandidates, activeVacancies, companies } = useApp();
  const { width } = useWindowDimensions();

  const company = companies.find(c => c.id === currentUser.companyId);
  const isNewClient = !currentUser.companyId;

  // Адаптивная ширина для веб
  const contentMaxWidth = Math.min(1200, width);
  const isWideScreen = width > 768;

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

  // Рассчитываем ширину карточки статистики
  const getStatCardStyle = () => {
    if (isWideScreen) {
      // На широких экранах - 3 карточки в ряд
      return { width: 'calc(33.333% - 12px)' as any, minWidth: 200 };
    }
    // На мобильных - 2 карточки в ряд
    return { width: '48%' as any };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Контейнер с максимальной шириной */}
        <View style={[styles.contentWrapper, { maxWidth: contentMaxWidth, width: '100%' }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <MenuButton />
              <View style={styles.headerInfo}>
                <Text style={styles.greeting}>Добро пожаловать,</Text>
                <Text style={styles.userName}>{currentUser.name}</Text>
                {company && (
                  <View style={styles.companyBadge}>
                    <Building2 size={14} color="#0066FF" />
                    <Text style={styles.companyName}>{company.name}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Уведомление для нового клиента без компании */}
          {isNewClient && (
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeIconContainer}>
                <AlertCircle size={24} color="#F59E0B" />
              </View>
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>Добро пожаловать в Change!</Text>
                <Text style={styles.welcomeText}>
                  Ваш аккаунт создан. Для просмотра кандидатов и вакансий обратитесь к вашему рекрутеру для привязки к компании.
                </Text>
              </View>
            </View>
          )}

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Статистика</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={[styles.statCard, getStatCardStyle()]}>
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
                <View style={styles.emptyIconContainer}>
                  <Briefcase size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>Нет активных вакансий</Text>
                <Text style={styles.emptyText}>
                  {isNewClient
                    ? 'После привязки к компании здесь появятся ваши вакансии'
                    : 'Когда рекрутер создаст вакансию для вашей компании, она появится здесь'
                  }
                </Text>
              </View>
            ) : (
              <View style={[styles.vacanciesGrid, isWideScreen && styles.vacanciesGridWide]}>
                {activeVacancies.map(vacancy => {
                  const candidatesCount = visibleCandidates.filter(c => c.position === vacancy.title).length;
                  return (
                    <View key={vacancy.id} style={[styles.vacancyCard, isWideScreen && styles.vacancyCardWide]}>
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
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  contentWrapper: {
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerInfo: {
    flex: 1,
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
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  companyName: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '500',
  },
  welcomeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 16,
  },
  welcomeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 20,
  },
  vacanciesGrid: {
    gap: 16,
  },
  vacanciesGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vacancyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  vacancyCardWide: {
    width: 'calc(50% - 8px)' as any,
    minWidth: 300,
  },
  vacancyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vacancyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
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
    marginTop: 4,
  },
  vacancyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  vacancyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vacancyStatText: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
