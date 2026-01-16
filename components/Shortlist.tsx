import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Candidate } from '../types';
import { Star, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ShortlistProps {
  candidates: Candidate[];
}

export const Shortlist: React.FC<ShortlistProps> = ({ candidates }) => {
  const router = useRouter();

  const renderCandidate = ({ item: c }: { item: Candidate }) => (
    <TouchableOpacity
      onPress={() => router.push(`/candidate/${c.id}`)}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.initial}>
          <Text style={styles.initialText}>{c.name[0]}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{c.name}</Text>
          <Text style={styles.position}>{c.position}</Text>
        </View>
        <View style={styles.meta}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{c.aiAnalysis?.score}%</Text>
          </View>
          <Text style={styles.location}>{c.location}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{c.status}</Text>
        </View>
        <View style={styles.moreLink}>
          <Text style={styles.moreLinkText}>ПОДРОБНЕЕ</Text>
          <ChevronRight size={14} color="#0066FF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Star size={32} color="#FFC107" fill="#FFC107" />
          <Text style={styles.title}>Избранное</Text>
        </View>
        <Text style={styles.subtitle}>
          Лучшие кандидаты, отобранные вами для быстрого доступа. ({candidates.length})
        </Text>
      </View>

      {candidates.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Star size={40} color="#E2E8F0" />
          </View>
          <Text style={styles.emptyTitle}>Список пуст</Text>
          <Text style={styles.emptyText}>
            Добавляйте лучших кандидатов в Shortlist, чтобы не терять их из виду в процессе подбора.
          </Text>
        </View>
      ) : (
        <FlatList
          data={candidates}
          renderItem={renderCandidate}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  header: { marginBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '600', color: '#000000' },
  subtitle: { fontSize: 14, fontWeight: '400', color: '#71717A' },
  list: { paddingBottom: 100 },
  card: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E4E4E7' },
  cardContent: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  initial: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#F4F4F5', alignItems: 'center', justifyContent: 'center' },
  initialText: { fontSize: 22, fontWeight: '600', color: '#52525B' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500', color: '#000000', marginBottom: 6 },
  position: { fontSize: 12, fontWeight: '400', color: '#71717A', textTransform: 'uppercase' },
  meta: { alignItems: 'flex-end', gap: 8 },
  scoreBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#A7F3D0' },
  scoreText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  location: { fontSize: 11, fontWeight: '400', color: '#A1A1AA', textTransform: 'uppercase' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#E4E4E7' },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
  statusText: { fontSize: 11, fontWeight: '500', color: '#2563EB', textTransform: 'uppercase' },
  moreLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  moreLinkText: { fontSize: 13, fontWeight: '500', color: '#000000' },
  emptyState: { backgroundColor: '#FAFAFA', padding: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E4E4E7', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyIcon: { width: 64, height: 64, backgroundColor: '#F4F4F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#000000', marginBottom: 8 },
  emptyText: { fontSize: 14, fontWeight: '400', color: '#71717A', textAlign: 'center', maxWidth: 280, lineHeight: 22 },
});
