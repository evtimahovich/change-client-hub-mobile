import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface MenuButtonProps {
  style?: ViewStyle;
  color?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ style, color = '#0F172A' }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <TouchableOpacity
      style={[styles.menuButton, style]}
      onPress={() => navigation.toggleDrawer()}
      activeOpacity={0.7}
    >
      <Menu size={24} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
