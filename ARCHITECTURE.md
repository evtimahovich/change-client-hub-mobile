# Архитектура приложения Change Client Hub

## Общая структура

```
┌─────────────────────────────────────────────────────┐
│                  Change Client Hub                   │
│              Recruiter CRM Platform                  │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │Recruiter│    │ Client  │    │  Admin  │
   │  View   │    │  View   │    │  View   │
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │              │
        └──────────────┴──────────────┘
                       │
              ┌────────▼────────┐
              │   Core System   │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │Database │   │   AI    │   │  File   │
   │ Layer   │   │ Service │   │ Storage │
   └─────────┘   └─────────┘   └─────────┘
```

## Роли и доступ

### Рекрутер (основная роль)

**Полный доступ к:**
- ✅ Все кандидаты в базе
- ✅ Все вакансии
- ✅ Все компании-клиенты
- ✅ Создание и редактирование
- ✅ История и аналитика

**Основные разделы:**
```
┌─────────────────────────┐
│    Recruiter View       │
├─────────────────────────┤
│ 📊 Dashboard            │ ← Общая аналитика
│ 👥 Candidates (CRM)     │ ← ГЛАВНЫЙ раздел
│ 💼 Vacancies            │ ← Управление вакансиями
│ 🏢 Companies            │ ← База клиентов
│ ⭐ Shortlist            │ ← Избранные
│ 💬 Messages             │ ← Коммуникации
└─────────────────────────┘
```

### Клиент (ограниченный доступ)

**Доступ только к:**
- ⚠️ Кандидаты, отправленные рекрутером
- ⚠️ Свои вакансии
- ⚠️ Информация о своей компании
- ❌ Не видит другие компании
- ❌ Не видит всю базу кандидатов

**Разделы клиента:**
```
┌─────────────────────────┐
│     Client View         │
├─────────────────────────┤
│ 👥 Sent Candidates      │ ← Только отправленные
│ 💼 Our Vacancies        │ ← Вакансии компании
│ ⭐ Favorites            │ ← Избранные кандидаты
│ 💬 Messages             │ ← Чат с рекрутером
└─────────────────────────┘
```

### Админ (супер права)

**Полный доступ ко всему + управление:**
- ✅ Управление пользователями
- ✅ Настройки системы
- ✅ Логи и аудит
- ✅ Биллинг и подписки

## Поток данных - Candidates (CRM)

### 1. Добавление кандидата

```
Recruiter
   │
   ├─► [+ Add Candidate]
   │
   ├─► Manual Entry / Parse Resume / Upload PDF
   │
   ├─► AI Analysis
   │      │
   │      ├─► Skills Extraction
   │      ├─► Experience Calculation
   │      └─► Match Score Generation
   │
   ├─► Save to Database
   │      │
   │      └─► status: "NEW" (Ожидает отправки)
   │
   └─► Appears in Candidate List
           │
           └─► isNew: true (красный badge)
```

### 2. Работа с кандидатом

```
Candidate Card
   │
   ├─► Search & Filter
   │      │
   │      ├─► By Name
   │      ├─► By Skills
   │      ├─► By Position
   │      └─► By Status
   │
   ├─► Quick Actions
   │      │
   │      ├─► 📤 Send to Client
   │      │      │
   │      │      └─► Select Client & Vacancy
   │      │             │
   │      │             └─► status: "SENT_TO_CLIENT"
   │      │
   │      ├─► 💬 Message
   │      │      │
   │      │      └─► Opens Chat Window
   │      │
   │      └─► 📞 Call
   │             │
   │             └─► Logs in History
   │
   ├─► Bulk Actions
   │      │
   │      ├─► Select Multiple
   │      ├─► Send All to Client
   │      ├─► Add to Shortlist
   │      └─► Reject
   │
   └─► Status Management
          │
          ├─► List View: Manual Change
          │
          └─► Kanban View: Drag & Drop
                 │
                 └─► Auto-updates + History Log
```

### 3. Отправка клиенту

