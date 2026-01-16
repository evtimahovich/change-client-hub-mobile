import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Linking, Modal } from 'react-native';
import { Company, Vacancy, Candidate } from '../types';
import {
  Building2, MapPin, Users, Calendar, TrendingUp, Globe,
  Mail, Phone, Instagram, Send as TelegramIcon, Star,
  Briefcase, User, Clock, Target, X, MessageCircle, Clipboard
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface CompanyDetailProps {
  company: Company;
  vacancies: Vacancy[];
  candidates: Candidate[];
}

type TabType = 'info' | 'contacts';

export const CompanyDetail: React.FC<CompanyDetailProps> = ({
  company,
  vacancies,
  candidates
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [selectedDM, setSelectedDM] = useState<typeof company.decisionMakers[0] | null>(null);
  const [showDMModal, setShowDMModal] = useState(false);

  const tabs = [
    { key: 'info' as TabType, label: 'Информация', count: null, action: 'tab' as const },
    { key: 'contacts' as TabType, label: 'ЛПР', count: company.decisionMakers?.length || 0, action: 'tab' as const },
    { key: 'vacancies', label: 'Вакансии', count: vacancies.length, action: 'navigate' as const, route: '/vacancies' },
    { key: 'candidates', label: 'Кандидаты', count: candidates.length, action: 'navigate' as const, route: '/candidates' },
  ];

  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {company.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О компании</Text>
          <Text style={styles.description}>{company.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основная информация</Text>
        <View style={styles.infoGrid}>
          {company.industry && (
            <View style={styles.infoItem}>
              <Briefcase size={18} color="#71717A" />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Отрасль</Text>
                <Text style={styles.infoValue}>{company.industry}</Text>
              </View>
            </View>
          )}
          {company.location && (
            <View style={styles.infoItem}>
              <MapPin size={18} color="#71717A" />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Локация</Text>
                <Text style={styles.infoValue}>{company.location}</Text>
              </View>
            </View>
          )}
          {company.employees && (
            <View style={styles.infoItem}>
              <Users size={18} color="#71717A" />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Сотрудники</Text>
                <Text style={styles.infoValue}>{company.employees}</Text>
              </View>
            </View>
          )}
          {company.founded && (
            <View style={styles.infoItem}>
              <Calendar size={18} color="#71717A" />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Основана</Text>
                <Text style={styles.infoValue}>{company.founded}</Text>
              </View>
            </View>
          )}
          {company.clientSince && (
            <View style={styles.infoItem}>
              <TrendingUp size={18} color="#71717A" />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Клиент с</Text>
                <Text style={styles.infoValue}>{company.clientSince}</Text>
              </View>
            </View>
          )}
          {company.website && (
            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => Linking.openURL(`https://${company.website}`)}
            >
              <Globe size={18} color="#0066FF" />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Веб-сайт</Text>
                <Text style={[styles.infoValue, styles.link]}>{company.website}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {company.culture && company.culture.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Культура</Text>
          <View style={styles.tagsContainer}>
            {company.culture.map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {company.hiringProcess && company.hiringProcess.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Процесс найма</Text>
          {company.hiringDuration && (
            <View style={styles.durationBadge}>
              <Clock size={14} color="#71717A" />
              <Text style={styles.durationText}>Обычно занимает {company.hiringDuration}</Text>
            </View>
          )}
          <View style={styles.stepsContainer}>
            {company.hiringProcess.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderContactsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Лица, принимающие решения</Text>
        {company.decisionMakers && company.decisionMakers.length > 0 ? (
          company.decisionMakers.map((person, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={() => {
                setSelectedDM(person);
                setShowDMModal(true);
              }}
            >
              <View style={styles.contactAvatar}>
                <User size={20} color="#71717A" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{person.name}</Text>
                <Text style={styles.contactRole}>{person.role}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Нет добавленных ЛПР</Text>
        )}
      </View>

      {(company.socials?.instagram || company.socials?.telegram) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Социальные сети</Text>
          <View style={styles.socialsContainer}>
            {company.socials.instagram && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL(`https://instagram.com/${company.socials!.instagram}`)}
              >
                <Instagram size={20} color="#E1306C" />
                <Text style={styles.socialText}>{company.socials.instagram}</Text>
              </TouchableOpacity>
            )}
            {company.socials.telegram && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Linking.openURL(company.socials!.telegram!)}
              >
                <TelegramIcon size={20} color="#0088cc" />
                <Text style={styles.socialText}>{company.socials.telegram}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.companyHeader}>
          {company.logo ? (
            <Image source={{ uri: company.logo }} style={styles.companyLogo} />
          ) : (
            <View style={styles.companyLogoPlaceholder}>
              <Building2 size={32} color="#71717A" />
            </View>
          )}
          <View style={styles.companyTitleSection}>
            <Text style={styles.companyName}>{company.name}</Text>
            {company.industry && (
              <Text style={styles.companyIndustry}>{company.industry}</Text>
            )}
          </View>
          {company.rating && (
            <View style={styles.ratingBadge}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{company.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Quick Access to Decision Makers */}
        {company.decisionMakers && company.decisionMakers.length > 0 && (
          <View style={styles.quickAccessSection}>
            <View style={styles.quickAccessHeader}>
              <User size={16} color="#71717A" />
              <Text style={styles.quickAccessTitle}>ЛПР - Быстрый доступ</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAccessScroll}
            >
              {company.decisionMakers.map((person, index) => (
                <View key={index} style={styles.quickAccessCard}>
                  <View style={styles.quickAccessCardHeader}>
                    <View style={styles.quickAccessAvatar}>
                      <User size={16} color="#0066FF" />
                    </View>
                    <View style={styles.quickAccessInfo}>
                      <Text style={styles.quickAccessName} numberOfLines={1}>{person.name}</Text>
                      <Text style={styles.quickAccessRole} numberOfLines={1}>{person.role}</Text>
                    </View>
                  </View>
                  <View style={styles.quickAccessActions}>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => Linking.openURL(`mailto:${person.email}`)}
                    >
                      <Mail size={16} color="#0066FF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => Linking.openURL(`tel:${person.phone}`)}
                    >
                      <Phone size={16} color="#0066FF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => {
                        setSelectedDM(person);
                        setShowDMModal(true);
                      }}
                    >
                      <MessageCircle size={16} color="#0066FF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => {
              if (tab.action === 'navigate' && 'route' in tab && tab.route) {
                router.push(tab.route as any);
              } else if (tab.action === 'tab') {
                setActiveTab(tab.key as TabType);
              }
            }}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {tab.count !== null && (
              <View style={[styles.tabBadge, activeTab === tab.key && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === tab.key && styles.tabBadgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'contacts' && renderContactsTab()}

      {/* Decision Maker Detail Modal */}
      <Modal
        visible={showDMModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDMModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dmModalContent}>
            <View style={styles.dmModalHeader}>
              <View style={styles.dmModalAvatar}>
                <User size={32} color="#0066FF" />
              </View>
              <TouchableOpacity
                style={styles.dmModalClose}
                onPress={() => setShowDMModal(false)}
              >
                <X size={24} color="#71717A" />
              </TouchableOpacity>
            </View>

            {selectedDM && (
              <ScrollView style={styles.dmModalBody} showsVerticalScrollIndicator={false}>
                <Text style={styles.dmModalName}>{selectedDM.name}</Text>
                <Text style={styles.dmModalRole}>{selectedDM.role}</Text>

                <View style={styles.dmModalSection}>
                  <View style={styles.dmModalSectionHeader}>
                    <Mail size={18} color="#0066FF" />
                    <Text style={styles.dmModalSectionTitle}>Контакты</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dmModalContactItem}
                    onPress={() => Linking.openURL(`mailto:${selectedDM.email}`)}
                  >
                    <Mail size={16} color="#71717A" />
                    <Text style={styles.dmModalContactText}>{selectedDM.email}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dmModalContactItem}
                    onPress={() => Linking.openURL(`tel:${selectedDM.phone}`)}
                  >
                    <Phone size={16} color="#71717A" />
                    <Text style={styles.dmModalContactText}>{selectedDM.phone}</Text>
                  </TouchableOpacity>
                </View>

                {selectedDM.communicationStyle && (
                  <View style={styles.dmModalSection}>
                    <View style={styles.dmModalSectionHeader}>
                      <MessageCircle size={18} color="#0066FF" />
                      <Text style={styles.dmModalSectionTitle}>Стиль коммуникации</Text>
                    </View>
                    <Text style={styles.dmModalText}>{selectedDM.communicationStyle}</Text>
                  </View>
                )}

                {selectedDM.hiringPreferences && (
                  <View style={styles.dmModalSection}>
                    <View style={styles.dmModalSectionHeader}>
                      <Clipboard size={18} color="#0066FF" />
                      <Text style={styles.dmModalSectionTitle}>Требования к подбору</Text>
                    </View>
                    <Text style={styles.dmModalText}>{selectedDM.hiringPreferences}</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    padding: 24,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#E4E4E7',
    marginRight: 16,
  },
  companyLogoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginRight: 16,
  },
  companyTitleSection: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D97706',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717A',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: '#000000',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: '#52525B',
    lineHeight: 22,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  infoItemText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A1A1AA',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  link: {
    color: '#0066FF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525B',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0369A1',
  },
  stepsContainer: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 12,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  contactRole: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },
  socialsContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  socialText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  vacancyCard: {
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 12,
  },
  vacancyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  vacancySalary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 12,
  },
  vacancyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacancyStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vacancyStatusActive: {
    backgroundColor: '#DCFCE7',
  },
  vacancyStatusClosed: {
    backgroundColor: '#FEE2E2',
  },
  vacancyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vacancyStatusTextActive: {
    color: '#15803D',
  },
  vacancyStatusTextClosed: {
    color: '#B91C1C',
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    marginBottom: 12,
  },
  candidateAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E4E4E7',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  candidatePosition: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    marginBottom: 4,
  },
  candidateStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0066FF',
  },
  candidateScore: {
    alignItems: 'center',
  },
  candidateScoreValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  candidateScoreLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#71717A',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 40,
  },
  quickAccessSection: {
    marginTop: 20,
  },
  quickAccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52525B',
  },
  quickAccessScroll: {
    gap: 12,
    paddingRight: 24,
  },
  quickAccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    width: 200,
  },
  quickAccessCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  quickAccessAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessInfo: {
    flex: 1,
  },
  quickAccessName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  quickAccessRole: {
    fontSize: 12,
    fontWeight: '400',
    color: '#71717A',
  },
  quickAccessActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dmModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  dmModalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dmModalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dmModalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dmModalBody: {
    padding: 20,
  },
  dmModalName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  dmModalRole: {
    fontSize: 16,
    fontWeight: '400',
    color: '#71717A',
    marginBottom: 24,
  },
  dmModalSection: {
    marginBottom: 24,
  },
  dmModalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dmModalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  dmModalContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    marginBottom: 8,
  },
  dmModalContactText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
  },
  dmModalText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#3F3F46',
    lineHeight: 24,
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0066FF',
  },
});
