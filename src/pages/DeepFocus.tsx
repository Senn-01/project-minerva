import React, { useState, useEffect } from 'react'
import { Play, StopCircle } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Timer } from '@/components/deep-focus/Timer'
import { WillpowerCheck } from '@/components/deep-focus/WillpowerCheck'
import { SessionComplete } from '@/components/deep-focus/SessionComplete'
import { DailyObjectiveForm } from '@/components/deep-focus/DailyObjectiveForm'
import { EmptyState } from '@/components/deep-focus/EmptyState'

export function DeepFocus() {
  const { 
    activeProjects, 
    currentSession, 
    todayObjective,
    startSession,
    endSession,
    setDailyObjective
  } = useApp()
  
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [selectedDuration, setSelectedDuration] = useState(60)
  const [willpowerLevel, setWillpowerLevel] = useState<string | null>(null)
  const [showDailyObjective, setShowDailyObjective] = useState(false)
  const [showSessionComplete, setShowSessionComplete] = useState(false)
  
  // Check if we need to show daily objective form
  useEffect(() => {
    if (!todayObjective && !localStorage.getItem('fa_daily_objective_skip')) {
      setShowDailyObjective(true)
    }
  }, [todayObjective])
  
  // Handle session start
  const handleStartSession = () => {
    if (selectedProject && willpowerLevel) {
      startSession(selectedProject, selectedDuration, willpowerLevel)
    }
  }
  
  // Handle session end
  const handleEndSession = () => {
    setShowSessionComplete(true)
  }
  
  // Empty state - no active projects
  if (activeProjects.length === 0) {
    return <EmptyState />
  }
  
  // Daily objective form
  if (showDailyObjective) {
    return (
      <DailyObjectiveForm
        onComplete={(count, duration) => {
          setDailyObjective(count, duration)
          setShowDailyObjective(false)
        }}
        onSkip={() => {
          localStorage.setItem('fa_daily_objective_skip', 'true')
          setShowDailyObjective(false)
        }}
      />
    )
  }
  
  // Session complete screen
  if (showSessionComplete && !currentSession) {
    return (
      <SessionComplete
        onContinue={() => setShowSessionComplete(false)}
      />
    )
  }
  
  // Active session
  if (currentSession) {
    return (
      <Timer
        session={currentSession}
        project={activeProjects.find(p => p.id === currentSession.projectId)!}
        onStop={handleEndSession}
      />
    )
  }
  
  // Pre-session setup
  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <div className="focus-nav">
        <h2 className="text-3xl font-black uppercase mb-8">Deep Focus</h2>
        
        {/* Daily objective display */}
        {todayObjective && (
          <div className="mb-8 p-4 border-4 border-black bg-brutal-yellow">
            <p className="font-bold">
              Today: {todayObjective.completedSessions}/{todayObjective.sessionCount} sessions × {todayObjective.sessionDuration}min
            </p>
          </div>
        )}
        
        {/* Willpower Check */}
        <WillpowerCheck
          value={willpowerLevel}
          onChange={setWillpowerLevel}
        />
        
        {/* Project Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold uppercase mb-4">Select Project</h3>
          <div className="grid grid-cols-1 gap-4">
            {activeProjects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id!)}
                className={`
                  p-4 border-4 border-black text-left transition-all
                  ${selectedProject === project.id 
                    ? 'bg-brutal-yellow shadow-brutal' 
                    : 'bg-white hover:shadow-brutal'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold uppercase">{project.title}</h4>
                    {project.description && (
                      <p className="text-sm mt-1 opacity-80">{project.description}</p>
                    )}
                  </div>
                  <div className="text-xs font-mono">
                    {project.totalFocusTime}min
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Duration Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold uppercase mb-4">Session Duration</h3>
          <div className="flex gap-4">
            {[25, 60, 90].map(duration => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`
                  px-6 py-3 border-4 border-black font-bold transition-all
                  ${selectedDuration === duration
                    ? 'bg-brutal-yellow shadow-brutal'
                    : 'bg-white hover:shadow-brutal'
                  }
                `}
              >
                {duration} MIN
              </button>
            ))}
          </div>
        </div>
        
        {/* Start Button */}
        <Button
          onClick={handleStartSession}
          disabled={!selectedProject || !willpowerLevel}
          variant="primary"
          size="lg"
          className="w-full flex items-center justify-center gap-3"
        >
          <Play className="h-6 w-6" />
          START SESSION
        </Button>
      </div>
    </div>
  )
}