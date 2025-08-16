import React, { useState, useEffect } from 'react'
import { StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FocusSession, Project } from '@/types'

interface TimerProps {
  session: FocusSession
  project: Project
  onStop: () => void
}

export function Timer({ session, project, onStop }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(session.plannedDuration * 60) // Convert to seconds
  const [elapsed, setElapsed] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          onStop()
          return 0
        }
        return prev - 1
      })
      setElapsed(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [onStop])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const progress = (elapsed / (session.plannedDuration * 60)) * 100
  
  // Get difficulty quote based on willpower and duration
  const getDifficultyQuote = () => {
    const key = `${session.willpowerLevel}_${session.plannedDuration}`
    const quotes: Record<string, string> = {
      'high_25': 'PIECE OF CAKE',
      'medium_25': 'HEY, NOT TOO ROUGH',
      'high_60': 'BRING IT ON',
      'medium_60': 'COME GET SOME',
      'low_25': "DAMN I'M GOOD",
      'high_90': 'CRUNCH TIME',
      'medium_90': 'BALLS OF STEEL ⚪⚪',
      'low_60': 'NIGHTMARE DEADLINE',
      'low_90': 'HAIL TO THE KING 👑'
    }
    return quotes[key] || 'FOCUS SESSION'
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Project Name */}
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase">{project.title}</h2>
          <p className="text-brutal-yellow text-xl font-bold">
            {getDifficultyQuote()}
          </p>
        </div>
        
        {/* Timer Display */}
        <div className="relative">
          <div className="text-8xl font-mono font-bold tabular-nums">
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8 h-4 bg-white/20 relative overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-brutal-yellow transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="mt-4 text-sm font-mono opacity-60">
            {formatTime(elapsed)} / {formatTime(session.plannedDuration * 60)}
          </div>
        </div>
        
        {/* Stop Button */}
        <Button
          onClick={onStop}
          variant="destructive"
          size="lg"
          className="bg-brutal-red border-white hover:bg-red-600"
        >
          <StopCircle className="h-6 w-6 mr-2" />
          STOP SESSION
        </Button>
        
        <p className="text-xs opacity-40">
          No pause allowed. Build discipline.
        </p>
      </div>
    </div>
  )
}