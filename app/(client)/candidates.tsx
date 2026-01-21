import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CandidateList } from '../../components/CandidateList';
import { MenuButton } from '../../components/MenuButton';
import { useApp } from '../../contexts/AppContext';

export default function ClientCandidatesScreen() {
  const {
    visibleCandidates,
    toggleShortlist,
    handleStatusChange,
    activeVacancies,
    companies
  } = useApp();

  const vacanciesWithCompany = useMemo(() => {
    return activeVacancies.map(v => ({
      id: v.id,
      title: v.title,
      companyId: v.companyId,
      companyName: companies.find(c => c.id === v.companyId)?.name
    }));
  }, [activeVacancies, companies]);

  return (
    <View style={{ flex: 1 }}>
      <CandidateList
        candidates={visibleCandidates}
        vacancies={vacanciesWithCompany}
        companies={companies}
        onToggleShortlist={toggleShortlist}
        onStatusChange={handleStatusChange}
        isClientView={true}
      />
      <MenuButton />
    </View>
  );
}
