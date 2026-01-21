import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, Building2 } from 'lucide-react-native';
import { registerWithEmail, loginWithGoogle } from '../../services/authService';
import { UserRole } from '../../types';

type RegisterTab = 'recruiter' | 'company';

export default function RegisterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 768;

  const [activeTab, setActiveTab] = useState<RegisterTab>('recruiter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    // Роль определяется выбранной вкладкой
    const role = activeTab === 'recruiter' ? UserRole.RECRUITER : UserRole.CLIENT;
    const result = await registerWithEmail(email, password, name, role);

    if (result.error) {
      setError(result.error);
    }
    // Навигация произойдёт автоматически через onAuthStateChanged

    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');

    const result = await loginWithGoogle();

    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleTabChange = (tab: RegisterTab) => {
    setActiveTab(tab);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && isLargeScreen && styles.scrollContentWeb,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[
          styles.contentWrapper,
          isWeb && isLargeScreen && styles.contentWrapperWeb,
        ]}>
          <View style={styles.header}>
            <Text style={[styles.logo, isLargeScreen && styles.logoLarge]}>Change Hub</Text>
            <Text style={styles.subtitle}>HR CRM Platform</Text>
          </View>

          {/* Вкладки */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'recruiter' && styles.tabActive,
                { borderTopLeftRadius: 16 },
              ]}
              onPress={() => handleTabChange('recruiter')}
            >
              <User
                size={20}
                color={activeTab === 'recruiter' ? '#1E2875' : '#9CA3AF'}
              />
              <Text style={[
                styles.tabText,
                activeTab === 'recruiter' && styles.tabTextActive,
              ]}>
                Рекрутер
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'company' && styles.tabActive,
                { borderTopRightRadius: 16 },
              ]}
              onPress={() => handleTabChange('company')}
            >
              <Building2
                size={20}
                color={activeTab === 'company' ? '#1E2875' : '#9CA3AF'}
              />
              <Text style={[
                styles.tabText,
                activeTab === 'company' && styles.tabTextActive,
              ]}>
                Компания
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[
            styles.form,
            isWeb && isLargeScreen && styles.formWeb,
          ]}>
            <Text style={styles.title}>
              {activeTab === 'recruiter' ? 'Регистрация рекрутера' : 'Регистрация компании'}
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <User size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={activeTab === 'recruiter' ? 'Имя' : 'Название компании'}
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Подтвердите пароль"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
              )}
            </TouchableOpacity>

            {/* Google регистрация только для компаний */}
            {activeTab === 'company' && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>или</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.googleButton]}
                  onPress={handleGoogleRegister}
                  disabled={loading}
                >
                  <Text style={styles.googleButtonText}>Продолжить с Google</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Уже есть аккаунт?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Войти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  scrollContentWeb: {
    padding: 48,
  },
  contentWrapper: {
    width: '100%',
  },
  contentWrapperWeb: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E2875',
  },
  logoLarge: {
    fontSize: 42,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#E5E7EB',
    cursor: 'pointer',
  } as any,
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#1E2875',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formWeb: {
    padding: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    outlineStyle: 'none',
  } as any,
  eyeButton: {
    padding: 4,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    cursor: 'pointer',
  } as any,
  primaryButton: {
    backgroundColor: '#1E2875',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 0,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkText: {
    color: '#1E2875',
    fontSize: 14,
    fontWeight: '600',
    cursor: 'pointer',
  } as any,
});
