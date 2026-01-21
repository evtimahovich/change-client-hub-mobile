
import { User, UserRole, Candidate, Vacancy, CandidateStatus, ChatMessage, Company } from './types';

export const mockCompanies: Company[] = [
  { 
    id: 'comp_a', 
    name: 'Caseware Ukraine', 
    description: 'Оказание комплексных бухгалтерских услуг компаниям малого и среднего бизнеса. Работаем удалённо с клиентами по всему Казахстану. Специализируемся на автоматизации учёта.', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CU&backgroundColor=F44336',
    location: 'Караганда, Астана',
    website: 'bbu.kz',
    industry: 'Бухгалтерские услуги',
    employees: '10-50 сотрудников',
    founded: '2016',
    clientSince: '20.06.2025',
    rating: 4.0,
    socials: {
      instagram: '@bbu_instagram',
      telegram: 't.me/bbugroup'
    },
    culture: ['Деловая атмосфера', 'Удалённая работа', 'Гибкий график', 'Рост внутри компании'],
    hiringProcess: [
      { step: 1, title: 'Созвон с HR' },
      { step: 2, title: 'Встреча с директором' },
      { step: 3, title: 'Тестовое' },
      { step: 4, title: 'Финальное интервью' }
    ],
    hiringDuration: '2-3 недели',
    decisionMakers: [
      {
        id: 'dm1',
        name: 'Анна Петрова',
        role: 'директор',
        email: 'anna@caseware.kz',
        phone: '+7 777 111 2233',
        communicationStyle: 'Предпочитает краткие, структурированные отчеты. Ценит пунктуальность и конкретику. Лучшее время для звонков: 10:00-12:00, 15:00-17:00.',
        hiringPreferences: 'Ищет кандидатов с опытом работы в стартапах или растущих компаниях. Важны soft skills: коммуникабельность, проактивность, умение работать в команде. Готова рассматривать кандидатов без высшего образования при наличии сильного портфолио.'
      },
      {
        id: 'dm2',
        name: 'Марат Нурланов',
        role: 'техлид',
        email: 'marat@caseware.kz',
        phone: '+7 777 444 5566',
        communicationStyle: 'Технический человек, ценит детальные технические описания. Предпочитает письменную коммуникацию (email, Telegram). Отвечает обычно в течение 24 часов.',
        hiringPreferences: 'Фокусируется на hard skills и практическом опыте. Обязательно проводит техническое интервью с живым кодингом. Важны знания современных технологий и best practices. Предпочитает кандидатов с опытом code review и менторства.'
      }
    ]
  },
  { 
    id: 'comp_b', 
    name: 'Global Logistics Corp', 
    description: 'Мировая логистическая сеть.', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GL&backgroundColor=0066FF' 
  },
  { 
    id: 'comp_c', 
    name: 'FinEase Fintech', 
    description: 'Инновации в мире финансов.', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FE&backgroundColor=8B5CF6' 
  },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Алексей Петров', role: UserRole.RECRUITER, email: 'petrov@change.com', avatar: 'https://picsum.photos/seed/petrov/100/100' },
  { id: '2', name: 'Мария Иванова', role: UserRole.CLIENT, email: 'ivanova@company.com', companyId: 'comp_a', avatar: 'https://picsum.photos/seed/ivanova/100/100' },
  { id: '3', name: 'Дмитрий Соколов', role: UserRole.RECRUITMENT_HEAD, email: 'sokolov@change.com', avatar: 'https://picsum.photos/seed/sokolov/100/100' },
  { id: '4', name: 'Администратор', role: UserRole.ADMIN, email: 'admin@change.com' },
];

