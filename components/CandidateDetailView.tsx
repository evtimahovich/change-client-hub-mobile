import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  Award,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { Candidate } from '../types';
import { useApp } from '../contexts/AppContext';
import InteractionTimeline from './InteractionTimeline';
import RecruiterNotes from './RecruiterNotes';
import StatusChangeModal from './StatusChangeModal';
import AIAnalysisCard from './AIAnalysisCard';

interface CandidateDetailViewProps {
  candidate: Candidate;
}

export default function CandidateDetailView({ candidate }: CandidateDetailViewProps) {
  const { toggleShortlist } = useApp();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    experience: false,
    aiAnalysis: true,
    video: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSectionHeader = (
    title: string,
    icon: React.ReactNode,
    sectionKey: keyof typeof expandedSections
  ) => (
    <TouchableOpacity
      onPress={() => toggleSection(sectionKey)}
      style={styles.sectionHeader}
    >
      <View style={styles.sectionHeaderLeft}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {expandedSections[sectionKey] ? (
        <ChevronUp size={20} color="#71717A" />
      ) : (
        <ChevronDown size={20} color="#71717A" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        {/* Avatar & Name */}
        <View style={styles.headerTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.headerRow}>
              <Text style={styles.candidateName} numberOfLines={2}>{candidate.name}</Text>
              <TouchableOpacity
                onPress={() => toggleShortlist(candidate.id)}
                style={styles.starButton}
              >
                <Star
                  size={24}
                  color="#F59E0B"
                  fill={candidate.shortlisted ? '#F59E0B' : 'none'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.position}>{candidate.position}</Text>

            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <TouchableOpacity
                onPress={() => setShowStatusModal(true)}
                style={styles.statusBadge}
              >
                <Text style={styles.statusText}>{candidate.status}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <View style={styles.contactRow}>
            <MapPin size={16} color="#71717A" />
            <Text style={styles.contactText}>{candidate.location}</Text>
          </View>

          <View style={styles.contactRow}>
            <Mail size={16} color="#71717A" />
            <Text style={styles.contactText}>{candidate.email}</Text>
          </View>

          <View style={styles.contactRow}>
            <Phone size={16} color="#71717A" />
            <Text style={styles.contactText}>{candidate.phone}</Text>
          </View>

          <View style={styles.contactRow}>
            <DollarSign size={16} color="#71717A" />
            <Text style={styles.contactText}>
              Ожидания: ${candidate.salaryExpectation.toLocaleString()}
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Briefcase size={16} color="#71717A" />
            <Text style={styles.contactText}>
              Опыт: {candidate.experienceYears} {candidate.experienceYears === 1 ? 'год' : 'лет'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            onPress={() => setShowStatusModal(true)}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Изменить статус</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <MessageSquare size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Analysis */}
      {candidate.aiAnalysis && (
        <View style={styles.sectionWrapper}>
          <AIAnalysisCard analysis={candidate.aiAnalysis} />
        </View>
      )}

      {/* Skills */}
      <View style={styles.card}>
        {renderSectionHeader('Навыки', <Award size={20} color="#0066FF" />, 'skills')}

        {expandedSections.skills && (
          <View style={styles.skillsContainer}>
            {candidate.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Video & Transcription */}
      {candidate.videoUrl && (
        <View style={styles.card}>
          {renderSectionHeader('Видео-интервью', <Award size={20} color="#8B5CF6" />, 'video')}

          {expandedSections.video && (
            <View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoText}>🎥 Видео загружено</Text>
              </View>

              {candidate.transcription && (
                <View style={styles.transcriptionBox}>
                  <Text style={styles.transcriptionLabel}>ТРАНСКРИПЦИЯ:</Text>
                  <Text style={styles.transcriptionText}>{candidate.transcription}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Recruiter Notes */}
      <View style={styles.sectionWrapper}>
        <RecruiterNotes candidateId={candidate.id} />
      </View>

      {/* Interaction Timeline */}
      <View style={styles.sectionWrapper}>
        <InteractionTimeline history={candidate.history} />
      </View>

      {/* Status Change Modal */}
      <StatusChangeModal
        visible={showStatusModal}
        candidate={candidate}
        onClose={() => setShowStatusModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  candidateName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  starButton: {
    marginLeft: 8,
  },
  position: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    backgroundColor: '#DBEAFE',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D4ED8',
  },
  contactSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  actionsSection: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000000',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#1D4ED8',
  },
  videoInfo: {
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  videoText: {
    fontSize: 14,
    color: '#6B21A8',
  },
  transcriptionBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  transcriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
