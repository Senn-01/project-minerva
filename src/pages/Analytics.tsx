import React from 'react'
import { TrendingUp, Award, Skull } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { FocusHeatmap } from '@/components/analytics/FocusHeatmap'
import { ProjectTreemap } from '@/components/analytics/ProjectTreemap'
import { SessionStats } from '@/components/analytics/SessionStats'
import { AchievementGrid } from '@/components/analytics/AchievementGrid'
import { ProjectGraveyard } from '@/components/analytics/ProjectGraveyard'

export function Analytics() {
  const { weeklyXP, totalXP, projects, achievements } = useApp()
  
  const completedThisWeek = projects.filter(p => {
    if (!p.actualCompletedAt) return false
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return p.actualCompletedAt > weekAgo
  })
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-black uppercase mb-8">Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="brutal-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase opacity-60">Weekly XP</span>
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-3xl font-black">{weeklyXP.toLocaleString()}</p>
        </div>
        
        <div className="brutal-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase opacity-60">Total XP</span>
            <Award className="h-5 w-5" />
          </div>
          <p className="text-3xl font-black">{totalXP.toLocaleString()}</p>
        </div>
        
        <div className="brutal-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase opacity-60">Completed</span>
            <Skull className="h-5 w-5" />
          </div>
          <p className="text-3xl font-black">{completedThisWeek.length}</p>
        </div>
      </div>
      
      {/* Focus Heatmap */}
      <div className="mb-8">
        <h3 className="text-xl font-bold uppercase mb-4">14-Day Focus Heatmap</h3>
        <FocusHeatmap />
      </div>
      
      {/* Project Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold uppercase mb-4">Project Time Distribution</h3>
          <ProjectTreemap projects={projects.filter(p => p.totalFocusTime > 0)} />
        </div>
        
        <div>
          <h3 className="text-xl font-bold uppercase mb-4">Session Quality</h3>
          <SessionStats />
        </div>
      </div>
      
      {/* Achievements */}
      <div className="mb-8">
        <h3 className="text-xl font-bold uppercase mb-4">Achievements</h3>
        {achievements.length > 0 ? (
          <AchievementGrid achievements={achievements} />
        ) : (
          <div className="brutal-card text-center py-12 opacity-50">
            <p className="text-lg font-bold uppercase">Coming Soon</p>
            <p className="text-sm mt-2">Complete sessions to unlock achievements</p>
          </div>
        )}
      </div>
      
      {/* Project Graveyard */}
      <ProjectGraveyard />
    </div>
  )
}