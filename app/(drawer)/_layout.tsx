import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, Briefcase, Building2, LayoutDashboard } from 'lucide-react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ET</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Eugenia T.</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: '#0F172A',
          width: 280,
        },
        headerShown: false,
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#94A3B8',
        drawerActiveBackgroundColor: '#1E293B',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -16,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginVertical: 4,
          marginHorizontal: 12,
          paddingVertical: 8,
        },
      }}>
      <Drawer.Screen
        name="candidates"
        options={{
          title: 'Кандидаты',
          drawerLabel: 'Кандидаты',
          drawerIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="vacancies"
        options={{
          title: 'Вакансии',
          drawerLabel: 'Вакансии',
          drawerIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="companies"
        options={{
          title: 'Компании',
          drawerLabel: 'Компании',
          drawerIcon: ({ color, size }) => <Building2 color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          title: 'Дашборд',
          drawerLabel: 'Дашборд',
          drawerIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  drawerContent: {
    paddingTop: 16,
  },
});
