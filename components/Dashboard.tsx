import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { User, Candidate, CandidateStatus } from '../types';
import { Briefcase, Users, Calendar, CheckCircle2, Plus, Building2, UserPlus, AlertCircle } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { useRouter } from 'expo-router';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const router = useRouter();
  const { vacancies, visibleCandidates: candidates } = useApp();

  // Calculate statistics
  const activeVacancies = vacancies.filter(v => v.status === 'active').length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newCandidatesThisWeek = candidates.filter(c =>
    c.isNew && new Date(c.history[0]?.date || '') >= oneWeekAgo
  ).length;

  const thisWeekInterviews = candidates.filter(c =>
    c.status === CandidateStatus.CLIENT_INTERVIEW
  ).length;

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const closedVacanciesThisMonth = vacancies.filter(v =>
    v.status === 'closed' && v.history.some(h =>
      h.action === 'closed' && new Date(h.date) >= oneMonthAgo
    )
  ).length;

  const stats = [
    { label: 'Активных вакансий', value: activeVacancies, icon: Briefcase, color: '#0066FF' },
    { label: 'Новых кандидатов за неделю', value: newCandidatesThisWeek, icon: Users, color: '#10B981' },
    { label: 'Интервью на этой неделе', value: thisWeekInterviews, icon: Calendar, color: '#F59E0B' },
    { label: 'Закрытых вакансий за месяц', value: closedVacanciesThisMonth, icon: CheckCircle2, color: '#8B5CF6' },
  ];

  // Quick Actions
  const quickActions = [
    { label: 'Компания', icon: Building2, route: '/company/new', color: '#0066FF' },
    { label: 'Вакансия', icon: Briefcase, route: '/vacancy/new-wizard', color: '#10B981' },
    { label: 'Кандидат', icon: UserPlus, route: '/candidate/new', color: '#F59E0B' },
  ];

  // Upcoming Interviews (mock data for today/tomorrow)
  const upcomingInterviews = useMemo(() => {
    const interviewCandidates = candidates.filter(c =>
      c.status === CandidateStatus.CLIENT_INTERVIEW
    ).slice(0, 5);

    return interviewCandidates.map((c, idx) => ({
      id: c.id,
      time: idx === 0 ? '14:00' : idx === 1 ? '16:30' : 'Завтра 10:00',
      candidate: c.name,
      vacancy: c.position,
      status: idx === 0 ? 'today' : idx === 1 ? 'today' : 'tomorrow',
    }));
  }, [candidates]);

  // Needs Attention
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const candidatesNeedingAttention = candidates.filter(c => {
    const lastInteraction = c.history[c.history.length - 1];
    return lastInteraction && new Date(lastInteraction.date) < sevenDaysAgo;
  }).slice(0, 3);

  const vacanciesNeedingAttention = vacancies.filter(v => {
    const lastActivity = v.history[v.history.length - 1];
    return v.status === 'active' && lastActivity && new Date(lastActivity.date) < threeDaysAgo;
  }).slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Дашборд</Text>
            <Text style={styles.subtitle}>Добро пожаловать, {user.name}</Text>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.quickActionsHeader}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickActionButtonContainer}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionButton, { backgroundColor: `${action.color}15`, borderColor: action.color }]}>
                  <action.icon size={18} color={action.color} />
                </View>
                <Text style={styles.quickActionButtonLabel} numberOfLines={1}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Interviews */}
        {upcomingInterviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ближайшие интервью</Text>
            <View style={styles.card}>
              {upcomingInterviews.map((interview, idx) => (
                <TouchableOpacity
                  key={interview.id}
                  style={[styles.interviewItem, idx !== upcomingInterviews.length - 1 && styles.interviewItemBorder]}
                  onPress={() => router.push(`/candidate/${interview.id}` as any)}
                >
                  <View style={styles.interviewTimeBox}>
                    <Text style={styles.interviewTime}>{interview.time}</Text>
                  </View>
                  <View style={styles.interviewInfo}>
                    <Text style={styles.interviewCandidate}>{interview.candidate}</Text>
                    <Text style={styles.interviewVacancy}>{interview.vacancy}</Text>
                  </View>
                  <View style={[
                    styles.interviewStatus,
                    interview.status === 'today' ? styles.interviewStatusToday : styles.interviewStatusTomorrow
                  ]}>
                    <Text style={[
                      styles.interviewStatusText,
                      interview.status === 'today' ? styles.interviewStatusTextToday : styles.interviewStatusTextTomorrow
                    ]}>
                      {interview.status === 'today' ? 'Сегодня' : 'Завтра'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {upcomingInterviews.length === 0 && (
                <Text style={styles.emptyText}>Нет запланированных интервью</Text>
              )}
            </View>
          </View>
        )}

        {/* Needs Attention */}
        {(candidatesNeedingAttention.length > 0 || vacanciesNeedingAttention.length > 0) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Требуют внимания</Text>
            </View>
            <View style={styles.card}>
              {candidatesNeedingAttention.map((candidate, idx) => (
                <TouchableOpacity
                  key={`candidate-${candidate.id}`}
                  style={[styles.attentionItem, styles.attentionItemBorder]}
                  onPress={() => router.push(`/candidate/${candidate.id}` as any)}
                >
                  <View style={styles.attentionIcon}>
                    <Users size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.attentionInfo}>
                    <Text style={styles.attentionTitle}>{candidate.name}</Text>
                    <Text style={styles.attentionDesc}>Без активности более 7 дней</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {vacanciesNeedingAttention.map((vacancy, idx) => (
                <TouchableOpacity
                  key={`vacancy-${vacancy.id}`}
                  style={[styles.attentionItem, idx !== vacanciesNeedingAttention.length - 1 && styles.attentionItemBorder]}
                  onPress={() => router.push(`/vacancy/${vacancy.id}` as any)}
                >
                  <View style={styles.attentionIcon}>
                    <Briefcase size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.attentionInfo}>
                    <Text style={styles.attentionTitle}>{vacancy.title}</Text>
                    <Text style={styles.attentionDesc}>Без откликов более 3 дней</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {candidatesNeedingAttention.length === 0 && vacanciesNeedingAttention.length === 0 && (
                <Text style={styles.emptyText}>Все задачи актуальны</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 28, fontWeight: '600', color: '#000000', marginBottom: 6 },
  subtitle: { fontSize: 14, fontWeight: '400', color: '#71717A' },

  // Quick Action Buttons in Header
  quickActionsHeader: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 8
  },
  quickActionButtonContainer: {
    alignItems: 'center',
    gap: 4
  },
  quickActionButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5
  },
  quickActionButtonLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#52525B',
    textAlign: 'center',
    maxWidth: 50
  },

  // Statistics Cards
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  statValue: { fontSize: 24, fontWeight: '600', color: '#000000', marginBottom: 3 },
  statLabel: { fontSize: 11, fontWeight: '400', color: '#71717A', lineHeight: 15 },

  // Sections
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#000000', marginBottom: 14 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    overflow: 'hidden'
  },

  // Upcoming Interviews
  interviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10
  },
  interviewItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7'
  },
  interviewTimeBox: {
    width: 55,
    alignItems: 'center'
  },
  interviewTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000'
  },
  interviewInfo: { flex: 1 },
  interviewCandidate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 3
  },
  interviewVacancy: {
    fontSize: 12,
    fontWeight: '400',
    color: '#71717A'
  },
  interviewStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5
  },
  interviewStatusToday: {
    backgroundColor: '#DCFCE7'
  },
  interviewStatusTomorrow: {
    backgroundColor: '#FEF3C7'
  },
  interviewStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  interviewStatusTextToday: {
    color: '#15803D'
  },
  interviewStatusTextTomorrow: {
    color: '#A16207'
  },

  // Needs Attention
  attentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10
  },
  attentionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7'
  },
  attentionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  attentionInfo: { flex: 1 },
  attentionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 3
  },
  attentionDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: '#71717A'
  },

  // Empty State
  emptyText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#A1A1AA',
    textAlign: 'center',
    padding: 20
  },
});
