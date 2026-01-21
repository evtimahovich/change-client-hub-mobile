import React from 'react';
import { VacancyList } from '../../components/VacancyList';
import { useApp } from '../../contexts/AppContext';

export default function ClientVacanciesScreen() {
  const { activeVacancies, companies, handleUpdateVacancy } = useApp();

  return (
    <VacancyList
      vacancies={activeVacancies}
      companies={companies}
      onUpdateVacancy={handleUpdateVacancy}
      isClientView={true}
    />
  );
}
