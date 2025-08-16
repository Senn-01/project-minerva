import type { 
  Project, 
  CaptureItem, 
  FocusSession, 
  DailyObjective,
  XPLog,
  Achievement,
  AchievementProgress,
  ProjectTransition,
  StreakTracking 
} from '@/types'

// Database class that mimics SQLite operations using localStorage
class Database {
  private prefix = 'fa_db_'
  
  // Initialize database with schema
  init() {
    const tables = [
      'projects',
      'capture_items',
      'focus_sessions',
      'daily_objectives',
      'xp_logs',
      'achievements',
      'achievement_progress',
      'project_transitions',
      'streak_tracking',
      'quick_tasks',
      'weekly_summaries'
    ]
    
    // Create tables if they don't exist
    tables.forEach(table => {
      if (!localStorage.getItem(this.prefix + table)) {
        localStorage.setItem(this.prefix + table, JSON.stringify([]))
      }
    })
    
    // Initialize default achievements
    this.initializeAchievements()
  }
  
  // Generic CRUD operations
  private getTable<T>(tableName: string): T[] {
    const data = localStorage.getItem(this.prefix + tableName)
    return data ? JSON.parse(data) : []
  }
  
  private setTable<T>(tableName: string, data: T[]) {
    localStorage.setItem(this.prefix + tableName, JSON.stringify(data))
  }
  
  private insert<T extends { id?: number }>(tableName: string, record: T): T {
    const table = this.getTable<T>(tableName)
    const newRecord = {
      ...record,
      id: record.id || Date.now(),
      createdAt: new Date().toISOString()
    }
    table.push(newRecord)
    this.setTable(tableName, table)
    return newRecord
  }
  
