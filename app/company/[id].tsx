import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { CompanyDetail } from '../../components/CompanyDetail';
import { useApp } from '../../contexts/AppContext';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { companies, vacancies, candidates } = useApp();

  const company = companies.find(c => c.id === id);

  const companyVacancies = useMemo(() => {
    return vacancies.filter(v => v.companyId === id);
  }, [vacancies, id]);

  const companyCandidates = useMemo(() => {
    const vacancyTitles = companyVacancies.map(v => v.title);
    return candidates.filter(c => vacancyTitles.includes(c.position));
  }, [candidates, companyVacancies]);

  if (!company) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      <CompanyDetail
        company={company}
        vacancies={companyVacancies}
        candidates={companyCandidates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
