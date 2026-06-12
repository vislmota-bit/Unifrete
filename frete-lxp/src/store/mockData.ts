import type {
  Course, Enrollment, Trail, Achievement,
  LeaderboardEntry, AdminMetrics, MonthlyData, AreaAdherence, Alert, News,
} from '@/types'

// ── Cursos ────────────────────────────────────────────────────────────────────
export const MOCK_COURSES: Course[] = [
  {
    id: 'c1', title: 'Direção Defensiva Avançada', category: 'Segurança',
    duration: 120, type: 'mandatory', thumbnail: '#0D1B36',
    modules: 8, deadline: '2025-07-15', xpReward: 200,
  },
  {
    id: 'c2', title: 'Regulamentação ANTT 2025', category: 'Compliance',
    duration: 90, type: 'mandatory', thumbnail: '#0084C1',
    modules: 6, deadline: '2025-06-30', xpReward: 150,
  },
  {
    id: 'c3', title: 'Manutenção Preventiva de Veículos', category: 'Operações',
    duration: 180, type: 'optional', thumbnail: '#12B76A',
    modules: 12, xpReward: 300,
  },
  {
    id: 'c4', title: 'Atendimento ao Cliente na Logística', category: 'Soft Skills',
    duration: 60, type: 'optional', thumbnail: '#F79009',
    modules: 4, xpReward: 100,
  },
  {
    id: 'c5', title: 'Uso da Plataforma Fretebras', category: 'Tecnologia',
    duration: 45, type: 'mandatory', thumbnail: '#00AEEF',
    modules: 3, deadline: '2025-06-20', xpReward: 80,
  },
  {
    id: 'c6', title: 'LGPD para Motoristas', category: 'Compliance',
    duration: 30, type: 'mandatory', thumbnail: '#F04438',
    modules: 2, deadline: '2025-07-01', xpReward: 60,
  },
  {
    id: 'c7', title: 'Excel Básico para Gestão de Rotas', category: 'Tecnologia',
    duration: 150, type: 'optional', thumbnail: '#475467',
    modules: 10, xpReward: 250,
  },
  {
    id: 'c8', title: 'Saúde e Bem-estar na Estrada', category: 'Saúde',
    duration: 40, type: 'optional', thumbnail: '#12B76A',
    modules: 3, xpReward: 90,
  },
]

// ── Matrículas do usuário u1 ──────────────────────────────────────────────────
export const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', userId: 'u1', courseId: 'c1', progress: 75, status: 'in_progress',  xpEarned: 150 },
  { id: 'e2', userId: 'u1', courseId: 'c2', progress: 100, status: 'completed',   xpEarned: 150, completedAt: '2025-05-10' },
  { id: 'e3', userId: 'u1', courseId: 'c3', progress: 30,  status: 'in_progress', xpEarned: 90 },
  { id: 'e4', userId: 'u1', courseId: 'c4', progress: 0,   status: 'not_started', xpEarned: 0 },
  { id: 'e5', userId: 'u1', courseId: 'c5', progress: 100, status: 'completed',   xpEarned: 80, completedAt: '2025-05-28' },
  { id: 'e6', userId: 'u1', courseId: 'c6', progress: 50,  status: 'in_progress', xpEarned: 30 },
  { id: 'e7', userId: 'u1', courseId: 'c7', progress: 0,   status: 'not_started', xpEarned: 0 },
  { id: 'e8', userId: 'u1', courseId: 'c8', progress: 100, status: 'completed',   xpEarned: 90, completedAt: '2025-06-01' },
]

