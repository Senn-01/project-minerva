import React from 'react'
import { Project } from '@/types'
import { cn } from '@/lib/utils/cn'

interface ProjectTreemapProps {
  projects: Project[]
}

export function ProjectTreemap({ projects }: ProjectTreemapProps) {
  const totalTime = projects.reduce((sum, p) => sum + p.totalFocusTime, 0)
  
  const categoryColors = {
    work: 'bg-blue-500',
    growth: 'bg-green-500',
    projects: 'bg-purple-500',
    life: 'bg-orange-500'
  }
  
  // Sort projects by time spent
  const sortedProjects = [...projects].sort((a, b) => b.totalFocusTime - a.totalFocusTime)
  
  if (projects.length === 0 || totalTime === 0) {
    return (
      <div className="brutal-card h-64 flex items-center justify-center">
        <p className="text-sm font-bold uppercase opacity-40">
          No focus time recorded yet
        </p>
      </div>
    )
  }
  
  return (
    <div className="brutal-card">
      <div className="space-y-3">
        {sortedProjects.slice(0, 5).map(project => {
          const percentage = (project.totalFocusTime / totalTime) * 100
          
          return (
            <div key={project.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm uppercase truncate">
                  {project.title}
                </span>
                <span className="text-xs font-mono">
                  {project.totalFocusTime}min
                </span>
              </div>
              <div className="h-8 bg-gray-100 border-2 border-black relative overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0",
                    categoryColors[project.category]
                  )}
                  style={{ width: `${percentage}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
      
      {projects.length > 5 && (
        <p className="text-xs text-center mt-4 opacity-60">
          +{projects.length - 5} more projects
        </p>
      )}
    </div>
  )
}