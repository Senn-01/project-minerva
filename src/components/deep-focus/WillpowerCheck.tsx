import React from 'react'
import { Flame, Coffee, BedDouble } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WillpowerCheckProps {
  value: string | null
  onChange: (value: string) => void
}

export function WillpowerCheck({ value, onChange }: WillpowerCheckProps) {
  const options = [
    {
      value: 'high',
      label: 'On Fire!',
      icon: Flame,
      emoji: '🔥',
      color: 'text-red-500'
    },
    {
      value: 'medium',
      label: 'Caffeinated',
      icon: Coffee,
      emoji: '☕',
      color: 'text-yellow-600'
    },
    {
      value: 'low',
      label: 'Running on Fumes',
      icon: BedDouble,
      emoji: '🥱',
      color: 'text-blue-500'
    }
  ]
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold uppercase mb-4">How's Your Willpower?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "p-6 border-4 border-black transition-all",
              "flex flex-col items-center gap-3",
              value === option.value 
                ? "bg-brutal-yellow shadow-brutal" 
                : "bg-white hover:shadow-brutal"
            )}
          >
            <span className="text-4xl">{option.emoji}</span>
            <span className="font-bold uppercase">{option.label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm mt-4 opacity-60 text-center">
        Be honest - this affects your XP multiplier and difficulty rating
      </p>
    </div>
  )
}