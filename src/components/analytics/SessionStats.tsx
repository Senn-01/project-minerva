import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function SessionStats() {
  // Mock data
  const stats = {
    totalSessions: 42,
    averageQuality: 3.8,
    completionRate: 87,
    averageDuration: 52,
    trend: 'up' as 'up' | 'down' | 'neutral'
  }
  
  const qualityLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent'
    if (rating >= 3.5) return 'Good'
    if (rating >= 2.5) return 'Average'
    return 'Challenging'
  }
  
  return (
    <div className="brutal-card space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 border-2 border-black">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">Total Sessions</p>
          <p className="text-2xl font-black">{stats.totalSessions}</p>
        </div>
        
        <div className="p-4 bg-gray-50 border-2 border-black">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">Completion Rate</p>
          <p className="text-2xl font-black">{stats.completionRate}%</p>
        </div>
        
        <div className="p-4 bg-gray-50 border-2 border-black">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">Avg Duration</p>
          <p className="text-2xl font-black">{stats.averageDuration}min</p>
        </div>
        
        <div className="p-4 bg-gray-50 border-2 border-black">
          <p className="text-xs font-bold uppercase opacity-60 mb-1">Avg Quality</p>
          <p className="text-2xl font-black">{qualityLabel(stats.averageQuality)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center pt-4 border-t-2 border-black">
        {stats.trend === 'up' && (
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-bold uppercase">Improving</span>
          </div>
        )}
        {stats.trend === 'down' && (
          <div className="flex items-center gap-2 text-red-600">
            <TrendingDown className="h-5 w-5" />
            <span className="font-bold uppercase">Declining</span>
          </div>
        )}
        {stats.trend === 'neutral' && (
          <div className="flex items-center gap-2 text-gray-600">
            <Minus className="h-5 w-5" />
            <span className="font-bold uppercase">Steady</span>
          </div>
        )}
      </div>
    </div>
  )
}