import React from 'react'
import { Zap } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils/cn'

export function XPIndicator() {
  const { weeklyXP } = useApp()
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white">
      <Zap className={cn(
        "h-5 w-5",
        weeklyXP > 0 && "text-brutal-yellow animate-pulse"
      )} />
      <span className="font-mono font-bold">{weeklyXP.toLocaleString()}</span>
      <span className="text-xs text-gray-500">XP</span>
    </div>
  )
}