import React from 'react';
import { View } from 'react-native';
import { VacancyList } from '../../components/VacancyList';
import { MenuButton } from '../../components/MenuButton';
import { useApp } from '../../contexts/AppContext';

export default function VacanciesScreen() {
  const { vacancies, companies, handleUpdateVacancy } = useApp();
  return (
    <View style={{ flex: 1 }}>
      <VacancyList
        vacancies={vacancies}
        companies={companies}
        onUpdateVacancy={handleUpdateVacancy}
      />
      <MenuButton />
    </View>
  );
}
