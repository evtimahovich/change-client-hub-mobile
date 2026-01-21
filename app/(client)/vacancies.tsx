import React from 'react';
import { View } from 'react-native';
import { VacancyList } from '../../components/VacancyList';
import { MenuButton } from '../../components/MenuButton';
import { useApp } from '../../contexts/AppContext';

export default function ClientVacanciesScreen() {
  const { activeVacancies, companies, handleUpdateVacancy } = useApp();

  return (
    <View style={{ flex: 1 }}>
      <VacancyList
        vacancies={activeVacancies}
        companies={companies}
        onUpdateVacancy={handleUpdateVacancy}
        isClientView={true}
      />
      <MenuButton />
    </View>
  );
}
