import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Candidate, CandidateStatus } from '../types';
import { DraggableKanbanCard } from './DraggableKanbanCard';

interface KanbanBoardProps {
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
  onToggleShortlist: (id: string) => void;
}

interface KanbanColumn {
  status: CandidateStatus;
  title: string;
  color: string;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  { status: CandidateStatus.NEW, title: 'Ожидает отправки', color: '#94A3B8' },
  { status: CandidateStatus.SENT_TO_CLIENT, title: 'Отправлен заказчику', color: '#3B82F6' },
  { status: CandidateStatus.CLIENT_INTERVIEW, title: 'Интервью у заказчика', color: '#8B5CF6' },
  { status: CandidateStatus.TEST_TASK, title: 'Проходит тестовое', color: '#F59E0B' },
  { status: CandidateStatus.SECURITY_CHECK, title: 'Сбор рекомендаций', color: '#EC4899' },
  { status: CandidateStatus.INTERNSHIP, title: 'Стажировка', color: '#06B6D4' },
  { status: CandidateStatus.OFFER, title: 'Оффер', color: '#10B981' },
  { status: CandidateStatus.HIRED, title: 'Найм', color: '#059669' },
  { status: CandidateStatus.REJECTED, title: 'Отказ', color: '#EF4444' },
  { status: CandidateStatus.RESERVE, title: 'Кадровый резерв', color: '#F97316' },
  { status: CandidateStatus.FIRED, title: 'Уволен', color: '#71717A' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onStatusChange,
  onToggleShortlist
}) => {
  const columnCandidates = useMemo(() => {
    const groups: Record<CandidateStatus, Candidate[]> = {
      [CandidateStatus.NEW]: [],
      [CandidateStatus.SENT_TO_CLIENT]: [],
      [CandidateStatus.CLIENT_INTERVIEW]: [],
      [CandidateStatus.TEST_TASK]: [],
      [CandidateStatus.SECURITY_CHECK]: [],
      [CandidateStatus.INTERNSHIP]: [],
      [CandidateStatus.OFFER]: [],
      [CandidateStatus.HIRED]: [],
      [CandidateStatus.REJECTED]: [],
      [CandidateStatus.RESERVE]: [],
      [CandidateStatus.FIRED]: [],
      [CandidateStatus.BLACKLIST]: [],
    };

    candidates.forEach(candidate => {
      groups[candidate.status].push(candidate);
    });

    return groups;
  }, [candidates]);

  const renderColumn = (column: KanbanColumn) => {
    const columnCandidatesList = columnCandidates[column.status];
    const count = columnCandidatesList.length;

    return (
      <View key={column.status} style={styles.column}>
        <View style={styles.columnHeader}>
          <View style={[styles.columnHeaderDot, { backgroundColor: column.color }]} />
          <Text style={styles.columnTitle}>{column.title}</Text>
          <View style={[styles.columnCount, { backgroundColor: column.color + '20' }]}>
            <Text style={[styles.columnCountText, { color: column.color }]}>{count}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.columnContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.columnContentContainer}
        >
          {columnCandidatesList.length === 0 ? (
            <View style={styles.emptyColumn}>
              <Text style={styles.emptyColumnText}>Нет кандидатов</Text>
            </View>
          ) : (
            columnCandidatesList.map(candidate => (
              <DraggableKanbanCard
                key={candidate.id}
                candidate={candidate}
                onToggleShortlist={onToggleShortlist}
                onStatusChange={onStatusChange}
                isCompact={count > 5}
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kanbanScroll}
      >
        {KANBAN_COLUMNS.map(column => renderColumn(column))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  kanbanScroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  column: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 16,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  columnHeaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  columnTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  columnCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  columnCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  columnContent: {
    flex: 1,
  },
  columnContentContainer: {
    paddingBottom: 8,
  },
  emptyColumn: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E4E4E7',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  emptyColumnText: {
    fontSize: 13,
    color: '#A1A1AA',
    fontWeight: '500',
  },
});
