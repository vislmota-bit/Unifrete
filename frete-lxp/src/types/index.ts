// ── Usuário ──────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  area: string
  level: number
  xp: number
  xpToNextLevel: number
  rankPosition: number
  streakDays: number
  avatar?: string
}

// ── Curso ────────────────────────────────────────────────────────────────────
export interface Course {
  id: string
  title: string
  category: string
  duration: number       // minutos
  type: 'mandatory' | 'optional'
  thumbnail: string      // cor hex usada como fundo do thumbnail
  modules: number
  deadline?: string      // ISO date string
  xpReward: number
}

// ── Matrícula (progresso do usuário num curso) ────────────────────────────────
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  progress: number       // 0–100
  status: 'not_started' | 'in_progress' | 'completed'
  completedAt?: string
  xpEarned: number
}

// ── Trilha de aprendizagem ───────────────────────────────────────────────────
export interface Trail {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string      // cor hex do gradiente
  totalDuration: number  // minutos
  progress: number       // 0–100
  modules: TrailModule[]
}

export type ContentType = 'video' | 'audio' | 'pdf' | 'doc'

export interface TrailModule {
  id: string
  title: string
  duration: number       // minutos
  xpReward: number
  status: 'completed' | 'active' | 'locked'
  completedAt?: string
  progress?: number      // 0–100 (só para status active)
  contentType?: ContentType
  contentUrl?: string
  description?: string
}

// ── Notícia ────────────────────────────────────────────────────────────────────
export interface News {
  id: string
  title: string
  summary: string
  category: 'company' | 'market' | 'law' | 'tip'
  contentType: ContentType
  contentUrl?: string
  publishedAt: string   // ISO date
  readingMinutes: number
  mandatory?: boolean
  emoji: string
}

// ── Conquista ─────────────────────────────────────────────────────────────────
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string           // emoji ou nome de ícone Lucide
  xpReward: number
  unlocked: boolean
  unlockedAt?: string
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  userId: string
  name: string
  area: string
  xp: number
  level: number
  avatar?: string
  isCurrentUser?: boolean
}

// ── Admin: usuário gerenciado ──────────────────────────────────────────────────
export type UserRole       = 'admin' | 'manager' | 'user'
export type UserPermission = 'view_reports' | 'manage_courses' | 'manage_users' | 'manage_content'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  area: string
  directorship: string
  managerName: string
  permissions: UserPermission[]
  status: 'active' | 'inactive'
  createdAt: string
  avatar?: string
}

// ── Admin: curso gerenciado ────────────────────────────────────────────────────
export interface AdminCourse {
  id: string
  title: string
  description: string
  xpReward: number
  tags: string[]
  bannerUrl?: string        // base64 ou URL
  bannerColor: string       // fallback hex
  permissions: {
    roles: UserRole[]
    areas: string[]
  }
  type: 'mandatory' | 'optional'
  status: 'draft' | 'published'
  createdAt: string
}


export interface AdminMetrics {
  activeCollaborators: number
  completionRate: number   // percentual 0–100
  hoursLearned: number
  nps: number
}

export interface MonthlyData {
  month: string
  completions: number
  starts: number
}

export interface AreaAdherence {
  area: string
  percentage: number
  color: string
}

export interface Alert {
  id: string
  type: 'danger' | 'warning' | 'info'
  message: string
  count?: number
  action: string
}
