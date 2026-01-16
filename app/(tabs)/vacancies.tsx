import React from 'react';
import { VacancyList } from '../../components/VacancyList';
import { useApp } from '../../contexts/AppContext';

export default function VacanciesScreen() {
  const { vacancies, companies, handleUpdateVacancy, handleCreateVacancy } = useApp();
  return (
    <VacancyList
      vacancies={vacancies}
      companies={companies}
      onUpdateVacancy={handleUpdateVacancy}
      onCreateVacancy={handleCreateVacancy}
    />
  );
}
