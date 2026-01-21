import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Users, Briefcase, LayoutDashboard, MessageCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';

function CustomDrawerContent(props: any) {
  const { currentUser, logout } = useApp();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfilePress = () => {
    props.navigation.closeDrawer();
    router.push('/(client)/profile');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      {/* Profile Section - Clickable */}
      <TouchableOpacity style={styles.profileSection} onPress={handleProfilePress} activeOpacity={0.7}>
        <View style={styles.profileHeader}>
          {currentUser.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(currentUser.name)}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileRole}>Клиент</Text>
          </View>
          <ChevronRight size={20} color="#64748B" />
        </View>
      </TouchableOpacity>

      {/* Menu Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ClientDrawerLayout() {
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
          marginLeft: 8,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginVertical: 4,
          marginHorizontal: 12,
          paddingVertical: 8,
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Дашборд',
          drawerLabel: 'Дашборд',
          drawerIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
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
        name="messages"
        options={{
          title: 'Сообщения',
          drawerLabel: 'Сообщения',
          drawerIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Профиль',
          drawerItemStyle: { display: 'none' },
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
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  profileRole: {
    fontSize: 14,
    color: '#94A3B8',
  },
  drawerContent: {
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
