import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Users, Briefcase, Clock, CheckCircle } from 'lucide-react-native';
import { CandidateStatus } from '../../types';

export default function ClientDashboardScreen() {
  const { currentUser, visibleCandidates, activeVacancies, companies } = useApp();

  const company = companies.find(c => c.id === currentUser.companyId);

  // Статистика по кандидатам
  const stats = {
    total: visibleCandidates.length,
    new: visibleCandidates.filter(c => c.status === CandidateStatus.SENT_TO_CLIENT).length,
    inProgress: visibleCandidates.filter(c =>
      [CandidateStatus.CLIENT_INTERVIEW, CandidateStatus.TEST_TASK, CandidateStatus.SECURITY_CHECK].includes(c.status)
    ).length,
    hired: visibleCandidates.filter(c => c.status === CandidateStatus.HIRED).length,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Добро пожаловать,</Text>
        <Text style={styles.userName}>{currentUser.name}</Text>
        {company && (
          <Text style={styles.companyName}>{company.name}</Text>
        )}
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
          <Users size={24} color="#2563EB" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Всего кандидатов</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Clock size={24} color="#D97706" />
          <Text style={styles.statNumber}>{stats.new}</Text>
          <Text style={styles.statLabel}>Новые</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
          <Briefcase size={24} color="#7C3AED" />
          <Text style={styles.statNumber}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>В процессе</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#DCFCE7' }]}>
          <CheckCircle size={24} color="#16A34A" />
          <Text style={styles.statNumber}>{stats.hired}</Text>
          <Text style={styles.statLabel}>Наняты</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Активные вакансии</Text>
        {activeVacancies.length === 0 ? (
          <Text style={styles.emptyText}>Нет активных вакансий</Text>
        ) : (
          activeVacancies.map(vacancy => (
            <View key={vacancy.id} style={styles.vacancyCard}>
              <Text style={styles.vacancyTitle}>{vacancy.title}</Text>
              <Text style={styles.vacancyLocation}>
                {vacancy.location ? `${vacancy.location.city}, ${vacancy.location.country}` : 'Не указано'}
              </Text>
              <Text style={styles.vacancyCandidates}>
                {visibleCandidates.filter(c => c.position === vacancy.title).length} кандидатов
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#0066FF',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  companyName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 20,
  },
  vacancyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vacancyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  vacancyLocation: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  vacancyCandidates: {
    fontSize: 12,
    color: '#0066FF',
    marginTop: 8,
  },
});