  private update<T extends { id?: number }>(tableName: string, id: number, updates: Partial<T>): T | null {
    const table = this.getTable<T>(tableName)
    const index = table.findIndex(r => r.id === id)
    if (index === -1) return null
    
    table[index] = {
      ...table[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    this.setTable(tableName, table)
    return table[index]
  }
  
  private delete<T extends { id?: number }>(tableName: string, id: number): boolean {
    const table = this.getTable<T>(tableName)
    const filtered = table.filter(r => r.id !== id)
    if (filtered.length === table.length) return false
    this.setTable(tableName, filtered)
    return true
  }
  
  private select<T extends { id?: number }>(
    tableName: string, 
    predicate?: (item: T) => boolean
  ): T[] {
    const table = this.getTable<T>(tableName)
    return predicate ? table.filter(predicate) : table
  }
  
  // Projects
  createProject(project: Omit<Project, 'id'>): Project {
    const newProject = this.insert('projects', {
      ...project,
      totalFocusTime: 0,
      sessionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Track transition
    this.trackProjectTransition(newProject.id!, undefined, project.status)
    
    return newProject
  }
  
  updateProject(id: number, updates: Partial<Project>): Project | null {
    const oldProject = this.select<Project>('projects', p => p.id === id)[0]
    if (!oldProject) return null
    
    // Track status transition
    if (updates.status && updates.status !== oldProject.status) {
      this.trackProjectTransition(id, oldProject.status, updates.status)
      
      // Handle completion
      if (updates.status === 'completed') {
        const now = new Date()
        updates.actualCompletedAt = now
        updates.completionWeek = this.getCurrentWeekNumber()
        
        // Award completion XP
        this.awardProjectCompletionXP(oldProject)
      }
    }
    
    return this.update('projects', id, updates)
  }
  
  getProjects(status?: string): Project[] {
    return this.select<Project>('projects', 
      status ? p => p.status === status : undefined
    )
  }
  
  // Capture Items
  createCaptureItem(text: string, source: 'manual' | 'hotkey' = 'manual'): CaptureItem {
    return this.insert('capture_items', {
      text,
      source,
      createdAt: new Date()
    })
  }
  
  triageCaptureItem(id: number, decision: string, resultingProjectId?: number): CaptureItem | null {
    return this.update('capture_items', id, {
      triagedAt: new Date(),
      triageDecision: decision,
      resultingProjectId
    })
  }
  
  getUntriaged(): CaptureItem[] {
    return this.select<CaptureItem>('capture_items', item => !item.triagedAt)
  }
  
  // Focus Sessions
  createSession(session: Omit<FocusSession, 'id'>): FocusSession {
    const sessionNumber = this.getTodaySessionNumber()
    const difficultyMultiplier = this.calculateDifficultyMultiplier(
      session.willpowerLevel,
      session.plannedDuration
    )
    
    const newSession = this.insert('focus_sessions', {
      ...session,
      sessionNumberToday: sessionNumber,
      difficultyMultiplier,
      difficultyQuote: this.getDifficultyQuote(session.willpowerLevel, session.plannedDuration),
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: new Date().getDay(),
      weekNumber: this.getCurrentWeekNumber()
    })
    
    // Update project metrics if completed
    if (session.completionStatus === 'completed') {
      this.updateProjectMetrics(session.projectId, session.actualDuration)
      this.awardSessionXP(newSession)
      this.updateStreak('daily_sessions')
    }
    
    return newSession
  }
  
  getTodaysSessions(): FocusSession[] {
    const today = new Date().toDateString()
    return this.select<FocusSession>('focus_sessions', 
      s => new Date(s.startedAt).toDateString() === today
    )
  }
  
  // Daily Objectives
  setDailyObjective(sessionCount: number, sessionDuration: number): DailyObjective {
    const today = new Date().toDateString()
    const existing = this.select<DailyObjective>('daily_objectives', 
      d => new Date(d.date).toDateString() === today
    )[0]
    
    if (existing) {
      return this.update('daily_objectives', existing.id!, {
        sessionCount,
        sessionDuration,
        totalMinutesPlanned: sessionCount * sessionDuration
      })!
    }
    
    return this.insert('daily_objectives', {
      date: new Date(),
      sessionCount,
      sessionDuration,
      completedSessions: 0,
      totalMinutesPlanned: sessionCount * sessionDuration,
      totalMinutesActual: 0,
      createdAt: new Date()
    })
  }
  
  updateDailyObjectiveProgress(minutes: number): void {
    const today = new Date().toDateString()
    const objective = this.select<DailyObjective>('daily_objectives',
      d => new Date(d.date).toDateString() === today
    )[0]
    
    if (objective) {
      this.update('daily_objectives', objective.id!, {
        completedSessions: objective.completedSessions + 1,
        totalMinutesActual: objective.totalMinutesActual + minutes
      })
    }
  }
  
  // XP System
  awardSessionXP(session: FocusSession): XPLog {
    const baseXP = 10
    const durationBonus = Math.floor(session.actualDuration / 10)
    const qualityBonus = this.getQualityBonus(session.qualityRating)
    const dailyDecay = this.getDailyDecayMultiplier(session.sessionNumberToday)
    
    const totalXP = Math.round(
      (baseXP + durationBonus + qualityBonus) * 
      (session.difficultyMultiplier || 1) * 
      dailyDecay
    )
    
    return this.insert('xp_logs', {
      pointsEarned: totalXP,
      source: 'session',
      sourceId: session.id,
      multipliers: {
        difficulty: session.difficultyMultiplier,
        dailyPosition: dailyDecay,
        bonus: 1
      },
      earnedAt: new Date(),
      weekNumber: this.getCurrentWeekNumber()
    })
  }
  
  awardProjectCompletionXP(project: Project): XPLog {
    const xp = project.cost * project.benefit * 10
    
    return this.insert('xp_logs', {
      pointsEarned: xp,
      source: 'completion',
      sourceId: project.id,
      earnedAt: new Date(),
      weekNumber: this.getCurrentWeekNumber()
    })
  }
  
  getWeeklyXP(): number {
    const currentWeek = this.getCurrentWeekNumber()
    const logs = this.select<XPLog>('xp_logs', log => log.weekNumber === currentWeek)
    return logs.reduce((sum, log) => sum + log.pointsEarned, 0)
  }
  
  getTotalXP(): number {
    const logs = this.getTable<XPLog>('xp_logs')
    return logs.reduce((sum, log) => sum + log.pointsEarned, 0)
  }
  
  // Achievements
  initializeAchievements() {
    const achievements = this.getTable<Achievement>('achievements')
    if (achievements.length > 0) return
    
    const defaultAchievements = [
      {
        type: 'consistency',
        name: 'Iron Will',
        description: '21 consecutive days of focus sessions',
        requirements: { days: 21 },
        pointsValue: 500,
        icon: '🏆'
      },
      {
        type: 'category_master',
        name: 'Career Climber',
        description: '100 hours in Work category',
        requirements: { hours: 100, category: 'work' },
        pointsValue: 1000,
        icon: '💼'
      },
      {
        type: 'difficulty_champion',
        name: 'Balls of Steel Legend',
        description: '25 sessions at highest difficulty',
        requirements: { sessions: 25, difficulty: 'balls_of_steel' },
        pointsValue: 750,
        icon: '⚪'
      }
    ]
    
    defaultAchievements.forEach(a => this.insert('achievements', { ...a, userId: 1 }))
  }
  
  checkAchievements(): Achievement[] {
    // Check for newly unlocked achievements
    const unlocked: Achievement[] = []
    
    // Check Iron Will
    const streak = this.getCurrentStreak('daily_sessions')
    if (streak >= 21) {
      const ironWill = this.select<Achievement>('achievements', 
        a => a.name === 'Iron Will' && !a.unlockedAt
      )[0]
      if (ironWill) {
        this.update('achievements', ironWill.id!, { unlockedAt: new Date() })
        unlocked.push(ironWill)
      }
    }
    
    return unlocked
  }
  
  // Streaks
  updateStreak(streakType: string): void {
    const today = new Date().toDateString()
    const streak = this.select<StreakTracking>('streak_tracking',
      s => s.streakType === streakType && s.userId === 1
    )[0]
    
    if (!streak) {
      this.insert('streak_tracking', {
        userId: 1,
        streakType,
        currentStreak: 1,
        longestStreak: 1,
        streakStartDate: new Date(),
        lastActivityDate: new Date()
      })
      return
    }
    
    const lastActivity = new Date(streak.lastActivityDate!)
    const daysSince = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSince === 0) {
      // Already updated today
      return
    } else if (daysSince === 1) {
      // Continue streak
      const newStreak = streak.currentStreak + 1
      this.update('streak_tracking', streak.id!, {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityDate: new Date()
      })
    } else {
      // Reset streak
      this.update('streak_tracking', streak.id!, {
        currentStreak: 1,
        streakStartDate: new Date(),
        lastActivityDate: new Date()
      })
    }
  }
  
  getCurrentStreak(streakType: string): number {
    const streak = this.select<StreakTracking>('streak_tracking',
      s => s.streakType === streakType && s.userId === 1
    )[0]
    return streak?.currentStreak || 0
  }
  
  // Project Transitions
  trackProjectTransition(projectId: number, fromStatus?: string, toStatus: string): void {
    this.insert('project_transitions', {
      projectId,
      fromStatus,
      toStatus,
      transitionedAt: new Date()
    })
  }
  
  // Helper Methods
  private updateProjectMetrics(projectId: number, duration: number): void {
    const project = this.select<Project>('projects', p => p.id === projectId)[0]
    if (project) {
      this.update('projects', projectId, {
        totalFocusTime: project.totalFocusTime + duration,
        sessionCount: project.sessionCount + 1
      })
    }
  }
  
  private getTodaySessionNumber(): number {
    const today = new Date().toDateString()
    const sessions = this.select<FocusSession>('focus_sessions',
      s => new Date(s.startedAt).toDateString() === today
    )
    return sessions.length + 1
  }
  
  private getCurrentWeekNumber(): number {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now.getTime() - start.getTime()
    const oneWeek = 1000 * 60 * 60 * 24 * 7
    return Math.floor(diff / oneWeek)
  }
  
  private getTimeOfDay(): string {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }
  
  private calculateDifficultyMultiplier(willpower: string, duration: number): number {
    const matrix: Record<string, number> = {
      'high_25': 0.5,
      'medium_25': 1.0,
      'high_60': 1.5,
      'medium_60': 2.0,
      'low_25': 2.0,
      'high_90': 2.5,
      'medium_90': 3.0,
      'low_60': 3.5,
      'low_90': 4.0
    }
    return matrix[`${willpower}_${duration}`] || 1.0
  }
  
  private getDifficultyQuote(willpower: string, duration: number): string {
    const quotes: Record<string, string> = {
      'high_25': 'Piece of Cake',
      'medium_25': 'Hey, Not Too Rough',
      'high_60': 'Bring It On',
      'medium_60': 'Come Get Some',
      'low_25': "Damn I'm Good",
      'high_90': 'Crunch Time',
      'medium_90': 'Balls of Steel',
      'low_60': 'Nightmare Deadline',
      'low_90': 'Hail to the King'
    }
    return quotes[`${willpower}_${duration}`] || 'Standard Session'
  }
  
  private getQualityBonus(rating?: string): number {
    const bonuses: Record<string, number> = {
      'excellent': 10,
      'good': 5,
      'challenging': 2
    }
    return bonuses[rating || ''] || 0
  }
  
  private getDailyDecayMultiplier(sessionNumber: number): number {
    if (sessionNumber === 1) return 1.0
    if (sessionNumber === 2) return 0.75
    if (sessionNumber === 3) return 0.5
    return 0.25
  }
}

// Export singleton instance
export const db = new Database()

// Initialize on import
db.init()