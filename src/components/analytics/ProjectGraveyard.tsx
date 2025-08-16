import React, { useState } from 'react'
import { Skull } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils/cn'

export function ProjectGraveyard() {
  const { projects } = useApp()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const graveyardProjects = projects.filter(p => p.status === 'graveyard')
  
  if (graveyardProjects.length === 0) {
    return null
  }
  
  return (
    <div className="mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 px-4 py-2",
          "border-4 border-black bg-white",
          "hover:shadow-brutal transition-all",
          isExpanded && "shadow-brutal bg-gray-100"
        )}
      >
        <Skull className="h-5 w-5" />
        <span className="font-bold uppercase">Project Graveyard</span>
        <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs rounded">
          {graveyardProjects.length}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {graveyardProjects.map(project => (
            <div
              key={project.id}
              className="p-4 border-2 border-black bg-gray-50 opacity-60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold line-through">{project.title}</h4>
                  {project.lessonsLearned && (
                    <p className="text-sm mt-2 italic">
                      Lessons: {project.lessonsLearned}
                    </p>
                  )}
                </div>
                <div className="text-xs font-mono">
                  {project.totalFocusTime}min invested
                </div>
              </div>
              <div className="text-xs mt-2 opacity-60">
                Discontinued {project.completedAt && new Date(project.completedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}