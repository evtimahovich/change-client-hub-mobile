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
  useWindowDimensions,
} from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { updateUserProfile } from '../../services/authService';
import { MenuButton } from '../../components/MenuButton';
import { User, Mail, Save, Camera } from 'lucide-react-native';

export default function RecruiterProfileScreen() {
  const { currentUser, authUser, setCurrentUser } = useApp();
  const { width } = useWindowDimensions();

  const [name, setName] = useState(currentUser.name);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Адаптивность для веб
  const contentMaxWidth = 600;

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
        <View style={[styles.headerContent, { maxWidth: contentMaxWidth }]}>
          <View style={styles.headerRow}>
            <MenuButton />
            <Text style={styles.headerTitle}>Личный кабинет</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Центрированный контент */}
        <View style={styles.centerWrapper}>
          <View style={[styles.contentCard, { maxWidth: contentMaxWidth }]}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                {currentUser.avatar ? (
                  <Image source={{ uri: currentUser.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{getInitials(currentUser.name)}</Text>
                  </View>
                )}
                <View style={styles.cameraButton}>
                  <Camera size={16} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleLabel}>Рекрутер</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

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
          </View>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  headerContent: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
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
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  centerWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  contentCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FAFBFC',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  form: {
    padding: 24,
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
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  inputTextDisabled: {
    color: '#64748B',
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
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
