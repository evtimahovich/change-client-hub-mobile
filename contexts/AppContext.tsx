import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { User, Candidate, Vacancy, CandidateStatus, UserRole, Company, Interaction } from '../types';
import {
  mockCandidates,
  mockVacancies,
  mockUsers,
  mockChats,
  mockCompanies
} from '../mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  vacancies: Vacancy[];
  setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  chats: any[];
  visibleCandidates: Candidate[];
  activeVacancies: Vacancy[];
  handleStatusChange: (candidateId: string, newStatus: CandidateStatus, comment: string) => void;
  toggleShortlist: (candidateId: string) => void;
  handleCreateCompany: (newCompany: Company) => void;
  handleCreateVacancy: (newVacancy: Vacancy) => void;
  handleAddComment: (candidateId: string, comment: string, mentions?: string[]) => void;
  handleScheduleInterview: (candidateId: string, date: string, time: string, participants: string[], location: string, notes: string) => void;
  handleCloseVacancy: (vacancyId: string, reason: string) => void;
  handleReopenVacancy: (vacancyId: string, reason: string) => void;
  handleAddToVacancy: (candidateIds: string[], vacancyId: string) => void;
  handleUpdateVacancy: (vacancyId: string, updates: Partial<Vacancy>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [vacancies, setVacancies] = useState<Vacancy[]>(mockVacancies);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [chats] = useState(mockChats);

  const visibleCandidates = useMemo(() => {
    if (currentUser.role === UserRole.CLIENT && currentUser.companyId) {
      const companyVacancies = vacancies.filter(v => v.companyId === currentUser.companyId).map(v => v.title);
      return candidates.filter(c => companyVacancies.includes(c.position));
    }
    return candidates;
  }, [candidates, currentUser, vacancies]);

  const activeVacancies = useMemo(() => {
    const active = vacancies.filter(v => v.status === 'active');
    if (currentUser.role === UserRole.CLIENT && currentUser.companyId) {
      return active.filter(v => v.companyId === currentUser.companyId);
    }
    return active;
  }, [vacancies, currentUser]);

  const handleStatusChange = (candidateId: string, newStatus: CandidateStatus, comment: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        const interaction: Interaction = {
          id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString(),
          type: newStatus === c.status ? 'comment' : 'status_change',
          user: currentUser.name,
          details: comment,
          statusBefore: c.status,
          statusAfter: newStatus
        };

        return {
          ...c,
          status: newStatus,
          history: [
            interaction,
            ...c.history
          ],
          shortlisted: (newStatus === CandidateStatus.REJECTED || newStatus === CandidateStatus.BLACKLIST) ? false : c.shortlisted
        };
      }
      return c;
    }));
  };

  const toggleShortlist = (candidateId: string) => {
    setCandidates(prev => prev.map(c =>
      c.id === candidateId ? { ...c, shortlisted: !c.shortlisted } : c
    ));
  };

  const handleCreateCompany = (newCompany: Company) => {
    setCompanies(prev => [...prev, newCompany]);
  };

  const handleCreateVacancy = (newVacancy: Vacancy) => {
    setVacancies(prev => [newVacancy, ...prev]);
  };

  const handleAddComment = (candidateId: string, comment: string, mentions?: string[]) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        const interaction: Interaction = {
          id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString(),
          type: 'comment',
          user: currentUser.name,
          details: comment,
          mentions: mentions,
        };

        return {
          ...c,
          history: [
            interaction,
            ...c.history
          ],
        };
      }
      return c;
    }));
  };

  const handleScheduleInterview = (
    candidateId: string,
    date: string,
    time: string,
    participants: string[],
    location: string,
    notes: string
  ) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        const interaction: Interaction = {
          id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString(),
          type: 'interview_scheduled',
          user: currentUser.name,
          details: notes || `Интервью запланировано на ${date} в ${time}${location ? ` (${location})` : ''}`,
          interviewDate: date,
          interviewTime: time,
          participants: participants,
        };

        return {
          ...c,
          history: [
            interaction,
            ...c.history
          ],
        };
      }
      return c;
    }));
  };

  const handleCloseVacancy = (vacancyId: string, reason: string) => {
    setVacancies(prev => prev.map(v => {
      if (v.id === vacancyId) {
        return {
          ...v,
          status: 'closed' as const,
          history: [
            {
              date: new Date().toISOString(),
              user: currentUser.name,
              action: 'closed',
              details: reason,
            },
            ...v.history
          ]
        };
      }
      return v;
    }));
  };

  const handleReopenVacancy = (vacancyId: string, reason: string) => {
    setVacancies(prev => prev.map(v => {
      if (v.id === vacancyId) {
        return {
          ...v,
          status: 'active' as const,
          history: [
            {
              date: new Date().toISOString(),
              user: currentUser.name,
              action: 'reopened',
              details: reason,
            },
            ...v.history
          ]
        };
      }
      return v;
    }));
  };

  const handleAddToVacancy = (candidateIds: string[], vacancyId: string) => {
    const vacancy = vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;

    setCandidates(prev => prev.map(c => {
      if (candidateIds.includes(c.id)) {
        const interaction: Interaction = {
          id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString(),
          type: 'status_change',
          user: currentUser.name,
          details: `Кандидат добавлен к вакансии "${vacancy.title}"`,
          statusBefore: c.status,
          statusAfter: CandidateStatus.SENT_TO_CLIENT
        };

        return {
          ...c,
          vacancyId: vacancyId,
          companyId: vacancy.companyId,
          status: CandidateStatus.SENT_TO_CLIENT,
          history: [interaction, ...c.history],
        };
      }
      return c;
    }));
  };

  const handleUpdateVacancy = (vacancyId: string, updates: Partial<Vacancy>) => {
    setVacancies(prev => prev.map(v =>
      v.id === vacancyId ? { ...v, ...updates } : v
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      candidates,
      setCandidates,
      vacancies,
      setVacancies,
      companies,
      setCompanies,
      chats,
      visibleCandidates,
      activeVacancies,
      handleStatusChange,
      toggleShortlist,
      handleCreateCompany,
      handleCreateVacancy,
      handleAddComment,
      handleScheduleInterview,
      handleCloseVacancy,
      handleReopenVacancy,
      handleAddToVacancy,
      handleUpdateVacancy,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
