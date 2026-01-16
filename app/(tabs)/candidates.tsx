import React, { useMemo } from 'react';
import { CandidateList } from '../../components/CandidateList';
import { useApp } from '../../contexts/AppContext';

export default function CandidatesScreen() {
  const {
    visibleCandidates,
    toggleShortlist,
    handleStatusChange,
    handleAddToVacancy,
    handleCreateVacancy,
    vacancies,
    companies
  } = useApp();

  const vacanciesWithCompany = useMemo(() => {
    return vacancies
      .filter(v => v.status === 'active')
      .map(v => ({
        id: v.id,
        title: v.title,
        companyId: v.companyId,
        companyName: companies.find(c => c.id === v.companyId)?.name
      }));
  }, [vacancies, companies]);

  return (
    <CandidateList
      candidates={visibleCandidates}
      vacancies={vacanciesWithCompany}
      companies={companies}
      onToggleShortlist={toggleShortlist}
      onStatusChange={handleStatusChange}
      onAddToVacancy={handleAddToVacancy}
      onCreateVacancy={handleCreateVacancy}
    />
  );
}
