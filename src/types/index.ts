export type ProjectStatus = 'active' | 'inactive' | 'parking_lot' | 'completed' | 'graveyard'
export type ProjectCategory = 'work' | 'growth' | 'projects' | 'life'
export type ProjectPriority = 'must_do' | 'should_do' | 'nice_to_have'
export type WillpowerLevel = 'high' | 'medium' | 'low'
export type EnergyLevel = 'fired_up' | 'need_break' | 'spent'
export type QualityRating = 'excellent' | 'good' | 'average' | 'challenging' | 'bad'
export type CompletionStatus = 'completed' | 'interrupted'
export type TriageDecision = 'project' | 'quick_task' | 'routed' | 'deleted'

export interface CaptureItem {
  id?: number
  text: string
  source: 'manual' | 'hotkey'
  createdAt: Date
  triagedAt?: Date
  triageDecision?: TriageDecision
  outcomeData?: any
  resultingProjectId?: number
}

export interface Project {
  id?: number
  title: string
  description?: string
  cost: number // 1-10
  benefit: number // 1-10
  priority: ProjectPriority
  status: ProjectStatus
  category: ProjectCategory
  customTags?: string[]
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  actualCompletedAt?: Date
  completionWeek?: number
  completedAt?: Date
  totalFocusTime: number // minutes
  sessionCount: number
  lessonsLearned?: string
}

export interface DailyObjective {
  id?: number
  date: Date
  sessionCount: number
  sessionDuration: number // minutes
  createdAt: Date
  completedSessions: number
  totalMinutesPlanned: number
  totalMinutesActual: number
}

export interface FocusSession {
  id?: number
  projectId: number
  dailyObjectiveId?: number
  plannedDuration: number // minutes
  actualDuration: number // minutes
  willpowerLevel: WillpowerLevel
  energyLevel?: EnergyLevel
  qualityRating?: QualityRating
  difficultyQuote?: string
  difficultyMultiplier?: number
  sessionNumberToday: number
  completionStatus: CompletionStatus
  interruptionReason?: string
  breakDuration?: number // minutes
  startedAt: Date
  endedAt: Date
  timeOfDay?: string
  dayOfWeek?: number
  weekNumber?: number
}

export interface XPLog {
  id?: number
  pointsEarned: number
  source: 'session' | 'completion'
  sourceId?: number
  multipliers?: {
    difficulty?: number
    dailyPosition?: number
    bonus?: number
  }
  earnedAt: Date
  weekNumber: number
}

export interface Achievement {
  id?: number
  type: 'consistency' | 'category_master' | 'difficulty_champion' | 'strategic'
  name: string
  description?: string
  requirements?: any
  pointsValue: number
  icon?: string
  unlockedAt?: Date
  userId: number
}

export interface AchievementProgress {
  id?: number
  achievementType: string
  achievementName: string
  userId: number
  currentValue: number
  targetValue: number
  metadata?: any
  startedAt: Date
  lastUpdated: Date
  completedAt?: Date
}

export interface ProjectTransition {
  id?: number
  projectId: number
  fromStatus?: ProjectStatus
  toStatus: ProjectStatus
  transitionedAt: Date
  reason?: string
}

export interface StreakTracking {
  id?: number
  userId: number
  streakType: string
  currentStreak: number
  longestStreak: number
  streakStartDate?: Date
  lastActivityDate?: Date
  longestStreakStart?: Date
  longestStreakEnd?: Date
  metadata?: any
}