// ── Trilhas ───────────────────────────────────────────────────────────────────
export const MOCK_TRAILS: Trail[] = [
  {
    id: 't1',
    title: 'Motorista Pro',
    description: 'Tudo que você precisa para se tornar um motorista de alto desempenho na plataforma Fretebras.',
    category: 'Operações',
    thumbnail: '#0D1B36',
    totalDuration: 390,
    progress: 67,
    modules: [
      { id: 'm1', title: 'Fundamentos da Plataforma', duration: 45, xpReward: 80,  status: 'completed', completedAt: '2025-05-10',
        contentType: 'video', contentUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        description: 'Conheça os recursos essenciais da plataforma Fretebras e como utilizá-los no dia a dia.' },
      { id: 'm2', title: 'Direção Defensiva Avançada', duration: 120, xpReward: 200, status: 'active', progress: 75,
        contentType: 'video', contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Técnicas avançadas de direção defensiva para aumentar a segurança nas estradas.' },
      { id: 'm3', title: 'Manutenção Preventiva', duration: 180, xpReward: 300, status: 'locked',
        contentType: 'pdf', contentUrl: 'https://www.africau.edu/images/default/sample.pdf',
        description: 'Manual completo de manutenção preventiva de veículos pesados.' },
      { id: 'm4', title: 'Gestão de Rotas Eficientes', duration: 45, xpReward: 100, status: 'locked',
        contentType: 'audio', contentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        description: 'Podcast sobre como planejar e otimizar rotas para máxima eficiência.' },
    ],
  },
  {
    id: 't2',
    title: 'IA no Frete',
    description: 'Como a inteligência artificial está transformando a logística e o que você precisa saber.',
    category: 'Tecnologia',
    thumbnail: '#0084C1',
    totalDuration: 210,
    progress: 15,
    modules: [
      { id: 'm5', title: 'Introdução à IA na Logística', duration: 60, xpReward: 100, status: 'active', progress: 50,
        contentType: 'video', contentUrl: 'https://www.youtube.com/watch?v=9vJRopau0g0',
        description: 'Como a inteligência artificial está transformando a operação logística no Brasil.' },
      { id: 'm6', title: 'Machine Learning para Rotas', duration: 90, xpReward: 150, status: 'locked',
        contentType: 'pdf', contentUrl: 'https://www.africau.edu/images/default/sample.pdf',
        description: 'Conceitos de aprendizado de máquina aplicados à roteirização inteligente.' },
      { id: 'm7', title: 'Ferramentas de IA na prática', duration: 60, xpReward: 100, status: 'locked',
        contentType: 'video', contentUrl: '',
        description: 'Demonstração prática das principais ferramentas de IA disponíveis para motoristas.' },
    ],
  },
  {
    id: 't3',
    title: 'Compliance & Regulação',
    description: 'Esteja em dia com as normas da ANTT, LGPD e as melhores práticas do setor.',
    category: 'Compliance',
    thumbnail: '#F04438',
    totalDuration: 120,
    progress: 33,
    modules: [
      { id: 'm8', title: 'ANTT — Normas 2025', duration: 90, xpReward: 150, status: 'completed', completedAt: '2025-05-10',
        contentType: 'pdf', contentUrl: 'https://www.africau.edu/images/default/sample.pdf',
        description: 'Resolução ANTT 2025 — principais mudanças para motoristas profissionais.' },
      { id: 'm9', title: 'LGPD para Motoristas', duration: 30, xpReward: 60, status: 'active', progress: 50,
        contentType: 'doc', contentUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit',
        description: 'O que você precisa saber sobre proteção de dados pessoais no exercício da profissão.' },
      { id: 'm10', title: 'Seguro e Responsabilidade', duration: 0, xpReward: 80, status: 'locked',
        contentType: 'video', contentUrl: '',
        description: 'Tipos de seguro, cobertura e responsabilidades legais do motorista.' },
    ],
  },
  {
    id: 't4',
    title: 'Liderança na Estrada',
    description: 'Desenvolvimento de habilidades interpessoais e de liderança para motoristas sênior.',
    category: 'Soft Skills',
    thumbnail: '#12B76A',
    totalDuration: 160,
    progress: 0,
    modules: [
      { id: 'm11', title: 'Comunicação Assertiva', duration: 60, xpReward: 100, status: 'locked' },
      { id: 'm12', title: 'Gestão de Conflitos',   duration: 60, xpReward: 100, status: 'locked' },
      { id: 'm13', title: 'Mentoria de Pares',      duration: 40, xpReward: 80,  status: 'locked' },
    ],
  },
]

// ── Conquistas ────────────────────────────────────────────────────────────────
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'Primeira Milha',    description: 'Completou seu primeiro módulo.',         icon: '🚀', xpReward: 50,  unlocked: true,  unlockedAt: '2025-04-01' },
  { id: 'a2', name: 'Motorista Seguro',  description: 'Concluiu Direção Defensiva Avançada.',   icon: '🛡️', xpReward: 200, unlocked: true,  unlockedAt: '2025-05-15' },
  { id: 'a3', name: 'Streak de 7 Dias', description: '7 dias consecutivos de aprendizagem.',    icon: '🔥', xpReward: 100, unlocked: true,  unlockedAt: '2025-05-20' },
  { id: 'a4', name: 'Especialista',      description: 'Conclua 5 cursos na mesma categoria.',    icon: '⭐', xpReward: 300, unlocked: false },
  { id: 'a5', name: 'Top 10',            description: 'Alcance o top 10 do leaderboard.',        icon: '🏆', xpReward: 500, unlocked: false },
]

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'u10', name: 'Ana Beatriz',    area: 'Operações',    xp: 8120, level: 12 },
  { userId: 'u11', name: 'Carlos Mendes',  area: 'Tecnologia',   xp: 7450, level: 11 },
  { userId: 'u12', name: 'Renata Souza',   area: 'Comercial',    xp: 6980, level: 10 },
  { userId: 'u13', name: 'Diego Alves',    area: 'Logística',    xp: 5600, level: 9  },
  { userId: 'u1',  name: 'Pedro Jota',     area: 'Operações',    xp: 3240, level: 7, isCurrentUser: true },
]

