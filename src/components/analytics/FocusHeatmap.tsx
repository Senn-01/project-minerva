import React from 'react'
import { cn } from '@/lib/utils/cn'

export function FocusHeatmap() {
  // Generate last 14 days
  const days = []
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    days.push({
      date,
      sessions: Math.floor(Math.random() * 5), // Mock data
      minutes: Math.floor(Math.random() * 180)
    })
  }
  
  const getIntensity = (sessions: number) => {
    if (sessions === 0) return 'bg-gray-100'
    if (sessions === 1) return 'bg-brutal-yellow/30'
    if (sessions === 2) return 'bg-brutal-yellow/50'
    if (sessions === 3) return 'bg-brutal-yellow/70'
    return 'bg-brutal-yellow'
  }
  
  return (
    <div className="brutal-card">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="text-center">
            <div className="text-xs font-bold uppercase mb-1 opacity-60">
              {day.date.toLocaleDateString('en', { weekday: 'short' })}
            </div>
            <div
              className={cn(
                "aspect-square border-2 border-black flex items-center justify-center font-bold",
                getIntensity(day.sessions)
              )}
            >
              {day.sessions > 0 && day.sessions}
            </div>
            <div className="text-xs mt-1 opacity-40">
              {day.date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mt-6 text-xs">
        <span className="opacity-60">Less</span>
        <div className="flex gap-1">
          {['bg-gray-100', 'bg-brutal-yellow/30', 'bg-brutal-yellow/50', 'bg-brutal-yellow/70', 'bg-brutal-yellow'].map(color => (
            <div key={color} className={cn("w-4 h-4 border border-black", color)} />
          ))}
        </div>
        <span className="opacity-60">More</span>
      </div>
    </div>
  )
}