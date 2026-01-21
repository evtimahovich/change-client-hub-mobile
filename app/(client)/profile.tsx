import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { updateUserProfile, getUserProfile } from '../../services/authService';
import { MenuButton } from '../../components/MenuButton';
import { ArrowLeft, User, Mail, Building2, Save } from 'lucide-react-native';

export default function ClientProfileScreen() {
  const router = useRouter();
  const { currentUser, authUser, setCurrentUser, companies } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const company = companies.find(c => c.id === currentUser.companyId);

  useEffect(() => {
    setHasChanges(name !== currentUser.name);
  }, [name, currentUser.name]);

  const handleSave = async () => {
    if (!authUser) return;
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Имя не может быть пустым');
      return;
    }

    setIsLoading(true);
    const { error } = await updateUserProfile(authUser.uid, { name: name.trim() });

    if (error) {
      Alert.alert('Ошибка', error);
    } else {
      // Обновляем локальный стейт
      setCurrentUser({ ...currentUser, name: name.trim() });
      Alert.alert('Успешно', 'Профиль обновлён');
      setHasChanges(false);
    }
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <MenuButton />
          <Text style={styles.headerTitle}>Личный кабинет</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {currentUser.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(currentUser.name)}</Text>
            </View>
          )}
          <Text style={styles.roleLabel}>Клиент</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Имя</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Введите имя"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Email (readonly) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Mail size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={currentUser.email}
                editable={false}
              />
            </View>
            <Text style={styles.hint}>Email нельзя изменить</Text>
          </View>

          {/* Company (readonly) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Компания</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Building2 size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={company?.name || 'Не привязана'}
                editable={false}
              />
            </View>
            {!company && (
              <Text style={styles.hint}>Обратитесь к рекрутеру для привязки к компании</Text>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanges || isLoading) && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Сохранить изменения</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roleLabel: {
    fontSize: 14,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  inputDisabled: {
    backgroundColor: '#F8FAFC',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  inputTextDisabled: {
    color: '#94A3B8',
  },
  hint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0066FF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