export const mockVacancies: Vacancy[] = [
  {
    id: 'v1',
    title: 'Senior Frontend Developer',
    companyId: 'comp_a',
    recruiterId: '1',
    description: 'Мы ищем эксперта по React для руководства командой разработки дашборда.',
    location: {
      city: 'Караганда',
      country: 'Казахстан',
      address: 'ул. Ержанова 20, БЦ «Сарыарка», офис 305'
    },
    workFormat: ['remote', 'hybrid'],
    experienceYears: 5,
    requirements: ['React 18+', 'TypeScript', 'Tailwind CSS', '5+ лет опыта', 'REST API', 'SSR', 'SPA архитектура'],
    responsibilities: ['Проектирование фронтенд-архитектуры', 'Ревью кода', 'Менторство'],
    conditions: ['Удаленка', 'Гибкий график', 'Медицинская страховка'],
    niceToHave: ['Next.js', 'Framer Motion'],
    salaryRange: { min: 4000, max: 6000 },
    status: 'active',
    history: [
      { date: '2024-01-10T10:00:00Z', user: 'Алексей Петров', action: 'Создано', details: 'Первоначальное создание вакансии' }
    ]
  },
  {
    id: 'v2',
    title: 'Middle Node.js Developer',
    companyId: 'comp_a',
    recruiterId: '1',
    description: 'Помогите нам масштабировать микросервисы.',
    location: {
      city: 'Алматы',
      country: 'Казахстан',
      address: 'пр. Абая 150, БЦ «Нурлы Тау», офис 1203'
    },
    workFormat: ['office', 'hybrid'],
    experienceYears: 3,
    requirements: ['Node.js', 'PostgreSQL', 'Redis', '3+ лет опыта', 'REST API', 'Микросервисы', 'SQL'],
    responsibilities: ['Разработка API', 'Оптимизация базы данных'],
    conditions: ['Гибрид', 'Офис в Алматы'],
    niceToHave: ['Kubernetes', 'AWS'],
    salaryRange: { min: 2500, max: 4000 },
    status: 'active',
    history: [],
    employmentType: 'Официально • Неофициально',
    workConditions: 'Ми пропонуємо офіційне працевлаштування та повністю "білу" конкурентну заробітну плату, графік роботи: робочі дні на місяць без затримок. Графік гнучкий, з можливістю працювати як в офісі, так і віддалено.\n\nДля вашого розвитку ми покриваємо 50% вартості профільних курсів, тренінгів та конференцій, а також надаємо доступ до корпоративної електронної бібліотеки.\n\nМи дбаємо про комфорт: надаємо сучасне обладнання (ноутбук, монітор, необхідна периферія), оплачуємо корпоративний мобільний зв\'язок. В офісі завжди є свіжі фрукти, снеки, кава/чай, а також власна зона відпочинку.\n\nОкрім стандартних 24 днів відпустки та лікарняних, ми пропонуємо повний пакет медичного страхування. Раз на квартал проводимо корпоративні заходи та тімбілдінги.',
    contactPersons: [
      {
        id: '1',
        name: 'Пухова Анна Олеговна',
        position: 'Директор',
        phone: '+7 708 963 8274',
        telegram: 'https://t.me/Godgiven_short',
        communicationPreferences: 'Быстро реагирует, клиентский сервис',
        decisionMakingStyle: 'Пробелы в резюме, опоздания'
      }
    ],
    comments: [
      {
        id: '1',
        author: 'Томчен Баратеон',
        date: '14:00 10.02.2025',
        type: 'positive',
        text: 'Быстро отвечает, готов к овертаймам, опыт в финтехе, работал в Google, гибкий по формату, релокация возможна, сильный английский, уверенно держится на интервью, тех. база крепкая, позитивный фидбек от команды.'
      },
      {
        id: '2',
        author: 'Томчен Баратеон',
        date: '14:00 10.02.2025',
        type: 'negative',
        text: 'Быстро отвечает, готов к овертаймам, опыт в финтехе, работал в Google, гибкий по формату, релокация возможна, сильный английский, уверенно держится на интервью, тех. база крепкая, позитивный фидбек от команды.'
      }
    ]
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Иван Сергеев',
    position: 'Senior Frontend Developer',
    location: 'Алматы',
    email: 'ivan@dev.com',
    phone: '+7 777 123 4567',
    salaryExpectation: 5500,
    experienceYears: 7,
    skills: ['React', 'TypeScript', 'Redux', 'AWS', 'Docker'],
    status: CandidateStatus.NEW,
    shortlisted: false,
    isNew: true,
    aiAnalysis: {
      score: 92,
      breakdown: { hardSkills: 38, experience: 30, salary: 15, bonus: 9 },
      summary: "Идеально подходит по стеку и опыту. Ожидания чуть выше среднего."
    },
    renome: "Сильный технический бэкграунд, работал в крупных финтех проектах.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    transcription: "Рассказывает о своем опыте с React 18 и оптимизацией производительности...",
    history: []
  },
  {
    id: 'c2',
    name: 'Анна Петрова',
    position: 'Senior Frontend Developer',
    location: 'Астана',
    email: 'anna@dev.com',
    phone: '+7 777 234 5678',
    salaryExpectation: 4800,
    experienceYears: 6,
    skills: ['React', 'Vue', 'TypeScript', 'Node.js'],
    status: CandidateStatus.SENT_TO_CLIENT,
    shortlisted: true,
    aiAnalysis: {
      score: 88,
      breakdown: { hardSkills: 35, experience: 28, salary: 18, bonus: 7 },
      summary: "Отличные навыки, адекватные ожидания."
    },
    history: []
  },
  {
    id: 'c3',
    name: 'Дмитрий Козлов',
    position: 'Middle Node.js Developer',
    location: 'Караганда',
    email: 'dmitry@dev.com',
    phone: '+7 777 345 6789',
    salaryExpectation: 3200,
    experienceYears: 4,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
    status: CandidateStatus.CLIENT_INTERVIEW,
    shortlisted: false,
    isNew: true,
    aiAnalysis: {
      score: 85,
      breakdown: { hardSkills: 32, experience: 26, salary: 20, bonus: 7 },
      summary: "Хороший кандидат для middle позиции."
    },
    history: []
  },
  {
    id: 'c4',
    name: 'Елена Смирнова',
    position: 'Senior Frontend Developer',
    location: 'Алматы',
    email: 'elena@dev.com',
    phone: '+7 777 456 7890',
    salaryExpectation: 5000,
    experienceYears: 8,
    skills: ['React', 'Angular', 'TypeScript', 'GraphQL'],
    status: CandidateStatus.TEST_TASK,
    shortlisted: true,
    aiAnalysis: {
      score: 90,
      breakdown: { hardSkills: 36, experience: 29, salary: 17, bonus: 8 },
      summary: "Очень опытный кандидат с широким стеком."
    },
    history: []
  },
  {
    id: 'c5',
    name: 'Максим Новиков',
    position: 'Middle Node.js Developer',
    location: 'Шымкент',
    email: 'maxim@dev.com',
    phone: '+7 777 567 8901',
    salaryExpectation: 2800,
    experienceYears: 3,
    skills: ['Node.js', 'NestJS', 'MySQL', 'Redis'],
    status: CandidateStatus.SECURITY_CHECK,
    shortlisted: false,
    aiAnalysis: {
      score: 82,
      breakdown: { hardSkills: 30, experience: 24, salary: 21, bonus: 7 },
      summary: "Перспективный middle разработчик."
    },
    history: []
  },
  {
    id: 'c6',
    name: 'Ольга Васильева',
    position: 'Senior Frontend Developer',
    location: 'Алматы',
    email: 'olga@dev.com',
    phone: '+7 777 678 9012',
    salaryExpectation: 5200,
    experienceYears: 7,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    status: CandidateStatus.INTERNSHIP,
    shortlisted: true,
    aiAnalysis: {
      score: 91,
      breakdown: { hardSkills: 37, experience: 29, salary: 16, bonus: 9 },
      summary: "Отличное совпадение по требованиям."
    },
    history: []
  },
  {
    id: 'c7',
    name: 'Сергей Федоров',
    position: 'Middle Node.js Developer',
    location: 'Астана',
    email: 'sergey@dev.com',
    phone: '+7 777 789 0123',
    salaryExpectation: 3500,
    experienceYears: 5,
    skills: ['Node.js', 'Fastify', 'PostgreSQL', 'Docker'],
    status: CandidateStatus.OFFER,
    shortlisted: true,
    aiAnalysis: {
      score: 87,
      breakdown: { hardSkills: 34, experience: 27, salary: 19, bonus: 7 },
      summary: "Сильный middle кандидат."
    },
    history: []
  },
  {
    id: 'c8',
    name: 'Мария Соколова',
    position: 'Senior Frontend Developer',
    location: 'Караганда',
    email: 'maria@dev.com',
    phone: '+7 777 890 1234',
    salaryExpectation: 4500,
    experienceYears: 6,
    skills: ['React', 'Redux', 'TypeScript', 'Jest'],
    status: CandidateStatus.HIRED,
    shortlisted: false,
    aiAnalysis: {
      score: 89,
      breakdown: { hardSkills: 35, experience: 28, salary: 19, bonus: 7 },
      summary: "Надежный senior разработчик."
    },
    history: []
  },
  {
    id: 'c9',
    name: 'Алексей Морозов',
    position: 'Middle Node.js Developer',
    location: 'Алматы',
    email: 'alex@dev.com',
    phone: '+7 777 901 2345',
    salaryExpectation: 4500,
    experienceYears: 3,
    skills: ['Node.js', 'Express', 'MongoDB'],
    status: CandidateStatus.REJECTED,
    shortlisted: false,
    aiAnalysis: {
      score: 68,
      breakdown: { hardSkills: 25, experience: 20, salary: 15, bonus: 8 },
      summary: "Завышенные ожидания для middle."
    },
    history: []
  },
  {
    id: 'c10',
    name: 'Наталья Волкова',
    position: 'Senior Frontend Developer',
    location: 'Астана',
    email: 'natalia@dev.com',
    phone: '+7 777 012 3456',
    salaryExpectation: 5800,
    experienceYears: 9,
    skills: ['React', 'Vue', 'Angular', 'TypeScript', 'Webpack'],
    status: CandidateStatus.RESERVE,
    shortlisted: true,
    aiAnalysis: {
      score: 94,
      breakdown: { hardSkills: 38, experience: 31, salary: 15, bonus: 10 },
      summary: "Превосходный кандидат, держим в резерве."
    },
    history: []
  }
];

export const mockChats: ChatMessage[] = [
  { id: 'm1', senderId: '1', senderName: 'Алексей Петров', text: 'Привет! Нашел отличного кандидата на Senior JS. Посмотри Ивана!', timestamp: '2024-01-15T09:00:00Z' }
];