```
[Select Candidates]
        │
        ├─► Checkbox Selection (1 or many)
        │
        ├─► [Send to Client] button
        │
        ├─► Modal: Select Client
        │      │
        │      └─► List of Companies
        │
        ├─► Modal: Select Vacancy
        │      │
        │      └─► List of Active Vacancies
        │
        ├─► Confirmation
        │
        ├─► Update Database
        │      │
        │      ├─► candidate.companyId = selected
        │      ├─► candidate.vacancyId = selected
        │      ├─► candidate.status = "SENT_TO_CLIENT"
        │      └─► history.push({...})
        │
        └─► Notifications
               │
               ├─► To Recruiter: "Sent successfully"
               │
               └─► To Client: "New candidate available"
```

### 4. Отслеживание прогресса (Kanban)

```
[Kanban Board]
   │
   ├─── Column 1: NEW (Ожидает отправки)
   │       │
   │       └─► Candidates not yet sent
   │
   ├─── Column 2: SENT_TO_CLIENT
   │       │
   │       └─► Waiting for client review
   │
   ├─── Column 3: CLIENT_INTERVIEW
   │       │
   │       └─► Interview scheduled/ongoing
   │
   ├─── Column 4: TEST_TASK
   │       │
   │       └─► Completing test assignment
   │
   ├─── Column 5: SECURITY_CHECK
   │       │
   │       └─► References & background check
   │
   ├─── Column 6: INTERNSHIP
   │       │
   │       └─► Trial period
   │
   ├─── Column 7: OFFER
   │       │
   │       └─► Offer made
   │
   ├─── Column 8: HIRED ✅
   │       │
   │       └─► Successfully hired
   │
   ├─── Column 9: REJECTED ❌
   │       │
   │       └─► Did not work out
   │
   ├─── Column 10: RESERVE
   │       │
   │       └─► Keep for future opportunities
   │
   └─── Column 11: FIRED
           │
           └─► Left the company
```

## Компонентная структура

### CandidateList Component Tree

```
<CandidateList>
   │
   ├─► <Header>
   │      │
   │      ├─► <Title> "Кандидаты"
   │      ├─► <Subtitle> "(280) Кандидатов"
   │      │
   │      ├─► <ViewToggle>
   │      │      ├─► [List]
   │      │      └─► [Kanban]
   │      │
   │      ├─► <FilterButton>
   │      ├─► <AddButton>
   │      │
   │      └─► <SearchBar>
   │             ├─► Input
   │             ├─► <VacancyDropdown>
   │             ├─► <LocationButton>
   │             └─► <SearchButton>
   │
   ├─► [Mode: List]
   │      │
   │      └─► <FlatList>
   │             │
   │             └─► <CandidateCard> (repeated)
   │                    │
   │                    ├─► <CardHeader>
   │                    │      ├─► <Checkbox>
   │                    │      ├─► <ShortlistButton>
   │                    │      └─► <MoreButton>
   │                    │
   │                    ├─► <CardContent>
   │                    │      ├─► <Avatar> + Badge
   │                    │      ├─► <AIScore>
   │                    │      ├─► <Position>
   │                    │      ├─► <PersonalInfo>
   │                    │      ├─► <Salary>
   │                    │      └─► <JobHistory>
   │                    │
   │                    ├─► <QuickActions>
   │                    │      ├─► [Send]
   │                    │      ├─► [Message]
   │                    │      └─► [Call]
   │                    │
   │                    └─► <BottomActions>
   │                           ├─► [Favorite]
   │                           └─► [History]
   │
   ├─► [Mode: Kanban]
   │      │
   │      └─► <KanbanBoard>
   │             │
   │             └─► <Column> (x11 statuses)
   │                    │
   │                    ├─► <ColumnHeader>
   │                    │      ├─► Color Dot
   │                    │      ├─► Title
   │                    │      └─► Count Badge
   │                    │
   │                    └─► <ScrollView>
   │                           │
   │                           └─► <DraggableCard> (repeated)
   │
   ├─► <FilterModal>
   │      │
   │      ├─► <FilterSection> "Вакансия"
   │      │      └─► [Options...]
   │      │
   │      ├─► <FilterSection> "Статус"
   │      │      └─► [Options...]
   │      │
   │      └─► <Actions>
   │             ├─► [Reset]
   │             └─► [Apply]
   │
   └─► <BulkActionsPanel> (conditional)
          │
          ├─► "Selected: X"
          │
          └─► <Actions>
                 ├─► [Send to Client]
                 ├─► [Add to Shortlist]
                 └─► [Reject]
```

## State Management

### Local Component State

