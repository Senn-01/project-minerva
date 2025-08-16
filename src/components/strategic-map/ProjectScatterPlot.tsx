import React from 'react'
import { Project } from '@/types'
import { cn } from '@/lib/utils/cn'

interface ProjectScatterPlotProps {
  projects: Project[]
  onProjectClick: (id: number) => void
}

const categoryShapes = {
  work: '●',
  growth: '■',
  projects: '▲',
  life: '◆'
}

const quadrantLabels = {
  topLeft: 'Boss-Battle',
  topRight: 'No-Brainer',
  bottomLeft: 'Trap-Zone',
  bottomRight: 'Side-Quest'
}

export function ProjectScatterPlot({ projects, onProjectClick }: ProjectScatterPlotProps) {
  const maxX = 11
  const maxY = 11
  
  const getPosition = (cost: number, benefit: number) => {
    const x = (cost / 10) * 100
    const y = ((10 - benefit) / 10) * 100 // Invert Y axis so high benefit is at top
    return { x, y }
  }
  
  const getQuadrant = (cost: number, benefit: number) => {
    if (cost <= 5 && benefit > 5) return 'topRight' // No-Brainer
    if (cost > 5 && benefit > 5) return 'topLeft' // Boss-Battle
    if (cost <= 5 && benefit <= 5) return 'bottomRight' // Side-Quest
    return 'bottomLeft' // Trap-Zone
  }
  
  return (
    <div className="relative w-full h-[600px] border-4 border-black bg-white">
      {/* Grid lines */}
      <div className="absolute inset-0">
        {/* Vertical center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black opacity-20" />
        {/* Horizontal center line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black opacity-20" />
      </div>
      
      {/* Quadrant labels */}
      <div className="absolute top-4 left-4 text-xs font-bold uppercase opacity-40">
        {quadrantLabels.topLeft}
      </div>
      <div className="absolute top-4 right-4 text-xs font-bold uppercase opacity-40">
        {quadrantLabels.topRight}
      </div>
      <div className="absolute bottom-4 left-4 text-xs font-bold uppercase opacity-40">
        {quadrantLabels.bottomLeft}
      </div>
      <div className="absolute bottom-4 right-4 text-xs font-bold uppercase opacity-40">
        {quadrantLabels.bottomRight}
      </div>
      
      {/* Axis labels */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 text-sm font-bold uppercase">
        Cost (Effort) →
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 -rotate-90 text-sm font-bold uppercase">
        Benefit (Impact) →
      </div>
      
      {/* Projects */}
      {projects.map((project) => {
        const { x, y } = getPosition(project.cost, project.benefit)
        const quadrant = getQuadrant(project.cost, project.benefit)
        const shape = categoryShapes[project.category]
        
        return (
          <button
            key={project.id}
            onClick={() => onProjectClick(project.id!)}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2",
              "flex flex-col items-center gap-1 p-2",
              "hover:z-10 transition-all",
              "group"
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {/* Shape indicator */}
            <div className={cn(
              "text-4xl leading-none",
              project.status === 'active' ? 'text-brutal-yellow' : 'text-black opacity-60',
              project.dueDate && new Date(project.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 'animate-pulse'
            )}>
              {shape}
            </div>
            
            {/* Project title on hover */}
            <div className={cn(
              "absolute top-full mt-2 px-2 py-1",
              "bg-white border-2 border-black shadow-brutal",
              "text-xs font-bold whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "pointer-events-none"
            )}>
              {project.title}
              <div className="text-[10px] opacity-60">
                C:{project.cost} B:{project.benefit}
              </div>
            </div>
            
            {/* Priority indicator */}
            {project.priority === 'must_do' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-brutal-red rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}