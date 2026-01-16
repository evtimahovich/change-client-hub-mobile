import React from 'react';
import { View } from 'react-native';
import { CompanyList } from '../../components/CompanyList';
import { MenuButton } from '../../components/MenuButton';
import { useApp } from '../../contexts/AppContext';

export default function CompaniesScreen() {
  const { companies } = useApp();
  return (
    <View style={{ flex: 1 }}>
      <CompanyList companies={companies} />
      <MenuButton />
    </View>
  );
}
