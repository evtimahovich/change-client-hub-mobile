import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { Company } from '../types';
import { Search, Filter, Plus, Building2, MapPin, Users, Briefcase, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface CompanyListProps {
  companies: Company[];
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return companies.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.industry?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const renderCompany = ({ item: company }: { item: Company }) => (
    <TouchableOpacity
      style={styles.companyCard}
      onPress={() => router.push(`/company/${company.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          {company.logo ? (
            <Image source={{ uri: company.logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Building2 size={24} color="#71717A" />
            </View>
          )}
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{company.name}</Text>
          {company.industry && (
            <Text style={styles.companyIndustry}>{company.industry}</Text>
          )}
        </View>
        {company.rating && (
          <View style={styles.ratingBadge}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{company.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      {company.description && (
        <Text style={styles.description} numberOfLines={2}>
          {company.description}
        </Text>
      )}

      <View style={styles.metadata}>
        {company.location && (
          <View style={styles.metaItem}>
            <MapPin size={14} color="#71717A" />
            <Text style={styles.metaText}>{company.location}</Text>
          </View>
        )}
        {company.employees && (
          <View style={styles.metaItem}>
            <Users size={14} color="#71717A" />
            <Text style={styles.metaText}>{company.employees}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Briefcase size={16} color="#0066FF" />
            <Text style={styles.statText}>Вакансии</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={16} color="#10B981" />
            <Text style={styles.statText}>Кандидаты</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Компании</Text>
            <Text style={styles.subtitle}>({filtered.length}) Компаний</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/company/new')}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color="#9E9E9E" />
          <TextInput
            placeholder="Поиск по названию или отрасли..."
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderCompany}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  companyCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E4E4E7',
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 13,
    fontWeight: '400',
    color: '#71717A',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#52525B',
    lineHeight: 20,
    marginBottom: 16,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#71717A',
  },
  cardFooter: {
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F4F5',
    padding: 12,
    borderRadius: 8,
  },
  statText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
