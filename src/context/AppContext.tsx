import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Project, CaptureItem, FocusSession, DailyObjective, XPLog, Achievement } from '@/types'

interface AppContextType {
  // Projects
  projects: Project[]
  activeProjects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: number, updates: Partial<Project>) => void
  deleteProject: (id: number) => void
  
  // Capture Items
  captureItems: CaptureItem[]
  addCaptureItem: (text: string, source?: 'manual' | 'hotkey') => void
  triageCaptureItem: (id: number, decision: string, projectData?: any) => void
  
  // Focus Sessions
  currentSession: FocusSession | null
  startSession: (projectId: number, duration: number, willpower: string) => void
  endSession: (quality?: string, energy?: string) => void
  
  // Daily Objectives
  todayObjective: DailyObjective | null
  setDailyObjective: (sessionCount: number, duration: number) => void
  
  // XP & Achievements
  weeklyXP: number
  totalXP: number
  achievements: Achievement[]
  
  // UI State
  showTriage: boolean
  setShowTriage: (show: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // Projects State
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  
  // Capture State
  const [captureItems, setCaptureItems] = useState<CaptureItem[]>([])
  const [showTriage, setShowTriage] = useState(false)
  
  // Session State
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  
  // Daily Objective State
  const [todayObjective, setTodayObjective] = useState<DailyObjective | null>(null)
  
  // XP State
  const [weeklyXP, setWeeklyXP] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  
  // Load initial data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProjects = localStorage.getItem('fa_projects')
        if (savedProjects) {
          const parsed = JSON.parse(savedProjects)
          setProjects(parsed)
          setActiveProjects(parsed.filter((p: Project) => p.status === 'active'))
        }
        
        const savedCaptures = localStorage.getItem('fa_captures')
        if (savedCaptures) {
          setCaptureItems(JSON.parse(savedCaptures))
        }
        
        const savedXP = localStorage.getItem('fa_weekly_xp')
        if (savedXP) {
          setWeeklyXP(JSON.parse(savedXP))
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    loadData()
  }, [])
  
  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('fa_projects', JSON.stringify(projects))
    setActiveProjects(projects.filter(p => p.status === 'active'))
  }, [projects])
  
  useEffect(() => {
    localStorage.setItem('fa_captures', JSON.stringify(captureItems))
  }, [captureItems])
  
  useEffect(() => {
    localStorage.setItem('fa_weekly_xp', JSON.stringify(weeklyXP))
  }, [weeklyXP])
  
  // Project Methods
  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalFocusTime: 0,
      sessionCount: 0,
    }
    setProjects(prev => [...prev, newProject])
  }
  
  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, updatedAt: new Date() }
        : p
    ))
  }
  
  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }
  
  // Capture Methods
  const addCaptureItem = (text: string, source: 'manual' | 'hotkey' = 'manual') => {
    const newCapture: CaptureItem = {
      id: Date.now(),
      text,
      source,
      createdAt: new Date(),
    }
    setCaptureItems(prev => [...prev, newCapture])
  }
  
  const triageCaptureItem = (id: number, decision: string, projectData?: any) => {
    setCaptureItems(prev => prev.map(item => {
      if (item.id === id) {
        if (decision === 'project' && projectData) {
          addProject(projectData)
        }
        return {
          ...item,
          triagedAt: new Date(),
          triageDecision: decision as any,
          outcomeData: projectData,
        }
      }
      return item
    }))
    
    // Remove triaged item
    setTimeout(() => {
      setCaptureItems(prev => prev.filter(item => item.id !== id))
    }, 100)
  }
  
  // Session Methods
  const startSession = (projectId: number, duration: number, willpower: string) => {
    const session: FocusSession = {
      projectId,
      plannedDuration: duration,
      actualDuration: 0,
      willpowerLevel: willpower as any,
      sessionNumberToday: 1, // TODO: Calculate from today's sessions
      completionStatus: 'completed',
      startedAt: new Date(),
      endedAt: new Date(),
    }
    setCurrentSession(session)
  }
  
  const endSession = (quality?: string, energy?: string) => {
    if (!currentSession) return
    
    const endedSession = {
      ...currentSession,
      endedAt: new Date(),
      actualDuration: Math.floor((new Date().getTime() - currentSession.startedAt.getTime()) / 60000),
      qualityRating: quality as any,
      energyLevel: energy as any,
    }
    
    // Calculate XP
    const baseXP = 10
    const durationBonus = Math.floor(endedSession.actualDuration / 10)
    const qualityBonus = quality === 'excellent' ? 10 : quality === 'good' ? 5 : 0
    const totalXP = baseXP + durationBonus + qualityBonus
    
    setWeeklyXP(prev => prev + totalXP)
    setTotalXP(prev => prev + totalXP)
    
    // Update project time
    const project = projects.find(p => p.id === currentSession.projectId)
    if (project) {
      updateProject(project.id!, {
        totalFocusTime: project.totalFocusTime + endedSession.actualDuration,
        sessionCount: project.sessionCount + 1,
      })
    }
    
    setCurrentSession(null)
  }
  
  // Daily Objective Methods
  const setDailyObjective = (sessionCount: number, duration: number) => {
    const objective: DailyObjective = {
      date: new Date(),
      sessionCount,
      sessionDuration: duration,
      createdAt: new Date(),
      completedSessions: 0,
      totalMinutesPlanned: sessionCount * duration,
      totalMinutesActual: 0,
    }
    setTodayObjective(objective)
  }
  
  const value: AppContextType = {
    projects,
    activeProjects,
    addProject,
    updateProject,
    deleteProject,
    captureItems,
    addCaptureItem,
    triageCaptureItem,
    currentSession,
    startSession,
    endSession,
    todayObjective,
    setDailyObjective,
    weeklyXP,
    totalXP,
    achievements,
    showTriage,
    setShowTriage,
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}