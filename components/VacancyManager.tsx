import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Vacancy, User, UserRole, Company } from '../types';
import { Briefcase, Building2, DollarSign, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface VacancyManagerProps {
  vacancies: Vacancy[];
  user: User;
  companies: Company[];
}

export const VacancyManager: React.FC<VacancyManagerProps> = ({ vacancies, user, companies }) => {
  const router = useRouter();

  const filteredVacancies = useMemo(() => {
    if (user.role === UserRole.CLIENT && user.companyId) {
      return vacancies.filter(v => v.companyId === user.companyId);
    }
    return vacancies;
  }, [vacancies, user]);

  const activeVacancies = filteredVacancies.filter(v => v.status === 'active');

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Компания';
  };

  const renderVacancy = ({ item: v }: { item: Vacancy }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.vacancyTitle}>{v.title}</Text>
          <View style={styles.companyRow}>
            <Building2 size={14} color="#757575" />
            <Text style={styles.companyText}>{getCompanyName(v.companyId)}</Text>
          </View>
          {v.location && (
            <Text style={styles.locationText}>
              📍 {v.location.city}, {v.location.country}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, v.status === 'active' ? styles.statusBadgeActive : styles.statusBadgeClosed]}>
          <Text style={[styles.statusText, v.status === 'active' ? styles.statusTextActive : styles.statusTextClosed]}>
            {v.status === 'active' ? 'АКТИВНА' : 'ЗАКРЫТА'}
          </Text>
        </View>
      </View>

      {v.salaryRange && (
        <View style={styles.salaryRow}>
          <DollarSign size={14} color="#6B9BD1" />
          <Text style={styles.salaryText}>
            ${v.salaryRange.min} - ${v.salaryRange.max}
          </Text>
        </View>
      )}

      {v.requirements && v.requirements.length > 0 && (
        <View style={styles.tagsRow}>
          {v.requirements.slice(0, 5).map((req, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{req}</Text>
            </View>
          ))}
        </View>
      )}

      {v.description && (
        <Text style={styles.description} numberOfLines={2}>
          {v.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerRow}>
            <Briefcase size={32} color="#6B9BD1" />
            <Text style={styles.title}>Вакансии</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/vacancy/new-wizard')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Всего: {filteredVacancies.length} (активных: {activeVacancies.length})
        </Text>

        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabTextActive}>АКТИВНЫЕ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>ЗАКРЫТЫЕ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeVacancies.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Briefcase size={40} color="#E2E8F0" />
          </View>
          <Text style={styles.emptyTitle}>Нет активных вакансий</Text>
          <Text style={styles.emptyText}>
            Создайте новую вакансию для начала подбора кандидатов.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activeVacancies}
          renderItem={renderVacancy}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  header: { marginBottom: 32 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  title: { fontSize: 28, fontWeight: '600', color: '#000000' },
  subtitle: { fontSize: 14, fontWeight: '400', color: '#71717A', marginBottom: 24 },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: { flexDirection: 'row', gap: 8 },
  tabActive: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#000000', borderRadius: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F4F4F5', borderWidth: 1, borderColor: '#E4E4E7', borderRadius: 8 },
  tabTextActive: { fontSize: 13, fontWeight: '500', color: '#FFFFFF' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#71717A' },
  card: { backgroundColor: '#FAFAFA', padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E4E4E7' },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  cardHeaderLeft: { flex: 1 },
  vacancyTitle: { fontSize: 17, fontWeight: '500', color: '#000000', marginBottom: 8 },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  companyText: { fontSize: 13, fontWeight: '400', color: '#71717A' },
  locationText: { fontSize: 12, fontWeight: '400', color: '#71717A', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  statusBadgeActive: { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
  statusBadgeClosed: { backgroundColor: '#F4F4F5', borderColor: '#E4E4E7' },
  statusText: { fontSize: 11, fontWeight: '500', textTransform: 'uppercase' },
  statusTextActive: { color: '#059669' },
  statusTextClosed: { color: '#71717A' },
  salaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  salaryText: { fontSize: 15, fontWeight: '600', color: '#000000' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: { paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#F4F4F5', borderRadius: 8, borderWidth: 1, borderColor: '#E4E4E7' },
  tagText: { fontSize: 11, fontWeight: '500', color: '#52525B' },
  description: { fontSize: 13, color: '#71717A', fontWeight: '400', lineHeight: 20 },
  emptyState: { backgroundColor: '#FAFAFA', padding: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E4E4E7', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyIcon: { width: 64, height: 64, backgroundColor: '#F4F4F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#000000', marginBottom: 8 },
  emptyText: { fontSize: 14, fontWeight: '400', color: '#71717A', textAlign: 'center', maxWidth: 280, lineHeight: 22 },
});
