import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Phone, MessageSquare, AlertCircle, FileText, Clock, Calendar } from 'lucide-react-native';
import { Interaction } from '../types';

interface InteractionTimelineProps {
  history: Interaction[];
}

export default function InteractionTimeline({ history }: InteractionTimelineProps) {
  const getIcon = (type: Interaction['type']) => {
    switch (type) {
      case 'call':
        return <Phone size={16} color="#0066FF" />;
      case 'message':
        return <MessageSquare size={16} color="#10B981" />;
      case 'status_change':
        return <AlertCircle size={16} color="#F59E0B" />;
      case 'comment':
        return <FileText size={16} color="#8B5CF6" />;
      case 'interview_scheduled':
        return <Calendar size={16} color="#F59E0B" />;
      default:
        return <Clock size={16} color="#71717A" />;
    }
  };

  const getTypeLabel = (type: Interaction['type']) => {
    switch (type) {
      case 'call':
        return 'Звонок';
      case 'message':
        return 'Сообщение';
      case 'status_change':
        return 'Изменение статуса';
      case 'comment':
        return 'Комментарий';
      case 'interview_scheduled':
        return 'Интервью запланировано';
      default:
        return 'Действие';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Вчера в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Clock size={20} color="#71717A" />
          <Text style={styles.title}>История взаимодействий</Text>
        </View>
        <Text style={styles.emptyText}>Пока нет записей</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={20} color="#71717A" />
        <Text style={styles.title}>История взаимодействий</Text>
      </View>

      {history.map((item, index) => (
        <View key={item.id} style={styles.timelineItem}>
          {/* Timeline Line */}
          <View style={styles.timelineLeft}>
            <View style={styles.iconCircle}>
              {getIcon(item.type)}
            </View>
            {index < history.length - 1 && (
              <View style={styles.timelineLine} />
            )}
          </View>

          {/* Content */}
          <View style={styles.timelineContent}>
            <View style={styles.contentHeader}>
              <Text style={styles.typeLabel}>{getTypeLabel(item.type)}</Text>
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>

            <Text style={styles.userText}>{item.user}</Text>

            {item.type === 'status_change' && item.statusBefore && item.statusAfter && (
              <View style={styles.statusChangeBadge}>
                <Text style={styles.statusChangeText}>
                  <Text style={styles.statusBefore}>{item.statusBefore}</Text>
                  {' → '}
                  <Text style={styles.statusAfter}>{item.statusAfter}</Text>
                </Text>
              </View>
            )}

            {item.details && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailsText}>{item.details}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
    minHeight: 20,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  userText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusChangeBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statusChangeText: {
    fontSize: 12,
    color: '#92400E',
  },
  statusBefore: {
    textDecorationLine: 'line-through',
  },
  statusAfter: {
    fontWeight: '600',
  },
  detailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#374151',
  },
});
