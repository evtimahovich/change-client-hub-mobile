
export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITMENT_HEAD = 'RECRUITMENT_HEAD',
  RECRUITER = 'RECRUITER',
  CLIENT = 'CLIENT'
}

export enum CandidateStatus {
  NEW = 'Ожидает отправки',
  SENT_TO_CLIENT = 'Отправлен заказчику',
  CLIENT_INTERVIEW = 'Интервью у заказчика',
  TEST_TASK = 'Проходит тестовое',
  SECURITY_CHECK = 'Сбор рекомендаций/проверка СБ',
  INTERNSHIP = 'Стажировка',
  OFFER = 'Оффер',
  HIRED = 'Найм',
  REJECTED = 'Отказ',
  RESERVE = 'Кадровый резерв',
  FIRED = 'Уволен',
  BLACKLIST = 'Черный список'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  companyId?: string;
  email: string;
  avatar?: string;
}

export interface AIAnalysis {
  score: number;
  breakdown: {
    hardSkills: number;
    experience: number;
    salary: number;
    bonus: number;
  };
  summary: string;
}

export interface Interaction {
  id: string;
  date: string;
  type: 'call' | 'message' | 'status_change' | 'comment' | 'interview_scheduled';
  user: string;
  details: string;
  statusBefore?: CandidateStatus;
  statusAfter?: CandidateStatus;
  mentions?: string[]; // Array of ЛПР IDs who were mentioned
  interviewDate?: string; // For scheduled interviews
  interviewTime?: string; // Interview time
  participants?: string[]; // Array of ЛПР IDs who will participate
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  location: string;
  email: string;
  phone: string;
  salaryExpectation: number;
  experienceYears: number;
  skills: string[];
  status: CandidateStatus;
  shortlisted: boolean;
  aiAnalysis?: AIAnalysis;
  renome?: string;
  videoUrl?: string;
  transcription?: string;
  history: Interaction[];
  isNew?: boolean;
  companyId?: string;
  vacancyId?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  employees?: string;
  founded?: string;
  clientSince?: string;
  rating?: number;
  socials?: {
    instagram?: string;
    telegram?: string;
  };
  culture?: string[];
  hiringProcess?: {
    step: number;
    title: string;
  }[];
  hiringDuration?: string;
  decisionMakers?: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    communicationStyle?: string;
    hiringPreferences?: string;
  }[];
}

export interface Vacancy {
  id: string;
  title: string;
  companyId: string;
  recruiterId: string;
  description: string;
  location?: {
    city: string;
    country: string;
    address?: string;
  };
  workFormat?: ('office' | 'remote' | 'hybrid')[];
  experienceYears?: number;
  requirements: string; // Текстовое описание требований
  responsibilities: string[];
  conditions: string[];
  niceToHave: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  contract?: {
    price: number; // в тенге
    documentUrl?: string; // ссылка или загруженный PDF
  };
  publishToHH?: boolean;
  status: 'active' | 'closed';
  history: {
    date: string;
    user: string;
    action: string;
    details: string;
  }[];
  employmentType?: string; // Оформление: Официально, Неофициально
  workConditions?: string; // Условия работы: текстовое описание
  contactPersons?: {
    id: string;
    name: string;
    position: string;
    phone: string;
    telegram?: string;
    communicationPreferences?: string;
    decisionMakingStyle?: string;
  }[];
  comments?: {
    id: string;
    author: string;
    date: string;
    type: 'positive' | 'negative';
    text: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: string[];
}