// ── Admin: métricas ───────────────────────────────────────────────────────────
export const MOCK_METRICS: AdminMetrics = {
  activeCollaborators: 12480,
  completionRate:      68,
  hoursLearned:        94320,
  nps:                 72,
}

export const MOCK_MONTHLY: MonthlyData[] = [
  { month: 'Jan', completions: 820,  starts: 1200 },
  { month: 'Fev', completions: 940,  starts: 1350 },
  { month: 'Mar', completions: 1100, starts: 1600 },
  { month: 'Abr', completions: 980,  starts: 1420 },
  { month: 'Mai', completions: 1340, starts: 1800 },
  { month: 'Jun', completions: 1520, starts: 2100 },
]

export const MOCK_AREA_ADHERENCE: AreaAdherence[] = [
  { area: 'Operações',  percentage: 82, color: '#00AEEF' },
  { area: 'Tecnologia', percentage: 91, color: '#12B76A' },
  { area: 'Comercial',  percentage: 74, color: '#F79009' },
  { area: 'Logística',  percentage: 68, color: '#F04438' },
  { area: 'Financeiro', percentage: 87, color: '#0D1B36' },
]

export const MOCK_NEWS: News[] = [
  {
    id: 'n1', emoji: '🚀',
    title: 'Fretebras lança rastreio em tempo real',
    summary: 'A plataforma agora permite acompanhamento da carga com atualização a cada 30 segundos, melhorando a transparência para embarcadores e motoristas.',
    category: 'company', contentType: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    publishedAt: '2025-06-10', readingMinutes: 3,
  },
  {
    id: 'n2', emoji: '📦',
    title: 'Frete rodoviário cresce 12% no 1º semestre de 2025',
    summary: 'Levantamento da CNT aponta recuperação do setor, impulsionada pelo agronegócio e pelo e-commerce nacional.',
    category: 'market', contentType: 'pdf',
    contentUrl: 'https://www.africau.edu/images/default/sample.pdf',
    publishedAt: '2025-06-08', readingMinutes: 5,
  },
  {
    id: 'n3', emoji: '⚖️',
    title: 'ANTT publica nova resolução sobre jornada do motorista',
    summary: 'Resolução nº 6.012/2025 atualiza regras sobre tempo de direção, descanso obrigatório e registros eletrônicos. Motoristas devem se adequar até agosto.',
    category: 'law', contentType: 'pdf',
    contentUrl: 'https://www.africau.edu/images/default/sample.pdf',
    publishedAt: '2025-06-05', readingMinutes: 7,
    mandatory: true,
  },
  {
    id: 'n4', emoji: '🏆',
    title: 'Fretebras é eleita uma das melhores empresas para trabalhar',
    summary: 'Reconhecimento no ranking Great Place To Work 2025 na categoria de empresas de tecnologia e logística.',
    category: 'company', contentType: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=9vJRopau0g0',
    publishedAt: '2025-06-02', readingMinutes: 2,
  },
  {
    id: 'n5', emoji: '🤖',
    title: 'IA na logística: o que vem por aí em 2025',
    summary: 'Podcast com especialistas sobre roteirização inteligente, previsão de demanda e chatbots no atendimento ao motorista.',
    category: 'market', contentType: 'audio',
    contentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    publishedAt: '2025-05-28', readingMinutes: 18,
  },
  {
    id: 'n6', emoji: '🛣️',
    title: 'Novo código de trânsito: impactos para motoristas profissionais',
    summary: 'Novas regras de pontuação em carteira, multas para celular ao volante e habilitação categoria E entram em vigor em julho.',
    category: 'law', contentType: 'doc',
    contentUrl: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit',
    publishedAt: '2025-05-20', readingMinutes: 6,
    mandatory: true,
  },
]

export const MOCK_ALERTS: Alert[] = [
  { id: 'al1', type: 'danger',  message: 'Motoristas com treinamentos vencidos',    count: 134, action: 'Ver lista' },
  { id: 'al2', type: 'warning', message: 'Cursos obrigatórios com prazo esta semana', count: 289, action: 'Notificar' },
  { id: 'al3', type: 'info',    message: 'Novos colaboradores sem onboarding',       count: 47,  action: 'Atribuir trilha' },
]
