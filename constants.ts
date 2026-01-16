
import { CandidateStatus, UserRole } from './types';

export const COLORS = {
  primary: '#6B9BD1',
  primaryHover: '#5A8ABF',
  neutral: '#333333',
  accent: '#7BA5D8',
  success: '#81C784',
  warning: '#FFD54F',
  error: '#E57373',
  textLight: '#F5F5F5',
  textDark: '#1A1A1A',
  textGray: '#757575',
};

export const STATUS_COLORS: Record<CandidateStatus, { bg: string, text: string, border: string }> = {
  [CandidateStatus.NEW]: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  [CandidateStatus.SENT_TO_CLIENT]: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  [CandidateStatus.CLIENT_INTERVIEW]: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  [CandidateStatus.TEST_TASK]: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  [CandidateStatus.SECURITY_CHECK]: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  [CandidateStatus.OFFER]: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  [CandidateStatus.HIRED]: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  [CandidateStatus.REJECTED]: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  [CandidateStatus.BLACKLIST]: { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-900' },
};

export const REJECTION_TEMPLATES = [
  '❌ Не подходит по опыту',
  '💰 Зарплатные ожидания выше бюджета',
  '🎯 Не соответствует требованиям',
  '⏸️ Хороший профиль, но сейчас не актуален',
];
