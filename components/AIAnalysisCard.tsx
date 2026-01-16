import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain, TrendingUp } from 'lucide-react-native';
import { AIAnalysis } from '../types';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
}

export default function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  const getScoreBadgeStyle = (score: number) => {
    if (score >= 80) return styles.scoreGreen;
    if (score >= 60) return styles.scoreYellow;
    return styles.scoreRed;
  };

  const getScoreTextStyle = (score: number) => {
    if (score >= 80) return styles.scoreTextGreen;
    if (score >= 60) return styles.scoreTextYellow;
    return styles.scoreTextRed;
  };

  const getProgressBarColor = (value: number) => {
    if (value >= 80) return '#10B981';
    if (value >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const renderProgressBar = (label: string, value: number) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>{value}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${value}%`, backgroundColor: getProgressBarColor(value) }
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Brain size={24} color="#0066FF" />
          <Text style={styles.title}>AI Анализ соответствия</Text>
        </View>

        <View style={[styles.scoreBadge, getScoreBadgeStyle(analysis.score)]}>
          <Text style={[styles.scoreText, getScoreTextStyle(analysis.score)]}>
            {analysis.score}%
          </Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryHeader}>
          <TrendingUp size={16} color="#8B5CF6" />
          <Text style={styles.summaryTitle}>РЕКОМЕНДАЦИЯ AI</Text>
        </View>
        <Text style={styles.summaryText}>{analysis.summary}</Text>
      </View>

      {/* Breakdown */}
      <View style={styles.breakdownBox}>
        <Text style={styles.breakdownTitle}>ДЕТАЛИЗАЦИЯ:</Text>

        {renderProgressBar('Hard Skills', analysis.breakdown.hardSkills)}
        {renderProgressBar('Опыт работы', analysis.breakdown.experience)}
        {renderProgressBar('Зарплатные ожидания', analysis.breakdown.salary)}
        {renderProgressBar('Бонусы (soft skills, культура)', analysis.breakdown.bonus)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  scoreGreen: {
    backgroundColor: '#D1FAE5',
  },
  scoreYellow: {
    backgroundColor: '#FEF3C7',
  },
  scoreRed: {
    backgroundColor: '#FEE2E2',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreTextGreen: {
    color: '#047857',
  },
  scoreTextYellow: {
    color: '#D97706',
  },
  scoreTextRed: {
    color: '#DC2626',
  },
  summaryBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
    marginLeft: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  breakdownBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 16,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});
