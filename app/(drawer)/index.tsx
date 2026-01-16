import React from 'react';
import { View } from 'react-native';
import { Dashboard } from '../../components/Dashboard';
import { MenuButton } from '../../components/MenuButton';
import { useApp } from '../../contexts/AppContext';

export default function DashboardScreen() {
  const { currentUser } = useApp();
  return (
    <View style={{ flex: 1 }}>
      <Dashboard user={currentUser} />
      <MenuButton />
    </View>
  );
}
