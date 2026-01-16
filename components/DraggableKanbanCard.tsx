import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Candidate, CandidateStatus } from '../types';
import { Star, Send, MessageSquare, Phone, MoveRight, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface DraggableKanbanCardProps {
  candidate: Candidate;
  onToggleShortlist: (id: string) => void;
  onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
  isCompact?: boolean;
}

const STATUS_OPTIONS = [
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

export const DraggableKanbanCard: React.FC<DraggableKanbanCardProps> = ({
  candidate,
  onToggleShortlist,
  onStatusChange,
  isCompact = false,
}) => {
  const router = useRouter();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusSelect = (newStatus: CandidateStatus) => {
    if (newStatus !== candidate.status) {
      onStatusChange(candidate.id, newStatus);
    }
    setShowStatusModal(false);
  };

  const currentStatus = STATUS_OPTIONS.find(s => s.status === candidate.status);

  return (
    <>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => router.push(`/candidate/${candidate.id}`)}
          onLongPress={() => setShowStatusModal(true)}
          activeOpacity={0.7}
          delayLongPress={500}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}` }}
                style={styles.cardAvatar}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {candidate.name.split(' ')[0]}
                </Text>
                <Text style={styles.cardPosition} numberOfLines={1}>
                  {candidate.position}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onToggleShortlist(candidate.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Star
                size={16}
                color={candidate.shortlisted ? '#F59E0B' : '#D1D5DB'}
                fill={candidate.shortlisted ? '#F59E0B' : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {!isCompact && (
            <>
              <View style={styles.cardStats}>
                <View style={styles.cardStatItem}>
                  <Text style={styles.cardStatLabel}>Match</Text>
                  <Text style={styles.cardStatValue}>{candidate.aiAnalysis?.score}%</Text>
                </View>
                <View style={styles.cardStatItem}>
                  <Text style={styles.cardStatLabel}>Salary</Text>
                  <Text style={styles.cardStatValue}>${candidate.salaryExpectation}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.cardActionButton}>
                  <Send size={12} color="#71717A" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardActionButton}>
                  <MessageSquare size={12} color="#71717A" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardActionButton}>
                  <Phone size={12} color="#71717A" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moveButton}
          onPress={() => setShowStatusModal(true)}
        >
          <MoveRight size={14} color="#71717A" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Переместить кандидата</Text>
                <Text style={styles.modalSubtitle}>{candidate.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>

            {currentStatus && (
              <View style={styles.currentStatusBadge}>
                <View style={[styles.statusDot, { backgroundColor: currentStatus.color }]} />
                <Text style={styles.currentStatusText}>Текущий статус: {currentStatus.title}</Text>
              </View>
            )}

            <ScrollView style={styles.statusList} showsVerticalScrollIndicator={false}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.status}
                  style={[
                    styles.statusOption,
                    option.status === candidate.status && styles.statusOptionActive
                  ]}
                  onPress={() => handleStatusSelect(option.status)}
                >
                  <View style={[styles.statusDot, { backgroundColor: option.color }]} />
                  <Text style={[
                    styles.statusOptionText,
                    option.status === candidate.status && styles.statusOptionTextActive
                  ]}>
                    {option.title}
                  </Text>
                  {option.status === candidate.status && (
                    <View style={styles.checkMark}>
                      <Text style={styles.checkMarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 12,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E4E4E7',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  cardPosition: {
    fontSize: 12,
    fontWeight: '400',
    color: '#71717A',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardStatItem: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    padding: 8,
    borderRadius: 6,
  },
  cardStatLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#A1A1AA',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  cardActionButton: {
    flex: 1,
    height: 32,
    backgroundColor: '#F4F4F5',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  moveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },
  currentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F4F4F5',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  currentStatusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525B',
  },
  statusList: {
    paddingHorizontal: 20,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  statusOptionActive: {
    backgroundColor: '#F4F4F5',
    borderColor: '#000000',
    borderWidth: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#52525B',
  },
  statusOptionTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