```typescript
// CandidateList.tsx
const [searchTerm, setSearchTerm] = useState('');
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
const [filterModalVisible, setFilterModalVisible] = useState(false);
const [vacancyFilter, setVacancyFilter] = useState<string>('all');
const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
```

### Computed State (Memoized)

```typescript
const filtered = useMemo(() => {
  return candidates.filter(c => {
    const matchesSearch = /* ... */;
    const matchesVacancy = /* ... */;
    const matchesStatus = /* ... */;
    return matchesSearch && matchesVacancy && matchesStatus;
  });
}, [candidates, searchTerm, vacancyFilter, statusFilter]);
```

### Global State (Future)

```typescript
// Context API or Redux
interface AppState {
  user: User;
  candidates: Candidate[];
  vacancies: Vacancy[];
  companies: Company[];
  filters: FilterState;
  ui: UIState;
}
```

## API Endpoints (Future)

```
GET    /api/candidates              - Получить всех кандидатов
POST   /api/candidates              - Создать кандидата
GET    /api/candidates/:id          - Получить одного
PUT    /api/candidates/:id          - Обновить
DELETE /api/candidates/:id          - Удалить

POST   /api/candidates/:id/send     - Отправить клиенту
PUT    /api/candidates/:id/status   - Изменить статус
POST   /api/candidates/:id/favorite - Добавить в избранное

GET    /api/vacancies               - Получить вакансии
GET    /api/companies               - Получить компании

POST   /api/ai/analyze-resume       - AI анализ резюме
POST   /api/ai/match-score          - Расчет соответствия
```

## Performance Optimizations

### 1. List Virtualization
```typescript
<FlatList
  data={filtered}
  renderItem={renderCandidate}
  keyExtractor={(item) => item.id}
  windowSize={10}                    // Оптимизация памяти
  removeClippedSubviews={true}       // Native optimization
  maxToRenderPerBatch={10}           // Batch rendering
  updateCellsBatchingPeriod={50}     // Update frequency
/>
```

### 2. Memoization
```typescript
// Мемоизация фильтрации
const filtered = useMemo(() => { /* ... */ }, [deps]);

// Мемоизация рендера
const renderCandidate = useCallback(({ item }) => { /* ... */ }, []);
```

### 3. Lazy Loading
```typescript
// Подгрузка деталей по требованию
const loadCandidateDetails = async (id: string) => {
  if (!detailsCache[id]) {
    const details = await api.getCandidateDetails(id);
    setDetailsCache(prev => ({ ...prev, [id]: details }));
  }
};
```

## Security Considerations

### Access Control

```typescript
// Middleware для проверки доступа
const canAccessCandidate = (user: User, candidate: Candidate) => {
  if (user.role === 'RECRUITER' || user.role === 'ADMIN') {
    return true; // Полный доступ
  }

  if (user.role === 'CLIENT') {
    // Только если кандидат отправлен этому клиенту
    return candidate.companyId === user.companyId;
  }

  return false;
};
```

### Data Privacy

```typescript
// Фильтрация данных для клиента
const sanitizeCandidateForClient = (candidate: Candidate) => {
  return {
    ...candidate,
    phone: undefined,        // Скрыть телефон
    email: undefined,        // Скрыть email
    history: undefined,      // Скрыть историю
    // Показывать только необходимое
  };
};
```

## Future Architecture

### Microservices Approach

```
┌─────────────────────────────────────────────┐
│           API Gateway                        │
└─────────────────┬───────────────────────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐  ┌───▼────┐  ┌───▼─────┐
│Candidate│  │Vacancy │  │ Company │
│ Service │  │Service │  │ Service │
└────┬────┘  └───┬────┘  └───┬─────┘
     │           │            │
     └───────────┴────────────┘
                 │
         ┌───────▼───────┐
         │   Database    │
         │   Cluster     │
         └───────────────┘
```

### Event-Driven Updates

```
Candidate Status Changed
        ↓
   Event Emitted
        ↓
   ┌────┴────┐
   │         │
   ▼         ▼
Update DB  Notify Users
   │         │
   │         ├─► Email
   │         ├─► Push
   │         └─► WebSocket
   │
   └─► Update Analytics
```

## Заключение

Архитектура построена с учетом:
- 🎯 Разделения ролей и доступа
- 🚀 Высокой производительности
- 🔒 Безопасности данных
- 📈 Масштабируемости
- 🛠 Удобства разработки
