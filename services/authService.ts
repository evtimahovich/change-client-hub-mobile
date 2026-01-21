import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserRole } from '../types';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  createdAt: Date;
}

// Получить профиль пользователя из Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        companyId: data.companyId,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Создать профиль пользователя в Firestore
export const createUserProfile = async (
  uid: string,
  name: string,
  email: string,
  role: UserRole,
  companyId?: string
): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', uid), {
      name,
      email,
      role,
      companyId: companyId || null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Обновить профиль пользователя в Firestore
export const updateUserProfile = async (
  uid: string,
  updates: Partial<Pick<UserProfile, 'name' | 'companyId'>>
): Promise<{ error: string | null }> => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, updates);
    return { error: null };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { error: 'Не удалось обновить профиль' };
  }
};

// Вход по email/пароль
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

// Регистрация по email/пароль
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: UserRole,
  companyId?: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user.uid, name, email, role, companyId);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

// Вход через Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Проверяем есть ли профиль
    const profile = await getUserProfile(result.user.uid);
    if (!profile) {
      // Создаём профиль по умолчанию (клиент/компания)
      await createUserProfile(
        result.user.uid,
        result.user.displayName || 'User',
        result.user.email || '',
        UserRole.CLIENT
      );
    }

    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

// Выход
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Перевод ошибок Firebase на русский
const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Email уже используется',
    'auth/invalid-email': 'Некорректный email',
    'auth/operation-not-allowed': 'Операция не разрешена',
    'auth/weak-password': 'Слишком простой пароль (минимум 6 символов)',
    'auth/user-disabled': 'Аккаунт заблокирован',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    'auth/popup-closed-by-user': 'Окно авторизации было закрыто',
  };
  return messages[code] || 'Произошла ошибка. Попробуйте ещё раз';
};
